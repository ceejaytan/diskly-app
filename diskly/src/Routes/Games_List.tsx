import { useEffect, useState } from "react";
import Header_for_GameSearch from "../components/Header_for_GameSearch";
import { API_URL } from "../API/config";
import { useLocation, useNavigate } from "react-router-dom";

import checkLoginSession from "../components/Login/CheckLoginSession";
import Rental_form from "../components/Rental_Form/Rental_Form";

import "../Css/Games_List.css"

type game_rent_info = {
  game_title: string,
  rental_start_date: Date,
  return_date: Date,
  console: string,
  quantity: number,
  total: number
} | null;

type Game = {
  id: number;
  name: string;
  cover_path: string;
  price_to_rent: number;
};

enum platform{
  Full_Catalog = "Full_Catalog",
  Xbox = "Xbox",
  PlayStation = "PlayStation",
  PC = "PC"
}

export default function GamesPage() {

  type SessionType = { username: string; } | null;
  const [session, setSession] = useState<SessionType>(null);


  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const userdata = await checkLoginSession();
      if (userdata && userdata.logged_in) {
        setSession({ username: userdata.username });
      } else {
        setSession(null);
      }
    })();
  }, []);




  const [game_platform, setGame_Platform] = useState<platform>(platform.Full_Catalog);
  const[showRentalForm, setShowRentalForm] = useState(false);
  const[gameRentInfo, setGameRentInfo] = useState<game_rent_info>(null);

  function openRentForm(){
    setShowRentalForm(!showRentalForm);
  }


  const location = useLocation();
  const param = new URLSearchParams(location.search).get("search") || "";

  const fetchGames = async () => {
    try {
  const response = await fetch(`${API_URL}/games/?game_name_search=${encodeURIComponent(param)}`);
      if (!response.ok) throw new Error("Failed to fetch games");
      const data: Game[] = await response.json();
      setGames(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames()
  }, [location.search])



  function login_to_rent(){
    navigate(`/AuthPage?type=login&redirect=${encodeURIComponent(window.location.pathname)}?search=${param}`);
  }


  if (loading) return(
    <>
    <Header_for_GameSearch userSession={ session }></Header_for_GameSearch>
      <div className="loading-error">
      <div className="spinner"></div>
      <p>Loading games...</p>
    </div>
    </>
  )

  if (error) return(
    <>
    <Header_for_GameSearch userSession={ session }></Header_for_GameSearch>
      <div className="loading-error">
    <p>Server is not running</p>
    </div>
   </>
  )

  if (games.length === 0) return(
  <>
    <Header_for_GameSearch userSession={ session }></Header_for_GameSearch>

        <div className="platform-selector">
          {Object.values(platform).map((p) => (
            <label key={p} className={`platform-option ${game_platform === p ? "active" : ""}`}>
              <input
                type="radio"
                name="platform"
                value={p}
                checked={game_platform === p}
                onChange={() => setGame_Platform(p)}
              />
              {p.replace("_", " ")}
            </label>
          ))}
        </div>

      <div className="loading-error">
    <div className="no-results">
      <h2>No Result</h2>
      <p>We couldn’t find anything matching your search.</p>
      <p>:(</p>
      <button className="browse-btn" onClick={() => navigate("/games-list")}>
        Browse All Games
      </button>
    </div>
    </div>
  </>
);

  return (
    <>
    <Header_for_GameSearch userSession={ session }></Header_for_GameSearch>

        <div className="platform-selector">
          {Object.values(platform).map((p) => (
            <label key={p} className={`platform-option ${game_platform === p ? "active" : ""}`}>
              <input
                type="radio"
                name="platform"
                value={p}
                checked={game_platform === p}
                onChange={() => setGame_Platform(p)}
              />
              {p.replace("_", " ")}
            </label>
          ))}
        </div>
    <div className="container-games">


        
      {game_platform === platform.Full_Catalog &&(<h2>Available Games to Rent</h2>)}
      {game_platform !== platform.Full_Catalog &&(<h2>Available Games to Rent &nbsp; {'>'} &nbsp; {game_platform.replace("_", " ")} </h2>)}

      <div className="games-list">
        {games.map((game) => (
          <div className="games-box" key={game.id}>
            <img className="game-cover" src={`${API_URL}/${ game.cover_path }`}alt={game.name}/>
            <h4 className="truncate hover:whitespace-normal">{game.name}</h4>
            <p>₱{game.price_to_rent} per day</p>


            {session && (
            <button className="rent-btn" onClick={() => openRentForm()}>Rent Now</button>
            )}

            {!session && (
            <button className="rent-btn not-loggedin" onClick={login_to_rent}>Login to rent</button>
            )}

          </div>
        ))}
      </div>
      {showRentalForm && (
      <Rental_form info={gameRentInfo} cancelbtn={() => openRentForm()}></Rental_form>
      )}
    </div>

    </>
  );
}
