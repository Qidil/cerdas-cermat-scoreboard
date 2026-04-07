import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

// 🖥️ DISPLAY
function Display() {
  const [score, setScore] = useState(0)

  useEffect(() => {
    window.electronAPI.onScoreUpdate((data) => {
      setScore(data.score)
    })
  }, [])

  return (
    <div>
      <h1>DISPLAY</h1>
      <h2>Score: {score}</h2>
    </div>
  )
}

// 🎮 CONTROL
function Control() {
  const [score, setScore] = useState(0)

  const handleAdd = () => {
    const newScore = score + 10
    setScore(newScore)

    window.electronAPI.sendScore({ score: newScore })
  }

  return (
    <div>
      <h1>CONTROL PANEL</h1>
      <button onClick={handleAdd}>+10</button>
    </div>
  )
}

// 🚀 ROUTING
function App() {
  return (
    <Routes>
      <Route path="/display" element={<Display />} />
      <Route path="/control" element={<Control />} />
    </Routes>
  )
}

export default App