import { useEffect, useState } from "react";
import Header from "../components/Header";
import { API_URL } from "../API/config";

export default function GamesPage() {

type Game = {
  id: number;
  name: string;
  cover_path: string;
};

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p>Loading games...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
    <Header></Header>
    <div style={{ padding: "20px" }}>
      <h1>Available Games to Rent</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {games.map((game) => (
          <div
            key={game.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <img
              src={`${API_URL}/${ game.cover_path }`}
              alt={game.name}
              style={{ width: "100%", borderRadius: "4px" }}
            />
            <h3>{game.name}</h3>
            <button
              style={{
                padding: "5px 10px",
                marginTop: "5px",
                cursor: "pointer",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "#63D6DD",
                color: "#171F21",
              }}
              onClick={() => alert(`Renting ${game.name}`)}
            >
              Rent
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
