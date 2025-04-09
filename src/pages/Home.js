// src/pages/Home.js
import React, { useEffect } from 'react';
import './Loader.css'; // CSSファイルを分けて読み込み

const Home = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "main3.html";
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-container">
      <div className="loader">
        <span className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <ellipse transform="rotate(-21.283 49.994 75.642)" cx="50" cy="75.651" rx="19.347" ry="16.432" fill="currentColor" />
            <path fill="currentColor" d="M58.474 7.5h10.258v63.568H58.474z" />
          </svg>
        </span>
        <span className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <ellipse transform="rotate(-21.283 49.994 75.642)" cx="50" cy="75.651" rx="19.347" ry="16.432" fill="currentColor" />
            <path fill="currentColor" d="M58.474 7.5h10.258v63.568H58.474z" />
          </svg>
        </span>
        <span className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <ellipse transform="rotate(-21.283 49.994 75.642)" cx="50" cy="75.651" rx="19.347" ry="16.432" fill="currentColor" />
            <path fill="currentColor" d="M58.474 7.5h10.258v63.568H58.474z" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default Home;
