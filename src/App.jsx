import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header/header'
import Footer from './components/Footer/Footer'
import ProtectedRoute from './components/ProtectedRoute'

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
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          {/* Публичный маршрут - доступен без авторизации */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Защищённые маршруты - требуют авторизации */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <ReservationsMain />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/clients" 
            element={
              <ProtectedRoute>
                <ClientsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/tours" 
            element={
              <ProtectedRoute>
                <ToursPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/tour" 
            element={
              <ProtectedRoute>
                <TourDetailsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/flights" 
            element={
              <ProtectedRoute>
                <FlightReservation />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/hotels" 
            element={
              <ProtectedRoute>
                <HotelReservation />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/summary-reservation" 
            element={
              <ProtectedRoute>
                <SummaryReservation />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/voucher" 
            element={
              <ProtectedRoute>
                <VoucherDisplay />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/clients/create" 
            element={
              <ProtectedRoute>
                <NewClientPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/client" 
            element={
              <ProtectedRoute>
                <ClientDetailsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/profile" 
            element={
              <ProtectedRoute>
                <ManagerProfile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/edit" 
            element={
              <ProtectedRoute>
                <EditManagerPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/reservation" 
            element={
              <ProtectedRoute>
                <ReservationDetails />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 - любая другая страница - перенаправляем на главную */}
          <Route path="*" element={<ReservationsMain />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App