export const API_URL = "http://192.168.1.7:8080"

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
        window.location.href = "/"
      }
    })
}
