import { useEffect, useState } from "react";
import { API_URL } from "../../../API/config";


type more_boilerplate_because_reactjs_moment = {
  id: number;
  cd_name: string;
  game_id: number;
  cancelbtn: () => void;
  refetchRentalData: () => void;
  }

export default function ConfirmReturned({id, cd_name, game_id, cancelbtn, refetchRentalData}:more_boilerplate_because_reactjs_moment){

  const [gamecd_info, setGamecd_Info] = useState("")


async function confirm_return(id: number){
  const res = await fetch(`${API_URL}//?id=${id}`, {
    method: "POST",
    credentials: "include"
  });
  if (!res.ok){ console.log("failed to approve")}
  refetchRentalData()
  cancelbtn()
}

async function fetch_gamecd(){
    const res = await fetch(`${API_URL}/games/rent-info?game_id=${game_id}`);
    const data = await res.json();
    setGamecd_Info(data.cover_image_path);
  }

  useEffect(() => {
    (async () => {
      fetch_gamecd();
    })();
  }, [])
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
            <h1 className="leading-snug text-center">
              Confirm that the CD has been returned?
            </h1>
            <p>{game_id}. {cd_name}</p>
            <img className="w-[300px] border-2 border-cyan-400 rounded-2xl" src={` ${ API_URL }/${ gamecd_info } `}/>

            <div className="flex gap-4 w-full justify-center">
              <button
                type="button"
                className="rent-form-cancelbtn hover:bg-cyan-400/10 flex-1"
                onClick={async () => {
                  await confirm_return(id);
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
      </div>
  </>
  )
}
