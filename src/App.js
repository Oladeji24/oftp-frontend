import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [remember, setRemember] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Use environment variable for backend API URL, fallback to localhost for local dev
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(`${apiUrl}${endpoint}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage(isLogin ? `Welcome, ${data.user.username}!` : 'Registration successful! Please log in.');
        if (isLogin) {
          // Save token for future authenticated requests
          localStorage.setItem('token', data.token);
        }
      } else {
        setMessage(data.message || 'Error occurred.');
      }
    } catch (err) {
      setMessage('Server error.');
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setMessage('');
    setResetSent(false);
    try {
      // Simulate sending a reset link (in real app, call backend API)
      setTimeout(() => {
        setResetSent(true);
        setMessage('If this email is registered, a reset link has been sent.');
      }, 1000);
    } catch (err) {
      setMessage('Error sending reset link.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Forex & Crypto Trading Platform</h1>
      </header>
      <div className="auth-container">
        {showForgot ? (
          <form onSubmit={handleForgot} className="auth-form">
            <h2>Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send Reset Link</button>
            <button type="button" className="toggle-btn" onClick={() => { setShowForgot(false); setMessage(''); }}>
              Back to Login
            </button>
            {resetSent && <div className="message">{message}</div>}
          </form>
        ) : (
          <>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit} className="auth-form">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {isLogin && (
                <div className="remember-row">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
              )}
              <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            {isLogin && (
              <button className="toggle-btn" onClick={() => { setShowForgot(true); setMessage(''); }}>
                Forgot password?
              </button>
            )}
            <button className="toggle-btn" onClick={() => { setIsLogin(!isLogin); setMessage(''); }}>
              {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
            {message && <div className="message">{message}</div>}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
