import "./Rental_Form.css"
type more_boilerplate_because_reactjs_moment = {
  cancelbtn: () => void;
  }

export default function Rental_Form_Message_Success({cancelbtn}: more_boilerplate_because_reactjs_moment){
  return(
  <>
    <div className="fixed inset-0 flex items-center justify-center bg-black/80  z-50 p-4" onClick={cancelbtn}>
      <div className="rent-form-container bg-[#0b0e13] border-2 border-cyan-400 rounded-2xl w-full max-w-xl p-8 text-cyan-100" onClick={(e) => e.stopPropagation()}>

          <div className="flex justify-center">
            <img
              src="/images/disklogo.png"
              alt="Diskly Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <div className="rental-form-success-toast flex flex-col gap-3 items-center">
            <h1 className=" leading-snug">
              Rental request recorded.<br />
              Proceed to the counter to complete the transaction.
            </h1>
            <button
              type="button"
              className="rent-form-cancelbtn hover:bg-cyan-400/10 w-[90%]"
              onClick={cancelbtn}
            >
              Cancel
            </button>
            </div>
          </div>
      </div>
  </>
  )
}
