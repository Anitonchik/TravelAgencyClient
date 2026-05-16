import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header/header'
import Footer from './components/Footer/Footer'
import ReservationsMain from './pages/ReservationsMain/ReservationsMain'
import ClientsPage from './pages/ClientsPage/ClientsPage'
import LoginPage from './pages/LoginPage/LoginPage'
import ToursPage from './pages/ToursPage/ToursPage'
import FlightReservation from './pages/Reservation/FlightReservation/FlightReservation'
import TourDetailsPage from './pages/Reservation/TourDetails/TourDetails'
import HotelReservation from './pages/Reservation/HotelReservation/HotelReservation'
import SummaryReservation from './pages/Reservation/SummaryReservation/SummaryReservation'

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
              <Route path="/tours" element={<ToursPage />} />
              <Route path="/tour" element={<TourDetailsPage />} />
              <Route path="/flights" element={<FlightReservation />} />
              <Route path="/hotels" element={<HotelReservation />} />
              <Route path="/summary-reservation" element={<SummaryReservation />}/>
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
  );
  
}

export default App
