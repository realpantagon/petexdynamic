import axios from "axios";
import { useState, useEffect } from "react";

const currencyOrder = [
  "US Dollar $50-100",
  "US Dollar $5-20",
  "US Dollar $1",
  "Euro",
  "Japanese Yen",
  "British Pound",
  "Singapore Dollar",
  "Australian Dollar",
  "Swiss Franc",
  "Hong Kong Dollar",
  "Canadian Dollar",
  "New Zealand Dollar",
  "Swedish Krona",
  "Taiwan Dollar",
  "Norwegian Krone",
  "Malaysian Ringgit",
  "Chinese Yuan Renminbi",
  "South Korean Won",
];

export default function ExchangeTable() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchDataFromAirtable();
    const intervalId = setInterval(fetchDataFromAirtable, 60000); // 60000 ms = 1 minute

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const fetchDataFromAirtable = async () => {
    try {
      const response = await axios.get('https://api.airtable.com/v0/appXvdgNSlqDP9QwS/Table%201', {
        headers: {
          Authorization: 'Bearer patJrmzFDvT8Qncac.657ccc7a50caaebd1e4a3a390acca8e67d06047dd779d5726b602d4febe8e383',
        },
      });

      const records = response.data.records;
      const currencyIndices = {};
      currencyOrder.forEach((currency, index) => {
        currencyIndices[currency.trim().toLowerCase()] = index;
      });

      const formattedData = records
      .map((record) => [
          (record.fields.Flags && record.fields.Flags[0] && record.fields.Flags[0].url) || "", // Check if Flags and its first element exist before accessing url
          record.fields.Cur,
          record.fields.Currency ? record.fields.Currency.trim() : "", // Check if Currency exists before trimming
          record.fields.Rate,
      ])
      .sort((a, b) => currencyIndices[(a[2] || "").trim().toLowerCase()] - currencyIndices[(b[2] || "").trim().toLowerCase()]);
  

      setTableData(formattedData);
    } catch (error) {
      console.error('Error fetching data from Airtable:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="PeterExchange">PETER EXCHANGE</h1>
      <table>
        <thead>
          <tr style={{ backgroundColor: "navy" }}>
            <th style={{ backgroundColor: "#B0DAFF" }}></th>
            <th style={{ fontSize: "50px", color: "navy", backgroundColor: "#B0DAFF" }}></th>
            <th style={{ fontSize: "50px", color: "navy", backgroundColor: "#B0DAFF" }}>Currency</th>
            <th style={{ fontSize: "50px", color: "navy", backgroundColor: "#B0DAFF" }}>Rate</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>
                <img src={row[0]} alt={row[2]} className="flag" style={{ width: "60px", height: "60px" }} />
              </td>
              <td style={{ fontSize: "50px" }}>{row[1]}</td>
              <td style={{ fontSize: "35px" }}>{row[2]}</td>
              <td style={{ fontSize: "50px" }}>{row[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
