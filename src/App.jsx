import { useState } from 'react'
import React from 'react'
import DarkModeToggle from './components/DarkModeToggle'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Profile from './components/Profile'
import OverallDeals from './Pages/OverallDeals'
import LastTransactions from './Pages/LastTransactions'
import TeamsPage from './Pages/Teams'
import AgentRanking from './Pages/AgentRanking'
import MainPage from './Pages/MainPage'
import './App.css'

import { ThemeProvider } from './context/ThemeContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <Router>

    <ThemeProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar toggleProfile={toggleProfile} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <Routes>
                <Route path="/deals" element={<OverallDeals />} />
                <Route path="/transactions" element={<LastTransactions />} />
                <Route path="/team" element={<TeamsPage />} />
                <Route path="/ranking" element={<AgentRanking />} />
                <Route path="/*" element={<MainPage />} />
                
              </Routes>
            {/* Your page content goes here */}
          </main>
        </div>
        {isProfileOpen && <Profile onClose={toggleProfile} />}
      </div>
    </ThemeProvider>
    </Router>
  )
}

export default App