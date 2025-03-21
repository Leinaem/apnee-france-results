'use client';
import { useState, useEffect } from "react";

// Utils
import { scanTable, queryRangeCommand } from "../../../lib/database/dbCommands";
import { buildQueryRangeResultsParams } from "../../../lib/database/dbUtils";
import { sortBy } from "@/utils/sort";
import { getCategoryPerfByDistance, numberToStringTwoDecimals } from "@/utils/utils";

// Components
import InputSelect from "@/app/components/partials/inputSelect";

// Types
import { AttributesType, DatabaseAttributesType } from "@/app/type/database";
import { GenericStringIndex } from "@/app/type/generic";

// Others
import databaseAttributes from '../json/databaseAttributes.json';

type TableListResultsType = {
  [k: string]: GenericStringIndex[];
}

const Results = () => {
  const [competitionList, setCompetitionList] = useState<GenericStringIndex[]>([]);
  const [categoryList, setCategoryList] = useState<GenericStringIndex[]>([]);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<number>(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);
  const [results, setResults] = useState<GenericStringIndex[]>([]);
  const [filteredResults, setFilteredResults] = useState({});

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
      sortBy('id', data);
      setCategoryList(data);
    }
  }

  const getTableAttributes = () => {
    const databaseAttributesObj:DatabaseAttributesType = databaseAttributes;
    const dataAttributesProperty = 'results';
    const tableAttributes = databaseAttributesObj[dataAttributesProperty as keyof DatabaseAttributesType];
    setTableAttributes(tableAttributes);
  }

  const getData = async () => {
    const params = buildQueryRangeResultsParams(Number(selectedCompetitionId), selectedCategoryId);
    const data = await queryRangeCommand(params);
    setResults(data.Items || []);
  }

  const sortResults = () => {
    const tableByCategory = {} as TableListResultsType;
    sortBy('categoryId', results);
    results.forEach((result) => {
      const categoryId = result.categoryId as keyof typeof tableByCategory;
      if (categoryId) {
        if (tableByCategory[categoryId] === undefined
        ) {
          tableByCategory[categoryId] = [];
          Object.defineProperty(tableByCategory, categoryId, []);
        }
      }
      tableByCategory[categoryId as keyof typeof tableByCategory]?.push(result);
    })
    setFilteredResults(tableByCategory);
  }

const categoryPerfByDistance = getCategoryPerfByDistance(categoryList);

  useEffect(() => {
    getCompetitionList();
    getCategoryList();
    getTableAttributes();
  }, []);

  useEffect(() => {
    if (selectedCompetitionId || selectedCategoryId) {
      getData();
    }
  }, [selectedCompetitionId, selectedCategoryId]);

  useEffect(() => {
    setFilteredResults([]);
    if (results.length) {
      sortResults();
    }
  }, [results])

  const getTitle = () => {
    const selectionCompetition = competitionList.find((comp) => comp.id === selectedCompetitionId) || {};
    return `${selectionCompetition.name} - ${selectionCompetition.city}`
  }

  return (
    <div className="page page-results">
      <InputSelect
        id="competition-list"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setSelectedCompetitionId(Number(e.target.value));
          setResults([]);
        }}
        value={selectedCompetitionId}
        defaultText='Choisissez une comptétition'
        options={competitionList}
        schema='competition-name'
      />
      {
        Boolean(selectedCompetitionId) && (
          <>
            <InputSelect
              id="catagory-list"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedCategoryId(Number(e.target.value));
                setResults([]);
              }}
              value={selectedCategoryId}
              defaultText='Choisissez une catégorie'
              options={categoryList}
              schema='category-name'
            />
            <h2>{getTitle()}</h2>
          </>
        )
      }
      {Object.entries(filteredResults).map((section, i) => {
        const categoryId =  Number(section[0]);
        const categoryName = categoryList.find((cat) => cat.id === categoryId)?.name;
        const sectionData = section[1] as GenericStringIndex[];
        const perfByDistance = categoryPerfByDistance.includes(Number(section[0]));
        const sortDirection = perfByDistance ? 'desc' : 'asc'
        sortBy('perfRetained', sectionData, sortDirection);

        return (
          <div key={i}>
            <div className="table-title"><p>{categoryName}</p></div>
            <table>
              <thead>
                <tr>
                  {Boolean(tableAttributes?.length) && tableAttributes.map((attr) => {
                    if (!attr.displayResult) {
                      return null;
                    }
                    return <th key={attr.name}>{attr.label}</th>
                  })}
                </tr>
              </thead>
              <tbody>
                {
                  sectionData.map((val: GenericStringIndex, j: number) => {
                    return (
                      <tr key={j}>
                      {tableAttributes.map((attr) => {
                        const perfCell = attr.name.startsWith("perf");
                        const cellPerfByDistance = perfByDistance && perfCell;
                        const value = cellPerfByDistance ? numberToStringTwoDecimals(val[attr.name] as number) : val[attr.name]

                        return attr.displayResult ? <td key={attr.name}>{value}</td> : null
                      })}
                    </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
} 

export default Results;
