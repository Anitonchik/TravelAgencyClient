import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Header from './components/Header/header'
import HotelCard from './components/Hotel/hotel'
import ReservationsMain from './pages/ReservationsMain/ReservationsMain'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <ReservationsMain />
    </div>
  );
  
}

export default App
