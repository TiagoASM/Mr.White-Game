import {useState} from "react";
import './Game.css'
import { useNavigate } from "react-router-dom";

function Game({playerList, gameValue}) {
  const [players, setPlayers] = useState(playerList);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedName , setSelectedName] = useState("");
  const [lastModalShow, setLastModalShow] = useState(false);
  const [impostor, setImpostor] = useState(false);
  const navigate = useNavigate();

  const handleEliminate = (player) => {
    if (selectedIndex !== ""){
      const updatedPlayers = [...players];
      updatedPlayers.splice(selectedIndex, 1);
      setPlayers(updatedPlayers);
      setSelectedIndex(null);
      if(selectedName === gameValue.playerName){
        setImpostor(true);
      }
      setLastModalShow(true);
      console.log("selected name : ", selectedName);
      console.log("impostor name : " , gameValue.playerName);
    }
  }

  const handleClick = (index, player) => {
    setSelectedIndex(index);
    setSelectedName(player);
  }

  const nextFaseButton = () =>  {
    if(impostor){
      navigate("/");
    }else{
      setLastModalShow(false);
    }
  }

  return(
    <>

      {lastModalShow && (
        <div className="Modal-Overlay">
          <div className="Modal-Content">
            {impostor ? (
              <p><strong>{selectedName}</strong>, é o MR.White</p>
            ):(
              <p><strong>{selectedName}</strong>, é um Civil</p>
            )}
            <button className="View-Word-Button" onClick={nextFaseButton}>OK</button>
          </div>    
        </div>
      )}

      <div className="Game-Container">
      <button className="Eliminate-Button" onClick={handleEliminate} disabled={selectedIndex === null}>
        Eliminar
      </button>

      <div className="Cards-Wrapper">
        {players.map((player, index) => (
          <div
            key={index}
            className={`Player-Cards ${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => handleClick(index,player)}
          >
            {player}
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default Game;