import { useEffect, useState } from "react";
import { API_URL } from "../../API/config";

type Rental = {
  id: number;
  name: string;
  title: string;
  rented_on: string;
  return_on: string;
  price: number;
  quantity: number;
  console: string;
  isOverdue: boolean;
};

type more_boilerplate_because_reactjs_moment = {
  transaction_id: number;
  rental_status: string;
  cancelbtn: () => void;
  }

export default function Rental_Summary({transaction_id, rental_status, cancelbtn}:more_boilerplate_because_reactjs_moment){
  const [rentalsData, setRentalsData] = useState<Rental| null>(null);

  async function fetchData(){
    const res = await fetch(`${API_URL}/admin/view-rental-detail?id=${transaction_id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return;
    const data = await res.json();
    setRentalsData(data);
  }

  useEffect(() => {
    (async () => {
      fetchData();
    })();
  }, [])

  return(
  <>
    <div className="fixed inset-0 flex items-center justify-center bg-black/80  z-50 p-4" onClick={cancelbtn} >
      <div className="rent-form-container bg-[#0b0e13] border-2 border-cyan-400 rounded-2xl w-full max-w-xl p-8 text-cyan-100" onClick={(e) => e.stopPropagation()}>
        <div className="rent-form flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-cyan-400 text-center mb-2">
            Diskly Rental Summary
          </h2>

          <div className="flex justify-center">
            <img
              src="/images/disklogo.png"
              alt="Diskly Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          {/* Game Title */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-semibold text-cyan-300 mb-1 w-[93%] text-left">
              Game Title
            </label>
            <p className="
              bg-[#D6DCDE]
              border
              border-cyan-400/60
              text-black
              rounded-[13px]
              h-[40px] w-[100%]
              flex
              items-center
              ">
                { rentalsData?.title ?? "Loading..." }
            </p>
          </div>

          {/* Rental Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-cyan-300 mb-1 w-[85%] text-left">
                Rental Start Date
              </label>
              <p className="
                bg-[#D6DCDE]
                border
                border-cyan-400/60
                text-black
                rounded-[13px]
                h-[40px] w-[100%]
                flex
                items-center
                ">
                  {rentalsData
                    ? new Date(rentalsData?.rented_on).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                  : "Loading..."}
              </p>
            </div>
            <div className="flex flex-col items-center">
                {rentalsData?.isOverdue && rental_status !== "Returned" ? (
              <label className="text-sm font-semibold text-red-500 mb-1 w-[85%] text-left">
                ( Already past the return date )
                </label>
                ): 
              <label className="text-sm font-semibold text-cyan-300 mb-1 w-[85%] text-left">
                Return Date 
              </label>
                }
              <p
              className={`
                bg-[#D6DCDE]
                border-2
                text-black
                rounded-[13px]
                h-[40px]
                w-full
                flex
                items-center px-3

              required
                `}

              >
                  {rentalsData
                    ? new Date(rentalsData?.return_on).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                  : "Loading..."}
                </p>
            </div>
          </div>

          {/* Console / Quantity / Total */}
          <div className="grid grid-cols-[2fr_1fr_2fr] gap-4">
            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-cyan-300 mb-1 w-[85%] text-left">
                Console
              </label>
              <p className="
                bg-[#D6DCDE]
                border
                border-cyan-400/60
                text-black
                rounded-[13px]
                h-[40px] w-[100%]
                flex
                items-center
                ">
                  {rentalsData?.console}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-cyan-300 mb-1 w-[85%] text-left">
                Quantity
              </label>
              <p
              className={`
                bg-[#D6DCDE]
                border
                border-cyan-400/60
                text-black 
                rounded-[13px]
                h-[40px] w-[100%]
                flex
                items-center
                  `}
              >{rentalsData?.quantity}</p>
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-cyan-300 mb-1 w-[85%] text-left">
                Total
              </label>
              <p className="
                bg-[#D6DCDE]
                border
                border-cyan-400/60
                text-black 
                rounded-[13px]
                h-[40px] w-[100%]
                flex
                items-center
                ">
                  ₱{rentalsData?.price}
              </p>
            </div>
          </div>


          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="rent-form-cancelbtn hover:bg-cyan-400/10"
              onClick={cancelbtn}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}
