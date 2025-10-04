export const API_URL = "http://localhost:8080"

export async function checkBackendStatus(){
  try{
    const res = await fetch(`${API_URL}`)
    if (res.ok){
      return true

    }else{
      return false
    }
  }catch(err){
    return false
  }
}

export function logout_session(){
  fetch(`${API_URL}/accounts/logout`, {
    method: "GET",
    credentials: "include"
  })
  .then( res => {
    if (res.ok){
        console.log("logged out successfully");
        window.location.href = "/"
      }else {console.log("failed to logout");
      }
    })
}
