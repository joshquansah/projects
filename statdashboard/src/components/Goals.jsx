import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  ResponsiveContainer,
} from 'recharts';

import Table from './Table';
import teamColors from '../services/teamColors';

const formatChartValue = (value) => {
  if (typeof value === 'number') return value.toLocaleString();
  return value;
};

const Goals = ({ goals, isAnimationActive }) => {
  const chartSets = [
    {
      title: 'Goals scored',
      dataKey: 'Goals Scored',
      color: '#2ec5a6',
      data: goals?.['Goals Scored'] || [],
    },
    {
      title: 'Goals conceded',
      dataKey: 'Goals Conceded',
      color: '#ff6b6b',
      data: goals?.['Goals Conceded'] || [],
    },
  ];

  const CustomBarShape = (props) => {
    const { x, y, width, height, payload } = props;
    const fillColor = teamColors[payload.team] || 'var(--pl-accent)';
    return <rect x={x} y={y} width={width} height={height} fill={fillColor} rx={6} />;
  };

  if (!goals || Object.keys(goals).length === 0) {
    return <p className="empty-state">No goal data available for this season.</p>;
  }

  return (
    <div className="goal-section">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Scoring metrics</p>
          <h2>Goal analysis</h2>
        </div>
      </div>

      <div className="chart-stack">
        {chartSets.map((chart) => (
          <div className="chart-card" key={chart.dataKey}>
            <h3>{chart.title}</h3>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chart.data} margin={{ top: 8, right: 8, left: -24, bottom: 8 }}>
                      <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis
                        dataKey="team"
                        interval={0}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'var(--pl-text-soft)', fontSize: 12, fontFamily: 'Albert Sans', fontWeight: 600, letterSpacing: '0em' }}
                      />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--pl-text-soft)', fontSize: 12, fontFamily: 'Albert Sans', fontWeight: 600 }} allowDecimals={false} />
                  <Tooltip
                    formatter={formatChartValue}
                    contentStyle={{
                        background: 'var(--pl-surface-2)',
                        border: '1px solid var(--pl-border)',
                        borderRadius: '12px',
                        color: 'var(--pl-text)',
                    }}
                  />
                  <Bar
                    dataKey={chart.dataKey}
                      fill={chart.color}
                      radius={[8, 8, 0, 0]}
                      barSize={18}
                    shape={CustomBarShape}
                    isAnimationActive={isAnimationActive}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div className="mini-table-grid">
        <div className="mini-table-wrap">
          <h3>Goals ratio</h3>
          <Table data={goals['Goals Ratio'] || []} />
        </div>
        <div className="mini-table-wrap">
          <h3>Goals per game</h3>
          <Table data={goals['Goals per Game'] || []} />
        </div>
        <div className="mini-table-wrap">
          <h3>Clean sheets</h3>
          <Table data={goals['Clean Sheets'] || []} />
        </div>
      </div>
    </div>
  );
};

export default Goals;