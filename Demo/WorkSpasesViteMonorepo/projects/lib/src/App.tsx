import { useState } from 'react'
import './App.css'
import Button from './components/Button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Button children="aaaa" />
    </div>
  )
}

export default App
