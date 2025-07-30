import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Home } from './pages/Home'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/:token" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

