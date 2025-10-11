type editdata = {
  id: number;
  name: string;
  title: string;
  rented_on: string;
  return_on: string;
  price: number;
  status: "Pending" | "Approved" | "Denied";
  quantity: number;
  console: string;
}

type more_boilerplate_because_reactjs_moment = {
  editdata: editdata;
  cancelbtn: () => void;
  }

export default function Transaction_action({editdata, cancelbtn}:more_boilerplate_because_reactjs_moment){

  return(
  <>
    <div className="fixed inset-0 flex items-center justify-center bg-black/80  z-50 p-4" onClick={cancelbtn} >
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
                { editdata.title }
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
                  {new Date(editdata.rented_on).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-cyan-300 mb-1 w-[85%] text-left">
                Return Date
              </label>
              <input type="date"
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
  value={new Date(editdata.return_on).toISOString().split("T")[0]}
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
                  {editdata.console}
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
                  `}
                    value={editdata?.quantity.toString()}
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

                `}
                >
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
                  {editdata.price}
              </p>
            </div>
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
              disabled={ true }
            >
              Update ( doesnt work yet )
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
  </>
  )
}
