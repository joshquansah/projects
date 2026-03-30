import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';

import Table from './Table'

const Goals = ({goals, isAnimationActive}) => {
  const premierLeagueColors = {
  "Arsenal": "#EF0107",            // Red 
  "Aston Villa": "#95BFE5",         // Light Blue / claret and blue
  "Bournemouth": "#DA291C",        // Red 
  "Brentford": "#E30613",          // Red 
  "Brighton": "#0057B8",           // Blue 
  "Burnley": "#6C1D45",
  "Chelsea": "#034694",            // Blue 
  "Crystal Palace": "#1B458F",      // Blue & red 
  "Everton": "#003399",            // Blue 
  "Fulham": "#000000",             // Black & white 
  "Ipswich": "#0055A4",
  "Leeds": "#FFCC00",        // White & blue trim 
  "Leicester": "#003090",      // Blue 
  "Liverpool": "#C8102E",          // Red 
  "Luton": "#F26522",
  "Manchester City": "#6CABDD",     // Sky blue 
  "Manchester United": "#DA020E",   // Red 
  "Newcastle": "#000000",    // Black & white stripes 
  "Nottingham Forest": "#E00017",   // Red 
  "Sheffield Utd": "#EE2737",
  "Southampton": "#FF0000",        // Red & white stripes 
  "Tottenham": "#132257",   // Navy 
  "West Ham": "#7A263A",      // Claret 
  "Wolves": "#FDB913"              // Old gold 
};
const CustomBarShape = (props) => {
  const { x, y, width, height, payload } = props;
  const fillColor = premierLeagueColors[payload.team] || "#8884d8";
  return <rect x={x} y={y} width={width} height={height} fill={fillColor} />;
};
    if(!goals) return <p>No year selected</p>

    return(
        <div>
        <h2>Goals Scored</h2>
      <BarChart style={{ width: '100%', maxWidth: '800px', maxHeight: '70vh', aspectRatio: 1.618 }} 
        responsive data={goals["Goals Scored"]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="team" tick={false} label={{ value: "Teams", position: "insideTop", offset: 10 }} />
        <YAxis width="auto" label={{ value: "Goals", angle: -90, position: "insideLeft", offset: 10 }}/>
        <Tooltip />
        <Legend />
        <Bar dataKey="Goals Scored" shape={CustomBarShape} isAnimationActive={isAnimationActive} />
      </BarChart>
      <h2>Goals Conceded</h2>
      <BarChart style={{ width: '100%', maxWidth: '800px', maxHeight: '70vh', aspectRatio: 1.618 }} 
        responsive data={goals["Goals Conceded"]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="team" tick={false} label={{ value: "Teams", position: "insideTop", offset: 10 }}/>
        <YAxis width="auto" label={{ value: "Goals", angle: -90, position: "insideLeft", offset: 10 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Goals Conceded" shape={CustomBarShape} isAnimationActive={isAnimationActive} />
      </BarChart>
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