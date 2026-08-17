import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import correctSoundFile from './assets/sounds/correct.mp3'
import wrongSoundFile from './assets/sounds/wrong.mp3'
import tickSoundFile from './assets/sounds/tick.mp3'

const electronAPI = window.electronAPI

const hexToRgba = (hex, opacity) => {
  const h = (hex || '').replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  if ([r, g, b].some((v) => isNaN(v))) return 'transparent'
  return `rgba(${r},${g},${b},${opacity / 100})`
}

function Display() {
  const [teams, setTeams] = useState([])
  const [effect, setEffect] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [timer, setTimer] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const correctSound = useRef(null)
  const wrongSound = useRef(null)
  const tickSound = useRef(null)
  if (!correctSound.current) correctSound.current = new Audio(correctSoundFile)
  if (!wrongSound.current) wrongSound.current = new Audio(wrongSoundFile)
  if (!tickSound.current) tickSound.current = new Audio(tickSoundFile)
  const [headerText, setHeaderText] = useState('')
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
  const [fontSizeHeader, setFontSizeHeader] = useState(36)
  const [fontSizeTeam, setFontSizeTeam] = useState(24)
  const [fontSizeScore, setFontSizeScore] = useState(60)
  const [fontSizeTimer, setFontSizeTimer] = useState(48)
  const [fontSizeFooter, setFontSizeFooter] = useState(14)
  const [posHeaderX, setPosHeaderX] = useState(0)
  const [posHeaderY, setPosHeaderY] = useState(0)
  const [posTeamX, setPosTeamX] = useState(0)
  const [posTeamY, setPosTeamY] = useState(0)
  const [posScoreX, setPosScoreX] = useState(0)
  const [posScoreY, setPosScoreY] = useState(0)
  const [posTimerX, setPosTimerX] = useState(0)
  const [posTimerY, setPosTimerY] = useState(0)
  const [posFooterX, setPosFooterX] = useState(0)
  const [posFooterY, setPosFooterY] = useState(0)
  const [teamGap, setTeamGap] = useState(80)
  const [hideSponsor, setHideSponsor] = useState(false)
  const [fontWeightHeader, setFontWeightHeader] = useState('bold')
  const [fontWeightTeam, setFontWeightTeam] = useState('bold')
  const [fontWeightScore, setFontWeightScore] = useState('bold')
  const [fontWeightTimer, setFontWeightTimer] = useState('bold')
  const [fontWeightFooter, setFontWeightFooter] = useState('normal')
  const [activeSoal, setActiveSoal] = useState(null)
  const [popupWidth, setPopupWidth] = useState(900)
  const [popupHeight, setPopupHeight] = useState(500)
  const [popupBgColor, setPopupBgColor] = useState('#1e293b')
  const [popupBgImage, setPopupBgImage] = useState('')
  const [popupFont, setPopupFont] = useState('')
  const [popupFontSize, setPopupFontSize] = useState(36)
  const [popupTextColor, setPopupTextColor] = useState('#ffffff')
  const [popupOptionColor, setPopupOptionColor] = useState('#94a3b8')
  const [popupBadgeBgColor, setPopupBadgeBgColor] = useState('#ffffff')
  const [popupBadgeOpacity, setPopupBadgeOpacity] = useState(15)
  const [popupOptionBgColor, setPopupOptionBgColor] = useState('#ffffff')
  const [popupOptionBgOpacity, setPopupOptionBgOpacity] = useState(10)
  const [popupBorderColor, setPopupBorderColor] = useState('#ffffff')
  const [popupBorderWidth, setPopupBorderWidth] = useState(0)
  const [popupShadow, setPopupShadow] = useState(true)
  const [popupClosing, setPopupClosing] = useState(false)
  const popupCloseTimer = useRef(null)
  const [popupFontBadge, setPopupFontBadge] = useState('')
  const [popupFontQuestion, setPopupFontQuestion] = useState('')
  const [popupFontOption, setPopupFontOption] = useState('')
  const [popupBadgeFontSize, setPopupBadgeFontSize] = useState(14)
  const [popupBadgeBgPaddingX, setPopupBadgeBgPaddingX] = useState(12)
  const [popupBadgeBgPaddingY, setPopupBadgeBgPaddingY] = useState(4)
  const [popupBadgePosX, setPopupBadgePosX] = useState(0)
  const [popupBadgePosY, setPopupBadgePosY] = useState(0)
  const [popupOptionFontSize, setPopupOptionFontSize] = useState(20)
  const [popupOptionBgPaddingX, setPopupOptionBgPaddingX] = useState(24)
  const [popupOptionBgPaddingY, setPopupOptionBgPaddingY] = useState(12)
  const [popupOptionPosX, setPopupOptionPosX] = useState(0)
  const [popupOptionPosY, setPopupOptionPosY] = useState(0)

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
      if (settings.font_size_header) setFontSizeHeader(parseInt(settings.font_size_header))
      if (settings.font_size_team) setFontSizeTeam(parseInt(settings.font_size_team))
      if (settings.font_size_score) setFontSizeScore(parseInt(settings.font_size_score))
      if (settings.font_size_timer) setFontSizeTimer(parseInt(settings.font_size_timer))
      if (settings.font_size_footer) setFontSizeFooter(parseInt(settings.font_size_footer))
      if (settings.pos_header_x) setPosHeaderX(parseInt(settings.pos_header_x))
      if (settings.pos_header_y) setPosHeaderY(parseInt(settings.pos_header_y))
      if (settings.pos_team_x) setPosTeamX(parseInt(settings.pos_team_x))
      if (settings.pos_team_y) setPosTeamY(parseInt(settings.pos_team_y))
      if (settings.pos_score_x) setPosScoreX(parseInt(settings.pos_score_x))
      if (settings.pos_score_y) setPosScoreY(parseInt(settings.pos_score_y))
      if (settings.pos_timer_x) setPosTimerX(parseInt(settings.pos_timer_x))
      if (settings.pos_timer_y) setPosTimerY(parseInt(settings.pos_timer_y))
      if (settings.pos_footer_x) setPosFooterX(parseInt(settings.pos_footer_x))
      if (settings.pos_footer_y) setPosFooterY(parseInt(settings.pos_footer_y))
      if (settings.team_gap) setTeamGap(parseInt(settings.team_gap))
      if (settings.hide_sponsor) setHideSponsor(settings.hide_sponsor === 'true')
      if (settings.font_weight_header) setFontWeightHeader(settings.font_weight_header)
      if (settings.font_weight_team) setFontWeightTeam(settings.font_weight_team)
      if (settings.font_weight_score) setFontWeightScore(settings.font_weight_score)
      if (settings.font_weight_timer) setFontWeightTimer(settings.font_weight_timer)
      if (settings.font_weight_footer) setFontWeightFooter(settings.font_weight_footer)
      if (settings.popup_width) setPopupWidth(parseInt(settings.popup_width))
      if (settings.popup_height) setPopupHeight(parseInt(settings.popup_height))
      if (settings.popup_bg_color) setPopupBgColor(settings.popup_bg_color)
      if (settings.popup_bg_image) setPopupBgImage(settings.popup_bg_image)
      if (settings.popup_font) setPopupFont(settings.popup_font)
      if (settings.popup_font_size) setPopupFontSize(parseInt(settings.popup_font_size))
      if (settings.popup_text_color) setPopupTextColor(settings.popup_text_color)
      if (settings.popup_option_color) setPopupOptionColor(settings.popup_option_color)
      if (settings.popup_badge_bg_color) setPopupBadgeBgColor(settings.popup_badge_bg_color)
      if (settings.popup_badge_opacity) setPopupBadgeOpacity(parseInt(settings.popup_badge_opacity))
      if (settings.popup_option_bg_color) setPopupOptionBgColor(settings.popup_option_bg_color)
      if (settings.popup_option_bg_opacity) setPopupOptionBgOpacity(parseInt(settings.popup_option_bg_opacity))
      if (settings.popup_border_color) setPopupBorderColor(settings.popup_border_color)
      if (settings.popup_border_width) setPopupBorderWidth(parseInt(settings.popup_border_width))
      if (settings.popup_shadow) setPopupShadow(settings.popup_shadow === 'true')
      if (settings.popup_font_badge) setPopupFontBadge(settings.popup_font_badge)
      if (settings.popup_font_question) setPopupFontQuestion(settings.popup_font_question)
      if (settings.popup_font_option) setPopupFontOption(settings.popup_font_option)
      if (settings.popup_badge_font_size) setPopupBadgeFontSize(parseInt(settings.popup_badge_font_size))
      if (settings.popup_badge_bg_padding_x) setPopupBadgeBgPaddingX(parseInt(settings.popup_badge_bg_padding_x))
      if (settings.popup_badge_bg_padding_y) setPopupBadgeBgPaddingY(parseInt(settings.popup_badge_bg_padding_y))
      if (settings.popup_badge_pos_x) setPopupBadgePosX(parseInt(settings.popup_badge_pos_x))
      if (settings.popup_badge_pos_y) setPopupBadgePosY(parseInt(settings.popup_badge_pos_y))
      if (settings.popup_option_font_size) setPopupOptionFontSize(parseInt(settings.popup_option_font_size))
      if (settings.popup_option_bg_padding_x) setPopupOptionBgPaddingX(parseInt(settings.popup_option_bg_padding_x))
      if (settings.popup_option_bg_padding_y) setPopupOptionBgPaddingY(parseInt(settings.popup_option_bg_padding_y))
      if (settings.popup_option_pos_x) setPopupOptionPosX(parseInt(settings.popup_option_pos_x))
      if (settings.popup_option_pos_y) setPopupOptionPosY(parseInt(settings.popup_option_pos_y))
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
        case 'font_size_header': setFontSizeHeader(parseInt(data.value)); break
        case 'font_size_team': setFontSizeTeam(parseInt(data.value)); break
        case 'font_size_score': setFontSizeScore(parseInt(data.value)); break
        case 'font_size_timer': setFontSizeTimer(parseInt(data.value)); break
        case 'font_size_footer': setFontSizeFooter(parseInt(data.value)); break
        case 'pos_header_x': setPosHeaderX(parseInt(data.value)); break
        case 'pos_header_y': setPosHeaderY(parseInt(data.value)); break
        case 'pos_team_x': setPosTeamX(parseInt(data.value)); break
        case 'pos_team_y': setPosTeamY(parseInt(data.value)); break
        case 'pos_score_x': setPosScoreX(parseInt(data.value)); break
        case 'pos_score_y': setPosScoreY(parseInt(data.value)); break
        case 'pos_timer_x': setPosTimerX(parseInt(data.value)); break
        case 'pos_timer_y': setPosTimerY(parseInt(data.value)); break
        case 'pos_footer_x': setPosFooterX(parseInt(data.value)); break
        case 'pos_footer_y': setPosFooterY(parseInt(data.value)); break
        case 'team_gap': setTeamGap(parseInt(data.value)); break
        case 'hide_sponsor': setHideSponsor(data.value === 'true'); break
        case 'font_weight_header': setFontWeightHeader(data.value); break
        case 'font_weight_team': setFontWeightTeam(data.value); break
        case 'font_weight_score': setFontWeightScore(data.value); break
        case 'font_weight_timer': setFontWeightTimer(data.value); break
        case 'font_weight_footer': setFontWeightFooter(data.value); break
        case 'popup_width': setPopupWidth(parseInt(data.value)); break
        case 'popup_height': setPopupHeight(parseInt(data.value)); break
        case 'popup_bg_color': setPopupBgColor(data.value); break
        case 'popup_bg_image': setPopupBgImage(data.value); break
        case 'popup_font': setPopupFont(data.value); break
        case 'popup_font_size': setPopupFontSize(parseInt(data.value)); break
        case 'popup_text_color': setPopupTextColor(data.value); break
        case 'popup_option_color': setPopupOptionColor(data.value); break
        case 'popup_badge_bg_color': setPopupBadgeBgColor(data.value); break
        case 'popup_badge_opacity': setPopupBadgeOpacity(parseInt(data.value)); break
        case 'popup_option_bg_color': setPopupOptionBgColor(data.value); break
        case 'popup_option_bg_opacity': setPopupOptionBgOpacity(parseInt(data.value)); break
        case 'popup_border_color': setPopupBorderColor(data.value); break
        case 'popup_border_width': setPopupBorderWidth(parseInt(data.value)); break
        case 'popup_shadow': setPopupShadow(data.value === 'true'); break
        case 'popup_font_badge': setPopupFontBadge(data.value); break
        case 'popup_font_question': setPopupFontQuestion(data.value); break
        case 'popup_font_option': setPopupFontOption(data.value); break
        case 'popup_badge_font_size': setPopupBadgeFontSize(parseInt(data.value)); break
        case 'popup_badge_bg_padding_x': setPopupBadgeBgPaddingX(parseInt(data.value)); break
        case 'popup_badge_bg_padding_y': setPopupBadgeBgPaddingY(parseInt(data.value)); break
        case 'popup_badge_pos_x': setPopupBadgePosX(parseInt(data.value)); break
        case 'popup_badge_pos_y': setPopupBadgePosY(parseInt(data.value)); break
        case 'popup_option_font_size': setPopupOptionFontSize(parseInt(data.value)); break
        case 'popup_option_bg_padding_x': setPopupOptionBgPaddingX(parseInt(data.value)); break
        case 'popup_option_bg_padding_y': setPopupOptionBgPaddingY(parseInt(data.value)); break
        case 'popup_option_pos_x': setPopupOptionPosX(parseInt(data.value)); break
        case 'popup_option_pos_y': setPopupOptionPosY(parseInt(data.value)); break
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
        correctSound.current.currentTime = 0
        correctSound.current.play()
      } else {
        wrongSound.current.currentTime = 0
        wrongSound.current.play()
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

      if (time > 0) {
        tickSound.current.currentTime = 0
        tickSound.current.play()
      }
    })

    electronAPI.onTimerVisibility((visible) => {
      setIsVisible(visible)
    })
  }, [])

  useEffect(() => {
    if (!electronAPI) return

    electronAPI.onShowQuestion((soal) => {
      if (popupCloseTimer.current) {
        clearTimeout(popupCloseTimer.current)
        popupCloseTimer.current = null
      }
      setPopupClosing(false)
      setActiveSoal(soal)
    })

    electronAPI.onHideQuestion(() => {
      setPopupClosing(true)
      popupCloseTimer.current = setTimeout(() => {
        setActiveSoal(null)
        setPopupClosing(false)
        popupCloseTimer.current = null
      }, 200)
    })

    return () => {
      if (popupCloseTimer.current) clearTimeout(popupCloseTimer.current)
    }
  }, [])

  useEffect(() => {
    const fonts = [
      { data: fontHeader, name: 'CerdasHeader' },
      { data: fontTeam, name: 'CerdasTeam' },
      { data: fontScore, name: 'CerdasScore' },
      { data: fontTimer, name: 'CerdasTimer' },
      { data: fontFooter, name: 'CerdasFooter' },
      { data: popupFont, name: 'CerdasPopup' },
      { data: popupFontBadge, name: 'CerdasPopupBadge' },
      { data: popupFontQuestion, name: 'CerdasPopupQuestion' },
      { data: popupFontOption, name: 'CerdasPopupOption' },
    ]
    Promise.all(fonts.map((f) => {
      if (!f.data) return Promise.resolve()
      const fontFace = new FontFace(f.name, `url(${f.data})`)
      return fontFace.load().then(() => {
        document.fonts.add(fontFace)
      }).catch(() => {})
    }))
  }, [fontHeader, fontTeam, fontScore, fontTimer, fontFooter, popupFont, popupFontBadge, popupFontQuestion, popupFontOption])

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
      <div className="h-[12%] flex items-center justify-center" style={{ transform: `translate(${posHeaderX}px, ${posHeaderY}px)` }}>
        <h1 className="tracking-widest" style={{ color: textColorHeader, fontFamily: fontHeader ? 'CerdasHeader' : undefined, fontSize: `${fontSizeHeader}px`, fontWeight: fontWeightHeader }}>
          {headerText}
        </h1>
      </div>

      <div className="h-[78%] flex flex-col items-center justify-center relative">
        {bgLogo && (
          <img
            src={bgLogo}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ opacity: bgLogoOpacity / 100 }}
            alt=""
          />
        )}

        <div className="flex" style={{ gap: `${teamGap}px` }}>
          {teams.map((team) => (
            <div key={team.id} className="text-center relative" style={{ transform: `translate(${posTeamX}px, ${posTeamY}px)` }}>
              <h2 style={{ color: textColorTeam, fontFamily: fontTeam ? 'CerdasTeam' : undefined, fontSize: `${fontSizeTeam}px`, fontWeight: fontWeightTeam }}>{team.name}</h2>

              <div style={{ color: textColorScore, fontFamily: fontScore ? 'CerdasScore' : undefined, fontSize: `${fontSizeScore}px`, fontWeight: fontWeightScore, transform: `translate(${posScoreX}px, ${posScoreY}px)` }}>
                {team.score}
              </div>

              {effect && effect.teamId === team.id && (
                <div
                  className={`absolute left-1/2 -translate-x-1/2 animate-score-pop ${
                    effect.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                  style={{ top: 0, fontSize: `${fontSizeScore * 0.8}px` }}
                >
                  {effect.change > 0 ? `+${effect.change}` : effect.change}
                </div>
              )}
            </div>
          ))}
        </div>

        {isVisible && (
          <div className="absolute bottom-10 animate-timer-pulse" style={{ color: textColorTimer, fontFamily: fontTimer ? 'CerdasTimer' : undefined, fontSize: `${fontSizeTimer}px`, fontWeight: fontWeightTimer, transform: `translate(${posTimerX}px, ${posTimerY}px)` }}>
            {timer}
          </div>
        )}
      </div>

      {!hideSponsor && (
        <div className="h-[10%] flex items-end justify-end pr-6 pb-4" style={{ color: textColorFooter, fontFamily: fontFooter ? 'CerdasFooter' : undefined, fontSize: `${fontSizeFooter}px`, fontWeight: fontWeightFooter, transform: `translate(${posFooterX}px, ${posFooterY}px)` }}>
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
      )}

      {activeSoal && (
        <div className={`absolute inset-0 flex items-center justify-center z-40 p-10 ${popupClosing ? 'animate-popup-out' : 'animate-popup-in'}`}>
          <div
            className={`relative rounded-lg flex flex-col justify-center items-center text-center p-10 ${popupShadow ? 'shadow-2xl' : ''}`}
            style={{
              width: `${popupWidth}px`,
              height: `${popupHeight}px`,
              maxWidth: '100%',
              maxHeight: '100%',
              backgroundColor: popupBgColor,
              backgroundImage: popupBgImage ? `url(${popupBgImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: popupTextColor,
              fontFamily: popupFont ? 'CerdasPopup' : undefined,
              border: popupBorderWidth > 0 ? `${popupBorderWidth}px solid ${popupBorderColor}` : undefined,
            }}
          >
            <span
              className="absolute top-3 left-3 rounded-full font-bold uppercase tracking-widest"
              style={{
                backgroundColor: hexToRgba(popupBadgeBgColor, popupBadgeOpacity),
                color: popupOptionColor,
                fontFamily: popupFontBadge ? 'CerdasPopupBadge' : undefined,
                fontSize: `${popupBadgeFontSize}px`,
                padding: `${popupBadgeBgPaddingY}px ${popupBadgeBgPaddingX}px`,
                transform: `translate(${popupBadgePosX}px, ${popupBadgePosY}px)`,
              }}
            >
              {activeSoal.type === 'pilihan_ganda' ? 'Pilihan Ganda' : activeSoal.type === 'benar_salah' ? 'Benar / Salah' : 'Isian'}
            </span>
            <p
              className="tracking-wide leading-relaxed"
              style={{ fontSize: `${popupFontSize}px`, fontWeight: 'bold', fontFamily: popupFontQuestion ? 'CerdasPopupQuestion' : undefined }}
            >
              {activeSoal.question}
            </p>
            {activeSoal.type === 'pilihan_ganda' && activeSoal.options && (
              <div
                className="mt-8 grid gap-3"
                style={{ gridTemplateColumns: activeSoal.options.length > 2 ? '1fr 1fr' : '1fr' }}
              >
                {activeSoal.options.map((opt, i) => (
                  <div
                    key={i}
                    className="rounded text-left"
                    style={{
                      backgroundColor: hexToRgba(popupOptionBgColor, popupOptionBgOpacity),
                      color: popupOptionColor,
                      fontSize: `${popupOptionFontSize}px`,
                      fontWeight: 'bold',
                      fontFamily: popupFontOption ? 'CerdasPopupOption' : undefined,
                      padding: `${popupOptionBgPaddingY}px ${popupOptionBgPaddingX}px`,
                      transform: `translate(${popupOptionPosX}px, ${popupOptionPosY}px)`,
                    }}
                  >
                    <span className="mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {feedback && (
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            feedback === 'correct' ? 'animate-flicker' : ''
          }`}
          style={{
            backgroundColor:
              feedback === 'correct'
                ? 'rgba(0,255,0,0.8)'
                : 'rgba(255,0,0,0.8)'
          }}
        >
          <svg viewBox="0 0 24 24" className="w-[70vh] h-[70vh]" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            {feedback === 'correct' ? (
              <path d="M5 13l4 4L19 7" />
            ) : (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6l-12 12" />
              </>
            )}
          </svg>
        </div>
      )}
    </div>
  )
}

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
  const [activeTab, setActiveTab] = useState('operator')
  const [soalList, setSoalList] = useState([])
  const [activeSoalId, setActiveSoalId] = useState(null)
  const [popupWidth, setPopupWidth] = useState(900)
  const [popupHeight, setPopupHeight] = useState(500)
  const [popupBgColor, setPopupBgColor] = useState('#1e293b')
  const [popupBgImage, setPopupBgImage] = useState('')
  const [popupFont, setPopupFont] = useState('')
  const [popupFontSize, setPopupFontSize] = useState(36)
  const [popupTextColor, setPopupTextColor] = useState('#ffffff')
  const [popupOptionColor, setPopupOptionColor] = useState('#94a3b8')
  const [popupBadgeBgColor, setPopupBadgeBgColor] = useState('#ffffff')
  const [popupBadgeOpacity, setPopupBadgeOpacity] = useState(15)
  const [popupOptionBgColor, setPopupOptionBgColor] = useState('#ffffff')
  const [popupOptionBgOpacity, setPopupOptionBgOpacity] = useState(10)
  const [popupBorderColor, setPopupBorderColor] = useState('#ffffff')
  const [popupBorderWidth, setPopupBorderWidth] = useState(0)
  const [popupShadow, setPopupShadow] = useState(true)
  const [popupFontBadge, setPopupFontBadge] = useState('')
  const [popupFontQuestion, setPopupFontQuestion] = useState('')
  const [popupFontOption, setPopupFontOption] = useState('')
  const [popupBadgeFontSize, setPopupBadgeFontSize] = useState(14)
  const [popupBadgeBgPaddingX, setPopupBadgeBgPaddingX] = useState(12)
  const [popupBadgeBgPaddingY, setPopupBadgeBgPaddingY] = useState(4)
  const [popupBadgePosX, setPopupBadgePosX] = useState(0)
  const [popupBadgePosY, setPopupBadgePosY] = useState(0)
  const [popupOptionFontSize, setPopupOptionFontSize] = useState(20)
  const [popupOptionBgPaddingX, setPopupOptionBgPaddingX] = useState(24)
  const [popupOptionBgPaddingY, setPopupOptionBgPaddingY] = useState(12)
  const [popupOptionPosX, setPopupOptionPosX] = useState(0)
  const [popupOptionPosY, setPopupOptionPosY] = useState(0)
  const [exporting, setExporting] = useState(false)
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
  const [fontSizeHeader, setFontSizeHeader] = useState(36)
  const [fontSizeTeam, setFontSizeTeam] = useState(24)
  const [fontSizeScore, setFontSizeScore] = useState(60)
  const [fontSizeTimer, setFontSizeTimer] = useState(48)
  const [fontSizeFooter, setFontSizeFooter] = useState(14)
  const [posHeaderX, setPosHeaderX] = useState(0)
  const [posHeaderY, setPosHeaderY] = useState(0)
  const [posTeamX, setPosTeamX] = useState(0)
  const [posTeamY, setPosTeamY] = useState(0)
  const [posScoreX, setPosScoreX] = useState(0)
  const [posScoreY, setPosScoreY] = useState(0)
  const [posTimerX, setPosTimerX] = useState(0)
  const [posTimerY, setPosTimerY] = useState(0)
  const [posFooterX, setPosFooterX] = useState(0)
  const [posFooterY, setPosFooterY] = useState(0)
  const [teamGap, setTeamGap] = useState(80)
  const [hideSponsor, setHideSponsor] = useState(false)
  const [fontWeightHeader, setFontWeightHeader] = useState('bold')
  const [fontWeightTeam, setFontWeightTeam] = useState('bold')
  const [fontWeightScore, setFontWeightScore] = useState('bold')
  const [fontWeightTimer, setFontWeightTimer] = useState('bold')
  const [fontWeightFooter, setFontWeightFooter] = useState('normal')
  const [notification, setNotification] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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
      setNotification('Tersimpan: ' + file)
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
      if (settings.font_size_header) setFontSizeHeader(parseInt(settings.font_size_header))
      if (settings.font_size_team) setFontSizeTeam(parseInt(settings.font_size_team))
      if (settings.font_size_score) setFontSizeScore(parseInt(settings.font_size_score))
      if (settings.font_size_timer) setFontSizeTimer(parseInt(settings.font_size_timer))
      if (settings.font_size_footer) setFontSizeFooter(parseInt(settings.font_size_footer))
      if (settings.pos_header_x) setPosHeaderX(parseInt(settings.pos_header_x))
      if (settings.pos_header_y) setPosHeaderY(parseInt(settings.pos_header_y))
      if (settings.pos_team_x) setPosTeamX(parseInt(settings.pos_team_x))
      if (settings.pos_team_y) setPosTeamY(parseInt(settings.pos_team_y))
      if (settings.pos_score_x) setPosScoreX(parseInt(settings.pos_score_x))
      if (settings.pos_score_y) setPosScoreY(parseInt(settings.pos_score_y))
      if (settings.pos_timer_x) setPosTimerX(parseInt(settings.pos_timer_x))
      if (settings.pos_timer_y) setPosTimerY(parseInt(settings.pos_timer_y))
      if (settings.pos_footer_x) setPosFooterX(parseInt(settings.pos_footer_x))
      if (settings.pos_footer_y) setPosFooterY(parseInt(settings.pos_footer_y))
      if (settings.team_gap) setTeamGap(parseInt(settings.team_gap))
      if (settings.hide_sponsor) setHideSponsor(settings.hide_sponsor === 'true')
      if (settings.font_weight_header) setFontWeightHeader(settings.font_weight_header)
      if (settings.font_weight_team) setFontWeightTeam(settings.font_weight_team)
      if (settings.font_weight_score) setFontWeightScore(settings.font_weight_score)
      if (settings.font_weight_timer) setFontWeightTimer(settings.font_weight_timer)
      if (settings.font_weight_footer) setFontWeightFooter(settings.font_weight_footer)
      if (settings.popup_width) setPopupWidth(parseInt(settings.popup_width))
      if (settings.popup_height) setPopupHeight(parseInt(settings.popup_height))
      if (settings.popup_bg_color) setPopupBgColor(settings.popup_bg_color)
      if (settings.popup_bg_image) setPopupBgImage(settings.popup_bg_image)
      if (settings.popup_font) setPopupFont(settings.popup_font)
      if (settings.popup_font_size) setPopupFontSize(parseInt(settings.popup_font_size))
      if (settings.popup_text_color) setPopupTextColor(settings.popup_text_color)
      if (settings.popup_option_color) setPopupOptionColor(settings.popup_option_color)
      if (settings.popup_badge_bg_color) setPopupBadgeBgColor(settings.popup_badge_bg_color)
      if (settings.popup_badge_opacity) setPopupBadgeOpacity(parseInt(settings.popup_badge_opacity))
      if (settings.popup_option_bg_color) setPopupOptionBgColor(settings.popup_option_bg_color)
      if (settings.popup_option_bg_opacity) setPopupOptionBgOpacity(parseInt(settings.popup_option_bg_opacity))
      if (settings.popup_border_color) setPopupBorderColor(settings.popup_border_color)
      if (settings.popup_border_width) setPopupBorderWidth(parseInt(settings.popup_border_width))
      if (settings.popup_shadow) setPopupShadow(settings.popup_shadow === 'true')
      if (settings.popup_font_badge) setPopupFontBadge(settings.popup_font_badge)
      if (settings.popup_font_question) setPopupFontQuestion(settings.popup_font_question)
      if (settings.popup_font_option) setPopupFontOption(settings.popup_font_option)
      if (settings.popup_badge_font_size) setPopupBadgeFontSize(parseInt(settings.popup_badge_font_size))
      if (settings.popup_badge_bg_padding_x) setPopupBadgeBgPaddingX(parseInt(settings.popup_badge_bg_padding_x))
      if (settings.popup_badge_bg_padding_y) setPopupBadgeBgPaddingY(parseInt(settings.popup_badge_bg_padding_y))
      if (settings.popup_badge_pos_x) setPopupBadgePosX(parseInt(settings.popup_badge_pos_x))
      if (settings.popup_badge_pos_y) setPopupBadgePosY(parseInt(settings.popup_badge_pos_y))
      if (settings.popup_option_font_size) setPopupOptionFontSize(parseInt(settings.popup_option_font_size))
      if (settings.popup_option_bg_padding_x) setPopupOptionBgPaddingX(parseInt(settings.popup_option_bg_padding_x))
      if (settings.popup_option_bg_padding_y) setPopupOptionBgPaddingY(parseInt(settings.popup_option_bg_padding_y))
      if (settings.popup_option_pos_x) setPopupOptionPosX(parseInt(settings.popup_option_pos_x))
      if (settings.popup_option_pos_y) setPopupOptionPosY(parseInt(settings.popup_option_pos_y))

      setIsLoading(false)
    })

    electronAPI.onOperationError((msg) => {
      setNotification(msg)
    })
  }, [])

  useEffect(() => {
    if (!notification) return
    const t = setTimeout(() => setNotification(''), 3000)
    return () => clearTimeout(t)
  }, [notification])

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

  const handleSetSetting = (key, val) => {
    electronAPI?.setSetting(key, String(val))
  }

  const parseCSV = (text) => {
    const rows = []
    let row = []
    let cell = ''
    let inQuotes = false

    for (let i = 0; i < text.length; i++) {
      const c = text[i]
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') {
            cell += '"'
            i++
          } else {
            inQuotes = false
          }
        } else {
          cell += c
        }
      } else if (c === '"') {
        inQuotes = true
      } else if (c === ',') {
        row.push(cell)
        cell = ''
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++
        row.push(cell)
        cell = ''
        if (row.some((x) => x.trim() !== '')) rows.push(row)
        row = []
      } else {
        cell += c
      }
    }
    row.push(cell)
    if (row.some((x) => x.trim() !== '')) rows.push(row)

    const header = rows[0].map((h) => h.trim().toLowerCase())
    const data = rows.slice(1)

    return data.map((r) => {
      const obj = {}
      header.forEach((h, idx) => { obj[h] = (r[idx] || '').trim() })
      return obj
    })
  }

  const csvToSoal = (records) => {
    return records
      .filter((r) => r.question)
      .map((r, i) => {
        const type = (r.type || 'isian').trim().toLowerCase().replace(/[-\s]+/g, '_')
        let normalizedType = 'isian'
        if (type === 'pilihan_ganda' || type === 'pg' || type === 'multiple_choice') normalizedType = 'pilihan_ganda'
        else if (type === 'benar_salah' || type === 'true_false' || type === 'bs') normalizedType = 'benar_salah'

        const options = []
        if (normalizedType === 'pilihan_ganda') {
          for (const key of ['option_a', 'option_b', 'option_c', 'option_d', 'a', 'b', 'c', 'd']) {
            const val = r[key]
            if (val) options.push(val)
            if (options.length === 4) break
          }
        }

        return {
          id: 'soal-' + Date.now() + '-' + i,
          type: normalizedType,
          question: r.question,
          options: options.length > 0 ? options : undefined,
          answer: r.answer || ''
        }
      })
  }

  const handleSoalFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''

    try {
      const text = await file.text()
      let parsed = []

      if (file.name.toLowerCase().endsWith('.csv')) {
        const records = parseCSV(text)
        parsed = csvToSoal(records)
      } else {
        const json = JSON.parse(text)
        const arr = Array.isArray(json) ? json : (json.soal || [])
        parsed = arr.map((s, i) => ({
          id: 'soal-' + Date.now() + '-' + i,
          type: (s.type || 'isian').toString().toLowerCase().replace(/[-\s]+/g, '_'),
          question: s.question || '',
          options: Array.isArray(s.options) ? s.options : undefined,
          answer: s.answer || ''
        }))
      }

      const valid = parsed.filter((s) => s.question)
      if (valid.length === 0) {
        setNotification('File tidak berisi soal yang valid')
        return
      }
      setSoalList(valid)
      setActiveSoalId(null)
      electronAPI?.hideQuestion()
      setNotification('Loaded ' + valid.length + ' soal')
    } catch (err) {
      setNotification('Gagal membaca file: ' + err.message)
    }
  }

  const toggleSoal = (soal) => {
    if (activeSoalId === soal.id) {
      setActiveSoalId(null)
      electronAPI?.hideQuestion()
    } else {
      setActiveSoalId(soal.id)
      electronAPI?.showQuestion(soal)
    }
  }

  const handleExportPng = async () => {
    setExporting(true)
    try {
      const result = await electronAPI?.exportDisplayPng()
      if (result && !result.canceled) {
        setNotification('Gambar tersimpan: ' + (result.filePath || '').split(/[\\/]/).pop())
      } else if (result && result.canceled && !result.error) {
        setNotification('Export dibatalkan')
      } else if (result && result.error) {
        setNotification('Gagal export: ' + result.error)
      }
    } catch (err) {
      setNotification('Gagal export: ' + err.message)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {isLoading && <div className="text-center py-4 text-gray-500">Memuat...</div>}
      {!isLoading && (<>
      {notification && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50 text-sm">
          {notification}
        </div>
      )}

      <h1 className="text-2xl font-bold text-center mb-4">CONTROL PANEL</h1>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-4">
        {[
          { id: 'operator', label: 'Operator' },
          { id: 'soal', label: 'Soal' },
          { id: 'tampilan', label: 'Tampilan' },
          { id: 'histori', label: 'Histori' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:bg-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'operator' && (<>
      {/* CARD: TIM */}
      <div className="bg-white border rounded-lg shadow-sm p-4 mb-4">
        <h2 className="font-bold text-lg mb-3">TIM</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Nama Tim"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="border p-2 flex-1 text-sm"
          />
          <button onClick={handleAddTeam} className="bg-blue-500 text-white px-4 py-2 text-sm font-semibold">
            Tambah
          </button>
        </div>
        <ul className="space-y-1">
          {teams.map((team) => (
            <li key={team.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-sm">
              <span className="font-medium">{team.name} — <span className="font-bold">{team.score}</span></span>
              {confirmDelete === team.id ? (
                <span className="flex gap-1">
                  <button onClick={() => {
                    electronAPI?.deleteTeam(team.id)
                    setConfirmDelete(null)
                  }} className="text-red-600 font-bold text-xs px-2 py-1 border border-red-300 rounded">Yakin?</button>
                  <button onClick={() => setConfirmDelete(null)} className="text-gray-500 text-xs px-2 py-1 border rounded">Batal</button>
                </span>
              ) : (
                <button onClick={() => setConfirmDelete(team.id)} className="text-red-500 text-lg leading-none hover:bg-red-50 px-2 rounded" title="Hapus tim">&times;</button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* CARD: SKOR */}
      <div className="bg-white border rounded-lg shadow-sm p-4 mb-4">
        <h2 className="font-bold text-lg mb-3">SKOR</h2>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => electronAPI?.sendFeedback('correct')}
            className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded text-sm font-semibold"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
            BENAR
          </button>
          <button
            onClick={() => electronAPI?.sendFeedback('wrong')}
            className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded text-sm font-semibold"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"><path d="M6 6l12 12"/><path d="M18 6l-12 12"/></svg>
            SALAH
          </button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            onChange={(e) => setSelectedTeam(parseInt(e.target.value))}
            className="border p-2 text-sm flex-1 min-w-[120px]"
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
            className="border p-2 text-sm w-20"
          />
          <button onClick={handleAddScore} className="bg-green-600 text-white px-3 py-2 text-sm font-semibold rounded">+ Tambah</button>
          <button onClick={handleMinusScore} className="bg-red-600 text-white px-3 py-2 text-sm font-semibold rounded">- Kurang</button>
        </div>
      </div>

      {/* CARD: TIMER */}
      <div className="bg-white border rounded-lg shadow-sm p-4 mb-4">
        <h2 className="font-bold text-lg mb-3">TIMER</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            placeholder="Detik"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            className="border p-2 text-sm w-24"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => electronAPI?.startTimer(Number(timeInput))} className="bg-blue-500 text-white px-3 py-1.5 text-sm font-semibold rounded">Start</button>
          <button onClick={() => electronAPI?.pauseTimer()} className="bg-yellow-500 text-white px-3 py-1.5 text-sm font-semibold rounded">Pause</button>
          <button onClick={() => electronAPI?.resumeTimer()} className="bg-green-500 text-white px-3 py-1.5 text-sm font-semibold rounded">Resume</button>
          <button onClick={() => electronAPI?.resetTimer()} className="bg-gray-500 text-white px-3 py-1.5 text-sm font-semibold rounded">Reset</button>
        </div>
      </div>
      </>)}

      {activeTab === 'soal' && (
      <div className="bg-white border rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">SOAL</h2>
          <input
            type="file"
            accept=".json,.csv"
            onChange={handleSoalFile}
            className="border p-2 text-sm"
          />
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Format: JSON ({'{'} "soal": [ ... ] {'}'}) atau CSV (type, question, option_a..option_d, answer). Tipe: pilihan_ganda, isian, benar_salah.
        </p>
        {soalList.length === 0 && (
          <p className="text-xs text-gray-400 italic">Belum ada soal. Upload file .json atau .csv.</p>
        )}
        <ul className="space-y-1">
          {soalList.map((soal, i) => (
            <li key={soal.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-sm gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-xs text-gray-400 font-semibold uppercase mr-2">
                  {soal.type === 'pilihan_ganda' ? 'PG' : soal.type === 'benar_salah' ? 'B/S' : 'Isian'}
                </span>
                <span className="font-medium truncate">{i + 1}. {soal.question}</span>
              </div>
              <button
                onClick={() => toggleSoal(soal)}
                className={`px-3 py-1 text-xs font-semibold rounded shrink-0 ${
                  activeSoalId === soal.id
                    ? 'bg-red-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {activeSoalId === soal.id ? 'Tutup' : 'Tampilkan'}
              </button>
            </li>
          ))}
        </ul>
      </div>
      )}

      {activeTab === 'histori' && (<>
      {/* CARD: DATA */}
      <div className="bg-white border rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <h2 className="font-bold text-lg">DATA</h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportPng}
              disabled={exporting}
              className="bg-green-600 text-white px-4 py-1.5 text-sm font-semibold rounded disabled:opacity-50"
            >
              {exporting ? 'Mengekspor...' : 'Export PNG'}
            </button>
            <button onClick={() => electronAPI?.saveMatch()} className="bg-blue-500 text-white px-4 py-1.5 text-sm font-semibold rounded">Simpan</button>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-600 mb-1">Load Match</h3>
        <ul className="space-y-1 mb-3">
          {files.map((file) => (
            <li key={file} className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded text-sm">
              <span className="text-xs truncate">{file}</span>
              <button onClick={() => electronAPI?.loadMatch(file)} className="text-blue-600 text-xs font-semibold hover:underline">Load</button>
            </li>
          ))}
          {files.length === 0 && <li className="text-xs text-gray-400 italic">Belum ada backup</li>}
        </ul>

        <button
          onClick={() => electronAPI?.openDataDir()}
          className="bg-purple-600 text-white px-4 py-1.5 text-sm font-semibold rounded mb-3"
        >
          Buka Lokasi Data
        </button>

        <h3 className="text-sm font-semibold text-gray-600 mb-1">History</h3>
        <ul className="space-y-0.5 max-h-32 overflow-y-auto">
          {history.map((item) => {
            let text = ''
            if (item.action === 'add') text = `+${item.value} (${item.team_name})`
            else if (item.action === 'minus') text = `-${item.value} (${item.team_name})`
            else if (item.action === 'add-team') text = `Tambah Tim: ${item.team_name}`
            else if (item.action === 'delete-team') text = `Hapus Tim: ${item.team_name}`
            else text = ''
            if (!text) return null
            return <li key={item.id} className="text-xs text-gray-600">{text}</li>
          })}
        </ul>
      </div>
      </>)}

      {activeTab === 'tampilan' && (
      /* CARD: TAMPILAN */
      <div className="bg-white border rounded-lg shadow-sm p-4 mb-4">
        <h2 className="font-bold text-lg mb-3">TAMPILAN</h2>

          <div className="space-y-5">

            {/* TEKS HEADER */}
            <div>
              <label className="block font-semibold text-sm">Teks Header</label>
              <input
                type="text"
                value={headerText}
                onChange={(e) => {
                  setHeaderText(e.target.value)
                  electronAPI?.setSetting('header_text', e.target.value)
                }}
                className="border p-2 w-full text-sm"
                placeholder="Kosongkan jika tidak ingin teks header"
              />
            </div>

            <div>
              <label className="block font-semibold text-sm">Warna Background</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => {
                  setBgColor(e.target.value)
                  electronAPI?.setSetting('bg_color', e.target.value)
                }}
                className="border p-1 w-full h-9"
              />
            </div>

            <div>
              <label className="block font-semibold text-sm">Gambar Background</label>
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
                  className="border p-2 text-sm flex-1"
                />
                {bgImage && (
                  <button onClick={() => {
                    setBgImage('')
                    electronAPI?.deleteSetting('bg_image')
                  }} className="bg-red-500 text-white px-2 py-1 text-sm rounded">Hapus</button>
                )}
              </div>
              {bgImage && <img src={bgImage} className="h-12 mt-1 object-contain" alt="preview" />}
            </div>

            {/* LOGO BACKGROUND */}
            <div>
              <label className="block font-semibold text-sm">Logo Background</label>
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
                  className="border p-2 text-sm flex-1"
                />
                {bgLogo && (
                  <button onClick={() => {
                    setBgLogo('')
                    electronAPI?.deleteSetting('bg_logo')
                  }} className="bg-red-500 text-white px-2 py-1 text-sm rounded">Hapus</button>
                )}
              </div>
              {bgLogo && <img src={bgLogo} className="h-12 mt-1 object-contain" alt="logo preview" />}
              <label className="block text-xs text-gray-500 mt-1">Opacity: {bgLogoOpacity}%</label>
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

            {/* SPONSOR */}
            <div>
              <label className="block font-semibold text-sm">Logo Sponsor</label>
              <div className="flex gap-2 items-center mb-2">
                <select value={sponsorCategory} onChange={(e) => setSponsorCategory(e.target.value)} className="border p-2 text-sm">
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
                  className="border p-2 text-sm flex-1"
                />
              </div>
              <div className="mb-2">
                {sponsorLogos.filter((s) => s.category === 'supported').length > 0 && (
                  <div className="mb-1">
                    <p className="text-xs font-semibold text-gray-500">SUPPORTED BY</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {sponsorLogos.filter((s) => s.category === 'supported').map((s) => (
                        <div key={sponsorLogos.indexOf(s)} className="relative group">
                          <img src={s.dataUrl} alt={s.name} className="h-8 object-contain" />
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
                          >&times;</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {sponsorLogos.filter((s) => s.category === 'sponsored').length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500">SPONSORED BY</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {sponsorLogos.filter((s) => s.category === 'sponsored').map((s) => (
                        <div key={sponsorLogos.indexOf(s)} className="relative group">
                          <img src={s.dataUrl} alt={s.name} className="h-8 object-contain" />
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
                          >&times;</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {sponsorLogos.length === 0 && <p className="text-xs text-gray-400">Belum ada logo sponsor</p>}
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={hideSponsor}
                  onChange={(e) => {
                    const val = e.target.checked
                    setHideSponsor(val)
                    electronAPI?.setSetting('hide_sponsor', String(val))
                  }}
                  className="w-4 h-4"
                />
                Sembunyikan sponsor di layar display
              </label>
            </div>

            {/* WARNA TEKS */}
            <div>
              <label className="block font-semibold text-sm mb-2">Warna Teks</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Header</label>
                  <input type="color" value={textColorHeader} onChange={(e) => { setTextColorHeader(e.target.value); electronAPI?.setSetting('text_color_header', e.target.value) }} className="border p-1 w-full h-8" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Nama Tim</label>
                  <input type="color" value={textColorTeam} onChange={(e) => { setTextColorTeam(e.target.value); electronAPI?.setSetting('text_color_team', e.target.value) }} className="border p-1 w-full h-8" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Skor</label>
                  <input type="color" value={textColorScore} onChange={(e) => { setTextColorScore(e.target.value); electronAPI?.setSetting('text_color_score', e.target.value) }} className="border p-1 w-full h-8" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Timer</label>
                  <input type="color" value={textColorTimer} onChange={(e) => { setTextColorTimer(e.target.value); electronAPI?.setSetting('text_color_timer', e.target.value) }} className="border p-1 w-full h-8" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Footer</label>
                  <input type="color" value={textColorFooter} onChange={(e) => { setTextColorFooter(e.target.value); electronAPI?.setSetting('text_color_footer', e.target.value) }} className="border p-1 w-full h-8" />
                </div>
              </div>
            </div>

            {/* UKURAN TEKS */}
            <div>
              <label className="block font-semibold text-sm mb-2">Ukuran Teks (px)</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Header</span>
                  <input type="number" min="1" value={fontSizeHeader}
                    onChange={(e) => { const v = parseInt(e.target.value) || 1; setFontSizeHeader(v); handleSetSetting('font_size_header', v) }}
                    className="border p-1 text-xs w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Nama Tim</span>
                  <input type="number" min="1" value={fontSizeTeam}
                    onChange={(e) => { const v = parseInt(e.target.value) || 1; setFontSizeTeam(v); handleSetSetting('font_size_team', v) }}
                    className="border p-1 text-xs w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Skor</span>
                  <input type="number" min="1" value={fontSizeScore}
                    onChange={(e) => { const v = parseInt(e.target.value) || 1; setFontSizeScore(v); handleSetSetting('font_size_score', v) }}
                    className="border p-1 text-xs w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Timer</span>
                  <input type="number" min="1" value={fontSizeTimer}
                    onChange={(e) => { const v = parseInt(e.target.value) || 1; setFontSizeTimer(v); handleSetSetting('font_size_timer', v) }}
                    className="border p-1 text-xs w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Footer</span>
                  <input type="number" min="1" value={fontSizeFooter}
                    onChange={(e) => { const v = parseInt(e.target.value) || 1; setFontSizeFooter(v); handleSetSetting('font_size_footer', v) }}
                    className="border p-1 text-xs w-20" />
                </div>
              </div>
            </div>

            {/* TEBAL / REGULER */}
            <div>
              <label className="block font-semibold text-sm mb-2">Ketebalan Teks</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Header</span>
                  <select value={fontWeightHeader}
                    onChange={(e) => { const v = e.target.value; setFontWeightHeader(v); handleSetSetting('font_weight_header', v) }}
                    className="border p-1 text-xs w-20">
                    <option value="bold">Bold</option>
                    <option value="normal">Reguler</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Nama Tim</span>
                  <select value={fontWeightTeam}
                    onChange={(e) => { const v = e.target.value; setFontWeightTeam(v); handleSetSetting('font_weight_team', v) }}
                    className="border p-1 text-xs w-20">
                    <option value="bold">Bold</option>
                    <option value="normal">Reguler</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Skor</span>
                  <select value={fontWeightScore}
                    onChange={(e) => { const v = e.target.value; setFontWeightScore(v); handleSetSetting('font_weight_score', v) }}
                    className="border p-1 text-xs w-20">
                    <option value="bold">Bold</option>
                    <option value="normal">Reguler</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Timer</span>
                  <select value={fontWeightTimer}
                    onChange={(e) => { const v = e.target.value; setFontWeightTimer(v); handleSetSetting('font_weight_timer', v) }}
                    className="border p-1 text-xs w-20">
                    <option value="bold">Bold</option>
                    <option value="normal">Reguler</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Footer</span>
                  <select value={fontWeightFooter}
                    onChange={(e) => { const v = e.target.value; setFontWeightFooter(v); handleSetSetting('font_weight_footer', v) }}
                    className="border p-1 text-xs w-20">
                    <option value="bold">Bold</option>
                    <option value="normal">Reguler</option>
                  </select>
                </div>
              </div>
            </div>

            {/* POSISI OFFSET */}
            <div>
              <label className="block font-semibold text-sm mb-2">Posisi Teks (offset px)</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Header X</span>
                  <input type="number" value={posHeaderX}
                    onChange={(e) => { const v = parseInt(e.target.value) || 0; setPosHeaderX(v); handleSetSetting('pos_header_x', v) }}
                    className="border p-1 text-xs w-16" />
                  <span className="text-xs">Y</span>
                  <input type="number" value={posHeaderY}
                    onChange={(e) => { const v = parseInt(e.target.value) || 0; setPosHeaderY(v); handleSetSetting('pos_header_y', v) }}
                    className="border p-1 text-xs w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Nama Tim X</span>
                  <input type="number" value={posTeamX}
                    onChange={(e) => { const v = parseInt(e.target.value) || 0; setPosTeamX(v); handleSetSetting('pos_team_x', v) }}
                    className="border p-1 text-xs w-16" />
                  <span className="text-xs">Y</span>
                  <input type="number" value={posTeamY}
                    onChange={(e) => { const v = parseInt(e.target.value) || 0; setPosTeamY(v); handleSetSetting('pos_team_y', v) }}
                    className="border p-1 text-xs w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Skor X</span>
                  <input type="number" value={posScoreX}
                    onChange={(e) => { const v = parseInt(e.target.value) || 0; setPosScoreX(v); handleSetSetting('pos_score_x', v) }}
                    className="border p-1 text-xs w-16" />
                  <span className="text-xs">Y</span>
                  <input type="number" value={posScoreY}
                    onChange={(e) => { const v = parseInt(e.target.value) || 0; setPosScoreY(v); handleSetSetting('pos_score_y', v) }}
                    className="border p-1 text-xs w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Timer X</span>
                  <input type="number" value={posTimerX}
                    onChange={(e) => { const v = parseInt(e.target.value) || 0; setPosTimerX(v); handleSetSetting('pos_timer_x', v) }}
                    className="border p-1 text-xs w-16" />
                  <span className="text-xs">Y</span>
                  <input type="number" value={posTimerY}
                    onChange={(e) => { const v = parseInt(e.target.value) || 0; setPosTimerY(v); handleSetSetting('pos_timer_y', v) }}
                    className="border p-1 text-xs w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Footer X</span>
                  <input type="number" value={posFooterX}
                    onChange={(e) => { const v = parseInt(e.target.value) || 0; setPosFooterX(v); handleSetSetting('pos_footer_x', v) }}
                    className="border p-1 text-xs w-16" />
                  <span className="text-xs">Y</span>
                  <input type="number" value={posFooterY}
                    onChange={(e) => { const v = parseInt(e.target.value) || 0; setPosFooterY(v); handleSetSetting('pos_footer_y', v) }}
                    className="border p-1 text-xs w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs">Gap Tim</span>
                  <input type="number" min="1" value={teamGap}
                    onChange={(e) => { const v = parseInt(e.target.value) || 1; setTeamGap(v); handleSetSetting('team_gap', v) }}
                    className="border p-1 text-xs w-20" />
                </div>
              </div>
            </div>

            {/* FONT */}
            <div>
              <label className="block font-semibold text-sm mb-2">Font Kustom</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-20 text-xs">Header</span>
                  <input type="file" accept=".ttf" onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const dataUrl = await readFileAsDataURL(file)
                      setFontHeader(dataUrl)
                      setFontHeaderName(file.name)
                      electronAPI?.setSetting('font_header', dataUrl)
                    }
                  }} className="border p-1 text-xs flex-1" />
                  {fontHeader && (
                    <button onClick={() => {
                      setFontHeader('')
                      setFontHeaderName('')
                      electronAPI?.deleteSetting('font_header')
                    }} className="text-red-500 text-xs">Hapus</button>
                  )}
                  {fontHeaderName && <span className="text-xs text-gray-500 truncate max-w-[80px]">{fontHeaderName}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 text-xs">Nama Tim</span>
                  <input type="file" accept=".ttf" onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const dataUrl = await readFileAsDataURL(file)
                      setFontTeam(dataUrl)
                      setFontTeamName(file.name)
                      electronAPI?.setSetting('font_team', dataUrl)
                    }
                  }} className="border p-1 text-xs flex-1" />
                  {fontTeam && (
                    <button onClick={() => {
                      setFontTeam('')
                      setFontTeamName('')
                      electronAPI?.deleteSetting('font_team')
                    }} className="text-red-500 text-xs">Hapus</button>
                  )}
                  {fontTeamName && <span className="text-xs text-gray-500 truncate max-w-[80px]">{fontTeamName}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 text-xs">Skor</span>
                  <input type="file" accept=".ttf" onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const dataUrl = await readFileAsDataURL(file)
                      setFontScore(dataUrl)
                      setFontScoreName(file.name)
                      electronAPI?.setSetting('font_score', dataUrl)
                    }
                  }} className="border p-1 text-xs flex-1" />
                  {fontScore && (
                    <button onClick={() => {
                      setFontScore('')
                      setFontScoreName('')
                      electronAPI?.deleteSetting('font_score')
                    }} className="text-red-500 text-xs">Hapus</button>
                  )}
                  {fontScoreName && <span className="text-xs text-gray-500 truncate max-w-[80px]">{fontScoreName}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 text-xs">Timer</span>
                  <input type="file" accept=".ttf" onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const dataUrl = await readFileAsDataURL(file)
                      setFontTimer(dataUrl)
                      setFontTimerName(file.name)
                      electronAPI?.setSetting('font_timer', dataUrl)
                    }
                  }} className="border p-1 text-xs flex-1" />
                  {fontTimer && (
                    <button onClick={() => {
                      setFontTimer('')
                      setFontTimerName('')
                      electronAPI?.deleteSetting('font_timer')
                    }} className="text-red-500 text-xs">Hapus</button>
                  )}
                  {fontTimerName && <span className="text-xs text-gray-500 truncate max-w-[80px]">{fontTimerName}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 text-xs">Footer</span>
                  <input type="file" accept=".ttf" onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const dataUrl = await readFileAsDataURL(file)
                      setFontFooter(dataUrl)
                      setFontFooterName(file.name)
                      electronAPI?.setSetting('font_footer', dataUrl)
                    }
                  }} className="border p-1 text-xs flex-1" />
                  {fontFooter && (
                    <button onClick={() => {
                      setFontFooter('')
                      setFontFooterName('')
                      electronAPI?.deleteSetting('font_footer')
                    }} className="text-red-500 text-xs">Hapus</button>
                  )}
                  {fontFooterName && <span className="text-xs text-gray-500 truncate max-w-[80px]">{fontFooterName}</span>}
                </div>
              </div>
            </div>

            {/* POPUP SOAL */}
            <div className="border-t pt-5">
              <label className="block font-semibold text-sm mb-2">Pengaturan Popup Soal</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-28 text-xs">Lebar (px)</span>
                  <input type="number" min="1" value={popupWidth}
                    onChange={(e) => { const v = parseInt(e.target.value) || 1; setPopupWidth(v); handleSetSetting('popup_width', v) }}
                    className="border p-1 text-xs w-20" />
                  <span className="w-28 text-xs ml-2">Tinggi (px)</span>
                  <input type="number" min="1" value={popupHeight}
                    onChange={(e) => { const v = parseInt(e.target.value) || 1; setPopupHeight(v); handleSetSetting('popup_height', v) }}
                    className="border p-1 text-xs w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-xs">Ukuran Font</span>
                  <input type="number" min="1" value={popupFontSize}
                    onChange={(e) => { const v = parseInt(e.target.value) || 1; setPopupFontSize(v); handleSetSetting('popup_font_size', v) }}
                    className="border p-1 text-xs w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-xs">Font Kustom</span>
                  <input type="file" accept=".ttf" onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const dataUrl = await readFileAsDataURL(file)
                      setPopupFont(dataUrl)
                      electronAPI?.setSetting('popup_font', dataUrl)
                    }
                  }} className="border p-1 text-xs flex-1" />
                  {popupFont && (
                    <button onClick={() => {
                      setPopupFont('')
                      electronAPI?.deleteSetting('popup_font')
                    }} className="text-red-500 text-xs">Hapus</button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-xs">Warna Teks</span>
                  <input type="color" value={popupTextColor}
                    onChange={(e) => { setPopupTextColor(e.target.value); handleSetSetting('popup_text_color', e.target.value) }}
                    className="border p-1 w-12 h-8" />
                  <span className="w-28 text-xs ml-2">Warna Opsi</span>
                  <input type="color" value={popupOptionColor}
                    onChange={(e) => { setPopupOptionColor(e.target.value); handleSetSetting('popup_option_color', e.target.value) }}
                    className="border p-1 w-12 h-8" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-xs">Bg Badge</span>
                  <input type="color" value={popupBadgeBgColor}
                    onChange={(e) => { setPopupBadgeBgColor(e.target.value); handleSetSetting('popup_badge_bg_color', e.target.value) }}
                    className="border p-1 w-12 h-8" />
                  <input type="number" min="0" max="100" value={popupBadgeOpacity}
                    onChange={(e) => { const v = Math.min(100, Math.max(0, parseInt(e.target.value) || 0)); setPopupBadgeOpacity(v); handleSetSetting('popup_badge_opacity', v) }}
                    className="border p-1 text-xs w-16" title="Opacity badge (%)" />
                  <span className="w-28 text-xs ml-2">Bg Opsi</span>
                  <input type="color" value={popupOptionBgColor}
                    onChange={(e) => { setPopupOptionBgColor(e.target.value); handleSetSetting('popup_option_bg_color', e.target.value) }}
                    className="border p-1 w-12 h-8" />
                  <input type="number" min="0" max="100" value={popupOptionBgOpacity}
                    onChange={(e) => { const v = Math.min(100, Math.max(0, parseInt(e.target.value) || 0)); setPopupOptionBgOpacity(v); handleSetSetting('popup_option_bg_opacity', v) }}
                    className="border p-1 text-xs w-16" title="Opacity opsi (%)" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-xs">Border</span>
                  <input type="color" value={popupBorderColor}
                    onChange={(e) => { setPopupBorderColor(e.target.value); handleSetSetting('popup_border_color', e.target.value) }}
                    className="border p-1 w-12 h-8" />
                  <input type="number" min="0" value={popupBorderWidth}
                    onChange={(e) => { const v = Math.max(0, parseInt(e.target.value) || 0); setPopupBorderWidth(v); handleSetSetting('popup_border_width', v) }}
                    className="border p-1 text-xs w-16" title="Ketebalan border (px)" />
                  <span className="w-28 text-xs ml-2">Shadow</span>
                  <input type="checkbox" checked={popupShadow}
                    onChange={(e) => { setPopupShadow(e.target.checked); handleSetSetting('popup_shadow', e.target.checked) }}
                    className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-xs">Font Badge</span>
                  <input type="file" accept=".ttf" onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const dataUrl = await readFileAsDataURL(file)
                      setPopupFontBadge(dataUrl)
                      electronAPI?.setSetting('popup_font_badge', dataUrl)
                    }
                  }} className="border p-1 text-xs flex-1" />
                  {popupFontBadge && (
                    <button onClick={() => {
                      setPopupFontBadge('')
                      electronAPI?.deleteSetting('popup_font_badge')
                    }} className="text-red-500 text-xs">Hapus</button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-xs">Font Soal</span>
                  <input type="file" accept=".ttf" onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const dataUrl = await readFileAsDataURL(file)
                      setPopupFontQuestion(dataUrl)
                      electronAPI?.setSetting('popup_font_question', dataUrl)
                    }
                  }} className="border p-1 text-xs flex-1" />
                  {popupFontQuestion && (
                    <button onClick={() => {
                      setPopupFontQuestion('')
                      electronAPI?.deleteSetting('popup_font_question')
                    }} className="text-red-500 text-xs">Hapus</button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-xs">Font Opsi</span>
                  <input type="file" accept=".ttf" onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const dataUrl = await readFileAsDataURL(file)
                      setPopupFontOption(dataUrl)
                      electronAPI?.setSetting('popup_font_option', dataUrl)
                    }
                  }} className="border p-1 text-xs flex-1" />
                  {popupFontOption && (
                    <button onClick={() => {
                      setPopupFontOption('')
                      electronAPI?.deleteSetting('popup_font_option')
                    }} className="text-red-500 text-xs">Hapus</button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-xs">Font Badge</span>
                  <input type="number" min="1" value={popupBadgeFontSize}
                    onChange={(e) => { const v = parseInt(e.target.value) || 1; setPopupBadgeFontSize(v); handleSetSetting('popup_badge_font_size', v) }}
                    className="border p-1 text-xs w-20" />
                  <span className="w-28 text-xs ml-2">Pad X</span>
                  <input type="number" min="0" value={popupBadgeBgPaddingX}
                    onChange={(e) => { const v = Math.max(0, parseInt(e.target.value) || 0); setPopupBadgeBgPaddingX(v); handleSetSetting('popup_badge_bg_padding_x', v) }}
                    className="border p-1 text-xs w-20" />
                  <span className="w-28 text-xs ml-2">Pad Y</span>
                  <input type="number" min="0" value={popupBadgeBgPaddingY}
                    onChange={(e) => { const v = Math.max(0, parseInt(e.target.value) || 0); setPopupBadgeBgPaddingY(v); handleSetSetting('popup_badge_bg_padding_y', v) }}
                    className="border p-1 text-xs w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-xs">Posisi Badge X</span>
                  <input type="number" value={popupBadgePosX}
                    onChange={(e) => { const v = parseInt(e.target.value) || 0; setPopupBadgePosX(v); handleSetSetting('popup_badge_pos_x', v) }}
                    className="border p-1 text-xs w-20" />
                  <span className="w-28 text-xs ml-2">Posisi Badge Y</span>
                  <input type="number" value={popupBadgePosY}
                    onChange={(e) => { const v = parseInt(e.target.value) || 0; setPopupBadgePosY(v); handleSetSetting('popup_badge_pos_y', v) }}
                    className="border p-1 text-xs w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-xs">Font Opsi</span>
                  <input type="number" min="1" value={popupOptionFontSize}
                    onChange={(e) => { const v = parseInt(e.target.value) || 1; setPopupOptionFontSize(v); handleSetSetting('popup_option_font_size', v) }}
                    className="border p-1 text-xs w-20" />
                  <span className="w-28 text-xs ml-2">Pad X</span>
                  <input type="number" min="0" value={popupOptionBgPaddingX}
                    onChange={(e) => { const v = Math.max(0, parseInt(e.target.value) || 0); setPopupOptionBgPaddingX(v); handleSetSetting('popup_option_bg_padding_x', v) }}
                    className="border p-1 text-xs w-20" />
                  <span className="w-28 text-xs ml-2">Pad Y</span>
                  <input type="number" min="0" value={popupOptionBgPaddingY}
                    onChange={(e) => { const v = Math.max(0, parseInt(e.target.value) || 0); setPopupOptionBgPaddingY(v); handleSetSetting('popup_option_bg_padding_y', v) }}
                    className="border p-1 text-xs w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-xs">Posisi Opsi X</span>
                  <input type="number" value={popupOptionPosX}
                    onChange={(e) => { const v = parseInt(e.target.value) || 0; setPopupOptionPosX(v); handleSetSetting('popup_option_pos_x', v) }}
                    className="border p-1 text-xs w-20" />
                  <span className="w-28 text-xs ml-2">Posisi Opsi Y</span>
                  <input type="number" value={popupOptionPosY}
                    onChange={(e) => { const v = parseInt(e.target.value) || 0; setPopupOptionPosY(v); handleSetSetting('popup_option_pos_y', v) }}
                    className="border p-1 text-xs w-20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Background Warna Solid</label>
                  <input type="color" value={popupBgColor}
                    onChange={(e) => { setPopupBgColor(e.target.value); handleSetSetting('popup_bg_color', e.target.value) }}
                    className="border p-1 w-full h-9" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Background Gambar</label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const dataUrl = await readFileAsDataURL(file)
                          setPopupBgImage(dataUrl)
                          electronAPI?.setSetting('popup_bg_image', dataUrl)
                        }
                      }}
                      className="border p-2 text-sm flex-1"
                    />
                    {popupBgImage && (
                      <button onClick={() => {
                        setPopupBgImage('')
                        electronAPI?.deleteSetting('popup_bg_image')
                      }} className="bg-red-500 text-white px-2 py-1 text-sm rounded">Hapus</button>
                    )}
                  </div>
                  {popupBgImage && <img src={popupBgImage} className="h-12 mt-1 object-contain" alt="preview" />}
                </div>
              </div>
            </div>

          </div>
      </div>
      )}

      </>)}
    </div>
  )
}

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
