import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const ExcelReader = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data.xls")
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const maxCols = Math.max(...jsonData.map(row => row.length));
        const normalizedData = jsonData.map(row => {
          const newRow = [...row];
          while (newRow.length < maxCols) newRow.push('');
          return newRow;
        });

        setData(normalizedData);
      })
      .catch(error => {
        console.error("Error reading Excel file:", error);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Excel File Viewer</h2>
      <table border="1" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '8px' }}>{cell || ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelReader;
