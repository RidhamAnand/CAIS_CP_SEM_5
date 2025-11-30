import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Enhanced Polymorphic Components
const Card = ({ variant = "primary", children, className = "", icon = null }) => {
  const variants = {
    primary: "card card-primary",
    secondary: "card card-secondary",
    accent: "card card-accent",
    minimal: "card card-minimal"
  };
  return (
    <div className={`${variants[variant]} ${className}`}>
      {icon && <div className="card-icon-container">{icon}</div>}
      {children}
    </div>
  );
};

const Button = ({ variant = "primary", loading = false, children, size = "md", ...props }) => {
  const variants = {
    primary: "btn btn-primary",
    secondary: "btn btn-secondary",
    accent: "btn btn-accent",
    outline: "btn btn-outline",
    ghost: "btn btn-ghost"
  };
  const sizes = {
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg"
  };
  return (
    <button className={`${variants[variant]} ${sizes[size]}`} disabled={loading} {...props}>
      {loading ? (
        <>
          <span className="spinner-mini"></span>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};

const Alert = ({ type = "error", children, icon = null }) => {
  const types = {
    error: "alert alert-error",
    success: "alert alert-success",
    info: "alert alert-info",
    warning: "alert alert-warning"
  };
  return (
    <div className={types[type]}>
      {icon && <span className="alert-icon">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};

const SectionTitle = ({ children, icon = null }) => (
  <div className="section-title">
    {icon && <span className="section-icon">{icon}</span>}
    <h2>{children}</h2>
  </div>
);

function App() {
  const [inputText, setInputText] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [encodedImage, setEncodedImage] = useState("");
  const [encodedVideo, setEncodedVideo] = useState("");
  const [encodedAudio, setEncodedAudio] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);
  const [decodedImage, setDecodedImage] = useState(null);
  const [decodedVideo, setDecodedVideo] = useState(null);
  const [decodedAudio, setDecodedAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("encrypt");

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleVideoChange = (event) => {
    setVideo(event.target.files[0]);
  };

  const handleAudioChange = (event) => {
    setAudio(event.target.files[0]);
  };

  const handleDecodedImageChange = (event) => {
    setDecodedImage(event.target.files[0]);
  };

  const handleDecodedVideoChange = (event) => {
    setDecodedVideo(event.target.files[0]);
  };

  const handleDecodedAudioChange = (event) => {
    setDecodedAudio(event.target.files[0]);
  };

  const handleEncrypt = async () => {
    setError("");
    setDecryptedText("");
    setLoading(true);

    if (!inputText || !image || !video || !audio) {
      setError("Please enter text and upload an image, video, and audio file.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("data", inputText);
    formData.append("image", image);
    formData.append("video", video);
    formData.append("audio", audio);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/encrypt",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setCiphertext(response.data.ciphertext);
      setEncodedImage(response.data.encoded_image);
      setEncodedVideo(response.data.encoded_video);
      setEncodedAudio(response.data.encoded_audio);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Error encrypting data";
      setError(errorMessage);
      console.error("Full error:", err);
      console.error("Error response:", err.response?.data);
    }
    setLoading(false);
  };

  const handleDecrypt = async () => {
    setError("");
    setDecryptedText("");
    setLoading(true);

    if (!ciphertext || !decodedImage || !decodedVideo || !decodedAudio) {
      setError(
        "Please enter ciphertext and upload encoded image, video, and audio files."
      );
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("ciphertext", ciphertext);
    formData.append("encoded_image", decodedImage);
    formData.append("encoded_video", decodedVideo);
    formData.append("encoded_audio", decodedAudio);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/decrypt",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setDecryptedText(response.data.decrypted_text);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Error decrypting data";
      setError(errorMessage);
      console.error("Full error:", err);
      console.error("Error response:", err.response?.data);
    }
    setLoading(false);
  };

  return (
    <div className="app-container-brainal">
      {/* Enhanced Navigation Bar with BrainAI Theme */}
      <nav className="navbar-brainal">
        <div className="nav-content-brainal">
          <div className="nav-left-brainal">
            <div className="logo-brainal">
              <div className="logo-gradient">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12h8M12 8v8M16 10l-4 4M12 10l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <span className="logo-text-brainal">Secure Key Sharing</span>
               
              </div>
            </div>
          </div>
          
          <div className="nav-center-brainal">
            <div className="nav-tabs">
              <button 
                className={`nav-tab ${activeTab === 'encrypt' ? 'active' : ''}`}
                onClick={() => setActiveTab('encrypt')}
              >
                🔒 Encrypt
              </button>
              <button 
                className={`nav-tab ${activeTab === 'decrypt' ? 'active' : ''}`}
                onClick={() => setActiveTab('decrypt')}
              >
                🔓 Decrypt
              </button>
            </div>
          </div>

          <div className="nav-right-brainal">
            <div className="user-info-brainal">
              <div className="user-avatar-brainal">
                {currentUser?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-name">Welcome</span>
                <span className="user-email-brainal">{currentUser?.email}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="btn-logout-brainal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="main-content-brainal">
        {/* Hero Section */}
        <div className="hero-section-brainal">
          <div className="hero-badge">🔐 Steganography-Based Security</div>
          <h1 className="hero-title-brainal">Secure Key Sharing via Steganography</h1>
          <p className="hero-subtitle-brainal">
            Hide and share encryption keys securely within multimedia files using advanced steganography techniques
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert type="error" icon="⚠️">
            {error}
          </Alert>
        )}

        {/* Main Grid */}
        <div className="cards-grid-brainal">
          {/* Encrypt Card */}
          {activeTab === 'encrypt' && (
          <Card variant="primary">
            <div className="card-header-brainal">
              <div className="card-icon-brainal encrypt-icon">
                🔒
              </div>
              <div>
                <h2 className="card-title-brainal">Encrypt & Hide</h2>
                <p className="card-desc">Secure your data with advanced encryption</p>
              </div>
            </div>

            <div className="card-body-brainal">
              <SectionTitle icon="📝">Message</SectionTitle>
              <div className="form-group-brainal">
                <textarea
                  className="form-textarea-brainal"
                  placeholder="Enter your secret message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows="3"
                />
              </div>

              <SectionTitle icon="📦">Cover Media</SectionTitle>
              <div className="upload-grid-brainal">
                {/* Image Upload */}
                <div className="upload-box-brainal">
                  <input
                    type="file"
                    accept="image/png"
                    onChange={handleImageChange}
                    className="file-input"
                    id="encrypt-img"
                  />
                  <label htmlFor="encrypt-img" className="upload-label-brainal">
                    {image ? (
                      <div className="preview-container-brainal">
                        <img src={URL.createObjectURL(image)} alt="Preview" className="preview-image-brainal"/>
                        <div className="preview-overlay-brainal">Change</div>
                      </div>
                    ) : (
                      <div className="upload-placeholder-brainal">
                        <span className="upload-icon">🖼️</span>
                        <span>Image</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Video Upload */}
                <div className="upload-box-brainal">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="file-input"
                    id="encrypt-video"
                  />
                  <label htmlFor="encrypt-video" className="upload-label-brainal">
                    {video ? (
                      <div className="file-selected-brainal">
                        <span>🎥</span>
                        <span className="file-name-brainal">{video.name.substring(0, 15)}</span>
                      </div>
                    ) : (
                      <div className="upload-placeholder-brainal">
                        <span className="upload-icon">🎥</span>
                        <span>Video</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Audio Upload */}
                <div className="upload-box-brainal">
                  <input
                    type="file"
                    accept=".wav"
                    onChange={handleAudioChange}
                    className="file-input"
                    id="encrypt-audio"
                  />
                  <label htmlFor="encrypt-audio" className="upload-label-brainal">
                    {audio ? (
                      <div className="file-selected-brainal">
                        <span>🎵</span>
                        <span className="file-name-brainal">{audio.name.substring(0, 15)}</span>
                      </div>
                    ) : (
                      <div className="upload-placeholder-brainal">
                        <span className="upload-icon">🎵</span>
                        <span>Audio</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <Button 
                variant="primary" 
                size="lg"
                onClick={handleEncrypt}
                loading={loading}
                style={{ marginTop: '1.5rem' }}
              >
                🔐 Encrypt Data
              </Button>

              {ciphertext && (
                <div className="result-section-brainal">
                  <div className="result-box-brainal success">
                    <label className="result-label-brainal">✅ Encrypted Data</label>
                    <div className="ciphertext-display-brainal">{ciphertext}</div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(ciphertext);
                        alert('Copied to clipboard!');
                      }}
                      className="btn-copy-brainal"
                    >
                      📋 Copy Ciphertext
                    </button>
                  </div>

                  {/* Download Encrypted Files */}
                  <div className="download-section-brainal">
                    <label className="result-label-brainal">📥 Download Encrypted Files</label>
                    <div className="download-grid-brainal">
                      {encodedImage && (
                        <a
                          href={encodedImage}
                          download="encoded_image.png"
                          className="download-card-brainal"
                        >
                          <span className="download-icon">🖼️</span>
                          <span className="download-label">Image</span>
                        </a>
                      )}
                      {encodedVideo && (
                        <a
                          href={encodedVideo}
                          download="encoded_video.avi"
                          className="download-card-brainal"
                        >
                          <span className="download-icon">🎥</span>
                          <span className="download-label">Video</span>
                        </a>
                      )}
                      {encodedAudio && (
                        <a
                          href={encodedAudio}
                          download="encoded_audio.wav"
                          className="download-card-brainal"
                        >
                          <span className="download-icon">🎵</span>
                          <span className="download-label">Audio</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
          )}

          {/* Decrypt Card */}
          {activeTab === 'decrypt' && (
          <Card variant="secondary">
            <div className="card-header-brainal secondary">
              <div className="card-icon-brainal decrypt-icon">
                🔓
              </div>
              <div>
                <h2 className="card-title-brainal">Decrypt & Extract</h2>
                <p className="card-desc">Retrieve your hidden information</p>
              </div>
            </div>

            <div className="card-body-brainal">
              <SectionTitle icon="📦">Cover Media</SectionTitle>
              <div className="upload-grid-brainal">
                {/* Image Upload */}
                <div className="upload-box-brainal">
                  <input
                    type="file"
                    accept="image/png"
                    onChange={handleDecodedImageChange}
                    className="file-input"
                    id="decrypt-img"
                  />
                  <label htmlFor="decrypt-img" className="upload-label-brainal">
                    {decodedImage ? (
                      <div className="preview-container-brainal">
                        <img src={URL.createObjectURL(decodedImage)} alt="Preview" className="preview-image-brainal"/>
                        <div className="preview-overlay-brainal">Change</div>
                      </div>
                    ) : (
                      <div className="upload-placeholder-brainal">
                        <span className="upload-icon">🖼️</span>
                        <span>Image</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Video Upload */}
                <div className="upload-box-brainal">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleDecodedVideoChange}
                    className="file-input"
                    id="decrypt-video"
                  />
                  <label htmlFor="decrypt-video" className="upload-label-brainal">
                    {decodedVideo ? (
                      <div className="file-selected-brainal">
                        <span>🎥</span>
                        <span className="file-name-brainal">{decodedVideo.name.substring(0, 15)}</span>
                      </div>
                    ) : (
                      <div className="upload-placeholder-brainal">
                        <span className="upload-icon">🎥</span>
                        <span>Video</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Audio Upload */}
                <div className="upload-box-brainal">
                  <input
                    type="file"
                    accept=".wav"
                    onChange={handleDecodedAudioChange}
                    className="file-input"
                    id="decrypt-audio"
                  />
                  <label htmlFor="decrypt-audio" className="upload-label-brainal">
                    {decodedAudio ? (
                      <div className="file-selected-brainal">
                        <span>🎵</span>
                        <span className="file-name-brainal">{decodedAudio.name.substring(0, 15)}</span>
                      </div>
                    ) : (
                      <div className="upload-placeholder-brainal">
                        <span className="upload-icon">🎵</span>
                        <span>Audio</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <Button 
                variant="secondary" 
                size="lg"
                onClick={handleDecrypt}
                loading={loading}
                style={{ marginTop: '1.5rem' }}
              >
                🔐 Decrypt Data
              </Button>

              {decryptedText && (
                <div className="result-section-brainal">
                  <div className="result-box-brainal success">
                    <label className="result-label-brainal">✅ Decrypted Message</label>
                    <div className="decrypted-display-brainal">{decryptedText}</div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(decryptedText);
                        alert('Copied to clipboard!');
                      }}
                      className="btn-copy-brainal"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
          )}
        </div>
      </div>

      <ModernStyles />
    </div>
  );
}

// Modern Styles Component with BrainAI Theme  
const ModernStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Oswald:wght@300;400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --primary: #7C3AED;
      --primary-dark: #6D28D9;
      --primary-light: #8B5CF6;
      --secondary: #EC4899;
      --accent: #10B981;
      --success: #10B981;
      --danger: #EF4444;
      --text-primary: #F9FAFB;
      --text-secondary: #D1D5DB;
      --text-muted: #9CA3AF;
      --border-color: #374151;
      --bg-dark: #0F172A;
      --bg-darker: #020617;
      --bg-card: #1E293B;
      --bg-card-hover: #334155;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.6);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.7);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.8);
      --glow: 0 0 20px rgba(124, 58, 237, 0.5);
    }

    .app-container-brainal {
      min-height: 100vh;
      background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%);
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: var(--text-primary);
      position: relative;
    }

    .app-container-brainal::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }

    /* Enhanced Navigation Bar */
    .navbar-brainal {
      background: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: var(--shadow-lg);
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid var(--border-color);
    }

    .nav-content-brainal {
      max-width: 1600px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      position: relative;
      z-index: 1;
    }

    .nav-left-brainal {
      display: flex;
      align-items: center;
      min-width: 250px;
    }

    .logo-brainal {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .logo-gradient {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(107, 70, 193, 0.3);
    }

    .logo-text-brainal {
      font-size: 1.3rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
      font-family: 'Oswald', sans-serif;
    }

    .logo-subtitle {
      font-size: 0.75rem;
      color: var(--secondary);
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .nav-center-brainal {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .nav-tabs {
      display: flex;
      gap: 0.5rem;
      background: var(--bg-darker);
      padding: 0.5rem;
      border-radius: 10px;
      border: 1px solid var(--border-color);
    }

    .nav-tab {
      padding: 0.6rem 1.2rem;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-weight: 600;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .nav-tab.active {
      background: var(--primary);
      color: white;
      box-shadow: var(--glow);
    }

    .nav-tab:hover {
      color: var(--primary);
    }

    .nav-right-brainal {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .user-info-brainal {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      background: var(--bg-card);
      border-radius: 10px;
      border: 1px solid var(--border-color);
    }

    .user-avatar-brainal {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.95rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .user-email-brainal {
      font-size: 0.85rem;
      color: var(--text-primary);
      font-weight: 500;
    }

    .btn-logout-brainal {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: rgba(239, 68, 68, 0.1);
      color: var(--danger);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-logout-brainal:hover {
      background: var(--danger);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    /* Main Content */
    .main-content-brainal {
      max-width: 1600px;
      margin: 0 auto;
      padding: 3rem 2rem;
      position: relative;
      z-index: 1;
    }

    .hero-section-brainal {
      text-align: center;
      margin-bottom: 3rem;
      animation: slideDown 0.6s ease;
    }

    .hero-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: rgba(107, 70, 193, 0.1);
      color: var(--primary);
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1rem;
      border: 1px solid rgba(107, 70, 193, 0.2);
    }

    .hero-title-brainal {
      font-size: 2.8rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary-light) 0%, var(--secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
      letter-spacing: -1px;
      font-family: 'Oswald', sans-serif;
      text-transform: uppercase;
    }

    .hero-subtitle-brainal {
      font-size: 1.1rem;
      color: var(--text-secondary);
      font-weight: 400;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Alerts */
    .alert {
      padding: 1rem 1.5rem;
      border-radius: 10px;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 500;
      animation: slideDown 0.3s ease;
      border: 1px solid;
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.2);
      color: #DC2626;
    }

    .alert-success {
      background: rgba(16, 185, 129, 0.1);
      border-color: rgba(16, 185, 129, 0.2);
      color: var(--success);
    }

    .alert-info {
      background: rgba(59, 130, 246, 0.1);
      border-color: rgba(59, 130, 246, 0.2);
      color: #2563EB;
    }

    .alert-warning {
      background: rgba(245, 158, 11, 0.1);
      border-color: rgba(245, 158, 11, 0.2);
      color: #D97706;
    }

    .alert-icon {
      font-size: 1.2rem;
    }

    /* Section Title */
    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-family: 'Oswald', sans-serif;
    }

    .section-icon {
      font-size: 1.2rem;
    }

    /* Cards Grid */
    .cards-grid-brainal {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      animation: slideUp 0.5s ease;
    }

    /* Card Styles */
    .card {
      background: var(--bg-card);
      border-radius: 16px;
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      transition: all 0.3s ease;
      border: 1px solid var(--border-color);
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl), var(--glow);
      border-color: var(--primary);
    }

    .card-primary {
      border-top: 3px solid var(--primary);
    }

    .card-secondary {
      border-top: 3px solid var(--secondary);
    }

    .card-accent {
      border-top: 3px solid var(--accent);
    }

    .card-header-brainal {
      padding: 2rem;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      color: white;
    }

    .card-header-brainal.secondary {
      background: linear-gradient(135deg, var(--secondary) 0%, #D81B60 100%);
    }

    .card-icon-brainal {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      flex-shrink: 0;
    }

    .card-title-brainal {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin: 0;
      line-height: 1.3;
    }

    .card-desc {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 0.25rem;
    }

    .card-body-brainal {
      padding: 2rem;
    }

    /* Form Groups */
    .form-group-brainal {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      letter-spacing: 0.3px;
    }

    .form-textarea-brainal {
      width: 100%;
      padding: 0.875rem 1.125rem;
      border: 1.5px solid var(--border-color);
      border-radius: 10px;
      font-size: 0.95rem;
      font-family: 'Montserrat', sans-serif;
      transition: all 0.3s ease;
      background: var(--bg-darker);
      color: var(--text-primary);
      resize: vertical;
    }

    .form-textarea-brainal:focus {
      outline: none;
      border-color: var(--primary);
      background: var(--bg-card);
      box-shadow: var(--glow);
    }

    /* Upload Grid */
    .upload-grid-brainal {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .upload-box-brainal {
      aspect-ratio: 1;
      position: relative;
    }

    .file-input {
      display: none;
    }

    .upload-label-brainal {
      display: block;
      height: 100%;
      cursor: pointer;
    }

    .upload-placeholder-brainal {
      height: 100%;
      border: 2px dashed var(--border-color);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      transition: all 0.3s ease;
      background: var(--bg-darker);
    }

    .upload-placeholder-brainal:hover {
      border-color: var(--primary);
      color: var(--primary-light);
      background: rgba(124, 58, 237, 0.1);
      box-shadow: inset var(--glow);
    }

    .upload-icon {
      font-size: 2rem;
    }

    .preview-container-brainal {
      position: relative;
      height: 100%;
      border-radius: 12px;
      overflow: hidden;
    }

    .preview-image-brainal {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .preview-overlay-brainal {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .preview-container-brainal:hover .preview-overlay-brainal {
      opacity: 1;
    }

    .file-selected-brainal {
      height: 100%;
      border: 2px solid var(--primary);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: rgba(124, 58, 237, 0.15);
      padding: 1rem;
      box-shadow: inset var(--glow);
    }

    .file-name-brainal {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--primary-light);
      text-align: center;
      word-break: break-word;
      max-height: 40px;
      overflow: hidden;
    }

    /* Buttons */
    .btn {
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    .btn-md {
      padding: 0.75rem 1.5rem;
    }

    .btn-lg {
      padding: 1rem 2rem;
      width: 100%;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(107, 70, 193, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(107, 70, 193, 0.4);
    }

    .btn-secondary {
      background: linear-gradient(135deg, var(--secondary) 0%, #D81B60 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
    }

    .btn-secondary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
    }

    .btn-accent {
      background: linear-gradient(135deg, var(--accent) 0%, #A78BFA 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
    }

    .btn-outline {
      background: transparent;
      color: var(--primary);
      border: 2px solid var(--primary);
    }

    .btn-outline:hover:not(:disabled) {
      background: rgba(107, 70, 193, 0.1);
      transform: translateY(-2px);
    }

    .btn-ghost {
      background: transparent;
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    .btn-ghost:hover:not(:disabled) {
      background: var(--bg-light);
    }

    /* Spinners */
    .spinner-mini {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Result Section */
    .result-section-brainal {
      margin-top: 2rem;
      animation: slideUp 0.4s ease;
    }

    .result-box-brainal {
      padding: 1.5rem;
      background: var(--bg-darker);
      border-radius: 12px;
      border: 1.5px solid var(--border-color);
    }

    .result-box-brainal.success {
      background: rgba(16, 185, 129, 0.15);
      border-color: var(--accent);
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
    }

    .result-label-brainal {
      display: block;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-secondary);
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .ciphertext-display-brainal {
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 0.85rem;
      color: var(--text-secondary);
      word-break: break-all;
      padding: 1rem;
      background: var(--bg-card);
      border-radius: 8px;
      border: 1px solid var(--border-color);
      line-height: 1.6;
      max-height: 200px;
      overflow-y: auto;
      margin-bottom: 1rem;
    }

    .decrypted-display-brainal {
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 0.95rem;
      color: #6EE7B7;
      word-break: break-word;
      padding: 1rem;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 8px;
      border: 1px solid var(--accent);
      line-height: 1.6;
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 1rem;
      white-space: pre-wrap;
    }

    .btn-copy-brainal {
      width: 100%;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-copy-brainal:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(107, 70, 193, 0.3);
    }

    /* Download Section */
    .download-section-brainal {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }

    .download-grid-brainal {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-top: 1rem;
    }

    .download-card-brainal {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.25rem;
      background: var(--bg-card);
      border: 2px solid var(--primary);
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .download-card-brainal:hover {
      transform: translateY(-4px);
      box-shadow: var(--glow);
      background: rgba(124, 58, 237, 0.2);
      border-color: var(--primary-light);
    }

    .download-icon {
      font-size: 2rem;
    }

    .download-label {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--primary-light);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-family: 'Oswald', sans-serif;
    }

    .download-filename {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-align: center;
      word-break: break-all;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .nav-content-brainal {
        padding: 1rem;
        flex-wrap: wrap;
      }

      .upload-grid-brainal {
        grid-template-columns: repeat(2, 1fr);
      }

      .download-grid-brainal {
        grid-template-columns: repeat(2, 1fr);
      }

      .hero-title-brainal {
        font-size: 2.2rem;
      }
    }

    @media (max-width: 768px) {
      .nav-content-brainal {
        gap: 1rem;
      }

      .nav-center-brainal {
        display: none;
      }

      .nav-tab {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
      }

      .user-details {
        display: none;
      }

      .upload-grid-brainal {
        grid-template-columns: 1fr;
      }

      .download-grid-brainal {
        grid-template-columns: 1fr;
      }

      .hero-title-brainal {
        font-size: 1.8rem;
      }

      .hero-subtitle-brainal {
        font-size: 1rem;
      }

      .card-header-brainal {
        padding: 1.5rem;
        flex-direction: column;
        text-align: center;
      }

      .card-body-brainal {
        padding: 1.5rem;
      }

      .main-content-brainal {
        padding: 1.5rem 1rem;
      }
    }
  `}</style>
);

export default App;
