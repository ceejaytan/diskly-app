import { useState } from "react";
import { API_URL } from "../../API/config";

type more_boilerplate_because_reactjs_moment = {
  id: number;
  cancelbtn: () => void;
  refetchData: () => void;
  }

export default function DeleteConfirmStock({id, cancelbtn, refetchData}:more_boilerplate_because_reactjs_moment){

  const [messagebox, setMessageBox] = useState(false);

  async function delete_rental(id: number){
    const res = await fetch(`${API_URL}/admin/delete_game?game_id=${id}`, {
      method: "POST",
      credentials: "include"
    });
    if (res.ok){
      refetchData()
      cancelbtn()
    }else{
      setMessageBox(true)
    }
  }
  return(
  <>
    <div className="fixed inset-0 flex items-center justify-center bg-black/80  z-50 p-4" onClick={cancelbtn}>
        {!messagebox && (
      <div className="rent-form-container bg-[#0b0e13] border-2 border-cyan-400 rounded-2xl w-full max-w-xl p-8 text-cyan-100" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-center">
            <img
              src="/images/disklogo.png"
              alt="Diskly Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <div className="rental-form-success-toast flex flex-col gap-3 items-center">
            <h1 className="leading-snug text-center">
              Are you sure you want to delete this record?
            </h1>
              <p>Deleting this will deny all pending transactions with this game cd</p>

            <div className="flex gap-4 w-full justify-center">
              <button
                type="button"
                className="rent-form-cancelbtn hover:bg-cyan-400/10 flex-1"
                onClick={async () => {
                  await delete_rental(id);
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="rent-form-cancelbtn hover:bg-cyan-400/10 flex-1"
                onClick={cancelbtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        )}

      {messagebox && (
          <div className="rent-form-container bg-[#0b0e13] border-2 border-cyan-400 rounded-2xl w-full max-w-xl p-8 text-cyan-100" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-center">
            <img
              src="/images/disklogo.png"
              alt="Diskly Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <div className="rental-form-success-toast flex flex-col gap-3 items-center">
            <h1 className="leading-snug text-center">
              Can't delete at the moment
            </h1>
              <p>
                It looks like your trying to delete a disk that is still being rented.
                {/* Want to take down all stocks other than the currently rented ones? */}
              </p>

            <div className="flex gap-4 w-full justify-center">
              <button
                type="button"
                className="rent-form-cancelbtn hover:bg-cyan-400/10 flex-1"
                onClick={cancelbtn}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
      </div>


  </>
  )
}
