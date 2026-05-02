import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header/header'
import Footer from './components/Footer/Footer'
import HotelCard from './components/Hotel/hotel'
import ReservationsMain from './pages/ReservationsMain/ReservationsMain'
import ClientsPage from './pages/ClientsPage/ClientsPage'
import LoginPage from './pages/LoginPage/LoginPage'
import ToursPage from './pages/ToursPage/ToursPage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
        <div>
          <Header />
          <Routes>
              <Route path="/" element={<ReservationsMain />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<ReservationsMain />} />
              <Route path="/hotels" element={<HotelCard />} />
              <Route path="/tours" element={<ToursPage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
  );
  
}

export default App
