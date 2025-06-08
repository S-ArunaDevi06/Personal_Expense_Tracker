import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './AuthForm.js';
import Hero from './hero.js';
import './App.css';
import Record from './Record.js';
import Dashboard from './Dashboard.js';
import Budget from './ManageBudget.js';

// Define context here
export const UserContext = createContext();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // holds { username, email }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/login"
            element={<AuthForm isLogin={true} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/register"
            element={<AuthForm isLogin={false} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/hero"
            element={isLoggedIn ? <Hero /> : <Navigate to="/login" />}
          />
          <Route path="/record" element={<Record />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/budget" element={<Budget />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
