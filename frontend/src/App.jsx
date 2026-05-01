import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import correctSoundFile from './assets/sounds/correct.mp3'
import wrongSoundFile from './assets/sounds/wrong.mp3'
import tickSoundFile from './assets/sounds/tick.mp3'

const electronAPI = window.electronAPI

// 🖥️ DISPLAY
function Display() {
  const [teams, setTeams] = useState([])
  const [effect, setEffect] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [timer, setTimer] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const correctSound = new Audio(correctSoundFile)
  const wrongSound = new Audio(wrongSoundFile)
  const tickSound = new Audio(tickSoundFile)

  useEffect(() => {
    if (!electronAPI) return

    electronAPI.getTeams().then(setTeams)

    electronAPI.onTeamsUpdate((data) => {
      setTeams(data)
    })
  }, [])

  useEffect(() => {
    if (!electronAPI) return

    electronAPI.onScoreEffect((data) => {
      setEffect(data)

      setTimeout(() => {
        setEffect(null)
      }, 1000)
    })
  }, [])

  useEffect(() => {
    if (!electronAPI) return

    electronAPI.onFeedback((type) => {
      setFeedback(type)

      if (type === 'correct') {
        correctSound.currentTime = 0
        correctSound.play()
      } else {
        wrongSound.currentTime = 0
        wrongSound.play()
      }

      setTimeout(() => {
        setFeedback(null)
      }, 1000)
    })
  }, [])

  useEffect(() => {
    if (!electronAPI) return

    electronAPI.onTimerUpdate((time) => {
      setTimer(time)

      // 🔊 tick
      if (time > 0) {
        tickSound.currentTime = 0
        tickSound.play()
      }
    })

    electronAPI.onTimerVisibility((visible) => {
      setIsVisible(visible)
    })
  }, [])



  return (
    <div className="h-screen w-screen bg-slate-900 text-white flex flex-col relative">

      {/* HEADER */}
      <div className="h-[12%] flex items-center justify-center">
        <h1 className="text-4xl font-bold tracking-widest">
          LOMBA CERDAS CERMAT
        </h1>
      </div>

      {/* BODY */}
      <div className="h-[78%] flex flex-col items-center justify-center relative">

        <div className="absolute opacity-10 text-[200px] font-bold">
          LOGO
        </div>

        <div className="flex gap-20">
          {teams.map((team) => (
            <div key={team.id} className="text-center relative">
              <h2 className="text-2xl mb-2">{team.name}</h2>

              <div className="text-6xl font-bold">
                {team.score}
              </div>

              {effect && effect.teamId === team.id && (
                <div
                  className={`absolute left-1/2 -translate-x-1/2 text-5xl animate-score-pop ${
                    effect.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                  style={{ top: 0 }}
                >
                  {effect.change > 0 ? `+${effect.change}` : effect.change}
                </div>
              )}
            </div>
          ))}
        </div>

        {isVisible && (
          <div className="absolute bottom-10 text-5xl font-bold animate-timer-pulse">
            {timer}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="h-[10%] flex items-end justify-end pr-6 pb-4 text-sm opacity-80">
        <div>
          SUPPORTED BY [logo] [logo] | SPONSORED BY [logo] [logo]
        </div>
      </div>

      {/* FEEDBACK */}
      {feedback && (
        <div
          className={`absolute inset-0 flex items-center justify-center text-9xl font-bold ${
            feedback === 'correct' ? 'animate-flicker' : ''
          }`}
          style={{
            backgroundColor:
              feedback === 'correct'
                ? 'rgba(0,255,0,0.8)'
                : 'rgba(255,0,0,0.8)'
          }}
        >
          {feedback === 'correct' ? '✔' : '✖'}
        </div>
      )}

    </div>
  )
}

// 🎮 CONTROL
function Control() {
  const [teamName, setTeamName] = useState('')
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [value, setValue] = useState(0)
  const [history, setHistory] = useState([])
  const [files, setFiles] = useState([])
  const [timeInput, setTimeInput] = useState('')

  useEffect(() => {
    if (!electronAPI) return

    electronAPI.getTeams().then(setTeams)

    electronAPI.onTeamsUpdate((data) => {
      setTeams(data)
    })

    electronAPI.getHistory().then(setHistory)

    electronAPI.onHistoryUpdate((data) => {
      setHistory(data)
    })

    electronAPI.getSavedFiles().then(setFiles)

    electronAPI.onSaveSuccess((file) => {
      alert('Tersimpan: ' + file)
      electronAPI.getSavedFiles().then(setFiles)
    })
  }, [])

  const handleAddTeam = () => {
    if (!teamName) return
    electronAPI?.addTeam(teamName)
    setTeamName('')
  }

  const handleAddScore = () => {
    if (!selectedTeam || value === '') return

    electronAPI?.updateTeamScore({
      teamId: selectedTeam,
      value: parseInt(value),
      type: 'add'
    })
  }

  const handleMinusScore = () => {
    if (!selectedTeam || value === '') return

    electronAPI?.updateTeamScore({
      teamId: selectedTeam,
      value: parseInt(value),
      type: 'minus'
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center">CONTROL PANEL</h1>

      {/* TAMBAH TIM */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Nama Tim"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddTeam} className="bg-blue-500 text-white px-4 py-2">
          Tambah Tim
        </button>
      </div>

      <hr className="my-4" />

      <button
        onClick={() => electronAPI?.sendFeedback('correct')}
        className="bg-green-500 text-white px-4 py-2 mr-2"
      >
        ✔ BENAR
      </button>

      <button
        onClick={() => electronAPI?.sendFeedback('wrong')}
        className="bg-red-500 text-white px-4 py-2"
      >
        ✖ SALAH
      </button>

      <hr className="my-4" />

      <h3 className="font-bold">TIMER</h3>

      <input
        type="number"
        placeholder="Detik"
        value={timeInput}
        onChange={(e) => setTimeInput(e.target.value)}
        className="border p-2 mr-2"
      />

      <div className="mt-2 space-x-2">
        <button onClick={() => electronAPI?.startTimer(Number(timeInput))} className="bg-blue-500 text-white px-3 py-1">Start</button>
        <button onClick={() => electronAPI?.pauseTimer()} className="bg-yellow-500 text-white px-3 py-1">Pause</button>
        <button onClick={() => electronAPI?.resumeTimer()} className="bg-green-500 text-white px-3 py-1">Resume</button>
        <button onClick={() => electronAPI?.resetTimer()} className="bg-gray-500 text-white px-3 py-1">Reset</button>
      </div>

      <hr className="my-4" />

      {/* PILIH TIM */}
      <select
        onChange={(e) => setSelectedTeam(parseInt(e.target.value))}
        className="border p-2 mr-2"
      >
        <option value="">Pilih Tim</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Skor"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border p-2 mr-2"
      />

      <button onClick={handleAddScore} className="bg-green-500 text-white px-3 py-1 mr-2">
        + Tambah
      </button>
      <button onClick={handleMinusScore} className="bg-red-500 text-white px-3 py-1">
        - Kurangi
      </button>

      <hr className="my-4" />

      {/* LIST TIM */}
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            {team.name} - {team.score}
            <button
              onClick={() => {
                if (confirm('Yakin hapus tim?')) {
                  electronAPI?.deleteTeam(team.id)
                }
              }}
              className="ml-2 text-red-500"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      <button onClick={() => electronAPI?.saveMatch()} className="mt-4 bg-blue-500 text-white px-4 py-2">
        💾 Simpan
      </button>

      <hr className="my-4" />

      <h3>Load Match</h3>
      <ul>
        {files.map((file) => (
          <li key={file}>
            {file}
            <button onClick={() => electronAPI?.loadMatch(file)} className="ml-2 text-blue-500">
              Load
            </button>
          </li>
        ))}
      </ul>

      <h3 className="mt-4">HISTORY</h3>
      <ul>
        {history.map((item) => {
          if (item.action === 'add') return <li key={item.id}>+{item.value} ({item.team_name})</li>
          if (item.action === 'minus') return <li key={item.id}>-{item.value} ({item.team_name})</li>
          if (item.action === 'add-team') return <li key={item.id}>Tambah Tim: {item.team_name}</li>
          if (item.action === 'delete-team') return <li key={item.id}>Hapus Tim: {item.team_name}</li>
          return null
        })}
      </ul>
    </div>
  )
}

// 🚀 ROUTING
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/control" />} />
      <Route path="/display" element={<Display />} />
      <Route path="/control" element={<Control />} />
    </Routes>
  )
}

export default App