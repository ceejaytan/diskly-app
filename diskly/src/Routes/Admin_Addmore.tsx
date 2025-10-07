import { useState } from "react";
import { API_URL } from "../API/config";

export default function admin_addmore(){
  const [GameName, setGameName] = useState("");
  const [GameCoverFile, setGameCover] = useState(null);

  const [MessageAdd, setMessageAdd] = useState("");


  function changeImage(e:any){
    const file = e.target.files[0];
    if (file) {
      setGameCover(file);
      setMessageAdd("");
    }else {
    }
  }

  function submit_addmore(e: any){
    e.preventDefault();


    let formdata = new FormData();
    if (GameCoverFile !== null){
    formdata.append("image", GameCoverFile)
    }else{
      setMessageAdd("No Game Cover selected")
    }
    if(GameName !== ""){
      formdata.append("game_name", GameName);
    }else {
      setMessageAdd("Invalid Name")
    }
    
    fetch(`${API_URL}/admin/add_game`, {
      method: "POST",
      credentials: "include",
      body: formdata
    })
    .then( res => {
        if (!res.ok){

        }
      })

  }

  return(
  <>
      <form onSubmit={e => submit_addmore(e)}>
        <label>Game cover:</label>
        <input type="text"/>

        <label>Game Name:</label>
        <input type="file" accept="image/*" onChange={e => changeImage(e)}/>

      </form>
  </>
  )
}
