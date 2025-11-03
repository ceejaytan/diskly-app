import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL, logout_session } from "../API/config";
import checkLoginSession from "../components/Login/CheckLoginSession";

import Rentals_Dashboard from "../components/Admin/Rentals";
import Transaction_Dashboard from "../components/Admin/Transactions";
import Stocks_Dashboard from "../components/Admin/Stocks";
import Customer_Dashboard from "../components/Admin/customer/customers";
import User_Issues from "../components/Admin/UserIssues/UserIssues";
import "../Css/AdminPage.css";

import { WS_URL } from "../API/config";

type SessionType = { username: string } | null;

enum admin_dashboard {
  Rentals = "Rentals",
  Transactions = "Transactions",
  Stock = "Stock",
  Customers = "Customers",
  User_Issues = "User Issues",
}

type Notification = {
  id: number;
  date: string;
  type: string;
  username: string;
  game_name: string;
  transaction_id: number;
};


type low_stock_games = {
  id: number;
  title: string;
  Quantity: string;
  status: string;
}


export default function AdminPage() {
  const [session, setSession] = useState<SessionType>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notification, setNotification] = useState<Notification | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const [refreshTransactions, setRefreshTransactions] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const typeParam = params.get("type") as keyof typeof admin_dashboard | null;

  const [admin_dashboard_type, setAdmin_dashboard_type] = useState<admin_dashboard>(
    typeParam && admin_dashboard[typeParam] ? admin_dashboard[typeParam] : admin_dashboard.Transactions
  );


  const [low_stock_games, setLow_stock_games] = useState<low_stock_games[]>([]);

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

  function ws_transaction_notification() {
    const ws = new WebSocket(`${WS_URL}/admin/ws/notify-transaction-made`);

    ws.onopen = () => {
      console.log("WebSocket connection established for transaction notifications.");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received:", data);

        const newNotif: Notification = {
          id: Date.now(),
          date: new Date().toISOString(),
          type: data.type,
          username: data.username,
          game_name: data.game_name,
          transaction_id: data.transaction_id,
        };

        setNotification(newNotif);
        setShowNotification(true);

        setTimeout(() => setShowNotification(false), 20000);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => console.log("WebSocket connection closed.");
    ws.onerror = (error) => console.error("WebSocket error:", error);
  }

  useEffect(() => {
    ws_transaction_notification();
    fetch_low_stock_games();
  }, []);


  async function fetch_low_stock_games() {
    try{
      const res = await fetch(`${API_URL}/admin/low-stock-games`);
      const data = await res.json();
      console.log("Low stock games:", data);
      setLow_stock_games(data);

    }catch(error){
      console.error("Error fetching low stock games:", error);
    }
  }

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

<aside
  className={`!pt-[60px] fixed lg:static top-0 left-0 h-full w-64 bg-[#171F21] flex flex-col transform transition-transform duration-300 z-50
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
>
  <div className="flex-1 overflow-y-auto px-4 pb-4">
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
            fetch_low_stock_games();
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

  <div className="border-t border-gray-700 bg-[#1E2729]">
    <div className="p-4 border-b border-gray-700 bg-[#171F21]">
      <button
        onClick={handleLogout}
        className="adminpage-logoutbtn w-full rounded-lg"
      >
        Sign Out
      </button>
    </div>

    <div className="low-stock-section px-3 py-3">
      <h3 className="text-[#63D6DD] text-sm font-semibold mb-2 flex items-center gap-2">
        <span>Low / Out of Stock</span>
      </h3>

      <div className="low-stock-list max-h-32 overflow-y-auto bg-[#1E2729] rounded-md p-2 space-y-2">
        {low_stock_games.length > 0 ? (
          low_stock_games.map((game) => (
            <div
              key={game.id}
              className="bg-[#263033] rounded-lg px-3 py-2 text-xs text-gray-100 flex flex-col shadow-sm border border-gray-700/40 "
            >
              <span className="font-medium truncate">{game.title}</span>
              <div className="flex justify-between text-gray-400">
                <span>
                  Remaining:{" "}
                  <b
                    className={
                      game.status === "Out of Stock"
                        ? "text-red-500"
                        : "text-yellow-400"
                    }
                  >
                    {game.Quantity}
                  </b>
                </span>
                <span className="capitalize text-[10px] text-gray-500">
                  {game.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-xs italic">No low stock items</div>
        )}
      </div>
    </div>
  </div>
</aside>

{showNotification && (
  <div className="toast-notification !border-2">
    <div className="toast-header">
    <span className="toast-date">
      {notification?.date
        ? new Date(notification.date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "none"}

    </span>
      <button className="toast-btn !text-red-500">X</button>
    </div>
          <i>#{ notification?.transaction_id || 0 }</i>
    <div className="toast-body">
      New transaction by <b>{notification?.username}</b> for{" "}
      <b>{notification?.game_name || "none"}</b>
    </div>
      {admin_dashboard_type === admin_dashboard.Transactions ? (
      <button
            onClick={() => {
              setRefreshTransactions(prev => !prev);
              setShowNotification(false);
            }}
            className="toast-btn !mt-2">Refresh</button>
      ) : (
      <button
            onClick={() => {
              setAdmin_dashboard_type(admin_dashboard.Transactions);
              setShowNotification(false);
            }}
            className="toast-btn !mt-2">View</button>
      ) }
  </div>
)}

      <main className="adminpage-main flex-1 overflow-auto lg:ml-64">
        {admin_dashboard_type === admin_dashboard.Rentals && <Rentals_Dashboard refetch_low_stock={fetch_low_stock_games} />}
        {admin_dashboard_type === admin_dashboard.Transactions && <Transaction_Dashboard refetch_low_stock={fetch_low_stock_games} refresh_trigger={refreshTransactions} />}
        {admin_dashboard_type === admin_dashboard.Stock && <Stocks_Dashboard refetch_low_stock={fetch_low_stock_games} />}
        {admin_dashboard_type === admin_dashboard.Customers && <Customer_Dashboard />}
        {admin_dashboard_type === admin_dashboard.User_Issues && <User_Issues />}
      </main>
    </div>
  );
}
