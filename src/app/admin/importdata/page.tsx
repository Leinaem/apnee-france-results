"use client"
import { useState, useEffect } from "react";
import Papa from "papaparse";
import { v4 as uuidv4 } from 'uuid';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../../lib/database/ddbDocClient";
import { fetchTableList, getDatabasAttributes } from "../../../../lib/database/dbutils";
import databaseAttributes from './databaseAttributes.json'

const ImportData = () => {
  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);
  const [tableList, setTableList] = useState<string[]>([]);
  const [tableAttributes, setTableAttributes] = useState({});
  const [tableRows, setTableRows] = useState([]);
  const [values, setValues] = useState([]);
  const [selectedTable, setSelectedTable] = useState<string>('');

  console.log('parsedData', parsedData);

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa?.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });
        setParsedData(results.data);
        setTableRows(rowsArray[0]);
        setValues(valuesArray);
      },
    });
  };

  const getTableList = async () => {
    const fetchedTableList = (await fetchTableList()) || [];
    const filteredTableList = fetchedTableList.filter((tableName) => databaseAttributes.hasOwnProperty(tableName));
    setTableList(filteredTableList);
  };

  // Get tables and attributes. LOCAL
  const getTableAttributes = () => {
    setTableAttributes(databaseAttributes[selectedTable]);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      parsedData.forEach(async (item) => {
        const { compId } = item;
        const params = {
          TableName: selectedTable,
          Item: {
            ...item,
          },
          ConditionExpression:'attribute_not_exists(id)'
        };
        console.log('params : ', params);
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("Success - item added", data);

      });
      
      alert("Les données ont été importées avec succes.");
      setParsedData([]);
      setSelectedTable('');

    } catch (err) {
      console.log("Error", err.stack);
    }
  };
  
  useEffect(() => {
    if (Object.keys(databaseAttributes).length) {
      getTableList();
    }
  }, []);
  
  useEffect(() => {
    getTableAttributes();
  }, [selectedTable]);

  return (
    <div>
      <h2>Importer des données.</h2>
      <form onSubmit={handleSubmit} id="addData-form">
        <select
          id="tableList"
          onChange={(e) => {
            setSelectedTable(e.target.value);
          }}
          value={selectedTable}
        >
          <option value="">Choisissez une table</option>
          {tableList.map((tableName, i) => {
            return (
              <option key={i} value={tableName}>
                {tableName}
              </option>
            );
          })}
        </select>

        {
          selectedTable && (
            <>
              <input
                type="file"
                name="file"
                onChange={changeHandler}
                accept=".csv"
              />
            {Boolean(parsedData.length) && (
              <button type="submit">
                Submit
              </button>
            )}

              <table>
                <thead>
                  <tr>
                    {Boolean(tableAttributes?.length) && tableAttributes.map((attr) => <th key={attr.name}>{attr.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.map((val, i) => {
                    return (
                      <tr key={i}>
                        {tableAttributes.map((attr) => {
                          return (
                            <td key={attr.name}>{val[attr.name]}</td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </>
          )
        }

      </form>
      <br />
      {/* Table */}
    </div>
  );
}

export default ImportData;