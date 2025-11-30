from flask import Flask, request, jsonify, send_from_directory
from cryptography.fernet import Fernet
from flask_cors import CORS
from stegano import lsb
import os
import base64
import wave
import cv2
import numpy as np
import hashlib
import json  # <--- Added for packing the envelope

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

### 🔹 HELPER: SHA-256 HASHING ###
def calculate_file_hash(file_path):
    """Calculates the SHA-256 hash of a file."""
    sha256_hash = hashlib.sha256()
    try:
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    except Exception as e:
        print(f"❌ Error hashing file: {e}")
        return None

### 🔹 BASE64 HELPER ###
def fix_base64_padding(b64_string):
    missing_padding = len(b64_string) % 4
    if missing_padding:
        b64_string += "=" * (4 - missing_padding)
    return b64_string

### 🔹 KEY SPLITTING & RECONSTRUCTION ###
def split_key_flexible(key, num_parts=3):
    key_b64 = base64.urlsafe_b64encode(key).decode()
    key_length = len(key_b64)
    base_size = key_length // num_parts
    remainder = key_length % num_parts

    key_parts = []
    start = 0
    for i in range(num_parts):
        extra_byte = 1 if i < remainder else 0
        end = start + base_size + extra_byte
        key_part = key_b64[start:end].strip()
        key_parts.append(key_part)
        start = end
    return key_parts

def reconstruct_key(parts):
    try:
        key_b64 = "".join(parts).strip()
        key_b64 = fix_base64_padding(key_b64)
        return base64.urlsafe_b64decode(key_b64)
    except Exception as e:
        print("❌ Key reconstruction failed:", str(e))
        return None

### 🔹 STEGANOGRAPHY FUNCTIONS (Image, Audio, Video) ###
# ... (Keep your existing hide_key_in_image, extract_key_from_image, etc. exactly as they were) ...
# ... I will omit the full function bodies here to save space, but INCLUDE them in your final file ...
# ... Just ensure hide_key_in_video uses the LOSSLESS codec logic we fixed previously ...

def hide_key_in_image(input_image, key_part, output_path):
    try:
        secret_image = lsb.hide(input_image, key_part)
        secret_image.save(output_path)
        return output_path
    except Exception: return None

def extract_key_from_image(encoded_image_path):
    try: return lsb.reveal(encoded_image_path).strip()
    except Exception: return ""

def hide_key_in_audio(audio_path, key_part, output_path):
    try:
        with wave.open(audio_path, "rb") as audio:
            params = audio.getparams()
            frames = bytearray(audio.readframes(audio.getnframes()))
        length = len(key_part)
        header = format(length, '016b')
        key_bin = header + ''.join(format(ord(char), '08b') for char in key_part)
        for i in range(len(key_bin)):
            frames[i] = (frames[i] & 0xFE) | int(key_bin[i])
        with wave.open(output_path, "wb") as encoded_audio:
            encoded_audio.setparams(params)
            encoded_audio.writeframes(bytes(frames))
        return output_path
    except Exception: return None

def extract_key_from_audio(audio_path):
    try:
        with wave.open(audio_path, "rb") as encoded_audio:
            frames = list(encoded_audio.readframes(encoded_audio.getnframes()))
        if len(frames) < 16: return ""
        header_bits = ''.join(str(frames[i] & 1) for i in range(16))
        key_length_bytes = int(header_bits, 2)
        total_needed_bits = 16 + key_length_bytes * 8
        key_bin = ''.join(str(frames[i] & 1) for i in range(total_needed_bits))
        key_payload = key_bin[16:]
        return ''.join(chr(int(key_payload[i:i+8], 2)) for i in range(0, len(key_payload), 8)).strip()
    except Exception: return ""

