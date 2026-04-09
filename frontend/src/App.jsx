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
  const [selectedTeam, setSelectedTeam] = useState('')
  const [value, setValue] = useState(0)

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

  const handleAddScore = () => {
    if (!selectedTeam || value === '') return

    window.electronAPI.updateTeamScore({
      teamId: selectedTeam,
      value: parseInt(value),
      type: 'add'
    })
  }

  const handleMinusScore = () => {
    if (!selectedTeam || value === '') return

    window.electronAPI.updateTeamScore({
      teamId: selectedTeam,
      value: parseInt(value),
      type: 'minus'
    })
  }

  return (
    <div>
      <h1>CONTROL PANEL</h1>

      {/* TAMBAH TIM */}
      <input
        type="text"
        placeholder="Nama Tim"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <button onClick={handleAddTeam}>Tambah Tim</button>

      <hr />

      {/* PILIH TIM */}
      <select onChange={(e) => setSelectedTeam(parseInt(e.target.value))}>
        <option value="">Pilih Tim</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

      {/* INPUT ANGKA */}
      <input
        type="number"
        placeholder="Masukkan skor"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {/* TOMBOL */}
      <button onClick={handleAddScore}>+ Tambah</button>
      <button onClick={handleMinusScore}>- Kurangi</button>

      <hr />

      {/* LIST */}
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            {team.name} - {team.score}

            <button
              onClick={() => {
                if (confirm('Yakin ingin menghapus tim ini?')) {
                  window.electronAPI.deleteTeam(team.id)
                }
              }}
              style={{ marginLeft: '10px' }}
            >
              ❌
            </button>
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