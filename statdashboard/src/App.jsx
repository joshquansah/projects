import { useState } from 'react'
import { useEffect } from 'react'
import api from './services/api'
import Selector from './components/Selector'
import Table from './components/Table'
import Goals from './components/Goals'
import './App.css'

function App() {
  const [season, setSeason] = useState('')
  const [seasonDisplay, setSeasonDisplay] = useState('')
  const [table, setTable] = useState([])
  const [goals, setGoals] = useState([])
  const [homeaway, setHomeaway] = useState([])
  const [form, setForm] = useState([])
  const [patterns, setPatterns] = useState([])
  useEffect(() => {console.log(season)
    if (!season) return

    api.getTable(season).then(table => setTable(table))
    api.getGoals(season).then(goals => setGoals(goals))
    api.getHomeAway(season).then(homeaway => setHomeaway(homeaway))
    api.getForm(season).then(form => setForm(form))
    api.getPatterns(season).then(patterns => setPatterns(patterns))
  },
     [season])
  
    
  const options = [
    {label: "2022", value: "22-23"},
    {label: "2023", value: "23-24"},
    {label: "2024", value: "24-25"},
  ]

  const handleSeason = (e) =>
    {
      const selected = options.find(o => o.value === e.target.value)
     setSeasonDisplay(e.target.value)
      setSeason(selected.label) 
     
    } 
  return (
    <>
      <h1>Premier League Match Stats</h1>
      <Selector options={options} onChange={handleSeason} value={seasonDisplay} />
      <h1>League Table</h1>
      <Table data={table} />
      <h1>Goal Stats</h1>
      <Goals goals={goals} isAnimationActive={true}/>
      <h1>Home vs Away</h1>
      <Table data={homeaway} />
      <h1>Form</h1>
      <Table data={form} />
      <h1>Match patterns</h1>
      <h2>Goals by Matchwek</h2>
      <Table data={patterns.goals_by_matchweek} />
      <h2>Common scorelines</h2>
      <Table data={patterns.common_scorelines} />
      <h2>Total Draws</h2>
      <p>{patterns.total_draws}</p>
    </>
  )
}

export default App
