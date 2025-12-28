import { useRef, useEffect, useState } from "react";
import './Home.css'
import { useNavigate } from 'react-router-dom';

function Home({playerList, setPlayerList, setGameValue ,gameValue}) {
  const [playerName, setPlayerName] = useState(""); 
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showModalPlayers, setShowModalPlayers] = useState(false);
  const [word, setWord] = useState("");
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);
  const [startIndexPlayer, setStartIndexPlayer] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [seeWordFlag, setSeeWordFlag] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedPlayerName, setSelectedPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wordUnderCover, setWordUnderCover] = useState("");
  const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY;



  const wordApi = async () => {
    setIsLoading(true);
    console.log(OPENAI_KEY);
    try{
      const messages = [
        { role: "system", content: "Devolve só JSON válido. Nada antes nem depois." },
        {
          role: "user",
          content:
            "Gera 2 palavras em PT, relacionadas mas não óbvias ex: '(civil:lua, undercover:sol', 'civil:piscina, undercover:praia'). JSON: {'civil':'...','undercover':'...'}"
        }
      ];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method:"POST", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          messages,
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }
  
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
  
      const parsed = JSON.parse(content);
      setWord(parsed.civil);
      setWordUnderCover(parsed.undercover);
      console.log(parsed.civil);
      console.log(parsed.undercover);
      return parsed; 
    }catch (error) {
      console.error("Erro OpenAI:", error);
      return null;
    }finally{
      setIsLoading(false);
    }
  };

  const ranOnce = useRef(false);

  /*
  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    wordApi();
  }, []);
  */

  const startGame = async () => {
    if (playerList.length < 3) {
      alert("Adiciona pelo menos 3 jogadores");
      return;
    }
  
    const result = await wordApi(); // AI gera palavras
    if (!result) return;

    // guardar palavras no gameValue
    setGameValue(prev => ({
      ...prev,
      palavra: result.civil,
      underCover: result.undercover
    }));
  
    // escolher Mr.White + Undercover
    selectRoles();

    setStartIndexPlayer(0);
    setShowModalPlayers(true);
    setSeeWordFlag(false);
  };
  

  const addName = () => {
    const name = playerName.trim();

    if (name && !playerList.includes(name)){
      setPlayerList([...playerList, playerName]);
      setPlayerName("");
    }
  };

  /*
  const startGame = () => {
    if(playerList.length > 2){
      setShowModal(true);
    } else {
      alert("Adiciona pelo menos 3 jogadores");
    }
  };*/

  const navigateGame = () => {
    if(word !== "" ){
      selectRandomMrWhite();
      setStartIndexPlayer(prev => prev +1);
      setShowModal(false);
      setShowModalPlayers(true);
    } 
  }

  const playersToReveal = playerList;

  const handleNextPlayer = () => {
    if (currentPlayerIndex < playersToReveal.length - 1) {
      setCurrentPlayerIndex(prev => prev + 1);
      setSeeWordFlag(false);
    } else {
      setShowModalPlayers(false);
      setCurrentPlayerIndex(0);
      setSeeWordFlag(false);
      navigate("/game");
    }
  };
  

  const handleSelectMrWhite = (playerName) => {
    setSelectedPlayerName(playerName);
    setGameValue(prev => ({
      palavra: word,
      playerName: playerName  
    }));
  };

  const selectRoles = () => {
    if (playerList.length < 3) {
      alert("Precisas de pelo menos 3 jogadores.");
      return null;
    }
  
    const shuffled = [...playerList].sort(() => Math.random() - 0.5);
  
    const mrWhite = shuffled[0];
    const undercover = shuffled[1];
  
    setGameValue(prev => ({
      ...prev,
      playerName: mrWhite,
      underCoverName: undercover,
    }));

    console.log("Mr.white", mrWhite);
    console.log("Undercover", undercover);
  
    return { mrWhite, undercover };
  };
  
  
  

  return (
    <>

      {showModal && (
        <div className='Modal-Overlay'>
            <div className='Modal-Content'>
              <p><strong>{playerList[currentChooserIndex]}</strong>, escolhe a palavra e o MR.White!</p>
              <input type='text' placeholder='Palavra do jogo' value={word} onChange={(e) => setWord(e.target.value)}/>
              {/*
                <div className='Cards-Container'>
              {playerList
                .filter((player, index) => index !== currentChooserIndex) 
                .map((player, index) => (
                  <div
                    key={index}
                    className={`Player-Card ${selectedPlayerName === player ? 'selected' : ''}`}
                    onClick={() => handleSelectMrWhite(player)}
                  >
                    {player}
                  </div>
                ))}
              </div>
              */}
              
              <button className="Start-Button" onClick={navigateGame}>START</button>
            </div>
        </div>
      )}

      {showModalPlayers && (
        <div className='Modal-Overlay'>
          <div className='Modal-Content'>
            <p><strong>{playersToReveal[currentPlayerIndex]}</strong></p>
            <div>
            {seeWordFlag && (
              playersToReveal[currentPlayerIndex] === gameValue.playerName ? (
                <p>És o MR.WHITE!</p>
              ) : playersToReveal[currentPlayerIndex] === gameValue.underCoverName ? (
                <h2>{gameValue.underCover}</h2>
              ) : (
                <h2>{gameValue.palavra}</h2>
              )
            )}
              
            </div>
            {!seeWordFlag ? (
              <button className='View-Word-Button' onClick={() => setSeeWordFlag(true)}>Ver palavra</button>
            ) : (
              <button className="View-Word-Button" onClick={handleNextPlayer}>Proximo</button>
            )}
            
          </div>
        </div>
      )}

      <div className='Input-Name'>
        <input className="Input-Jogador" type='text' value={playerName} placeholder='Nome do jogador' onChange={(e) => setPlayerName(e.target.value)}/>
        <button className="Add-Button" onClick={addName}>ADD</button>
        {!isLoading ? (
          <button className='Start-Button' onClick={startGame}>START</button>
        ):(
          <div class="loader"></div>
        ) }
        
      </div>

      <div className='Users-Name'>
        <ul>
          {playerList.map((player, index) => (
            <li key={index}> {player}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Home
