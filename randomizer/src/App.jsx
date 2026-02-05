import { useState } from 'react'
import './App.css'
import './components/ExcelReader'
import ExcelReader from './components/ExcelReader'

function App() {
  const [studentNum, setStudentNum] = useState(0)
  const [present, setPresent] = useState(0)
  const [excelData, setExcelData] = useState(null)
const handleNewStudentNum = (event) => {
  setStudentNum(event.target.value)
}
const handlePresent = (event) => {
  setPresent(event.target.value)
}
const randomizer = (event) => {
  event.preventDefault()
  for(let i = 0; i < present; i++){
  console.log(excelData[Math.floor(Math.random()) * 2].names)
  }
}
  return (
    <div>
    <form>
      <ExcelReader excelData={excelData} setExcelData={setExcelData}/>
      <input value = {studentNum} onChange = {handleNewStudentNum} />
      <input value = {present} onChange = {handlePresent} />
    </form>
    
      <button onClick={randomizer} type = "submit"> Randomize </button>
    <p>
      hello
    </p>
    </div>
  )
}

export default App
