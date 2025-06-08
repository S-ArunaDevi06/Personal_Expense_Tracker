import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from './api.js';
import { UserContext } from './App.js'; // Import context from App
import './AuthForm.css';

const AuthForm = ({ isLogin, setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Use context

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await loginUser(formData.email, formData.password);
        setIsLoggedIn(true);
        setUser({ email: formData.email });
        navigate('/record');
      } else {
        await registerUser(formData.username, formData.email, formData.password);
        alert('User registered!');
        navigate('/login');
      }
    } catch (err) {
      alert(isLogin ? 'Invalid mailID or password!' : 'User already exists!');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        <p className="toggle-text" onClick={() => navigate(isLogin ? '/register' : '/login')}>
          {isLogin ? 'New here? Register now!' : 'Already have an account? Login!'}
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
