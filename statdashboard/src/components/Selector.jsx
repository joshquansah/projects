const Selector = ({ options, onChange, value }) => {
  return (
    <div className="season-selector">
      <label htmlFor="seasons">Season</label>
      <select id="seasons" onChange={onChange} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selector;