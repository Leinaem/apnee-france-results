'use client';
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation'

// Utils
import { scanTable, queryRangeCommand } from "../../../lib/database/dbCommands";
import { buildQueryRangeResultsParams } from "../../../lib/database/dbUtils";
import { sortBy } from "@/utils/sort";
import { numberToStringTwoDecimals, getCategoryMappingId } from "@/utils/utils";

// Components
import InputSelect from "@/app/components/partials/inputSelect";

// Types
import { AttributesType, DatabaseAttributesType, TableListResultsType } from "@/app/type/database";
import { GenericStringIndex, CategoryMappingIdType } from "@/app/type/generic";

// Others
import databaseAttributes from '../json/databaseAttributes.json';

// Const
import { CATEGORY_GROUP_LIST } from "@/utils/const";


const Results = () => {
  const [competitionList, setCompetitionList] = useState<GenericStringIndex[]>([]);
  const [categoryList, setCategoryList] = useState<GenericStringIndex[]>([]);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<number>(0);
  const [selectedDisciplineGroup, setSelectedDisciplineGroup] = useState<string>('');
  const [selectedDisciplinesList, setSelectedDisciplinesList] = useState<GenericStringIndex[]>([]);
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);
  const [results, setResults] = useState<GenericStringIndex[]>([]);
  const [filteredResults, setFilteredResults] = useState({});
  const [categoryMappingId, setCategoryMappingId] = useState<CategoryMappingIdType>({});

  const searchParams = useSearchParams()
  const competitionidParam = searchParams.get('competitionid');

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
    const selectedDisciplinesId: number[] = selectedDisciplinesList.map((disc) => Number(disc.id));
    const params = buildQueryRangeResultsParams(
      Number(selectedCompetitionId),
      selectedDisciplinesId,
    );

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

  useEffect(() => {
    getCompetitionList();
    getCategoryList();
    getTableAttributes();

    if (competitionidParam) {
      setSelectedCompetitionId(Number(competitionidParam));
    }
  }, []);

  useEffect(() => {
    if (selectedCompetitionId) {
      getData();
    }
  }, [selectedCompetitionId, selectedDisciplinesList]);

  useEffect(() => {
    setFilteredResults([]);
    if (results.length) {
      sortResults();
    }
  }, [results])

  useEffect(() => {
    setCategoryMappingId(getCategoryMappingId(categoryList))
  },[categoryList]);

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
          if (!Number(e.target.value)) {
            setSelectedDisciplinesList([]);
            setSelectedDisciplineGroup('');
          }
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
            id="discipline-list"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const disciplinesList = categoryMappingId[e.target.value];
              setSelectedDisciplineGroup(e.target.value);
              setSelectedDisciplinesList(disciplinesList || []);
              setResults([]);
            }}
            value={selectedDisciplineGroup}
            defaultText='Choisissez une discipline'
            options={CATEGORY_GROUP_LIST}
            schema=''
          />
          <h2>{getTitle()}</h2>
          <h3>{Boolean(Number(selectedDisciplineGroup)) && selectedDisciplineGroup}</h3>
          </>
        )
      }

      {Object.entries(filteredResults).map((section, i) => {
        const categoryId =  Number(section[0]);
        const currentCategory = categoryList.find((cat) => cat.id === categoryId);
        const categoryName = currentCategory?.name;
        const sortDirection = currentCategory?.sortDirection as string;
        const perfByDistance = currentCategory?.perfUnitType === 'distance';
        const sectionData = section[1] as GenericStringIndex[];
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
