import { useEffect, useState } from "react";
import { API_URL } from "../../../API/config";

type Customers = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  status: "placeholer 1" | "placeholder 2";
};


export default function Customer_Dashboard() {
  const [activeTab, setActiveTab] = useState<"All Accounts" | "placeholder 1" | "placeholder 2">("All Accounts");
  const [rentalsData, setRentalsData] = useState<Customers[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);


  const filteredRentals =
    activeTab === "All Accounts"
      ? rentalsData
      : rentalsData.filter((r) => r.status === activeTab);

  return (
    <main className="stocks-dashboard rental-dashboard flex-1">
      <div className="flex flex-col gap-6">
        <div className="adminpage-dashboard-titles">
          <h1>Customers</h1>
          <p className="rental-p text-sm">{rentalsData?.length} Accounts found</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 w-full text-left xl:w-[40%]">
          {(["All Accounts", "placeholder 1", "placeholder 2"] as const).map((tab) => (
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
              grid grid-cols-[2fr_2fr_2fr_auto]
              font-semibold text-gray-700
            "
          >
            <div>Username</div>
            <div>Email</div>
            <div>Contact</div>
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
                  <p className="font-medium">{rental.username}</p>
                </div>

                <div className="truncate">{rental.email}</div>

                <div>
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


                      <button 
                        onClick={() => {}}
                        className="
                        adminpage-rentals-delete_btn
                        w-full
                        text-left
                        ">
                        Delete
                      </button>
                      <button
                        onClick={() => {}}
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
    </main>
  );
}