def hide_key_in_video(video_path, key_part, output_path):
    try:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened(): return None
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        
        # Build payload
        length = len(key_part)
        header = format(length, '032b')
        key_bin = header + ''.join(format(ord(c), '08b') for c in key_part)
        
        ret, frame = cap.read()
        if not ret: return None
        
        # Read rest of video
        remaining_frames = []
        while True:
            ret, next_frame = cap.read()
            if not ret: break
            remaining_frames.append(next_frame)
        cap.release()

        # Embed in first frame
        flat = frame.flatten()
        for i in range(len(key_bin)):
            flat[i] = (int(flat[i]) & 0xFE) | int(key_bin[i])
        modified_frame = flat.reshape(frame.shape)
        
        # Save LOSSLESS AVI
        output_path_avi = output_path.replace('.mp4', '.avi')
        fourcc = cv2.VideoWriter_fourcc(*'png ') # Motion PNG
        out = cv2.VideoWriter(output_path_avi, fourcc, fps, (width, height))
        if not out.isOpened():
             fourcc = cv2.VideoWriter_fourcc(*'ffv1')
             out = cv2.VideoWriter(output_path_avi, fourcc, fps, (width, height))
        
        out.write(modified_frame)
        for f in remaining_frames: out.write(f)
        out.release()
        return output_path_avi
    except Exception: return None

def extract_key_from_video(video_path):
    try:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened(): return ""
        ret, frame = cap.read()
        cap.release()
        if not ret: return ""
        flat = frame.flatten()
        header_bits = ''.join(str(int(flat[i]) & 1) for i in range(32))
        key_length = int(header_bits, 2)
        if key_length == 0 or key_length > 1000: return ""
        total_bits = 32 + key_length * 8
        payload_bits = ''.join(str(int(flat[i]) & 1) for i in range(32, total_bits))
        return ''.join(chr(int(payload_bits[i:i+8], 2)) for i in range(0, len(payload_bits), 8)).strip()
    except Exception: return ""

### 🔹 ENCRYPTION ROUTE (Packs Hashes into Ciphertext) 🔹 ###
@app.route('/encrypt', methods=['POST'])
def encrypt():
    if 'data' not in request.form:
        return jsonify({"error": "No data provided"}), 400

    data = request.form['data']
    encryption_key = Fernet.generate_key()
    cipher = Fernet(encryption_key)
    raw_encrypted_data = cipher.encrypt(data.encode()).decode() # The actual encrypted text

    key_parts = split_key_flexible(encryption_key)

    # 1. Image
    uploaded_image = request.files.get('image')
    if not uploaded_image: return jsonify({"error": "Missing image"}), 400
    input_image_path = os.path.join(UPLOAD_FOLDER, "uploaded_image.png")
    encoded_image_path = os.path.join(UPLOAD_FOLDER, "encoded_image.png")
    uploaded_image.save(input_image_path)
    if hide_key_in_image(input_image_path, key_parts[0], encoded_image_path) is None:
        return jsonify({"error": "Failed to hide key in image"}), 500

    # 2. Video
    uploaded_video = request.files.get('video')
    if not uploaded_video: return jsonify({"error": "Missing video"}), 400
    uploaded_video_filename = uploaded_video.filename or "vid"
    input_video_path = os.path.join(UPLOAD_FOLDER, f"uploaded_video_input{os.path.splitext(uploaded_video_filename)[1]}")
    encoded_video_path = os.path.join(UPLOAD_FOLDER, "encoded_video.avi")
    uploaded_video.save(input_video_path)
    result_video_path = hide_key_in_video(input_video_path, key_parts[1], encoded_video_path)
    if result_video_path is None: return jsonify({"error": "Failed to hide key in video"}), 500

    # 3. Audio
    uploaded_audio = request.files.get('audio')
    if not uploaded_audio: return jsonify({"error": "Missing audio"}), 400
    input_audio_path = os.path.join(UPLOAD_FOLDER, "uploaded_audio.wav")
    encoded_audio_path = os.path.join(UPLOAD_FOLDER, "encoded_audio.wav")
    uploaded_audio.save(input_audio_path)
    if hide_key_in_audio(input_audio_path, key_parts[2], encoded_audio_path) is None:
        return jsonify({"error": "Failed to hide key in audio"}), 500

    # 🔹 CALCULATE HASHES
    image_hash = calculate_file_hash(encoded_image_path)
    video_hash = calculate_file_hash(result_video_path)
    audio_hash = calculate_file_hash(encoded_audio_path)

    # 🔹 PACK THE ENVELOPE
    # We create a JSON object containing both the text and the hashes
    payload = {
        "msg": raw_encrypted_data,
        "hashes": {
            "img": image_hash,
            "vid": video_hash,
            "aud": audio_hash
        }
    }
    
    # Encode this payload to Base64 so it looks like a single string to the user
    # This becomes the "ciphertext" the user sees
    secure_envelope = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode()

    return jsonify({
        "ciphertext": secure_envelope,  # <--- This now contains the hashes hidden inside
        "encoded_image": f"http://localhost:5000/download/{os.path.basename(encoded_image_path)}",
        "encoded_video": f"http://localhost:5000/download/{os.path.basename(result_video_path)}",
        "encoded_audio": f"http://localhost:5000/download/{os.path.basename(encoded_audio_path)}"
    })

