import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import MapGrid from './components/MapGrid'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapGrid />} />
      </Routes>
    </Router>
  )
}

export default App
