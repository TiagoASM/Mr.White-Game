import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Game/Home';
import Game from './Game/Game';


function App() {
  const [playerList, setPlayerList] = useState([]);
  const [gameValue, setGameValue] = useState({palavra: "", palavraUndercover: "", playerName: "", underCoverName: ""});

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home 
          playerList={playerList} 
          setPlayerList={setPlayerList} 
          setGameValue={setGameValue} 
          gameValue={gameValue}
          />} />
          <Route path="/game" element={<Game playerList={playerList} gameValue={gameValue} />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
