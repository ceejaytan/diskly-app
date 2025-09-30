import { useEffect, useState } from "react"
import checkLoginSession from "../components/Login/CheckLoginSession"
import { checkBackendStatus } from "../API/config"

export default function Home(){
  const [loginSession, setLoginSession] = useState({
    username: "",
    logged_in: null
  })
  const [IsLoggedIn, setIsLoggedIn] = useState(false)


  useEffect(() => {
    (async () => {
      if (!await checkBackendStatus()){
        alert("Backend Is Not Running")
        window.location.href = "/"
      }
    })();
  }, [])


  useEffect(() => {
    (async () => {

    const data = await checkLoginSession()
    if (data){
        setLoginSession(data)
        setIsLoggedIn(true)
    }else{
        setIsLoggedIn(false)
      }
  })();
  },[])

  return(
  <>
      {IsLoggedIn && (
          <p>Logged In as: {loginSession.username}</p> 
        )}

      {!IsLoggedIn && (
        <p>Not Logged In</p> 
      )}

  </>
  )


}
