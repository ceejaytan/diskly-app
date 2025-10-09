import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout_session } from "../API/config";
import checkLoginSession from "../components/Login/CheckLoginSession";

import Transaction_Dashboard from "../components/Admin/Transactions";
import Stocks_Dashboard from "../components/Admin/Stocks";
import "../Css/AdminPage.css"

type SessionType = { username: string } | null;

enum admin_dashboard {
  Rentals,
  Transactions,
  Stock,
  Customers,
}

export default function AdminPage() {

  const [admin_dashboard_type, setAdmin_dashboard_type ] = useState(admin_dashboard.Transactions);

  const [session, setSession] = useState<SessionType>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
 <div className="flex h-screen bg-gray-100 flex-col lg:flex-row">

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between bg-[#171F21] text-white shadow-md">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-3xl font-bold focus:outline-none"
        >
          ☰
        </button>
      </div>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#171F21] flex flex-col justify-between transform transition-transform duration-300 z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="adminpage-sidebar px-4">
          {/* Logo */}
          <div className="flex justify-center py-6">
            <img src="/images/diskly-logo.png" alt="Logo" className="max-w-[180px]" />
          </div>

          {/* Profile */}
          <div className="flex flex-col items-center gap-2 pb-6">
            <div className="w-16 h-16 rounded-full bg-[#47C2C8] flex items-center justify-center text-3xl text-gray-900">
              👤
            </div>
            <div className="text-gray-200 font-medium text-center text-sm">
              Welcome, <i>{session?.username}</i>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            {[
              { label: "Rentals", type: admin_dashboard.Rentals },
              { label: "Transactions", type: admin_dashboard.Transactions },
              { label: "Stock", type: admin_dashboard.Stock },
              { label: "Customers", type: admin_dashboard.Customers },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setAdmin_dashboard_type(item.type);
                  setSidebarOpen(false);
                }}
                className={`
                adminpage-buttons
                text-[#63D6DD]
                text-left
                w-full
                ${admin_dashboard_type === item.type ? "adminpage-selected" : ""}
                  `}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Sign Out */}
        <div className="flex justify-center pb-6">
          <button
            onClick={handleLogout}
            className="adminpage-logoutbtn w-[60%] rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="adminpage-main flex-1 overflow-auto lg:ml-64">
        {admin_dashboard_type === admin_dashboard.Transactions && <Transaction_Dashboard />}
        {admin_dashboard_type === admin_dashboard.Stock && <Stocks_Dashboard />}
      </main>
    </div>
  );
}
