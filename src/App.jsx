import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header/header'
import HotelCard from './components/Hotel/hotel'
import ReservationsMain from './pages/ReservationsMain/ReservationsMain'
import ClientsPage from './pages/ClientsPage/ClientsPage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
        <div>
          <Routes>
              <Route path="/" element={<ReservationsMain />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="*" element={<ReservationsMain />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
  
}

export default App
