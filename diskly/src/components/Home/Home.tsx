import Header from "../Header"
import Footer from "../Footer"


type HeaderProps = {
  userSession: {
    userid: number;
    username: string;
    status: string;
  } | null
}

export default function Home({userSession}: HeaderProps){

  return(
  <>
      {userSession && (
        <>
    <Header userSession={userSession}></Header>
      <div className="home-content-bluebox">
            <h3>Welcome, {userSession.username}</h3>
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

      {!userSession && (
        <p>Not Logged In</p> 
      )}

  </>
  )


}
