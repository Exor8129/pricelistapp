import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FixedTable from './pages/table/table'
import Temp from './pages/temp/temp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <FixedTable/> */}
      <Temp/>
    </>
  )
}

export default App
