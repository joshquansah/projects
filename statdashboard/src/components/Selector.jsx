const Selector = ({options, onChange, value}) => {

    return(
    <div>
      <label htmlFor="seasons"> Choose a season:</label>
      <input list="season-options" id="seasons" onChange={onChange} value={value}/>
      <datalist id = "season-options">
        {options.map((option) => 
        <option key = {option.label} value = {option.value}></option>
        )
        }
      </datalist>
    </div>
    )
}
export default Selector