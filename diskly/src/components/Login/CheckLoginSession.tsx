import { API_URL } from "../../API/config"

export default async function checkLoginSession(){

  try {
    const res = await fetch(`${API_URL}/accounts/check-session-logged-in`,
      {
        method: "GET",
        credentials: "include"
      });

    if (!res.ok){ return null; }

    const data = await res.json();

    return data;

  }catch(err){
    return null
  }

}
