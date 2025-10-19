import { useEffect, useState } from "react";
import { API_URL } from "../../../API/config";

type Customer_Info = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  created_on: string;
  contact: string;
  birthday: string;
};

type more_boilerplate_because_reactjs_moment = {
  user_id: number;
  cancelbtn: () => void;
  }

export default function Customer_ViewMore({user_id, cancelbtn}:more_boilerplate_because_reactjs_moment){
  const [customersData, setCustomersData] = useState<Customer_Info| null>(null);

  async function fetchData(){
    const res = await fetch(`${API_URL}/admin/view-rental-detail?id=${user_id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return;
    const data = await res.json();
    setCustomersData(data);
  }

  useEffect(() => {
    (async () => {
      fetchData();
    })();
  }, [])

return (
  <>
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4"
      onClick={cancelbtn}
    >
      <div
        className="rent-form-container bg-[#0b0e13] border-2 border-cyan-400 rounded-2xl w-full max-w-xl p-8 text-cyan-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rent-form flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-cyan-400 text-center mb-2">
            Diskly Customer Details
          </h2>

          <div className="flex justify-center">
            <img
              src="/images/disklogo.png"
              alt="Diskly Logo"
              className="w-20 h-20 object-contain"
            />
          </div>

          <div className="flex flex-col items-center">
            <label className="text-sm font-semibold text-cyan-300 mb-1 w-[93%] text-left">
              First Name
            </label>
            <p className="bg-[#D6DCDE] border border-cyan-400/60 text-black rounded-[13px] h-[40px] w-[100%] flex items-center">
              {customersData?.first_name ?? "Loading..."}
            </p>
            <label className="text-sm font-semibold text-cyan-300 mb-1 w-[93%] text-left">
              Last Name
            </label>
            <p className="bg-[#D6DCDE] border border-cyan-400/60 text-black rounded-[13px] h-[40px] w-[100%] flex items-center">
              {customersData?.last_name ?? "Loading..."}
            </p>

            <label className="text-sm font-semibold text-cyan-300 mb-1 w-[93%] text-left">
              Username
            </label>
            <p className="bg-[#D6DCDE] border border-cyan-400/60 text-black rounded-[13px] h-[40px] w-[100%] flex items-center">
              {customersData?.username ?? "Loading..."}
            </p>
          </div>

          {/* Dates */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-semibold text-cyan-300 mb-1 w-[93%] text-left">
              Account Created Date
            </label>
            <p className="bg-[#D6DCDE] border border-cyan-400/60 text-black rounded-[13px] h-[40px] w-[100%] flex items-center">
              {customersData
                ? new Date(customersData?.created_on).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "Loading..."}
            </p>

            <label className="text-sm font-semibold text-cyan-300 mb-1 w-[93%] text-left">
              Birthday
            </label>
            <p className="bg-[#D6DCDE] border border-cyan-400/60 text-black rounded-[13px] h-[40px] w-[100%] flex items-center">
              {customersData
                ? new Date(customersData?.birthday).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "Loading..."}
            </p>
          </div>


          <div className="flex flex-col items-center">
            <label className="text-sm font-semibold text-cyan-300 mb-1 w-[93%] text-left">
               Email
            </label>
            <p className="bg-[#D6DCDE] border border-cyan-400/60 text-black rounded-[13px] h-[40px] w-[100%] flex items-center">
              {customersData?.email ?? "Loading..."}
            </p>
            <label className="text-sm font-semibold text-cyan-300 mb-1 w-[93%] text-left">
              Contact Number
            </label>
            <p className="bg-[#D6DCDE] border border-cyan-400/60 text-black rounded-[13px] h-[40px] w-[100%] flex items-center">
              {customersData?.contact ?? "Loading..."}
            </p>
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
);
}
