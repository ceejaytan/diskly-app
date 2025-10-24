import { useEffect, useState } from "react";
import { API_URL } from "../../API/config";
import Transaction_action from "./Transaction_Action";
import DeleteConfirmTransaction from "./delete_confirmation_transactions";
import ApproveConfirmTransaction from "./confirmations/approve_confirm_transaction";
import DenyTransaction from "./confirmations/deny_transaction";

type Rental = {
  id: number;
  name: string;
  title: string;
  rented_on: string;
  return_on: string;
  price: number;
  status: "Pending" | "Approved" | "Denied";
  quantity: number;
  console: string;
  total_transactions: number;
};


export default function Trasactions_Dashboard() {
  const [activeTab, setActiveTab] = useState<"All Trasactions" | "Pending" | "Approved">("All Trasactions");
  const [rentalsData, setRentalsData] = useState<Rental[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const [rentalEdit, setRentalEdit] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [approveConfirm, setApproveConfirm] = useState(false);
  const [denyConfirm, setDenyConfirm] = useState(false);

  const [searchByUsername, setSearchByUsername] = useState("");
  const [searchByGame, setSearchByGame] = useState("");
  const [searchByDate, setSearchByDate] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  async function fetchRentals(status = activeTab) {

    const statusFilter = 
      status === "All Trasactions" ? "" : status;

    const res = await fetch(`${API_URL}/admin/transactions?page=${page}&filterby=${statusFilter}&searchbyname=${searchByUsername}&searchbygame=${searchByGame}&searchbydate=${searchByDate}`, {
      credentials: "include",
    });
    const data = await res.json();

  if (Array.isArray(data)) {
    setRentalsData(data);
    setHasMore(data.length === 10);
  } else {
    setRentalsData([]);
    setHasMore(false);
  }
  }

  useEffect(() => {
    fetchRentals(activeTab);
  }, [page, activeTab, searchByUsername, searchByGame, searchByDate]);

  const filteredRentals =
    activeTab === "All Trasactions"
      ? rentalsData
      : rentalsData.filter((r) => r.status === activeTab);



useEffect(() => {
  const handleScroll = () => setOpenDropdownId(null);
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);


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
    <main className="rental-dashboard flex-1">
      <div className="flex flex-col gap-6">
        <div className="adminpage-dashboard-titles">
          <h1>Transactions</h1>
          <p className="rental-p text-sm">{rentalsData?.length} Transactions found</p>
          </div>

        <div className="flex gap-3 ">
          <input
            value={searchByUsername}
            onChange={(e) => {
              setSearchByUsername(e.target.value)
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
            placeholder="search by username"
          />
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
              setSearchByUsername("");
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
            onClick={() => {setRentalsData([]); fetchRentals() }}>refresh</button>
        </div>


        <div className="flex gap-3 w-full text-left xl:w-[40%]">
          {(["All Trasactions", "Pending", "Approved"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
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
              grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto]
              font-semibold text-gray-700
            "
          >
            <div>User</div>
            <div>Title</div>
            <div>Date Rented</div>
            <div>Price</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          <div className="adminpage-rentals-rowslist flex flex-col gap-5 relative">
            {filteredRentals.map((rental) => (
              <div
                key={rental.id}
                className={`
                  adminpage-rentals-individual-rows
                  grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto]
                  items-center rounded-[17px] border relative
                  ${rental.status === "Pending"
                    ? "bg-white"
                    : "bg-black/15"
                    }
                  `}
              >
                {/* Name */}
                <div className="flex items-center gap-3">
                  <img
                    src={`${API_URL}/images/DEFAULT_PIC.png`}
                    className="rounded-full w-[40px] h-[40px] object-cover"
                    alt="Avatar"
                  />
                  <p className="font-medium">{rental.name}</p>
                </div>

                <div className="truncate">{rental.title}</div>

                <div>
                  {
                    new Date(rental.rented_on).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                  }
                </div>

                <div>₱{rental.price.toFixed(2)}</div>

                <div
                  className={
                    rental.status === "Pending"
                      ? "text-yellow-500"
                      : rental.status === "Approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {rental.status}
                </div>

                {/* Dropdown */}
                
                <div className="text-right relative" >
                  <button
                    onClick={() =>
                      setOpenDropdownId((prev) =>
                        prev === rental.id ? null : rental.id
                      )
                    }
                    className="border rounded-md px-3 py-1 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    ▼
                  </button>

                  {openDropdownId === rental.id && (
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

                      {/* {rental.status === "Approved" &&( */}
                      {/* <button */}
                      {/*   onClick={() => setUnApproveConfirm(true)} */}
                      {/*   className="block w-full text-left hover:bg-gray-100" */}
                      {/*   > */}
                      {/*   Unapprove */}
                      {/* </button> */}
                      {/* )} */}
                      {rental.status === "Pending" &&(
                        <>
                      <button
                        onClick={() => setApproveConfirm(true)}
                        className="adminpage-rentals-green-txt
                        block w-full text-left hover:bg-gray-100"
                        >
                        Approve
                      </button>

                      <button
                        onClick={() => {setDenyConfirm(true)}}
                        className="
                        adminpage-rentals-delete_btn
                        block
                        w-full
                        text-left
                        hover:bg-gray-100
                        ">
                        Deny
                      </button>
                      </>
                      )}

                      {/* <button  */}
                      {/*   onClick={() => setDeleteConfirm(true)} */}
                      {/*   className=" */}
                      {/*   adminpage-rentals-delete_btn */}
                      {/*   w-full */}
                      {/*   text-left */}
                      {/*   "> */}
                      {/*   Delete */}
                      {/* </button> */}

                      <button
                        onClick={() => setRentalEdit(true)}
                        className="
                        block
                        w-full
                        text-left
                        hover:bg-gray-100
                        ">
                        View more
                      </button>

                      <button
                      onClick={() => setOpenDropdownId(null)}>
                       Close 
                      </button>
                    </div>
                  )}

                    {openDropdownId && (
                      <div
                      onTouchStart={() => setOpenDropdownId(null)}
                      onMouseDown={() => setOpenDropdownId(null)}
                      className="fixed inset-0 z-[5] bg-black/5"
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
        <p>Total Transactions Price from status {activeTab}: ₱{rentalsData[0]?.total_transactions ?? 0}</p>
        <p>Pending status will get auto denied if Return date has already gone past the return date the user chosed</p>

      {rentalEdit && (
      <Transaction_action
          editdata={rentalsData.find(r => r.id === openDropdownId)!}
          cancelbtn={() => {setRentalEdit(!rentalEdit)}}/>
      )}

      {deleteConfirm && (
      <DeleteConfirmTransaction 
          id={rentalsData.find(r => r.id === openDropdownId)?.id ?? 0}
          cancelbtn={() => setDeleteConfirm(false)}
          refetchRentalData={() => { fetchRentals(); setOpenDropdownId(null) } }
        />
      )}

      {approveConfirm && (
      <ApproveConfirmTransaction
          id={rentalsData.find(r => r.id === openDropdownId)?.id ?? 0}
          total_cost={rentalsData.find(r => r.id === openDropdownId)?.price ?? 0}
          cancelbtn={() => setApproveConfirm(false)}
          refetchRentalData={() => { fetchRentals(); setOpenDropdownId(null) } }
        />
      )}

      {denyConfirm && (
      <DenyTransaction
          id={rentalsData.find(r => r.id === openDropdownId)?.id ?? 0}
          cancelbtn={() => setDenyConfirm(false)}
          refetchRentalData={() => { fetchRentals(); setOpenDropdownId(null) } }
        />
      )}

    </main>
  );
}
