import { useEffect, useState } from "react";
import Header from "../components/Header";
import { API_URL } from "../API/config";
import { useNavigate } from "react-router-dom";

import checkLoginSession from "../components/Login/CheckLoginSession";

import "../Css/Games_List.css"

export default function GamesPage() {

  const [session, setSession] = useState<SessionType>(null);
  type SessionType = { username: string; } | null;

  type Game = {
    id: number;
    name: string;
    cover_path: string;
  };

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

  const param = new URLSearchParams(window.location.search).get("search") || "";


  const fetchGames = async () => {
    try {
  const response = await fetch(`${API_URL}/games?game_name_search=${encodeURIComponent(param)}`);
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
  }, [window.location.search])


  function login_to_rent(){
    navigate(`/AuthPage?type=login&redirect=${encodeURIComponent(location.pathname)}`);
  }

  if (loading) return(
    <>
    <Header></Header>
      <div className="loading-error">
      <div className="spinner"></div>
      <p>Loading games...</p>
    </div>
    </>
  )

  if (error) return(
    <>
    <Header></Header>
      <div className="loading-error">
    <p>Server is not running</p>
    </div>
   </>
  )

  return (
    <>
    <Header></Header>
    <div className="container-games">
      <h2>Available Games to Rent</h2>
      <div className="games-list">
        {games.map((game) => (
          <div className="games-box" key={game.id}>
            <img className="game-cover" src={`${API_URL}/${ game.cover_path }`}alt={game.name}/>
            <h3>{game.name}</h3>


            {session && (
            <button className="rent-btn">Rent</button>
            )}

            {!session && (
            <button className="rent-btn not-loggedin" onClick={login_to_rent}>Login to rent</button>
            )}

          </div>
        ))}
      </div>
    </div>
    </>
  );
}
