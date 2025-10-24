import { useState, useEffect, useRef } from "react";

import { API_URL, logout_session } from "../API/config";
import "../Css/Header.css";

type HeaderProps = {
  userSession: {
    userid: number;
    username: string;
    status: string;
  } | null
}

export default function Header({userSession}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    console.log(userSession)
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



  const [searchParam, setSearchParam] = useState("");

  function HandleSearchGame(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();

    window.location.href = `/games-list?search=${encodeURIComponent(searchParam)}`
  }

  return (
    <>
      {userSession?.status === "Banned" && (
      <div className="bg-red-600 text-white">You Have Been Banned From Renting</div>
      )}
    <header className="header">

      <div className="logo">
        <img
          src="/images/diskly-logo.png"
          alt="Diskly Logo"
          className="img-diskly-logo"
          onClick={() => (window.location.href = "/")}
        />
      </div>

      <form className="search-bar" onSubmit={HandleSearchGame}>
        <input
          type="text"
          placeholder="Search games..."
          value={ searchParam }
          onChange={(e) => {setSearchParam( e.target.value )}}
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
          {userSession && (
            <>
              <li className="header-profile">
                <img
                  src={`${API_URL}/images/DEFAULT_PIC.png`}
                  alt="Profile"
                  className="profile-avatar"
                />
                <span className="profile-username">
                username: <b><i>{userSession.username}</i></b>
                <p>View Profile</p>
                </span>
              </li>

              <li>
                <a href="/home">Home</a>
              </li>
              <li>
                <a href="/games-list">Catalog</a>
              </li>
              <li>
                <a href="/contact-us">Contact Us</a>
              </li>
              <li>
                <a href="/Terms">T&C</a>
              </li>

              <li>
                <button
                  className="logout-btn"
                  onClick={() => {
                    logout_session();
                  }}
                >
                  Sign Out
                </button>

              </li>
            </>
          )}

          {!userSession && (
            <li>
              <a href="/AuthPage?type=login">Sign In</a>
              <a href="/AuthPage?type=register">Register</a>
            </li>
          )}
        </ul>
      </nav>

    </header>
</>
  );
}
