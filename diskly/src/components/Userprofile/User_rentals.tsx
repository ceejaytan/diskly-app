import { useEffect, useState } from "react";
import { API_URL } from "../../API/config";

import "../../Css/UserHome.css"

type TransactionType = {
  id: number;
  game_name: string;
  console: string;
  quantity: number;
  rented_on: string;
  return_on: string;
  total_price: number;
  status: "Ongoing" | "Returned" | "Overdue";
  cover_image_path: string;
};


type more_boilerplate_because_reactjs_moment = {
  userid: number;
  }

export default function User_rentals({userid}:more_boilerplate_because_reactjs_moment){
  const [userRentals, setUserRentals] = useState<TransactionType[]>([]);

  async function fetchData(){
    const res = await fetch(`${API_URL}/user/user-rentals?user_id=${userid}&`);
    const data = await res.json();
    setUserRentals(data || []);
  }

  useEffect(() => {
    (async() => {
      fetchData();
    })();
  }, [])


function formatDate(datetimeStr: string) {
  const date = new Date(datetimeStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

  return(
  <>


    <div className="uprof-card-grid">
      {userRentals.length ? (
        userRentals.map(item => (
          <div className="uprof-card" key={item.id}>
            <img src={`${API_URL}/${ item.cover_image_path }` || `${API_URL}/images/gamecover/Image_not_found.jpg`} alt={item.game_name} className="uprof-card-cover" />
            <div className="uprof-card-info">
              <h3>{item.game_name}</h3>
              <p>Console: ₱{item.total_price.toLocaleString()}</p>
              <p>Console: {item.console}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Rented On: {formatDate( item.rented_on )}</p>
              {item.return_on && <p>Return On: {formatDate( item.return_on )}</p>}
              <span
                className={`
              uprof-status
            ${item.status === "Overdue" ? "bg-red-500" :
              item.status === "Ongoing" ? "bg-yellow-800" : "bg-green-500"}
              `}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className="uprof-empty">No records found</p>
      )}
    </div>
  </>
  )
}
