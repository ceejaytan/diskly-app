import React, { useState, useEffect, useRef } from "react";

import { API_URL, logout_session } from "../API/config";
import "../Css/Header.css";
import checkLoginSession from "./Login/CheckLoginSession";

type SessionType = { username: string } | null;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [session, setSession] = useState<SessionType>(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      const userdata = await checkLoginSession();
      if (userdata && userdata.logged_in) {
        setSession({ username: userdata.username });
      } else {
        setSession(null);
      }
    })();
  }, []);

  const param = new URLSearchParams(window.location.search).get("search") || "";

  useEffect(() => {
    setSearchTerm(param);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/games-list?search=${encodeURIComponent(
      searchTerm
    )}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <img
          src="/images/diskly-logo.png"
          alt="Diskly Logo"
          className="img-diskly-logo"
          onClick={() => (window.location.href = "/")}
        />
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">🔍︎</button>
      </form>

      <button
        ref={buttonRef}
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu ☰
      </button>

      <nav ref={menuRef} className={`nav ${isOpen ? "open" : ""}`}>
        <ul>
          {session && (
            <>
              <li className="header-profile">
                <img
                  src={`${API_URL}/images/DEFAULT_PIC.png`}
                  alt="Profile"
                  className="profile-avatar"
                />
                <span className="profile-username">
                  Your profile: {session.username}
                </span>
                <button
                  className="logout-btn"
                  onClick={() => {
                    logout_session();
                  }}
                >
                  Logout
                </button>
              </li>

<<<<<<< HEAD
          <li><a href="/home">Home</a></li>
          <li><a href="/games-list">Catalog</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="/Terms">T&C</a></li>
        </>
      )}
=======
              <li>
                <a href="/home">Home</a>
              </li>
              <li>
                <a href="#">Catalog</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="/Terms">T&C</a>
              </li>
            </>
          )}
>>>>>>> main

          {!session && (
            <li>
              <a href="/AuthPage?type=login">Sign In</a>
              <a href="/AuthPage?type=register">Register</a>
              <a href="/Stock">Admin</a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
