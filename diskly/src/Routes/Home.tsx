import { useEffect, useState } from "react"
import checkLoginSession from "../components/Login/CheckLoginSession"
import { checkBackendStatus } from "../API/config"

import Header from "../components/Header"


type SessionType = { username: string; } | null;

export default function Home(){
  const [userSession, setUserSession] = useState<SessionType>(null);

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
        setUserSession(data)
    }else{
        setUserSession(null)
      }
  })();
  },[])

  return(
  <>
      {userSession && (
        <>
        <Header userSession={userSession}></Header>

          <p>Logged In as: {userSession.username}</p> 
          </>
        )}

      {!userSession && (
        <p>Not Logged In</p> 
      )}

  </>
  )


}
