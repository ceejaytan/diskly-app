import React, { useState, useEffect, useRef } from "react";
import checkLoginSession from "../components/Login/CheckLoginSession";

type HeaderProps = {
  onTermsClick?: () => void;
};

type SessionType = { username: string; } | null;

export default function Header({ onTermsClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [session, setSession] = useState<SessionType>(null);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching for: ${searchTerm}`);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/images/diskly-logo.png" alt="Diskly Logo" style={{ height: "70px" }} />
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
      <button ref={buttonRef} className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        Menu ☰
      </button>
      <nav ref={menuRef} className={`nav ${isOpen ? "open" : ""}`}>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Catalog</a></li>
          {session ? (
            <>
              <li>{session.username}</li>
              <li><a href="/logout">Logout</a></li>
            </>
          ) : (
            <li><a href="/AuthPage">Sign In</a></li>
          )}
          <li><a href="#">Contact Us</a></li>
          <li><a href="/Terms">T&C</a></li>
        </ul>
      </nav>
    </header>
  );
}
