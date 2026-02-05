import * as XLSX from 'xlsx';

const ExcelReader = ({excelData, setExcelData}) => {
  
 
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const binaryString = e.target.result;
    const workbook = XLSX.read(binaryString, { type: 'binary' });

    // Get the first worksheet name
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet data to a JSON array of objects
    const json1Data = XLSX.utils.sheet_to_json(worksheet);

    setExcelData(json1Data);
    console.log(json1Data); // Your Excel data as JSON
  };

  reader.readAsBinaryString(file);
};

return (
  <div>
    <h2>Upload Excel File</h2>
    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
    
{excelData && (
  <table>
    <thead>
      <tr>
        {Object.keys(excelData[0]).map((key) => (
          <th key={key}>{key}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {excelData.map((row, index) => (
        <tr key={index}>
          {Object.values(row).map((value, i) => (
            <td key={i}>{String(value)}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)}

  </div>
);

  
}

export default ExcelReader;
