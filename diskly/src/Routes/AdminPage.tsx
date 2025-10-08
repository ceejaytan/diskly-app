import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout_session } from "../API/config";
import checkLoginSession from "../components/Login/CheckLoginSession";

import "../Css/AdminPage.css"

type SessionType = { username: string } | null;

export default function AdminPage() {
  const [session, setSession] = useState<SessionType>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const userdata = await checkLoginSession();
      if (userdata && userdata.logged_in) {
        setSession({ username: userdata.username });
      } else {
        setSession(null);
        navigate("/");
      }
    })();
  }, [navigate]);

  function handleLogout(){
    logout_session();
    navigate("/");
  };

  return (
<div className="flex h-screen bg-gray-100">
  {/* Sidebar */}
  <div className="adminpage-container w-64 bg-[#171F21] flex flex-col justify-between">
    <div className="adminpage-sidebar">
      {/* Logo */}
      <div className="flex justify-center">
        <img src="/images/diskly-logo.png" alt="Logo" className="max-w-[200px]" />
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="
              w-20 h-20
              rounded-full
              bg-[#47C2C8]
              flex
              items-center
              justify-center
              text-4xl
              text-gray-900
              ">👤</div>
        <div className="text-gray-200 font-medium text-center">Welcome, <i>{session?.username}</i></div>
      </div>

      {/* Navigation */}
      <nav className="adminpage-navbar flex flex-col items-center gap-2">
        <button
          className={`
            adminpage-buttons

            text-[#63D6DD]
            text-left
            w-full
          }`}
        >
          Dashboard
        </button>
        <button
          className={`

          adminpage-buttons

          text-[#63D6DD]
          text-left
          w-full
          transition
          }`}
        >
          Rentals
        </button>
        <button
          className={`
          adminpage-buttons

          text-[#63D6DD]
          px-6 py-2
          text-left
          w-full
          transition
          }`}
        >
          Transactions
        </button>
        <button
          className={`
          adminpage-buttons

          text-[#63D6DD]
          px-6 py-2
          text-left
          w-full
          transition
          }`}
        >
          Stock
        </button>
        <button
          className={`
          adminpage-buttons

          text-[#63D6DD]
          text-left
          w-full
          transition
          }`}
        >
          Customers
        </button>
      </nav>
    </div>

    {/* Sign Out */}
    <div className="flex justify-center pb-4">
      <button
        onClick={handleLogout}
        className="

            adminpage-logoutbtn

            w-[60%]
            rounded-lg
            "
      >
        Sign Out
      </button>
    </div>
  </div>

  {/* Main Content */}
  <main className="flex-1 p-6 overflow-auto">
    {/* Put your game table or dashboard here */}
  </main>
</div>
  );
}
