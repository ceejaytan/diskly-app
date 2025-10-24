import { API_URL } from "../../API/config";

export default async function Submit_Rental_Form(
  rent_info: {
    userid: number;
    username: string;
    game_id: number;
    game_title: string;
    rental_start_date: Date;
    return_date: Date;
    console: string;
    quantity: number;
    total_cost: number;
}
){

  const formdata = new FormData();
  formdata.append("userid", rent_info.userid.toString())
  formdata.append("username", rent_info.username)
  formdata.append("game_id", rent_info.game_id.toString())
  formdata.append("game_title", rent_info.game_title)
  formdata.append("rental_start_date", rent_info.rental_start_date.toISOString())
  formdata.append("return_date", rent_info.return_date.toISOString())
  formdata.append("console", rent_info.console)
  formdata.append("quantity", rent_info.quantity.toString())
  formdata.append("total_cost", rent_info.total_cost.toString())


  try {
    const res = await fetch(`${API_URL}/games/submit-rent-form`,{
      method: "POST",
      credentials: "include",
      body: formdata
    });

    const data = await res.json();

    if (!res.ok){
      console.log("failed to submit rent");
     return { success: false, message: data?.message || "Failed to submit rental form" };
    }
    console.log(data);
    return { success: true, message: data?.message || "Rental submitted successfully" };

  } catch (error) {
    console.log(error);
    return { success: false, message: "Network or server error" };
  }

}
