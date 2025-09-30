import { API_URL } from "../API/config";

export async function submitLogin(username: string, password: string){

  const formdata = new FormData();
  formdata.append("username", username);
  formdata.append("password", password);

  try{
    const res = await fetch(`${API_URL}/accounts/login`, {
      method: "POST",
      credentials: "include",
      body: formdata
    });

    if (res.ok){
      return true;
    }else {
      return false;
    }

  }catch(err){

  }
}
