import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout_session } from "../API/config";
import checkLoginSession from "../components/Login/CheckLoginSession";

import Rentals_Dashboard from "../components/Admin/Rentals";
import Transaction_Dashboard from "../components/Admin/Transactions";
import Stocks_Dashboard from "../components/Admin/Stocks";
import Customer_Dashboard from "../components/Admin/customer/customers";
import User_Issues from "../components/Admin/UserIssues/UserIssues";
import "../Css/AdminPage.css";

type SessionType = { username: string } | null;

enum admin_dashboard {
  Rentals = "Rentals",
  Transactions = "Transactions",
  Stock = "Stock",
  Customers = "Customers",
  User_Issues = "User Issues",
}

export default function AdminPage() {
  const [session, setSession] = useState<SessionType>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const typeParam = params.get("type") as keyof typeof admin_dashboard | null;

  const [admin_dashboard_type, setAdmin_dashboard_type] = useState<admin_dashboard>(
    typeParam && admin_dashboard[typeParam] ? admin_dashboard[typeParam] : admin_dashboard.Transactions
  );

  useEffect(() => {
    const currentType = admin_dashboard_type;
    const currentParam = params.get("type");

    if (currentParam !== currentType) {
      params.set("type", currentType);
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [admin_dashboard_type]);

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

  function handleLogout() {
    logout_session();
  }

  const navItems = [
    { label: "Rentals", type: admin_dashboard.Rentals },
    { label: "Transactions", type: admin_dashboard.Transactions },
    { label: "Stock", type: admin_dashboard.Stock },
    { label: "Customers", type: admin_dashboard.Customers },
    { label: "User Issues", type: admin_dashboard.User_Issues },
  ];

  return (
    <div className="flex h-screen bg-gray-100 flex-col lg:flex-row">
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

      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#171F21] flex flex-col justify-between transform transition-transform duration-300 z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="adminpage-sidebar px-4">
          <div className="flex justify-center py-6">
            <img src="/images/diskly-logo.png" alt="Logo" className="max-w-[180px]" />
          </div>

          <div className="flex flex-col items-center gap-2 pb-6">
            <div className="w-16 h-16 rounded-full bg-[#47C2C8] flex items-center justify-center text-3xl text-gray-900">
              👤
            </div>
            <div className="text-gray-200 font-medium text-center text-sm">
              Welcome, <i>{session?.username}</i>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setAdmin_dashboard_type(item.type);
                  setSidebarOpen(false);
                }}
                className={`adminpage-buttons text-[#63D6DD] text-left w-full ${
                  admin_dashboard_type === item.type ? "adminpage-selected" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="adminpage-logoutbtn w-[60%] rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="adminpage-main flex-1 overflow-auto lg:ml-64">
        {admin_dashboard_type === admin_dashboard.Rentals && <Rentals_Dashboard />}
        {admin_dashboard_type === admin_dashboard.Transactions && <Transaction_Dashboard />}
        {admin_dashboard_type === admin_dashboard.Stock && <Stocks_Dashboard />}
        {admin_dashboard_type === admin_dashboard.Customers && <Customer_Dashboard />}
        {admin_dashboard_type === admin_dashboard.User_Issues && <User_Issues />}
      </main>
    </div>
  );
}
