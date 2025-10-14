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
};


export default function Trasactions_Dashboard() {
  const [activeTab, setActiveTab] = useState<"All Trasactions" | "Pending" | "Approved">("All Trasactions");
  const [rentalsData, setRentalsData] = useState<Rental[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const [rentalEdit, setRentalEdit] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [approveConfirm, setApproveConfirm] = useState(false);
  const [denyConfirm, setDenyConfirm] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

async function fetchRentals(p = 1, status = activeTab) {

    const statusFilter = 
      status === "All Trasactions" ? "" : status;

  const res = await fetch(`${API_URL}/admin/transactions?page=${p}&filterby=${statusFilter}`, {
    credentials: "include",
  });
  const data = await res.json();

  setRentalsData(data);
  setHasMore(data.length === 10);
}

  useEffect(() => {
    fetchRentals();
  }, []);

  const filteredRentals =
    activeTab === "All Trasactions"
      ? rentalsData
      : rentalsData.filter((r) => r.status === activeTab);

  return (
    <main className="rental-dashboard flex-1">
      <div className="flex flex-col gap-6">
        <div className="adminpage-dashboard-titles">
          <h1>Trasactions</h1>

          {/* button needs styling */}
          <button
            className="text-white text-right rounded-full bg-transparent"
            onClick={() => {setRentalsData([]); fetchRentals() }}>refresh</button>
          <p className="rental-p text-sm">{rentalsData?.length} Rentals found</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 w-full text-left xl:w-[40%]">
{(["All Trasactions", "Pending", "Approved"] as const).map((tab) => (
  <button
    key={tab}
    onClick={() => {
      setActiveTab(tab);
      setPage(1);
      fetchRentals(1, tab);
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
            <div>Date</div>
            <div>Price</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          <div className="adminpage-rentals-rowslist flex flex-col gap-5 relative">
            {filteredRentals.map((rental) => (
              <div
                key={rental.id}
                className="
                  adminpage-rentals-individual-rows
                  grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto]
                  items-center rounded-[17px] border bg-white relative
                "
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

                <div>₱{rental.price}</div>

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


                      <button 
                        onClick={() => setDeleteConfirm(true)}
                        className="
                        adminpage-rentals-delete_btn
                        w-full
                        text-left
                        ">
                        Delete
                      </button>

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

<div className="flex justify-center mt-6">
  <button
    className="text-white"
    onClick={() => {
      if (page > 1) {
        const newPage = page - 1;
        setPage(newPage);
        fetchRentals(newPage, activeTab);
      }
    }}
    disabled={page === 1}
  >
    Previous
  </button>

  <span className="px-3">{page}</span>

  <button
    className="text-white"
    onClick={() => {
      if (hasMore) {
        const newPage = page + 1;
        setPage(newPage);
        fetchRentals(newPage, activeTab);
      }
    }}
    disabled={!hasMore}
  >
    Next
  </button>
</div>
      </div>

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
