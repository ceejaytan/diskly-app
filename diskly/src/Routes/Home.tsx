import { useEffect, useState } from "react";
import checkLoginSession from "../components/Login/CheckLoginSession";
import Header from "../components/Header";

import "../Css/UserHome.css";
import { API_URL } from "../API/config";

import User_transactions from "../components/Userprofile/User_transactions";
import User_rentals from "../components/Userprofile/User_rentals";
import User_completed from "../components/Userprofile/User_completed";



export default function UserProfile() {
  type SessionType = { userid: number; username: string; status: string } | null;
  const [session, setSession] = useState<SessionType>(null);
  const [activeTab, setActiveTab] = useState<"Transactions" | "Rentals" | "Completed">("Transactions");

  const [loading, setLoading] = useState(true);



  useEffect(() => {
    (async () => {
      const userdata = await checkLoginSession();
      if (userdata) {
        setSession({ userid: userdata.user_id, username: userdata.username, status: userdata.status });
      } else {
        setSession(null);
      }
      setLoading(false);
    })();
  }, []);



  if (loading) return(
    <>
    <Header userSession={ session }/>
      <div className="loading-error">
      <div className="spinner"></div>
      <p>Loading games...</p>
    </div>
    </>
  )

  return (
    <>
      <Header userSession={session} />

<div className="uprof-container">
  <div className="flex flex-col items-center">
    <img
      src={`${API_URL}/images/DEFAULT_PIC.png`}
      alt="Profile"
      className="w-28 h-28 rounded-full mb-4"
    />
    <h1 className="uprof-title">Welcome, {session?.username}</h1>
  </div>

        <div className="uprof-tabs">
          {(["Transactions", "Rentals", "Completed"] as const).map(tab => (
            <button
              key={tab}
              className={`uprof-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "Rentals" ? "Current Rentals" : tab}
            </button>
          ))}
        </div>
  <div>
    {activeTab === "Transactions" && session && <User_transactions userid={session?.userid || 0} />}
    {activeTab === "Rentals" && <User_rentals userid={session?.userid || 0} />}
    {activeTab === "Completed" && <User_completed userid={session?.userid || 0} />}
  </div>

      </div>
    </>
  );
}
