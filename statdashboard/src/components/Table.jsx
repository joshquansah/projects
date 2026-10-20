import teamColors from '../services/teamColors';

const formatHeader = (value) =>
  String(value)
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatCell = (value) => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(2);
  }

  return String(value);
};

const isNumericColumn = (value) =>
  typeof value === 'number' || (typeof value === 'string' && /^-?\d+(?:\.\d+)?$/.test(value.trim()));

const Table = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="empty-state">No data available for this season.</p>;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => {
              const isNumeric = isNumericColumn(data[0][column]);

              return (
                <th key={column} className={isNumeric ? 'numeric-cell' : ''}>
                  {formatHeader(column)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={`${index}-${row.team || row.name || 'row'}`}>
              {columns.map((column) => {
                const isNumeric = isNumericColumn(row[column]);
                const colKey = String(column).toLowerCase();

                // Detect team/name columns to render with club color
                const isTeamCol = colKey.includes('team') || colKey.includes('name');

                if (isTeamCol) {
                  const teamName = formatCell(row[column]);
                  const teamColor = teamColors[teamName] || 'transparent';
                  // Require explicit position field; do not fall back to index to avoid mislabeling zones
                  const position = Number(row.position ?? row.pos ?? row.rank);

                  // Determine left border zone color by position
                  let zoneColor = 'transparent';
                  if (!Number.isNaN(position)) {
                    if (position >= 1 && position <= 4) zoneColor = 'var(--pl-cyan)';
                    else if (position === 5) zoneColor = 'var(--pl-accent)';
                    else if (position >= 18) zoneColor = 'var(--pl-red)';
                  }

                  return (
                    <td key={`${column}-${index}`} className={isNumeric ? 'numeric-cell team-cell' : 'team-cell'}>
                      <div className="team-row" style={{ borderLeftColor: zoneColor }}>
                        <span className="team-badge" style={{ background: teamColor }} aria-hidden />
                        <span className="team-name">{teamName}</span>
                      </div>
                    </td>
                  );
                }

                return (
                  <td key={`${column}-${index}`} className={isNumeric ? 'numeric-cell' : ''}>
                    {formatCell(row[column])}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;