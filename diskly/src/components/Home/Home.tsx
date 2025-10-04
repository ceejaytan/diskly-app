import { useEffect, useState } from "react"
import checkLoginSession from "../Login/CheckLoginSession"
import { checkBackendStatus } from "../../API/config"

import Header from "../Header"
import Footer from "../Footer"

import "./Home.css"

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
        <>
    <Header></Header>
      <div className="home-content-bluebox">
            <h3>text here</h3>
        </div>
      <main className="main-content main-home-content">
        <h1 className="home-content-title">HELLDIVERS 2</h1>
        <p>
                Fast paced coop shooter
        </p>
        <div className="buttons">
          <button className="rent-now-btn" onClick={() => window.location.href = "/games-list"}>Rent Now</button>
          <button className="faqs-button" >Faq's</button>
        </div>
      </main>

      <Footer />
          </>
        )}

      {!IsLoggedIn && (
        <p>Not Logged In</p> 
      )}

  </>
  )


}
