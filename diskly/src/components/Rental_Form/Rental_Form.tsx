import { useState } from "react";
import "./Rental_Form.css";

type game_rent_info = {
  game_title: string,
  console: string,
  total_stocks: number,
  total: number,
  rental_start_date: Date
}

type more_boilerplate_because_reactjs_moment = {
  info: game_rent_info | null;
  cancelbtn: () => void;
}

export default function Rental_form({ info, cancelbtn }: more_boilerplate_because_reactjs_moment) {

  const [Quantity, setQuantity] = useState(1);


  const [agree_TermsCondition, setAgree_TermsCondition] = useState(false);
  const [agree_Late_Fee, setAgree_Late_Fee] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80  z-50 p-4" onClick={cancelbtn}>
      <div className="rent-form-container bg-[#0b0e13] border-2 border-cyan-400 rounded-2xl w-full max-w-xl p-8 text-cyan-100" onClick={(e) => e.stopPropagation()}>
        <form className="rent-form flex flex-col gap-6">
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
              {info?.game_title || "none"}
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
                {info?.rental_start_date ? new Date(info.rental_start_date).toLocaleDateString() : "null"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-cyan-300 mb-1 w-[85%] text-left">
                Return Date
              </label>
              <input type="date"
              className="
                bg-[#D6DCDE]
                border
                border-cyan-400/60
                text-black
                rounded-[13px]
                h-[40px]
                w-full
                flex
                items-center px-3
                "
              />
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
                {info?.console || "none"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-cyan-300 mb-1 w-[85%] text-left">
                Quantity
              </label>
              <input type="number"
              className="
                bg-[#D6DCDE]
                border
                border-cyan-400/60
                text-black
                rounded-[13px]
                h-[40px]
                w-full
                flex
                items-center px-3
              "
                min="1"
                value={Quantity}
                onChange={(e) => e.target.value}
              />
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
                ₱{info?.total || "null"}
              </p>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col gap-2 text-sm text-cyan-200">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox"
                className="accent-cyan-400"
                checked={agree_TermsCondition}
                onChange={(e) => setAgree_TermsCondition(e.target.checked)}
              />
              I agree to the{" "}
              <a href="#" className="underline text-cyan-400">
                Terms and Conditions
              </a>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox"
                className="accent-cyan-400"
                checked={agree_Late_Fee}
                onChange={(e) => setAgree_Late_Fee(e.target.checked)}
              />
              I agree to the{" "}
              <a href="#" className="underline text-cyan-400">
                Late Fee Policy
              </a>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="
              rent-form-submitrentalbtn
              hover:bg-cyan-300
              disabled:opacity-50
              disabled:bg-cyan-400/20"
              disabled={!agree_TermsCondition || !agree_Late_Fee}
            >
              Confirm Rental
            </button>
            <button
              type="button"
              className="rent-form-cancelbtn hover:bg-cyan-400/10"
              onClick={cancelbtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