### 🔹 DECRYPTION ROUTE (Unpacks and Verifies) 🔹 ###
@app.route('/decrypt', methods=['POST'])
def decrypt():
    if 'ciphertext' not in request.form:
        return jsonify({"error": "Ciphertext missing"}), 400

    # 🔹 UNPACK THE ENVELOPE
    envelope_string = request.form['ciphertext']
    try:
        # Decode Base64 -> JSON -> Python Dictionary
        decoded_bytes = base64.urlsafe_b64decode(envelope_string)
        payload = json.loads(decoded_bytes.decode())
        
        encrypted_data_real = payload['msg']
        expected_hashes = payload['hashes'] # This gives us {'img': '...', 'vid': '...', 'aud': '...'}
        
        print(f"🔹 Unpacked Envelope. Expected Hashes: {expected_hashes}")
    except Exception as e:
        print("❌ Error unpacking envelope:", e)
        return jsonify({"error": "Invalid ciphertext format. Cannot read integrity data."}), 400

    # --- 1. Process Image ---
    uploaded_image = request.files.get('encoded_image')
    if not uploaded_image: return jsonify({"error": "Missing encoded_image"}), 400
    saved_encoded_image = os.path.join(UPLOAD_FOLDER, "uploaded_encoded_image.png")
    uploaded_image.save(saved_encoded_image)
    
    # 🔒 INTEGRITY CHECK
    current_hash = calculate_file_hash(saved_encoded_image)
    if current_hash != expected_hashes['img']:
        return jsonify({"error": "SECURITY ALERT: Image file corrupted or tampered."}), 403
    
    extracted_image_key = extract_key_from_image(saved_encoded_image)
    if not extracted_image_key: return jsonify({"error": "Failed to extract key from image"}), 500

    # --- 2. Process Video ---
    uploaded_video = request.files.get('encoded_video')
    if not uploaded_video: return jsonify({"error": "Missing encoded_video"}), 400
    uploaded_video_filename = uploaded_video.filename or "vid.avi"
    saved_encoded_video = os.path.join(UPLOAD_FOLDER, f"uploaded_encoded_video{os.path.splitext(uploaded_video_filename)[1]}")
    uploaded_video.save(saved_encoded_video)

    # 🔒 INTEGRITY CHECK
    current_hash = calculate_file_hash(saved_encoded_video)
    if current_hash != expected_hashes['vid']:
        return jsonify({"error": "SECURITY ALERT: Video file corrupted or tampered."}), 403

    extracted_video_key = extract_key_from_video(saved_encoded_video)
    if not extracted_video_key: return jsonify({"error": "Failed to extract key from video"}), 500

    # --- 3. Process Audio ---
    uploaded_audio = request.files.get('encoded_audio')
    if not uploaded_audio: return jsonify({"error": "Missing encoded_audio"}), 400
    saved_encoded_audio = os.path.join(UPLOAD_FOLDER, "uploaded_encoded_audio.wav")
    uploaded_audio.save(saved_encoded_audio)

    # 🔒 INTEGRITY CHECK
    current_hash = calculate_file_hash(saved_encoded_audio)
    if current_hash != expected_hashes['aud']:
        return jsonify({"error": "SECURITY ALERT: Audio file corrupted or tampered."}), 403

    extracted_audio_key = extract_key_from_audio(saved_encoded_audio)
    if not extracted_audio_key: return jsonify({"error": "Failed to extract key from audio"}), 500

    # --- Reconstruct ---
    extracted_parts = [extracted_image_key, extracted_video_key, extracted_audio_key]
    reconstructed_key = reconstruct_key(extracted_parts)
    if not reconstructed_key: return jsonify({"error": "Failed to reconstruct key"}), 500

    try:
        cipher = Fernet(reconstructed_key)
        decrypted_data = cipher.decrypt(encrypted_data_real.encode()).decode()
    except Exception as e:
        print("❌ Decryption failed:", str(e))
        return jsonify({"error": "Decryption failed"}), 500

    return jsonify({"decrypted_text": decrypted_data})

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)