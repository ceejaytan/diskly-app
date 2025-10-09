import { useEffect, useState } from "react";
import { API_URL } from "../../API/config";

import "./rental_dashboard.css"

type Rental = {
  id: number;
  name: string;
  title: string;
  date: string;
  price: number;
  status: "Pending" | "Completed" | "Denied";
};


export default function Rentals_Dashboard() {
  const [activeTab, setActiveTab] = useState<"All Trasactions" | "Pending" | "Completed">("All Trasactions");
  const [rentalsData, setRentalsData] = useState<Rental[]>([])


async function fetchRentals(){
  const res = await fetch(`${API_URL}/admin/rentals/`,{
    method: "GET",
    credentials: "include",
  });
  if (!res.ok){
  }
  const data = await res.json();
  setRentalsData(data);
}

  useEffect(() => {
  async function run(){
      await fetchRentals();
    }run();
  }, [])
  

  const filteredRentals =
    activeTab === "All Trasactions"
      ? rentalsData
      : rentalsData.filter((r) => r.status === activeTab);

  return (

      <main className="rental-dashboard flex-1 p-6 overflow-auto">
      {/* Main Content */}
        <div className="flex flex-col gap-6">
          <div>
            <h1>Rentals</h1>
            <p className="rental-p text-sm">
              {rentalsData?.length} Rentals found
            </p>
          </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 w-full text-left xl:w-[40%] ">
          {(["All Trasactions", "Pending", "Completed"] as const).map((tab) => (
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
            <div className="adminpage-rental-headers  rounded-xl shadow-md p-4">
              {/* Header Row */}
              <div
                className="
            adminpage-rental-headers-fix
            grid
            grid-cols-[2fr_2fr_1fr_1fr_1fr_auto]
            font-semibold
            text-gray-700
            "
              >
                <div>Username</div>
                <div>Title</div>
                <div>Date</div>
                <div>Price</div>
                <div>Status</div>
                <div>Action</div>
              </div>

              {/* Rental Rows */}
              <div className="adminpage-rentals-rowslist flex flex-col gap-5 ">
                {filteredRentals.map((rental) => (
                  <div
                    key={rental.id}
                    className="
                    adminpage-rentals-individual-rows
                
                    grid
                    grid-cols-[2fr_2fr_1fr_1fr_1fr_auto]
                    items-center
                    rounded-[17px]
                    border
                    bg-white
                "
                  >
                    {/* Name + Avatar */}
                    <div className="flex items-center gap-3">
                      <img
                        src={`${API_URL}/images/DEFAULT_PIC.png`}
                        className="rounded-full w-[40px] h-[40px] object-cover"
                        alt="Avatar"
                      />
                      <p className="font-medium">{rental.name}</p>
                    </div>

                    {/* Title */}
                    <div className="truncate">{rental.title}</div>

                    {/* Date */}
                    <div>
                    {new Date(rental.date).toLocaleDateString("en-GB", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </div>

                  {/* Price */}
                  <div>₱{rental.price}</div>

                  {/* Status */}
                  <div
                    className={
                      rental.status === "Pending"
                        ? "text-yellow-500"
                        : rental.status === "Completed"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {rental.status}
                  </div>

                  {/* Dropdown */}
                  <div className="text-right">
                    <button className="border rounded-md px-3 py-1 bg-gray-50 hover:bg-gray-100 transition">
                      ▼
                    </button>
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
