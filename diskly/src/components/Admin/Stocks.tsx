import { useEffect, useState } from "react";
import { API_URL } from "../../API/config";
import "./Stocks.css";

import Add_newCD from "./Add_newCD";
import DeleteConfirmStock from "./delete_confirmation_stocks";
import Edit_CD from "./edit_stocks/edit_box";

type GameTitles = {
  id: number;
  Title: string;
  Date_Added: string;
  Quantity: number;
  status: "Available" | "Out of Stock";
  console: string;
};

type more_boilerplate_because_reactjs_moment = {
  refetch_low_stock: () => void;
  }


export default function Stocks_Dashboard({refetch_low_stock}: more_boilerplate_because_reactjs_moment) {
  const [activeTab, setActiveTab] = useState<"All Titles" | "Available" | "Out of Stock">("All Titles");
  const [GameTitleData, setGameTitleData] = useState<GameTitles[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const [OpenAddNewCD, setOpenAddNewCD] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [OpenEditCD, setOpenEditCD] = useState(false);

  const [searchByGame, setSearchByGame] = useState("");
  const [searchByDate, setSearchByDate] = useState("");


  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);


  async function fetchData(status = activeTab) {

    const statusFilter =
      status === "All Titles" ? "" : status;

    const res = await fetch(`${API_URL}/admin/games?page=${page}&filterby=${statusFilter}&searchbygame=${searchByGame}&searchbydate=${searchByDate}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return;
    const data = await res.json();
  if (Array.isArray(data)) {
    setGameTitleData(data);
    setHasMore(data.length === 10);
  } else {
    setGameTitleData([]);
    setHasMore(false);
  }
  }

  useEffect(() => {
    fetchData(activeTab);
  }, [page, activeTab, searchByGame, searchByDate]);

  const filteredRentals =
    activeTab === "All Titles"
      ? GameTitleData
      : GameTitleData.filter((r) => r.status === activeTab);


  function digits_only_page(e: any){
    const val = e.target.value
    if (val === ""){
      setPage(0);
      return;
    }
    const numval = Number(val);
    if (/^\d+(\.\d{0,2})?$/.test(val) && numval > 0 && val < 2147483648) {
      setPage(numval);
    }
  }

  return (
    <main className="stocks-dashboard rental-dashboard flex-1">
  <div className="flex flex-col gap-6">
    {/* Header */}
    <div className="adminpage-dashboard-titles flex justify-between items-center">
      <h1 className="text-2xl font-semibold">Game Titles</h1>
      <button
        onClick={() => setOpenAddNewCD(true)}
        className="adminpage-stocks-addnewcd rounded-lg"
      >
        Add New CD
      </button>
    </div>
    <p className="adminpage-dashboard-title-p text-sm">
      {GameTitleData?.length} Titles found
    </p>

        <div className="flex gap-3 ">
          <input
            value={searchByGame}
            onChange={(e) => {
              setSearchByGame(e.target.value)
              setPage(1);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
              }}}
            type="text"
            className="
            border-2
            "
            placeholder="search by game name"
          />
          <input
            value={searchByDate}
            onChange={(e) => {
              setSearchByDate(e.target.value)
              setPage(1);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
              }}}
            type="date"
            className="
            border-2
            "
          />
          <button
            onClick={() => {
              setSearchByGame("");
              setSearchByDate("");
              setPage(1);
            }}
            className="text-white"
            >
            clear
          </button>

          <button
            className="text-white text-right rounded-full bg-transparent"
            onClick={() => {setGameTitleData([]); fetchData() }}>refresh</button>
        </div>


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

    {/* Table Headers */}
    <div className="adminpage-rental-headers rounded-xl shadow-md relative">
      <div
        className="
          adminpage-rental-headers-fix
          grid grid-cols-[1.5fr_1.5fr_1.5fr_1fr_1fr_auto]
          font-semibold text-gray-700
        "
      >
        <div>Title</div>
        <div>Console</div>
        <div>Date Added</div>
        <div>Quantity</div>
        <div>Status</div>
        <div>Action</div>
      </div>

      {/* Data Rows */}
      <div className="adminpage-rentals-rowslist flex flex-col gap-5 relative">
        {filteredRentals.map((Games) => (
          <div
            key={Games.id}
            className="
          adminpage-rental-headers-fix
              adminpage-Games-individual-rows
              grid grid-cols-[1.5fr_1.5fr_1.5fr_1fr_1fr_auto]
              items-center rounded-[17px] border bg-white relative
            "
          >
            <div className="flex items-center gap-3">
              <p className="font-medium">{Games.Title}</p>
            </div>

            <div className="flex items-center gap-3">
              <p className="font-medium">{Games.console}</p>
            </div>

            <div>
              {new Date(Games.Date_Added).toLocaleDateString("en-GB", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
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
            <div className="relative text-right">
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
                    absolute right-0 top-full mt-1
                    w-[200px]
                    bg-white
                    border rounded-md shadow-md
                    z-20
                  "
                >
                  <button
                    onClick={() => setOpenEditCD(true)}
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
                      block w-full text-left px-3 py-2
                    "
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Transparent overlay to close dropdown */}
              {openDropdownId && (
                <div
                  onClick={() => setOpenDropdownId(null)}
                  className="fixed inset-0 z-10 bg-transparent"
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

        <div className="adminpage-nextprev flex justify-center items-center gap-4">
          <button
            className={`text-white transition-opacity duration-200 ${
              page === 1 ? "adminpage-nextprev-disabled" : ""
            }`}
            onClick={() => {
              if (page > 1) {
                const newPage = page - 1;
                setPage(newPage);
              }
            }}
            disabled={page === 1}
          >
            {"<"}
          </button>

            <input
              value={page === 0 ? "" : page}
              onChange={digits_only_page}
              onBlur={() => {
                if (page === 0) setPage(1);
              }}
              className="adminpage-transaction-page-count"
            />

          <button
            className={`text-white transition-opacity duration-200 ${
              !hasMore ? "adminpage-nextprev-disabled" : "opacity-100"
            }`}
            onClick={() => {
              if (hasMore) {
                const newPage = page + 1;
                setPage(newPage);
              }
            }}
            disabled={!hasMore}
          >
            {">"}
          </button>
        </div>

  {OpenAddNewCD && (
    <Add_newCD
      cancelbtn={() => {
        setOpenAddNewCD(false);
        fetchData();
      }}
    />
  )}

  {OpenEditCD && (
  <Edit_CD
      game_id={GameTitleData.find((r) => r.id === openDropdownId)?.id ?? 0}
      cancelbtn={() => {
        setOpenEditCD(false);
        fetchData();
        refetch_low_stock();
      }}
    />
  )}

  {deleteConfirm && (
    <DeleteConfirmStock
      id={GameTitleData.find((r) => r.id === openDropdownId)?.id ?? 0}
      cancelbtn={() => setDeleteConfirm(false)}
      refetchData={() => {
        fetchData();
        setOpenDropdownId(null);
        refetch_low_stock();
      }}
    />
  )}
</main>
  );
}
