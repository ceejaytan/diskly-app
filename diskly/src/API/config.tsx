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
