# Secure Key Sharing via Steganography

A full-stack web application that combines cryptography and steganography to provide multi-layered data security. The system encrypts sensitive data, splits the encryption key into three parts, and hides each part within different multimedia files (image, video, and audio), making data recovery impossible without all three components.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Security Model](#security-model)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Overview

Traditional encryption systems store or transmit encryption keys alongside encrypted data, creating a single point of failure. This project implements a distributed key storage mechanism using steganography, where the encryption key is split and hidden across three different media types. An attacker would need to:

1. Intercept all three multimedia files
2. Detect the presence of hidden data in each file
3. Extract the hidden key fragments
4. Reconstruct the original encryption key
5. Decrypt the ciphertext

Additionally, the system implements SHA-256 hash-based integrity verification to detect any tampering with the encoded files.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (React SPA - Encrypt/Decrypt Interface + Authentication)   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         │ (REST API)
┌────────────────────────┴────────────────────────────────────┐
│                     Application Layer                        │
│         (Flask Backend - Encryption & Steganography)        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Fernet     │  │    Stegano   │  │   OpenCV     │     │
│  │  Encryption  │  │   (LSB Image)│  │ (Video Proc) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Wave Lib   │  │   Hashlib    │  │  Key Splitter│     │
│  │ (Audio Proc) │  │  (SHA-256)   │  │  (3-way split)│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                      Storage Layer                           │
│         (File System - Temporary Encoded Files)             │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

#### Encryption Flow

```
User Message (Plaintext)
         │
         ▼
┌─────────────────────┐
│ Generate Fernet Key │
│    (32 bytes)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Encrypt Message    │
│   (AES-128-CBC)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Split Key Into    │
│    3 Parts (Base64) │
└──┬────────┬─────┬───┘
   │        │     │
   ▼        ▼     ▼
 Part1   Part2  Part3
   │        │     │
   ▼        ▼     ▼
┌──────┐ ┌─────┐ ┌─────┐
│Image │ │Video│ │Audio│
│ LSB  │ │ LSB │ │ LSB │
└───┬──┘ └──┬──┘ └──┬──┘
    │       │       │
    ▼       ▼       ▼
┌────────────────────────┐
│  Calculate SHA-256     │
│  Hash for Each File    │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  Pack Encrypted Data   │
│  + Hashes into JSON    │
│  Encode as Base64      │
└───────────┬────────────┘
            │
            ▼
    Ciphertext Envelope
    + 3 Encoded Files
```

#### Decryption Flow

```
Ciphertext Envelope + 3 Files
         │
         ▼
┌─────────────────────┐
│  Decode Base64      │
│  Unpack JSON        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Extract Expected    │
│ Hashes & Encrypted  │
│ Data                │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Verify File Hashes  │
│ (SHA-256 Check)     │
└──────────┬──────────┘
           │
       [PASS/FAIL]
           │
           ▼ (if pass)
┌──────────────────────┐
│ Extract Key Parts    │
│ from LSB             │
└───┬────────┬─────┬───┘
    │        │     │
    ▼        ▼     ▼
  Part1   Part2  Part3
    │        │     │
    └────┬───┴─────┘
         │
         ▼
┌─────────────────────┐
│ Reconstruct Full    │
│ Encryption Key      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Decrypt Message    │
│  (Fernet)           │
└──────────┬──────────┘
           │
           ▼
    Original Plaintext
```

### System Components

#### Frontend (React)

**Authentication Layer**
- Firebase Authentication integration
- Protected routes using React Router
- Split-screen login/signup design with feature showcase

**Encryption Interface**
- Tab-based navigation (Encrypt/Decrypt modes)
- Multi-file upload system (drag-and-drop support)
- Real-time validation and error handling
- Download interface for encoded files

**State Management**
- React hooks (useState, useEffect, useNavigate)
- Context API for authentication state
- Local state for encryption/decryption operations

#### Backend (Flask)

**Core Modules**

1. **Encryption Module**
   - Fernet symmetric encryption (AES-128 in CBC mode)
   - Random key generation using cryptographically secure PRNG
   - HMAC-based message authentication

2. **Key Management Module**
   - Flexible key splitting algorithm (3-way split with padding)
   - Base64 encoding for safe storage
   - Key reconstruction with integrity checks

3. **Steganography Module**
   - **Image**: LSB (Least Significant Bit) steganography using Stegano library
   - **Video**: Frame-based LSB embedding with lossless codecs (Motion PNG/FFV1)
   - **Audio**: WAV sample LSB modification with length header

4. **Integrity Module**
   - SHA-256 hashing for file verification
   - Tamper detection mechanism
   - Automatic rejection of modified files

5. **Envelope Module**
   - JSON payload packing (ciphertext + hashes)
   - Base64 envelope encoding
   - Secure unpacking with validation

## Features

### Core Features

- **Multi-Layer Security**: Combines encryption and steganography for defense in depth
- **Distributed Key Storage**: Encryption key split across three multimedia files
- **File Integrity Verification**: SHA-256 hashing detects file tampering
- **Lossless Encoding**: Preserves hidden data through codec selection
- **User Authentication**: Firebase-based secure login system
- **Responsive Design**: Dark theme UI optimized for all devices

### Security Features

- **One-Time Keys**: Unique encryption key for each operation
- **No Key Persistence**: Keys exist only in encoded multimedia files
- **Tamper Detection**: Automatic failure if files are modified
- **Plausible Deniability**: No visible indication of hidden data
- **Secret Sharing**: All three files required for decryption

## Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18.2.0 | UI framework |
| React Router DOM | Navigation and routing |
| Axios | HTTP client for API calls |
| Firebase | Authentication service |
| CSS-in-JS | Styled components |
| Google Fonts | Typography (Montserrat, Oswald) |

### Backend

| Technology | Purpose |
|------------|---------|
| Flask 3.1.2 | Web framework |
| Cryptography 46.0.2 | Fernet encryption |
| Stegano 2.0.0 | LSB image steganography |
| OpenCV 4.12.0 | Video processing |
| NumPy 2.2.6 | Array operations |
| Pillow 11.3.0 | Image manipulation |
| Flask-CORS 6.0.1 | Cross-origin support |
| Hashlib | SHA-256 hashing (built-in) |
| Wave | Audio processing (built-in) |

## Installation

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd stegano-backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python backend.py
```

Backend will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd stegano-app

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

### Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Email/Password and Google authentication
3. Create `src/firebase.js` with your Firebase config:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

## Usage

### Encrypting Data

1. Log in to the application
2. Select the "Encrypt" tab
3. Enter your plaintext message
4. Upload three files:
   - One PNG image
   - One video file (MP4/AVI)
   - One WAV audio file
5. Click "Encrypt & Hide"
6. Copy the generated ciphertext
7. Download all three encoded files

### Decrypting Data

1. Select the "Decrypt" tab
2. Paste the ciphertext
3. Upload the three encoded files (image, video, audio)
4. Click "Decrypt & Reveal"
5. View the original message

**Important**: Keep all three encoded files safe. Losing any file makes decryption impossible.

## Security Model

### Threat Model

**Protected Against:**
- Passive network eavesdropping (encrypted data)
- Single file interception (key splitting)
- File tampering (hash verification)
- Brute force attacks (strong encryption + distributed key)
- Casual inspection (steganography)

**Not Protected Against:**
- Loss/corruption of any encoded file (data becomes unrecoverable)
- Compromise of all three files simultaneously
- Quantum computing attacks (Fernet uses AES-128)
- Physical access to server memory during encryption

### Cryptographic Properties

- **Encryption Algorithm**: AES-128 in CBC mode (via Fernet)
- **Key Size**: 256 bits (32 bytes)
- **Hash Function**: SHA-256 (256-bit output)
- **Steganography**: LSB substitution (1 bit per byte)
- **Authentication**: HMAC for message integrity

### Key Security Considerations

1. **Key Generation**: Uses `secrets.token_bytes()` via Fernet for cryptographically secure randomness
2. **Key Storage**: Never persisted to disk; exists only in multimedia files
3. **Key Splitting**: Even distribution across three parts
4. **Key Reconstruction**: Requires exact Base64 decoding and padding correction

## API Documentation

### POST /encrypt

Encrypts plaintext data and hides the encryption key in multimedia files.

**Request:**
```
Content-Type: multipart/form-data

Fields:
- data: string (plaintext message)
- image: file (PNG image)
- video: file (MP4/AVI video)
- audio: file (WAV audio)
```

**Response:**
```json
{
  "ciphertext": "Base64-encoded envelope containing encrypted data and file hashes",
  "encoded_image": "http://localhost:5000/download/encoded_image.png",
  "encoded_video": "http://localhost:5000/download/encoded_video.avi",
  "encoded_audio": "http://localhost:5000/download/encoded_audio.wav"
}
```

**Status Codes:**
- 200: Success
- 400: Missing required fields
- 500: Encoding failure

### POST /decrypt

Decrypts data by extracting and reconstructing the key from multimedia files.

**Request:**
```
Content-Type: multipart/form-data

Fields:
- ciphertext: string (Base64 envelope)
- encoded_image: file (encoded PNG)
- encoded_video: file (encoded AVI)
- encoded_audio: file (encoded WAV)
```

**Response:**
```json
{
  "decrypted_text": "Original plaintext message"
}
```

**Status Codes:**
- 200: Success
- 400: Missing required fields
- 403: File tampering detected
- 500: Decryption failure

### GET /download/:filename

Downloads an encoded multimedia file.

**Response:**
- File download with Content-Disposition: attachment

## Project Structure

```
.
├── stegano-app/                  # React frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js          # Login page with split layout
│   │   │   ├── Signup.js         # Registration page
│   │   │   └── PrivateRoute.js   # Route protection
│   │   ├── contexts/
│   │   │   └── AuthContext.js    # Firebase auth state
│   │   ├── App.js                # Main encryption interface
│   │   ├── App.css               # Styling
│   │   ├── firebase.js           # Firebase configuration
│   │   ├── index.js              # App entry point
│   │   └── index.css             # Global styles
│   ├── package.json
│   └── .gitignore
│
├── stegano-backend/              # Flask backend
│   ├── backend.py                # Main application file
│   ├── requirements.txt          # Python dependencies
│   ├── uploads/                  # Temporary file storage (gitignored)
│   └── .gitignore
│
└── README.md                     # This file
```

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ES6+ syntax, functional components with hooks
- **CSS**: BEM naming convention for classes

### Testing

Before submitting a PR, ensure:
- Backend encryption/decryption cycle works correctly
- All three steganography methods preserve data
- File integrity checks detect tampering
- Frontend handles errors gracefully

---
