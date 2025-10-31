import { useEffect, useState } from "react";
import "./Rental_Form.css";
import Submit_Rental_Form from "./Rental_Form_Submit";
import Rental_Form_Message_Success from "./Rental_Form_Toast";

type game_rent_info = {
  game_id: number,
  game_title: string,
  console: string,
  total_stocks: number,
  total: number,
  rental_start_date: Date
  description: string,
}

type userinfo = {
  userid: number,
  username: string,
}

type more_boilerplate_because_reactjs_moment = {
  userinfo: userinfo | null;
  info: game_rent_info | null;
  cancelbtn: () => void;
}

export default function Rental_form({userinfo, info, cancelbtn }: more_boilerplate_because_reactjs_moment) {
  const [rentalForm_submitted, setRentalForm_Submitted] = useState(false);

  const [Return_Date, setReturn_Date] = useState("");
  const [returnDateValid, setReturnDateValid] = useState(false);
  const [Return_Date_Message, setReturn_Date_Message] = useState("");
  const [Quantity, setQuantity] = useState("1");
  const [quantityValid, setQuantityValid] = useState(true);
  const [rentTotal, setRentTotal] = useState(info?.total ?? 0);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transaction_id, setTransaction_id] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (!Return_Date || !info?.rental_start_date) {
    setReturnDateValid(false);
    setReturn_Date_Message("");
    return;
  }

  const rentalStart = new Date(info.rental_start_date);
  rentalStart.setHours(0, 0, 0, 0);

  const selectedDate = new Date(Return_Date);
  selectedDate.setHours(0, 0, 0, 0);

  const diffTime = selectedDate.getTime() - rentalStart.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (selectedDate <= rentalStart) {
    setReturnDateValid(false);
    setReturn_Date_Message(
      selectedDate < rentalStart
        ? "Cannot be in the past"
        : "Cannot be the same day"
    );
  } else if (diffDays > 90) {
    setReturnDateValid(false);
    setReturn_Date_Message("Maximum rental period is 90 days");
  } else {
    setReturnDateValid(true);
    setReturn_Date_Message("");
  }
}, [Return_Date, info?.rental_start_date]);

useEffect(() => {
  if (!info || !Return_Date) return;

  const qty = Number(Quantity) || 0;

  const start = new Date(info.rental_start_date);
  const end = new Date(Return_Date);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - start.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const validDays = days > 0 ? days : 0;

  const total = qty * info.total * validDays;
  setRentTotal(total);
}, [Quantity, info, Return_Date]);


  function digits_only(e: any){
    const val = e.target.value
    if (val === ""){
      setQuantity(val);
      setQuantityValid(false);
      return;
    }
    const numval = Number(val);
    if (/^\d*$/.test(val) && numval <= ( info?.total_stocks ?? 0) && numval > -1 && val !== "0") {
      setQuantity(val)
      setQuantityValid(true);
    }
  }

  const [agree_TermsCondition, setAgree_TermsCondition] = useState(false);
  const [agree_Late_Fee, setAgree_Late_Fee] = useState(false);

  const [success, setSuccess] = useState(false);


async function submitForm(e:any) {
    e.preventDefault()
  if (!info || !userinfo) return;
  setLoading(true);
  

  const result = await Submit_Rental_Form({
    userid: userinfo.userid,
    username: userinfo.username,
    game_id: info.game_id,
    game_title: info.game_title,
    rental_start_date: new Date(info.rental_start_date),
    return_date: new Date(Return_Date),
    console: info.console,
    quantity: Number(Quantity),
    total_cost: rentTotal,
  });
    setSuccess(result.success);
    setErrorMessage(result.message);
    setRentalForm_Submitted(true)
    setTransaction_id(result.transaction_id ?? null);
    setLoading(false);
}

  if (rentalForm_submitted){
    return(
    <>
        <Rental_Form_Message_Success 
          success={success}
          message={errorMessage || ""}
          cancelbtn={() => {cancelbtn(); setRentalForm_Submitted(false)}}
          refreshbtn={() => {window.location.reload()}}
          transaction_id={transaction_id ?? null}
        />
    </>
    )
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80  z-50 p-4" onClick={cancelbtn}>

    {loading && (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 z-50">
        <div className="w-14 h-14 border-4 border-cyan-300 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-cyan-300 text-lg font-semibold">Submitting...</p>
      </div>
    )}
      <div className="
        rent-form-container bg-[#0b0e13] border-2 border-cyan-400 rounded-2xl w-full max-w-xl p-8 text-cyan-100
        max-h-[100vh] overflow-y-auto"
         onClick={(e) => e.stopPropagation()}>
        <form className="rent-form flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-cyan-400 text-center mb-2">
            Diskly CD Rental Form
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

            <label className="text-sm font-semibold text-cyan-300 mb-1 w-[93%] text-left">
              description
            </label>
            <p className="
            bg-[#D6DCDE]
            border
            border-cyan-400/60
            text-black
            rounded-[13px]
            h-[120px] w-full
            flex
            items-start
            overflow-y-auto
              ">
              {info?.description || "none"}
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
                value={Return_Date}
                onChange={(e) => setReturn_Date(e.target.value)}
              className={`
                bg-[#D6DCDE]
                border-2
                text-black
                rounded-[13px]
                h-[40px]
                w-full
                flex
                items-center px-3

              ${!returnDateValid ? "border-red-500" : "border-green-500"}
              required
                `}
              />
              <small className="text-left w-[95%] text-red-500">{Return_Date_Message}</small>
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
              <div className="flex w-full max-w-[100%]">
              <input type="text"
              className={`
                bg-[#D6DCDE]
                border-2
                border-r-0
                text-black
                rounded-l-[13px]
                h-[40px]
                w-full
                items-center px-3

                ${!quantityValid ? "border-red-500" : "border-green-500"}

                  `}
                value={Quantity}
                onChange={(e) => digits_only(e)}
                required
              />
              <span className={`
                  bg-[#D6DCDE]
                  border-2
                  border-l-0
                  text-black
                  rounded-r-[13px]
                  h-[40px]
                  flex
                  items-center
                  w-[90%]

                ${!quantityValid ? "border-red-500" : "border-green-500"}
                `}
                >
                  / {info?.total_stocks ?? 0}
                </span>
                </div>
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
                ₱{rentTotal.toFixed(2) || "0"}
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
              disabled={
                  !agree_TermsCondition ||
                  !agree_Late_Fee ||
                  !quantityValid ||
                  !returnDateValid
                }
              onClick={(e) => submitForm(e)}
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
