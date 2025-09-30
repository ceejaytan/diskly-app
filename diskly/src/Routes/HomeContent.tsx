import React, { useState, useEffect, useRef } from "react";
import "../App.css";

const Header: React.FC<{ onTermsClick?: () => void }> = ({ onTermsClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
        <img
          src="/images/diskly-logo.png"
          alt="Diskly Logo"
          style={{ height: "70px" }}
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
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Catalog</a>
          </li>
          <li>
            <a href="/AuthPage">Sign In</a>
          </li>
          <li>
            <a href="#">Contact Us</a>
          </li>
          <li>
            <a href="/Terms">T&C</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="footer">
    &copy; {new Date().getFullYear()} DISKLY GameVault. All rights reserved.
  </footer>
);

const HomeContent: React.FC<{ navigateToTerms: () => void }> = ({
  navigateToTerms,
}) => {
  const images = [
    "/images/f124.png",
    "/images/fom.png",
    "/images/fear.png",
    "/images/cast.png",
    "/images/last.png",
  ];
  const moreImages = ["/images/HOW.png"];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleRentNow = () => (window.location.href = "/rent-form");

  const handleHowItWorks = () => {
    const section = document.getElementById("second-gallery");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app-container">
      <Header onTermsClick={navigateToTerms} />

      <main className="main-content">
        <h1>Borrow the game,</h1>
        <h1>
          <i>Keep the glory.</i>
        </h1>
        <p>
          <i>
            Welcome to DISKLY, your go-to place for game rentals. Whether you’re
            chasing retro memories or <br />
            diving into the latest releases, we make gaming simple, fun, and
            affordable for everyone.
          </i>
        </p>
        <div className="buttons">
          <button className="rent-now-btn" onClick={handleRentNow}>
            Rent Now
          </button>
          <button className="how-it-works-btn" onClick={handleHowItWorks}>
            How It Works
          </button>
          {}
        </div>
      </main>

      <div className="second-container">
        <div className="second-text">
          <h1>
            <i>Our Popular Games</i>
          </h1>
          <p>
            These are the games our players can’t get enough of! From classic
            hits to the latest releases, these titles are sure to bring endless
            fun.
          </p>
        </div>
        <div className="first-gallery">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Game ${index + 1}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                width: "250px",
                borderRadius: "8px",
                border: "2px solid #ffffff",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                boxShadow:
                  hoveredIndex === index
                    ? "0 10px 20px rgba(0,0,0,0.5)"
                    : "0 4px 10px rgba(0,0,0,0.3)",
              }}
            />
          ))}
        </div>
      </div>

      <div id="second-gallery" className="second-gallery">
        <div className="image-gallery-container">
          <div className="image-gallery">
            <img
              src={moreImages[0]}
              alt="Game 1"
              onMouseEnter={() => setHoveredIndex(images.length)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                width: "300px",
                borderRadius: "8px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                transform:
                  hoveredIndex === images.length ? "scale(1.05)" : "scale(1)",
              }}
            />
          </div>

          <div className="categories-text">
            <div className="category">
              <h2>Browse Games</h2>
              <p>
                Explore our collection of games! Popular titles, new releases,
                and fan favorites—all ready to rent and enjoy.
              </p>
            </div>
            <div className="category">
              <h2>Review Terms and Conditions</h2>
              <p>
                Check our rental rules, late fees, and responsibilities for lost
                or damaged games. Clear rules keep the fun smooth.
              </p>
            </div>
            <div className="category">
              <h2>Rent, Play, Return</h2>
              <p>
                1. <b>Rent:</b> Choose your game. 2. <b>Play:</b> Enjoy it. 3.{" "}
                <b>Return:</b> Bring it back or extend your rental.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rent-button-container">
        <button className="rent-game-btn" onClick={handleRentNow}>
          Rent a Game Now
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default HomeContent;
