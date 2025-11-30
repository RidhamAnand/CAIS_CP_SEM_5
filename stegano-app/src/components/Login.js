// src/components/Login.js
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError("Please fill in all fields");
    }

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Failed to log in: " + err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Failed to sign in with Google: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container-modern">
      <div className="auth-background"></div>
      
      {/* Split Layout Container */}
      <div className="auth-split-container">
        {/* Left Side - Image/Branding */}
        <div className="auth-left-panel">
          <div className="auth-branding-content">
            <div className="logo-circle-large">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="brand-name-large">Secure Key Sharing</h1>
            <p className="brand-description">Hide and share encryption keys securely within multimedia files using advanced steganography techniques</p>
            
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Military-grade encryption</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🖼️</span>
                <span>Hide keys in images, videos & audio</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔐</span>
                <span>Secure steganography techniques</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-right-panel">
          <div className="auth-form-container">
            <h2 className="auth-heading">Welcome Back</h2>
            <p className="auth-subheading">Sign in to continue to Secure Key Sharing</p>
        
        {error && (
          <div className="error-message-modern">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group-auth">
            <label className="form-label-auth">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="form-input-auth"
              required
            />
          </div>

          <div className="form-group-auth">
            <label className="form-label-auth">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input-auth"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-auth-primary">
            {loading ? (
              <>
                <span className="spinner-mini-auth"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="divider-auth">or</div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="btn-auth-google"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

            <p className="auth-link-auth">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>

      <ModernAuthStyles />
    </div>
  );
}

const ModernAuthStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Oswald:wght@300;400;500;600;700&display=swap');

    :root {
      --primary: #7C3AED;
      --primary-dark: #6D28D9;
      --primary-light: #8B5CF6;
      --secondary: #EC4899;
      --accent: #10B981;
      --bg-dark: #0F172A;
      --bg-darker: #020617;
      --bg-card: #1E293B;
      --text-primary: #F9FAFB;
      --text-secondary: #D1D5DB;
      --text-muted: #9CA3AF;
      --border: #374151;
      --primary-gradient: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    }

    * {
      font-family: 'Montserrat', sans-serif;
    }

    .auth-container-modern {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--bg-dark) 0%, #1E1B4B 100%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .auth-container-modern::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%);
      pointer-events: none;
      z-index: 1;
    }

    .auth-background {
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: rgba(124, 58, 237, 0.1);
      top: -200px;
      right: -200px;
      animation: float 6s ease-in-out infinite;
      z-index: 2;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(20px) rotate(5deg); }
    }

    .auth-split-container {
      display: flex;
      background: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(124, 58, 237, 0.2);
      width: 100%;
      max-width: 1100px;
      min-height: 600px;
      position: relative;
      z-index: 10;
      border: 1px solid var(--border);
      overflow: hidden;
    }

    .auth-left-panel {
      flex: 1;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      padding: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .auth-left-panel::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 70% 70%, rgba(0, 0, 0, 0.1) 0%, transparent 50%);
      pointer-events: none;
    }

    .auth-branding-content {
      position: relative;
      z-index: 1;
      text-align: center;
      color: white;
      animation: slideInLeft 0.6s ease;
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .logo-circle-large {
      width: 100px;
      height: 100px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem;
      box-shadow: 0 0 40px rgba(255, 255, 255, 0.3);
    }

    .brand-name-large {
      font-family: 'Oswald', sans-serif;
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .brand-description {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
      margin-bottom: 3rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      text-align: left;
      max-width: 350px;
      margin: 0 auto;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      font-size: 0.95rem;
      color: white;
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateX(5px);
    }

    .feature-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .auth-right-panel {
      flex: 1;
      padding: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-card);
    }

    .auth-form-container {
      width: 100%;
      max-width: 400px;
      animation: slideInRight 0.6s ease;
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .logo-section-auth {
      text-align: center;
      margin-bottom: 2rem;
      animation: slideInDown 0.6s ease;
    }

    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .logo-circle {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: var(--primary-gradient);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      box-shadow: 0 0 30px rgba(124, 58, 237, 0.6);
    }

    .brand-name-auth {
      font-family: 'Oswald', sans-serif;
      font-size: 1.75rem;
      font-weight: 700;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .brand-tagline-auth {
      font-size: 0.9rem;
      color: var(--text-secondary);
      font-weight: 400;
    }

    .auth-heading {
      font-family: 'Oswald', sans-serif;
      text-align: center;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      font-size: 1.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .auth-subheading {
      text-align: center;
      margin-bottom: 2rem;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .auth-form {
      margin-bottom: 1.5rem;
    }

    .form-group-auth {
      margin-bottom: 1.25rem;
    }

    .form-label-auth {
      font-family: 'Oswald', sans-serif;
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.9rem;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .form-input-auth {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 1.5px solid var(--border);
      border-radius: 10px;
      font-size: 0.95rem;
      font-family: 'Montserrat', sans-serif;
      transition: all 0.3s ease;
      background: var(--bg-darker);
      color: var(--text-primary);
    }

    .form-input-auth::placeholder {
      color: var(--text-muted);
    }

    .form-input-auth:focus {
      outline: none;
      border-color: var(--primary);
      background: var(--bg-card);
      box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
    }

    .btn-auth-primary {
      font-family: 'Oswald', sans-serif;
      width: 100%;
      padding: 0.95rem;
      background: var(--primary-gradient);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .btn-auth-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 0 30px rgba(124, 58, 237, 0.8);
    }

    .btn-auth-primary:active {
      transform: translateY(0px);
    }

    .btn-auth-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner-mini-auth {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .divider-auth {
      text-align: center;
      margin: 1.5rem 0;
      color: var(--text-muted);
      position: relative;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .divider-auth::before,
    .divider-auth::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background: var(--border);
    }

    .divider-auth::before {
      left: 0;
    }

    .divider-auth::after {
      right: 0;
    }

    .btn-auth-google {
      width: 100%;
      padding: 0.95rem;
      background: var(--bg-darker);
      border: 1.5px solid var(--border);
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      transition: all 0.3s ease;
      color: var(--text-primary);
    }

    .btn-auth-google:hover:not(:disabled) {
      background: var(--bg-card);
      border-color: var(--primary);
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
    }

    .btn-auth-google:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message-modern {
      background: rgba(239, 68, 68, 0.1);
      color: #FCA5A5;
      padding: 0.875rem 1rem;
      border-radius: 10px;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      border: 1px solid rgba(239, 68, 68, 0.3);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: slideDown 0.3s ease;
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

    .auth-link-auth {
      text-align: center;
      margin-top: 1.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 400;
    }

    .auth-link-auth a {
      color: var(--primary-light);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .auth-link-auth a:hover {
      color: var(--secondary);
      text-decoration: underline;
    }

    @media (max-width: 968px) {
      .auth-split-container {
        flex-direction: column;
        max-width: 500px;
      }

      .auth-left-panel {
        padding: 3rem 2rem;
        min-height: 300px;
      }

      .brand-name-large {
        font-size: 2rem;
      }

      .feature-list {
        display: none;
      }

      .auth-right-panel {
        padding: 3rem 2rem;
      }
    }

    @media (max-width: 480px) {
      .auth-split-container {
        border-radius: 20px;
      }

      .auth-left-panel {
        padding: 2rem 1.5rem;
      }

      .logo-circle-large {
        width: 70px;
        height: 70px;
      }

      .brand-name-large {
        font-size: 1.5rem;
      }

      .auth-right-panel {
        padding: 2rem 1.5rem;
      }

      .auth-heading {
        font-size: 1.5rem;
      }
    }
  `}</style>
);

export default Login;
