import React, { useState } from 'react';
import {BrowserRouter as Router, Link} from 'react-router-dom';
import { Routes ,Route } from 'react-router-dom';
import LoginForm from './components/login.tsx';
import Menu from './components/menu.tsx';
import Home from './components/home.tsx';
import About from './components/about.tsx';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedPage, setSelectedPage] = useState('home');

  const handleLogin = (username, password) => {
    console.log(`Logged in as ${username}`);
    setUsername(username);
    setPassword(password);
    setLoggedIn(true);
    setSelectedPage('home');
  };

  const handleLogout = () => {
    setUsername('');
    setPassword('');
    setLoggedIn(false);
  };


  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" Component={LoginForm} />
          <Route path="/" Component={Menu} />
          <Route path="/home" Component={Home} />
          <Route path="/about" Component={About} />
        </Routes>
      </Router>

    </div>
  );
}
