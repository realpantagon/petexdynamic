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
    <div className="h-screen">
      <h1 className="text-3xl md:text-md lg:text-3xl text-center font-bold">PETER EXCHANGE</h1>
      <table className="w-full h-full">
        <thead>
          <tr className="bg-navy">
            <th className=""></th>
            <th className="text-2xl md:text-md lg:text-2xl"></th>
            <th className="text-2xl md:text-md lg:text-2xl text-left">Currency</th>
            <th className="text-2xl md:text-md lg:text-2xl">Rate</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>
                <img src={row[0]} alt={row[2]} className="w-12" />
              </td>
              <td className="text-2xl md:text-md lg:text-2xl">{row[1]}</td>
              <td className="text-2xl md:text-md lg:text-2xl">{row[2]}</td>
              <td className="text-4xl md:text-md lg:text-4xl">{row[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
