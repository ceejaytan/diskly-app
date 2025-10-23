import { useEffect, useState } from "react";
import { API_URL } from "../../../API/config";

import Customer_ViewMore from "./customers_viewmore";

type Customers = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  contact: string;
  status: "Active" | "Banned";
};


export default function Customer_Dashboard() {
  const [activeTab, setActiveTab] = useState<"All Accounts" | "Active" | "Banned">("All Accounts");
  const [rentalsData, setRentalsData] = useState<Customers[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const [openCustomerInfo, setOpenCustomerInfo] = useState(false);


  const [searchByUsername, setSearchByUsername] = useState("");
  const [searchByEmail, setSearchByEmail] = useState("");
  const [searchByContact, setSearchByContact] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  async function fetchRentals(status = activeTab) {

    const statusFilter = status === "All Accounts" ? "" : status;

    const res = await fetch(`${API_URL}/admin/customers?page=${page}&searchbyname=${searchByUsername}&searchbyemail=${searchByEmail}&searchbycontact=${searchByContact}&searchbystatus=${statusFilter}`, {
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
  }, [page, activeTab, searchByUsername, searchByEmail, searchByContact]);

  const filteredRentals =
    activeTab === "All Accounts"
      ? rentalsData
      : rentalsData.filter((r) => r.status === activeTab);
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
        <div className="adminpage-dashboard-titles">
          <h1>Customers</h1>
          <p className="rental-p text-sm">{rentalsData?.length} Accounts found</p>
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
            value={searchByEmail}
            onChange={(e) => {
              setSearchByEmail(e.target.value)
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
            placeholder="search by email"
          />
          <input
            value={searchByContact}
            onChange={(e) => {
              setSearchByContact(e.target.value)
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
            placeholder="search by contact"
          />
          <button
            onClick={() => {
              setSearchByUsername("");
              setSearchByEmail("");
              setSearchByContact("");
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
          {(["All Accounts", "Active", "Banned"] as const).map((tab) => (
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
              grid grid-cols-[0.4fr_2fr_2fr_2fr_1fr_auto]
              font-semibold text-gray-700
            "
          >
            <div>UID</div>
            <div>Username</div>
            <div>Email</div>
            <div>Contact</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          <div className="adminpage-rentals-rowslist flex flex-col gap-5 relative">
            {filteredRentals.map((customers) => (
              <div
                key={customers.id}
                className="
                  adminpage-rentals-individual-rows
                  grid grid-cols-[0.4fr_2fr_2fr_2fr_1fr_auto]
                  items-center rounded-[17px] border bg-white relative
                "
              >

                <div className="truncate">{customers.id}</div>

                <div className="flex items-center gap-3">
                  <img
                    src={`${API_URL}/images/DEFAULT_PIC.png`}
                    className="rounded-full w-[40px] h-[40px] object-cover"
                    alt="Avatar"
                  />
                  <p className="font-medium">{customers.username}</p>
                </div>

                <div className="truncate">{customers.email}</div>

                <div className="">+63 {customers.contact}</div>

                <div 
                  className={`
                  ${customers.status === "Active" ? "text-green-700" : "text-red-700"}
                  `}
                  >{customers.status}</div>


                <div className="text-right relative" >
                  <button
                    onClick={() =>
                      setOpenDropdownId((prev) =>
                        prev === customers.id ? null : customers.id
                      )
                    }
                    className="border rounded-md px-3 py-1 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    ▼
                  </button>

                  {openDropdownId === customers.id && (
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

                      {/* <button  */}
                      {/*   onClick={() => {}} */}
                      {/*   className=" */}
                      {/*   adminpage-rentals-delete_btn */}
                      {/*   w-full */}
                      {/*   text-left */}
                      {/*   "> */}
                      {/*   Delete */}
                      {/* </button> */}

                      <button
                        onClick={() => {setOpenCustomerInfo(true)}}
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
      {openCustomerInfo && (
        <Customer_ViewMore
          user_id={rentalsData.find((r) => r.id === openDropdownId)?.id ?? 0}
          cancelbtn={() => setOpenCustomerInfo(false)}
        />
      )}
    </main>
  );
}
