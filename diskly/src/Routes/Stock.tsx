import React, { useEffect, useState } from "react";
import { logout_session } from "../API/config";
import checkLoginSession from "../components/Login/CheckLoginSession";
import "../Css/Stock.css";


type SessionType = { username: string } | null;

export default function Stock(){

  const [session, setSession] = useState<SessionType>(null)

  useEffect(() => {
    (async () => {
      const userdata = await checkLoginSession();
      if (userdata && userdata.logged_in) {
        setSession({ username: userdata.username });
      } else {
        setSession(null);
        window.location.href = "/"
      }
    })();
  }, []);


  return (
    <div className="admin-container">
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
              Welcome, <i>{session?.username}</i>
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
          </ul>
        </nav>
      </div>

      {}
      <div className="signout">
        <button onClick={() => logout_session()} className="signout-btn">
          <span>Sign out</span>
        </button>
      </div>
    </aside>
</div>
  );
}
