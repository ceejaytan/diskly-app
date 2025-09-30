import { API_URL } from "../API/config";

export async function SendRegister(userData: {
  fullname: string;
  username: string;
  email: string;
  birthday: string;
  contact: string;
  password: string;
  confirmpassword: string;
}) {


  const formdata = new FormData();
  formdata.append("fullname", userData.fullname);
  formdata.append("username", userData.username);
  formdata.append("email", userData.email);
  formdata.append("birthday", userData.birthday);
  formdata.append("contact", userData.contact);
  formdata.append("password", userData.password);
  formdata.append("confirmpassword", userData.confirmpassword);

  try {
    const res = await fetch(`${API_URL}/accounts/register`, {
      method: "POST",
      credentials: "include",
      body: formdata,
    });
    
    if (!res.ok) {
      return false;
    }

    const data =  await res.json();
    console.log(data);
    return true;

  }catch(err){
    return false;
  }
}

export async function CheckUsername(username: string) {
  try {
    const res = await fetch(`${API_URL}/accounts/check-username?username=${username}`);
    if (!res.ok) {
      return false;
    }
    const data = await res.json();
    return data.Available;

  }catch(err) {
    return false;
  }
}


export async function CheckEmail(email: string) {
  try {
    const res = await fetch(`${API_URL}/accounts/check-email?email=${email}`);
    if (!res.ok) {
      return false;
    }
    const data = await res.json();
    return data.Available;

  }catch(err) {
    return false;
  }
}

