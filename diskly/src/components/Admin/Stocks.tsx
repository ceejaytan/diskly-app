import { useEffect, useState } from "react";
import { API_URL } from "../../API/config";
import "./Stocks.css";

import Add_newCD from "./Add_newCD";
import DeleteConfirmStock from "./delete_confirmation_stocks";

type GameTitles = {
  id: number;
  Title: string;
  Date_Added: string;
  Quantity: number;
  status: "Available" | "Out of Stock";
};


export default function Stocks_Dashboard() {
  const [activeTab, setActiveTab] = useState<"All Titles" | "Available" | "Out of Stock">("All Titles");
  const [GameTitleData, setGameTitleData] = useState<GameTitles[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const [OpenAddNewCD, setOpenAddNewCD] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  async function fetchData() {
    const res = await fetch(`${API_URL}/admin/games`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return;
    const data = await res.json();
    setGameTitleData(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRentals =
    activeTab === "All Titles"
      ? GameTitleData
      : GameTitleData.filter((r) => r.status === activeTab);

  return (
    <main className="stocks-dashboard flex-1">
      <div className="flex flex-col gap-6">
        <div className="
          adminpage-dashboard-titles

          flex
          justify-between
          items-center
          ">
          <h1 className="text-2xl font-semibold">Game Titles</h1>
          <button
            onClick={() => setOpenAddNewCD(true)}
            className="
            adminpage-stocks-addnewcd
            rounded-lg
            "
          >
            Add New CD
          </button>
        </div>
        <p className="adminpage-dashboard-title-p text-sm">{GameTitleData?.length} Titles found</p>

        {/* Filter Buttons */}
        <div className="flex gap-3 w-full text-left xl:w-[40%]">
          {(["All Titles", "Available", "Out of Stock"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                adminpage-rental-filter
                ${
                  activeTab === tab
                    ? "shadow-md adminpage-rentals-active"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="adminpage-rental-headers rounded-xl shadow-md relative">
          <div
            className="
              adminpage-rental-headers-fix
              grid grid-cols-[3fr_2fr_1fr_1fr_auto]
              font-semibold text-gray-700
            "
          >
            <div>Title</div>
            <div>Date Added</div>
            <div>Quantity</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          <div className="adminpage-rentals-rowslist flex flex-col gap-5 relative">
            {filteredRentals.map((Games) => (
              <div
                key={Games.id}
                className="
                  adminpage-Games.-individual-rows
                  grid grid-cols-[3fr_2fr_1fr_1fr_auto]
                  items-center rounded-[17px] border bg-white relative
                "
              >
                {/* Name */}
                <div className="flex items-center gap-3">
                  <p className="font-medium">{Games.Title}</p>
                </div>


                <div>
                  {
                    new Date(Games.Date_Added).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                  }
                </div>

                <div>{Games.Quantity}</div>

                <div
                  className={
                    Games.status === "Available"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {Games.status}
                </div>

                {/* Dropdown */}
                
                <div className="text-right relative" >
                  <button
                    onClick={() =>
                      setOpenDropdownId((prev) =>
                        prev === Games.id ? null : Games.id
                      )
                    }
                    className="border rounded-md px-3 py-1 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    ▼
                  </button>

                  {openDropdownId === Games.id && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="
                      absolute
                      right-0
                      w-[200px]
                      bg-white
                      border
                      rounded-md
                      shadow-md
                      z-10
                      ">
                      <button
                        className="
                        block
                        w-full
                        text-left
                        hover:bg-gray-100
                        ">
                        Edit
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(true)}
                        className="
                        adminpage-rentals-delete_btn
                        w-full
                        text-left
                        ">
                        Delete
                      </button>
                    </div>
                  )}
                  {/* drop down fix dont touch */}
                    {openDropdownId && (
                      <div
                        onClick={() => setOpenDropdownId(null)}
                        className="fixed inset-0 z-[5] bg-transparent"
                      />
                    )}
                </div>
              </div>
            ))}

            {filteredRentals.length === 0 && (
              <div className="text-center text-gray-500 italic py-6">
                No rentals in this category.
              </div>
            )}
          </div>
        </div>
      </div>

    {OpenAddNewCD && (
    <Add_newCD cancelbtn={() => { setOpenAddNewCD(false); fetchData() }}></Add_newCD>
    )}

      {deleteConfirm && (
      <DeleteConfirmStock
          id={GameTitleData.find(r => r.id === openDropdownId)?.id ?? 0}
          cancelbtn={() => setDeleteConfirm(false)}
          refetchData={() => { fetchData(); setOpenDropdownId(null) } }

        />
      )}
    </main>
  );
}
