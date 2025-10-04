import React from "react";
import "../Css/Stock.css";

type NavItem = {
  id: string;
  label: string;
};

type Props = {
  profileName?: string;
  onSignOut?: () => void;
  active?: string;
};

export default function Stock({
  profileName = "Grace",
  onSignOut,
  active = "dashboard",
}: Props) {
  const nav: NavItem[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "rentals", label: "Rentals" },
    { id: "transactions", label: "Transactions" },
    { id: "stock", label: "Stock" },
    { id: "customers", label: "Customers" },
  ];

  return (
    <aside className="sidebar">
      <div>
        {}
        <div className="logo-container-1">
          <img
            src="/images/diskly-logo.png"
            alt="Logo"
            className="logo-image"
          />
        </div>

        {}
        <div className="profile">
          <div className="profile-avatar">👤</div>
          <div>
            <div className="profile-name">
              Welcome, <i>AdminName</i>
            </div>
          </div>
        </div>

        {}

        {}
        <div className="dashboard-categ">
          <div className="dashboard">Dashboard</div>
          <div>
            <div className="rentals">Rentals</div>
          </div>
          <div>
            <div className="transactions">Transactions</div>
          </div>
          <div className="stock-container">
            <div className="stock">Stock</div>
          </div>
          <div>
            <div className="customer">Customers</div>
          </div>
        </div>

        {}
        <nav className="nav">
          <ul>
            {nav.map((n) => {
              const isActive = n.id === active;
              return (
                <li key={n.id}>
                  <a
                    href="#"
                    className={`nav-link ${isActive ? "active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{n.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {}
      <div className="signout">
        <button onClick={onSignOut} className="signout-btn">
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
