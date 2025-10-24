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
            <p>Check out what’s new in our game vault and grab your next title before it’s gone!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;★ Welcome, <i><b>{userSession.username}</b></i> ! ★&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Check out what’s new in our game vault and grab your next title before it’s gone!</p>
        </div>
      <main className="main-content main-home-content">
        <h1 className="home-content-title">Welcome to <i>DISKLY!</i></h1>
        <p>
               <i> Ready to dive into your next adventure?
Browse our collection of the latest and <br></br>classic game CDs,  rent your favorites, and level up your gaming experience.</i>
        </p>
        <div className="buttons">
          <button className="rent-now-btn" onClick={() => window.location.href = "/games-list"}>Rent Now</button>
          <button className="faqs-button" >FAQ's</button>
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
