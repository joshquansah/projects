import Table from './Table'

const Goals = ({goals}) => {
    if(!goals) return <p>No year selected</p>

    return(
        <div>
        <h2>Goals Scored</h2>
      <Table data={goals["Goals Scored"]} />
      <h2>Goals Conceded</h2>
      <Table data={goals["Goals Conceded"]} />
      <h2>Goals Ratio</h2>
      <Table data={goals["Goals Ratio"]} />
      <h2>Goals per Game</h2>
      <Table data={goals["Goals per Game"]} />
      <h2>Clean Sheets</h2>
      <Table data={goals["Clean Sheets"]} />
      </div>
    )
    
}
export default Goals