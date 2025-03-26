"use client"
import { useState, useEffect } from "react";
import Papa from "papaparse";

// Utils
import { fetchTableList, addMultiData, scanTable } from "../../../../lib/database/dbCommands";
import { sortBy } from "@/utils/sort";
import { stringToNumber } from "@/utils/utils";
import { getCategoryPerfByDistance } from "@/utils/utils";

// Components
import InputSelect from "@/app/components/partials/inputSelect";

// Types
import { AttributesType, DatabaseAttributesType } from "@/app/type/database";
import { GenericStringIndex } from "@/app/type/generic";

// Others
import databaseAttributes from '../../json/databaseAttributes.json';

const ImportData = () => {
  const [preparedData, setPreparedData] = useState<GenericStringIndex[]>([]);
  const [tableList, setTableList] = useState<GenericStringIndex[]>([]);
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [competitionList, setCompetitionList] = useState<GenericStringIndex[]>([]);
  const [categoryList, setCategoryList] = useState<GenericStringIndex[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [season, setSeason] = useState<string>('2024-25');


  const changeHandler = (event: React.ChangeEvent<HTMLInputElement >) => {
    if (!event.target.files) {
      return;
    }
    Papa?.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results: {data: GenericStringIndex[]}) {
        const parsedData = results.data;
        setPreparedData(prepareData(parsedData));
      },
    });
  };

  const prepareData = (data: GenericStringIndex[]) => {
    const categoryPerfByDistance = getCategoryPerfByDistance(categoryList);

    if (selectedTable === 'results' && categoryList.length) {
      data.forEach((item: GenericStringIndex) => {
        const categoryId = categoryList.find((cat) => String(cat.name).toLowerCase() === String(item.categoryName).toLowerCase())?.id as number;
        const competitionId = selectedCompetition;
        const id = `${competitionId}_${categoryId}_${item.lastName}_${item.firstName}`;
        item.id = id.replaceAll(' ', '-');
        item.competitionId = Number(selectedCompetition);
        item.categoryId = categoryId;
        if (categoryPerfByDistance.includes(categoryId)) {
          item.perfRetained = stringToNumber(item.perfRetained as string);
          item.perfAnnounced = stringToNumber(item.perfAnnounced as string);
          item.perfAchieved = stringToNumber(item.perfAchieved as string);
        }
        if (typeof item.categoryName === 'string') {
          item.categoryName = item.categoryName.charAt(0).toUpperCase() + item.categoryName.slice(1).toLowerCase();
        }
        if (typeof item.firstName === 'string') {
          item.firstName = item.firstName.charAt(0).toUpperCase() + item.firstName.slice(1).toLowerCase();
        }
        item.season = season;
      });
    } else if (selectedTable === 'competitions') {
      data.forEach((item: GenericStringIndex) => {
        Number(item.id);
        item.id = Number(item.id);
        item.season = season;
      })
    }
    
    return data;
  }

  const getTableList = async () => {
    const fetchedTableList = (await fetchTableList()) || [];
    const filteredTableList = fetchedTableList
      .filter((tableName) => databaseAttributes.hasOwnProperty(tableName))
      .map((tableName) => ({label: tableName}))
    setTableList(filteredTableList);
  };

  const getCompetitionList = async () => {
    const data = await scanTable('competitions');
    if (data) {
      sortBy('id', data);
      setCompetitionList(data);
    }
  }

  const getCategoryList = async () => {
    const data = await scanTable('category');
    if (data) {
      setCategoryList(data);
    }
  }

  const getTableAttributes = () => {
    const databaseAttributesObj:DatabaseAttributesType = databaseAttributes;
    const dataAttributesProperty = selectedTable;
    const tableAttributes = databaseAttributesObj[dataAttributesProperty as keyof DatabaseAttributesType];
    setTableAttributes(tableAttributes);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log('selectedTable : ', selectedTable);
    console.log('preparedData : ', preparedData);

    addMultiData(selectedTable, preparedData);
    setPreparedData([]);
    setSelectedTable('');
  };
  
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
       getCategoryList();
    }
  }, [selectedTable]);

  return (
    <form onSubmit={handleSubmit} id="addData-form">
      <InputSelect
        id="tableList"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setSelectedTable(e.target.value);
          setSelectedCompetition('');
          setPreparedData([]);
        }}
        value={selectedTable}
        defaultText="Choisissez un type d'import"
        options={tableList}
        schema='import-type'
      />
      {
        selectedTable && (
          <>
            <InputSelect
              id="seasonList"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setSeason(e.target.value);
                setPreparedData([]);
              }}
              value={season}
              defaultText='Choisissez une saison'
              options={['2024-25']}
              schema=''
            />
          {selectedTable === 'results' && Boolean(competitionList.length) && (
            <>
              <InputSelect
                id="competitionList"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSelectedCompetition(e.target.value);
                  setPreparedData([]);
                }}
                value={selectedCompetition}
                defaultText='Choisissez une comptétition'
                options={competitionList}
                schema='competition-name'
              />
            </>
          )}
          {(selectedTable === 'competitions' || selectedCompetition) && (
            <input
              type="file"
              name="file"
              onChange={changeHandler}
              accept=".csv"
            />
          )}
          {Boolean(preparedData.length) && (
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
                {preparedData.map((val: GenericStringIndex , i) => {
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
  );
}

export default ImportData;
