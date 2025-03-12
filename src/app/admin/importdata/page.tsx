"use client"
import { useState, useEffect } from "react";
import Papa from "papaparse";

// Utils
import { fetchTableList, addMultiData, scanTable } from "../../../../lib/database/dbutils";

// Components
import InputSelect from "@/app/components/partials/inputSelect";

// Types
import { AttributesType, DatabaseAttributesType } from "@/app/type/database";
import { GenericStringIndex } from "@/app/type/generic";

// Others
import databaseAttributes from './databaseAttributes.json';

const ImportData = () => {
  const [parsedData, setParsedData] = useState<GenericStringIndex[]>([]);
  const [tableList, setTableList] = useState<GenericStringIndex[]>([]);
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [competitionList, setCompetitionList] = useState<GenericStringIndex[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement >) => {
    if (!event.target.files) {
      return;
    }
    Papa?.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results: {data: GenericStringIndex[]}) {
        setParsedData(results.data);
      },
    });
  };

  const getTableList = async () => {
    const fetchedTableList = (await fetchTableList()) || [];
    console.log('fetchedTableList', fetchedTableList);
    const filteredTableList = fetchedTableList
      .filter((tableName) => databaseAttributes.hasOwnProperty(tableName))
      .map((tableName) => ({label: tableName}))
    setTableList(filteredTableList);
  };

  const getTableAttributes = () => {
    const databaseAttributesObj:DatabaseAttributesType = databaseAttributes;
    const dataAttributesProperty = selectedTable;
    const tableAttributes = databaseAttributesObj[dataAttributesProperty as keyof DatabaseAttributesType];
    setTableAttributes(tableAttributes);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addMultiData(selectedTable, parsedData);
    setParsedData([]);
    setSelectedTable('');
  };
  
  const getCompetitionList = async () => {
    const data = await scanTable('competitions');
    if (data) {
      setCompetitionList(data);
    }
  }

  useEffect(() => {
    if (Object.keys(databaseAttributes).length) {
      getTableList();
    }
  }, []);

  useEffect(() => {
    if (databaseAttributes && selectedTable) {
      getTableAttributes();
    }

    if (selectedTable === 'results') {
       getCompetitionList();
    }
  }, [selectedTable]);

  return (
    <div>
      <h2>Importer des données.</h2>
      <form onSubmit={handleSubmit} id="addData-form">
        <InputSelect
          id="tableList"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedTable(e.target.value);
          }}
          value={selectedTable}
          defaultText="Choisissez un type d'import"
          options={tableList}
          schema='import-type'
        />
        {
          selectedTable && (
            <>
            {selectedTable === 'results' && Boolean(competitionList.length) && (
              <>
                <InputSelect
                  id="competitionList"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    console.log('value', e.target.value);
                    setSelectedCompetition(e.target.value);
                  }}
                  value={selectedCompetition}
                  defaultText='Choisissez une comptétition'
                  options={competitionList}
                  schema='competition-name'
                />
              </>
            )}
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
                  {parsedData.map((val: GenericStringIndex , i) => {
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
    </div>
  );
}

export default ImportData;
