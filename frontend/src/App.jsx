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
  const [headerText, setHeaderText] = useState('LOMBA CERDAS CERMAT')
  const [bgColor, setBgColor] = useState('#0f172a')
  const [bgImage, setBgImage] = useState('')
  const [bgLogo, setBgLogo] = useState('')
  const [bgLogoOpacity, setBgLogoOpacity] = useState(10)
  const [sponsorLogos, setSponsorLogos] = useState([])
  const [textColorHeader, setTextColorHeader] = useState('#ffffff')
  const [textColorTeam, setTextColorTeam] = useState('#ffffff')
  const [textColorScore, setTextColorScore] = useState('#ffffff')
  const [textColorTimer, setTextColorTimer] = useState('#ffffff')
  const [textColorFooter, setTextColorFooter] = useState('#ffffff')
  const [fontHeader, setFontHeader] = useState('')
  const [fontTeam, setFontTeam] = useState('')
  const [fontScore, setFontScore] = useState('')
  const [fontTimer, setFontTimer] = useState('')
  const [fontFooter, setFontFooter] = useState('')

  useEffect(() => {
    if (!electronAPI) return

    electronAPI.getTeams().then(setTeams)

    electronAPI.onTeamsUpdate((data) => {
      setTeams(data)
    })

    electronAPI.getAllSettings().then((settings) => {
      if (settings.header_text) setHeaderText(settings.header_text)
      if (settings.bg_color) setBgColor(settings.bg_color)
      if (settings.bg_image) setBgImage(settings.bg_image)
      if (settings.bg_logo) setBgLogo(settings.bg_logo)
      if (settings.bg_logo_opacity) setBgLogoOpacity(parseInt(settings.bg_logo_opacity))
      if (settings.sponsor_logos) setSponsorLogos(JSON.parse(settings.sponsor_logos))
      if (settings.text_color_header) setTextColorHeader(settings.text_color_header)
      if (settings.text_color_team) setTextColorTeam(settings.text_color_team)
      if (settings.text_color_score) setTextColorScore(settings.text_color_score)
      if (settings.text_color_timer) setTextColorTimer(settings.text_color_timer)
      if (settings.text_color_footer) setTextColorFooter(settings.text_color_footer)
      if (settings.font_header) setFontHeader(settings.font_header)
      if (settings.font_team) setFontTeam(settings.font_team)
      if (settings.font_score) setFontScore(settings.font_score)
      if (settings.font_timer) setFontTimer(settings.font_timer)
      if (settings.font_footer) setFontFooter(settings.font_footer)
    })

    electronAPI.onSettingsUpdate((data) => {
      switch (data.key) {
        case 'header_text': setHeaderText(data.value); break
        case 'bg_color': setBgColor(data.value); break
        case 'bg_image': setBgImage(data.value); break
        case 'bg_logo': setBgLogo(data.value); break
        case 'bg_logo_opacity': setBgLogoOpacity(parseInt(data.value)); break
        case 'sponsor_logos': setSponsorLogos(data.value ? JSON.parse(data.value) : []); break
        case 'text_color_header': setTextColorHeader(data.value); break
        case 'text_color_team': setTextColorTeam(data.value); break
        case 'text_color_score': setTextColorScore(data.value); break
        case 'text_color_timer': setTextColorTimer(data.value); break
        case 'text_color_footer': setTextColorFooter(data.value); break
        case 'font_header': setFontHeader(data.value); break
        case 'font_team': setFontTeam(data.value); break
        case 'font_score': setFontScore(data.value); break
        case 'font_timer': setFontTimer(data.value); break
        case 'font_footer': setFontFooter(data.value); break
      }
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

  useEffect(() => {
    const fonts = [
      { data: fontHeader, name: 'CerdasHeader' },
      { data: fontTeam, name: 'CerdasTeam' },
      { data: fontScore, name: 'CerdasScore' },
      { data: fontTimer, name: 'CerdasTimer' },
      { data: fontFooter, name: 'CerdasFooter' },
    ]
    Promise.all(fonts.map((f) => {
      if (!f.data) return Promise.resolve()
      const fontFace = new FontFace(f.name, `url(${f.data})`)
      return fontFace.load().then(() => {
        document.fonts.add(fontFace)
      }).catch(() => {})
    }))
  }, [fontHeader, fontTeam, fontScore, fontTimer, fontFooter])



  return (
    <div
      className="h-screen w-screen flex flex-col relative"
      style={{
        backgroundColor: bgColor,
        color: textColorHeader,
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* HEADER */}
      <div className="h-[12%] flex items-center justify-center">
        <h1 className="text-4xl font-bold tracking-widest" style={{ color: textColorHeader, fontFamily: fontHeader ? 'CerdasHeader' : undefined }}>
          {headerText || 'LOMBA CERDAS CERMAT'}
        </h1>
      </div>

      {/* BODY */}
      <div className="h-[78%] flex flex-col items-center justify-center relative">

        {bgLogo && (
          <img
            src={bgLogo}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ opacity: bgLogoOpacity / 100 }}
            alt=""
          />
        )}

        <div className="flex gap-20">
          {teams.map((team) => (
            <div key={team.id} className="text-center relative">
              <h2 className="text-2xl mb-2" style={{ color: textColorTeam, fontFamily: fontTeam ? 'CerdasTeam' : undefined }}>{team.name}</h2>

              <div className="text-6xl font-bold" style={{ color: textColorScore, fontFamily: fontScore ? 'CerdasScore' : undefined }}>
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
          <div className="absolute bottom-10 text-5xl font-bold animate-timer-pulse" style={{ color: textColorTimer, fontFamily: fontTimer ? 'CerdasTimer' : undefined }}>
            {timer}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="h-[10%] flex items-end justify-end pr-6 pb-4 text-sm" style={{ color: textColorFooter, fontFamily: fontFooter ? 'CerdasFooter' : undefined }}>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {sponsorLogos.filter((s) => s.category === 'supported').length > 0 && (
            <>
              <span>SUPPORTED BY</span>
              {sponsorLogos.filter((s) => s.category === 'supported').map((s, i) => (
                <img key={i} src={s.dataUrl} alt={s.name} className="h-6 object-contain" />
              ))}
            </>
          )}
          {sponsorLogos.filter((s) => s.category === 'sponsored').length > 0 && (
            <>
              <span>| SPONSORED BY</span>
              {sponsorLogos.filter((s) => s.category === 'sponsored').map((s, i) => (
                <img key={i} src={s.dataUrl} alt={s.name} className="h-6 object-contain" />
              ))}
            </>
          )}
          {sponsorLogos.length === 0 && 'SUPPORTED BY [logo] [logo] | SPONSORED BY [logo] [logo]'}
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
  const [headerText, setHeaderText] = useState('')
  const [bgColor, setBgColor] = useState('#0f172a')
  const [bgImage, setBgImage] = useState('')
  const [bgLogo, setBgLogo] = useState('')
  const [bgLogoOpacity, setBgLogoOpacity] = useState(10)
  const [sponsorLogos, setSponsorLogos] = useState([])
  const [sponsorCategory, setSponsorCategory] = useState('supported')
  const [textColorHeader, setTextColorHeader] = useState('#ffffff')
  const [textColorTeam, setTextColorTeam] = useState('#ffffff')
  const [textColorScore, setTextColorScore] = useState('#ffffff')
  const [textColorTimer, setTextColorTimer] = useState('#ffffff')
  const [textColorFooter, setTextColorFooter] = useState('#ffffff')
  const [showSettings, setShowSettings] = useState(false)
  const [fontHeader, setFontHeader] = useState('')
  const [fontHeaderName, setFontHeaderName] = useState('')
  const [fontTeam, setFontTeam] = useState('')
  const [fontTeamName, setFontTeamName] = useState('')
  const [fontScore, setFontScore] = useState('')
  const [fontScoreName, setFontScoreName] = useState('')
  const [fontTimer, setFontTimer] = useState('')
  const [fontTimerName, setFontTimerName] = useState('')
  const [fontFooter, setFontFooter] = useState('')
  const [fontFooterName, setFontFooterName] = useState('')

  const readFileAsDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.readAsDataURL(file)
    })
  }

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

    electronAPI.getAllSettings().then((settings) => {
      if (settings.header_text) setHeaderText(settings.header_text)
      if (settings.bg_color) setBgColor(settings.bg_color)
      if (settings.bg_image) setBgImage(settings.bg_image)
      if (settings.bg_logo) setBgLogo(settings.bg_logo)
      if (settings.bg_logo_opacity) setBgLogoOpacity(parseInt(settings.bg_logo_opacity))
      if (settings.sponsor_logos) setSponsorLogos(JSON.parse(settings.sponsor_logos))
      if (settings.text_color_header) setTextColorHeader(settings.text_color_header)
      if (settings.text_color_team) setTextColorTeam(settings.text_color_team)
      if (settings.text_color_score) setTextColorScore(settings.text_color_score)
      if (settings.text_color_timer) setTextColorTimer(settings.text_color_timer)
      if (settings.text_color_footer) setTextColorFooter(settings.text_color_footer)
      if (settings.font_header) setFontHeader(settings.font_header)
      if (settings.font_team) setFontTeam(settings.font_team)
      if (settings.font_score) setFontScore(settings.font_score)
      if (settings.font_timer) setFontTimer(settings.font_timer)
      if (settings.font_footer) setFontFooter(settings.font_footer)
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

      <hr className="my-4" />

      <button
        onClick={() => setShowSettings(!showSettings)}
        className="bg-purple-500 text-white px-4 py-2"
      >
        {showSettings ? 'Sembunyikan' : 'Atur'} Tampilan
      </button>

      {showSettings && (
        <div className="mt-4 space-y-4">
          <h3 className="font-bold text-lg">KUSTOMISASI TAMPILAN</h3>

          <div>
            <label className="block font-semibold">Teks Header</label>
            <input
              type="text"
              value={headerText}
              onChange={(e) => {
                setHeaderText(e.target.value)
                electronAPI?.setSetting('header_text', e.target.value)
              }}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">Warna Background</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => {
                setBgColor(e.target.value)
                electronAPI?.setSetting('bg_color', e.target.value)
              }}
              className="border p-1"
            />
          </div>

          <div>
            <label className="block font-semibold">Gambar Background</label>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const dataUrl = await readFileAsDataURL(file)
                    setBgImage(dataUrl)
                    electronAPI?.setSetting('bg_image', dataUrl)
                  }
                }}
                className="border p-2 flex-1"
              />
              {bgImage && (
                <button onClick={() => {
                  setBgImage('')
                  electronAPI?.deleteSetting('bg_image')
                }} className="bg-red-500 text-white px-2 py-1 text-sm">Hapus</button>
              )}
            </div>
            {bgImage && <img src={bgImage} className="h-16 mt-1 object-contain" alt="preview" />}
          </div>

          <div>
            <label className="block font-semibold">Logo Background</label>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const dataUrl = await readFileAsDataURL(file)
                    setBgLogo(dataUrl)
                    electronAPI?.setSetting('bg_logo', dataUrl)
                  }
                }}
                className="border p-2 flex-1"
              />
              {bgLogo && (
                <button onClick={() => {
                  setBgLogo('')
                  electronAPI?.deleteSetting('bg_logo')
                }} className="bg-red-500 text-white px-2 py-1 text-sm">Hapus</button>
              )}
            </div>
            {bgLogo && <img src={bgLogo} className="h-16 mt-1 object-contain" alt="logo preview" />}
            <label className="block text-sm mt-1">Opacity: {bgLogoOpacity}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={bgLogoOpacity}
              onChange={(e) => {
                const val = parseInt(e.target.value)
                setBgLogoOpacity(val)
                electronAPI?.setSetting('bg_logo_opacity', String(val))
              }}
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">Logo Sponsor</label>
            <div className="flex gap-2 items-center">
              <select value={sponsorCategory} onChange={(e) => setSponsorCategory(e.target.value)} className="border p-2">
                <option value="supported">SUPPORTED BY</option>
                <option value="sponsored">SPONSORED BY</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const dataUrl = await readFileAsDataURL(file)
                    const updated = [...sponsorLogos, { name: file.name, dataUrl, category: sponsorCategory }]
                    setSponsorLogos(updated)
                    electronAPI?.setSetting('sponsor_logos', JSON.stringify(updated))
                  }
                }}
                className="border p-2 flex-1"
              />
            </div>
            <div className="mt-2">
              {sponsorLogos.filter((s) => s.category === 'supported').length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-semibold">SUPPORTED BY</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {sponsorLogos.filter((s) => s.category === 'supported').map((s) => (
                      <div key={sponsorLogos.indexOf(s)} className="relative group">
                        <img src={s.dataUrl} alt={s.name} className="h-10 object-contain" />
                        <button
                          onClick={() => {
                            const globalIndex = sponsorLogos.findIndex((item) => item === s)
                            const updated = sponsorLogos.filter((_, idx) => idx !== globalIndex)
                            setSponsorLogos(updated)
                            if (updated.length === 0) {
                              electronAPI?.deleteSetting('sponsor_logos')
                            } else {
                              electronAPI?.setSetting('sponsor_logos', JSON.stringify(updated))
                            }
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {sponsorLogos.filter((s) => s.category === 'sponsored').length > 0 && (
                <div>
                  <p className="text-sm font-semibold">SPONSORED BY</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {sponsorLogos.filter((s) => s.category === 'sponsored').map((s) => (
                      <div key={sponsorLogos.indexOf(s)} className="relative group">
                        <img src={s.dataUrl} alt={s.name} className="h-10 object-contain" />
                        <button
                          onClick={() => {
                            const globalIndex = sponsorLogos.findIndex((item) => item === s)
                            const updated = sponsorLogos.filter((_, idx) => idx !== globalIndex)
                            setSponsorLogos(updated)
                            if (updated.length === 0) {
                              electronAPI?.deleteSetting('sponsor_logos')
                            } else {
                              electronAPI?.setSetting('sponsor_logos', JSON.stringify(updated))
                            }
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {sponsorLogos.length === 0 && <p className="text-sm text-gray-400">Belum ada logo sponsor</p>}
            </div>
          </div>

          <div>
            <label className="block font-semibold">Warna Teks</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm">Header</label>
                <input type="color" value={textColorHeader} onChange={(e) => { setTextColorHeader(e.target.value); electronAPI?.setSetting('text_color_header', e.target.value) }} className="border p-1 w-full" />
              </div>
              <div>
                <label className="text-sm">Nama Tim</label>
                <input type="color" value={textColorTeam} onChange={(e) => { setTextColorTeam(e.target.value); electronAPI?.setSetting('text_color_team', e.target.value) }} className="border p-1 w-full" />
              </div>
              <div>
                <label className="text-sm">Skor</label>
                <input type="color" value={textColorScore} onChange={(e) => { setTextColorScore(e.target.value); electronAPI?.setSetting('text_color_score', e.target.value) }} className="border p-1 w-full" />
              </div>
              <div>
                <label className="text-sm">Timer</label>
                <input type="color" value={textColorTimer} onChange={(e) => { setTextColorTimer(e.target.value); electronAPI?.setSetting('text_color_timer', e.target.value) }} className="border p-1 w-full" />
              </div>
              <div>
                <label className="text-sm">Footer</label>
                <input type="color" value={textColorFooter} onChange={(e) => { setTextColorFooter(e.target.value); electronAPI?.setSetting('text_color_footer', e.target.value) }} className="border p-1 w-full" />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Font Kustom</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-24 text-sm">Header</span>
                <input type="file" accept=".ttf" onChange={async (e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const dataUrl = await readFileAsDataURL(file)
                    setFontHeader(dataUrl)
                    setFontHeaderName(file.name)
                    electronAPI?.setSetting('font_header', dataUrl)
                  }
                }} className="border p-1 text-sm flex-1" />
                {fontHeader && (
                  <button onClick={() => {
                    setFontHeader('')
                    setFontHeaderName('')
                    electronAPI?.deleteSetting('font_header')
                  }} className="text-red-500 text-sm">Hapus</button>
                )}
                {fontHeaderName && <span className="text-xs text-gray-500 truncate max-w-[120px]">{fontHeaderName}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-24 text-sm">Nama Tim</span>
                <input type="file" accept=".ttf" onChange={async (e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const dataUrl = await readFileAsDataURL(file)
                    setFontTeam(dataUrl)
                    setFontTeamName(file.name)
                    electronAPI?.setSetting('font_team', dataUrl)
                  }
                }} className="border p-1 text-sm flex-1" />
                {fontTeam && (
                  <button onClick={() => {
                    setFontTeam('')
                    setFontTeamName('')
                    electronAPI?.deleteSetting('font_team')
                  }} className="text-red-500 text-sm">Hapus</button>
                )}
                {fontTeamName && <span className="text-xs text-gray-500 truncate max-w-[120px]">{fontTeamName}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-24 text-sm">Skor</span>
                <input type="file" accept=".ttf" onChange={async (e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const dataUrl = await readFileAsDataURL(file)
                    setFontScore(dataUrl)
                    setFontScoreName(file.name)
                    electronAPI?.setSetting('font_score', dataUrl)
                  }
                }} className="border p-1 text-sm flex-1" />
                {fontScore && (
                  <button onClick={() => {
                    setFontScore('')
                    setFontScoreName('')
                    electronAPI?.deleteSetting('font_score')
                  }} className="text-red-500 text-sm">Hapus</button>
                )}
                {fontScoreName && <span className="text-xs text-gray-500 truncate max-w-[120px]">{fontScoreName}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-24 text-sm">Timer</span>
                <input type="file" accept=".ttf" onChange={async (e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const dataUrl = await readFileAsDataURL(file)
                    setFontTimer(dataUrl)
                    setFontTimerName(file.name)
                    electronAPI?.setSetting('font_timer', dataUrl)
                  }
                }} className="border p-1 text-sm flex-1" />
                {fontTimer && (
                  <button onClick={() => {
                    setFontTimer('')
                    setFontTimerName('')
                    electronAPI?.deleteSetting('font_timer')
                  }} className="text-red-500 text-sm">Hapus</button>
                )}
                {fontTimerName && <span className="text-xs text-gray-500 truncate max-w-[120px]">{fontTimerName}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-24 text-sm">Footer</span>
                <input type="file" accept=".ttf" onChange={async (e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const dataUrl = await readFileAsDataURL(file)
                    setFontFooter(dataUrl)
                    setFontFooterName(file.name)
                    electronAPI?.setSetting('font_footer', dataUrl)
                  }
                }} className="border p-1 text-sm flex-1" />
                {fontFooter && (
                  <button onClick={() => {
                    setFontFooter('')
                    setFontFooterName('')
                    electronAPI?.deleteSetting('font_footer')
                  }} className="text-red-500 text-sm">Hapus</button>
                )}
                {fontFooterName && <span className="text-xs text-gray-500 truncate max-w-[120px]">{fontFooterName}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
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