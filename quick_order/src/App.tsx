// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useState, useEffect } from 'react'

// import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import LoginPage from './page/login/LoginPage';
import HomePage from './page/home/HomePage';
import MenuPage from './page/menu/MenuPage';
import "./i18n/i18n";
import OrderRecordRecentHours from './page/record/OrderRecordRecentHours';
import CategoryStatistic from './page/statistic/CategoryStatistic';
import ThermalPrinters from './page/miscellaneous/ThermalPrinters';

function Navigation() {

  const location = useLocation();
  // Only show navigation on home page
  if (location.pathname !== '/') return null;
  return (
    <nav className="main-nav">
      <Link to="/menu" className="menu-button">
        Go to Menu
      </Link>
    </nav>
  );
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    console.log('App component mounted')
    setIsLoaded(true)
  }, [])

  return (
    <Router>
      <div className="App">
        <Navigation />
        <main>
          {isLoaded ? (
            <Routes>
              {/* <Route path="/" element={<Navigate to="/menu" replace />} /> */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/order-records/hours/:hours" element={<OrderRecordRecentHours />} />
              <Route path="/category-statistics/:date" element={<CategoryStatistic />} />
              <Route path="/thermal-printers" element={<ThermalPrinters />} />
            </Routes>
          ) : (
            <div>Loading...</div>
          )}
        </main>
      </div>
    </Router>
  )
}

export default App
