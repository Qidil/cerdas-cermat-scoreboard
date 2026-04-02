import { Routes, Route } from 'react-router-dom'

function Display() {
  return <h1>DISPLAY SCREEN</h1>
}

function Control() {
  return <h1>CONTROL PANEL</h1>
}

function App() {
  return (
    <Routes>
      <Route path="/display" element={<Display />} />
      <Route path="/control" element={<Control />} />
    </Routes>
  )
}

export default App