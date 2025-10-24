import { API_URL } from "../../../API/config";

type more_boilerplate_because_reactjs_moment = {
  id: number;
  username: string;
  cancelbtn: () => void;
  refetchRentalData: () => void;
  }

export default function UnBanUser({id, username, cancelbtn, refetchRentalData}:more_boilerplate_because_reactjs_moment){

async function ban_user(id: number){
  const res = await fetch(`${API_URL}/admin/unban-user?id=${id}`, {
    method: "POST",
    credentials: "include"
  });
  if (!res.ok){ console.log("failed to delete")}
  refetchRentalData()
  cancelbtn()
}
  return(
  <>
    <div className="fixed inset-0 flex items-center justify-center bg-black/80  z-50 p-4" onClick={cancelbtn}>
      <div className="rent-form-container bg-[#0b0e13] border-2 border-cyan-400 rounded-2xl w-full max-w-xl p-8 text-cyan-100" onClick={(e) => e.stopPropagation()}>
          <h1>userid: {id}</h1>

          <div className="flex justify-center">
            <img
              src="/images/disklogo.png"
              alt="Diskly Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <div className="rental-form-success-toast flex flex-col gap-3 items-center">
            <h1 className="leading-snug text-center">
              Are you sure you want to Activate/Unban "{username}"?
            </h1>

            <div className="flex gap-4 w-full justify-center">
              <button
                type="button"
                className="rent-form-cancelbtn hover:bg-cyan-400/10 flex-1"
                onClick={async () => {
                  await ban_user(id);

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
