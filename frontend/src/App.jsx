import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

// 🖥️ DISPLAY
function Display() {
  const [teams, setTeams] = useState([])

  useEffect(() => {
    window.electronAPI.getTeams().then(setTeams)

    window.electronAPI.onTeamsUpdate((data) => {
      setTeams(data)
    })
  }, [])

  return (
    <div>
      <h1>DISPLAY</h1>

      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            {team.name} - {team.score}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 🎮 CONTROL
function Control() {
  const [teamName, setTeamName] = useState('')
  const [teams, setTeams] = useState([])

  //ambil data awal
  useEffect(() => {
    window.electronAPI.getTeams().then((data) => {
      setTeams(data)
    })
    
    window.electronAPI.onTeamsUpdate((data) => {
      setTeams(data)
    })
  }, [])

  const handleAddTeam = () => {
    if (!teamName) return

    window.electronAPI.addTeam(teamName)
    setTeamName('')
  }

  return (
    <div>
      <h1>CONTROL PANEL</h1>

      <input
        type="text"
        placeholder="Nama Tim"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />

      <button onClick={handleAddTeam}>Tambah Tim</button>

      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            {team.name} - {team.score}
          </li>
        ))}
      </ul>
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