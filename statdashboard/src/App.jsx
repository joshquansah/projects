import { useEffect, useMemo, useState } from 'react';
import api from './services/api';
import Selector from './components/Selector';
import Table from './components/Table';
import Goals from './components/Goals';
import './App.css';

const options = [
  { label: '2022/23', value: '2022' },
  { label: '2023/24', value: '2023' },
  { label: '2024/25', value: '2024' },
];

function App() {
  const [season, setSeason] = useState('2022');
  const [seasonDisplay, setSeasonDisplay] = useState('2022');
  const [table, setTable] = useState([]);
  const [goals, setGoals] = useState({});
  const [homeaway, setHomeaway] = useState([]);
  const [form, setForm] = useState([]);
  const [patterns, setPatterns] = useState({
    goals_by_matchweek: [],
    common_scorelines: [],
    total_draws: 0,
  });

  useEffect(() => {
    if (!season) return undefined;

    let active = true;

    Promise.all([
      api.getTable(season),
      api.getGoals(season),
      api.getHomeAway(season),
      api.getForm(season),
      api.getPatterns(season),
    ])
      .then(([tableData, goalsData, homeAwayData, formData, patternsData]) => {
        if (!active) return;

        setTable(Array.isArray(tableData) ? tableData : []);
        setGoals(goalsData || {});
        setHomeaway(Array.isArray(homeAwayData) ? homeAwayData : []);
        setForm(Array.isArray(formData) ? formData : []);
        setPatterns(patternsData || {
          goals_by_matchweek: [],
          common_scorelines: [],
          total_draws: 0,
        });
      })
      .catch((error) => {
        console.error('Unable to fetch football stats', error);
        if (active) {
          setTable([]);
          setGoals({});
          setHomeaway([]);
          setForm([]);
          setPatterns({
            goals_by_matchweek: [],
            common_scorelines: [],
            total_draws: 0,
          });
        }
      });

    return () => {
      active = false;
    };
  }, [season]);

  const summaryCards = useMemo(() => {
    const leader = Array.isArray(table) && table.length > 0 ? table[0] : null;
    const scoringChart = goals['Goals Scored'] || [];
    const topScorer = scoringChart.length > 0 ? scoringChart[0] : null;
    const homeStats = Array.isArray(homeaway) && homeaway.length > 0 ? homeaway[0] : null;

    return [
      {
        label: 'League leader',
        value: leader?.team || '—',
        detail: leader ? `${leader.points ?? 0} pts` : 'Awaiting data',
      },
      {
        label: 'Top attack',
        value: topScorer ? `${topScorer['Goals Scored'] ?? 0}` : '—',
        detail: topScorer ? topScorer.team : 'Awaiting data',
      },
      {
        label: 'Home goals',
        value: homeStats ? `${homeStats.home_goals ?? 0}` : '—',
        detail: homeStats ? homeStats.team || 'Home split' : 'Awaiting data',
      },
    ];
  }, [table, goals, homeaway]);

  const handleSeason = (event) => {
    const selected = options.find((option) => option.value === event.target.value) || null;
    const nextValue = selected ? selected.value : '';
    setSeasonDisplay(nextValue);
    setSeason(nextValue);
  };

  return (
    <div className="premier-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">PL</div>
          <div>
            <p className="eyebrow">Official season analysis</p>
            <h1>Premier League match stats</h1>
          </div>
        </div>

        <Selector options={options} onChange={handleSeason} value={seasonDisplay} />
      </header>

      <main className="dashboard-grid">
        <section className="panel hero-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Season overview</p>
              <h2>Current table pulse</h2>
            </div>
            <span className="dashboard-tag">{seasonDisplay || 'Select season'}</span>
          </div>

          <div className="stats-grid">
            {summaryCards.map((card) => (
              <article key={card.label} className="stat-card">
                <span className="stat-label">{card.label}</span>
                <strong>{card.value}</strong>
                <small>{card.detail}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="panel table-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">League table</p>
              <h2>Standings</h2>
            </div>
          </div>
          <Table data={table} />
        </section>

        <section className="panel chart-panel">
          <Goals goals={goals} isAnimationActive />
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Home vs away</p>
              <h2>Performance split</h2>
            </div>
          </div>
          <Table data={homeaway} />
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Form tracker</p>
              <h2>Recent form</h2>
            </div>
          </div>
          <Table data={form} />
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Match patterns</p>
              <h2>Goals by matchweek</h2>
            </div>
          </div>
          <Table data={patterns.goals_by_matchweek || []} />
        </section>

        <section className="panel pattern-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Pattern analysis</p>
              <h2>Scorelines & draws</h2>
            </div>
          </div>

          <div className="pattern-grid">
            <div className="mini-table-wrap">
              <Table data={patterns.common_scorelines || []} />
            </div>

            <div className="draw-summary">
              <span>Total draws</span>
              <strong>{patterns.total_draws ?? 0}</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
