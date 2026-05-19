import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header/header'
import Footer from './components/Footer/Footer'
import ReservationsMain from './pages/ReservationsMain/ReservationsMain'
import ReservationDetails from './pages/ReservationDetailsPage/ReservationDetailsPage'
import ClientsPage from './pages/ClientsPage/ClientsPage'
import LoginPage from './pages/LoginPage/LoginPage'
import ToursPage from './pages/ToursPage/ToursPage'
import FlightReservation from './pages/Reservation/FlightReservation/FlightReservation'
import TourDetailsPage from './pages/Reservation/TourDetails/TourDetails'
import HotelReservation from './pages/Reservation/HotelReservation/HotelReservation'
import SummaryReservation from './pages/Reservation/SummaryReservation/SummaryReservation'
import VoucherDisplay from './pages/Reservation/VoucherDisplay/VoucherDisplay'
import NewClientPage from './pages/NewClientPage/NewClientPage'
import ClientDetailsPage from './pages/ClientDetailsPage/ClientDetailsPage'
import ManagerProfile from './pages/ManagerProfilePage/ManagerProfilePage'
import EditManagerPage from './pages/EditManagerPage/EditManagerPage'

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
              <Route path="/voucher" element={<VoucherDisplay />}/>
              <Route path="/clients/create" element={<NewClientPage />}/>
              <Route path="/client" element={<ClientDetailsPage />}/>
              <Route path="/manager/profile" element={<ManagerProfile />}/>
              <Route path="/manager/edit" element={<EditManagerPage />}/>
              <Route path="/reservation" element={<ReservationDetails />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
  );
  
}

export default App
