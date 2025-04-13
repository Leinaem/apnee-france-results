
"use client"
import { useState, useEffect } from "react";

// Utils
import { scanTable, queryRangeCommand } from "../../../lib/database/dbCommands";
import { buildQueryRangeRankingParams, getTypeCompetitionsIds } from "../../../lib/database/dbutils";
import { sortBy } from "@/utils/sort";
import { numberToStringTwoDecimals } from "@/utils/utils";

// Components
import InputSelect from "@/app/components/partials/inputSelect";
import RankingFilter from "./RankingFilter";

// Types
import { AttributesType } from "@/app/type/database";
import { GenericStringIndex } from "@/app/type/generic";

// Others
import databaseAttributes from '../json/databaseAttributes.json';

// Const
import { CATEGORY_GROUP_LIST, CATEGORY_LIST } from "@/utils/const";

const Rankings = () => {
  const [categoryList, setCategoryList] = useState<GenericStringIndex[]>([]);
  const [selectedDisciplineGroup, setSelectedDisciplineGroup] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [fullRankings, setFullRankings] = useState<GenericStringIndex[]>([]);
  const [filteredResults, setFilteredResults] = useState<GenericStringIndex[]>([]);
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);

  const [withOpen, setWithOpen] = useState<boolean>(false);
  const [withSelective, setWithSelective] = useState<boolean>(true);
  const [withCupRound, setWithCupRound] = useState<boolean>(false);
  const [rankingType, setRankingType] = useState<string>('performance');  // performance

  const getCategoryList = async () => {
    const data = await scanTable('category');
    if (data) {
      sortBy('id', data);
      setCategoryList(data);
    }
  }

  const getTableAttributes = () => {
    const tableAttributes: AttributesType[] = databaseAttributes['results'];
    setTableAttributes(tableAttributes);
  }

  useEffect(() => {
    getCategoryList();
    getTableAttributes();
  }, []);

  useEffect(() => {
    const getData = async () => {
      if (!selectedDisciplineGroup || !selectedCategory) {
        return;
      }
  
      const selectedCategoryFull = categoryList.find((cat) => 
          String(cat.name)?.includes(selectedDisciplineGroup) && 
          String(cat.name)?.includes(selectedCategory)) || {};
      
      let lastEvaluatedKey: object | undefined = undefined;
      let resultItems: GenericStringIndex[] = [];
  
      do {
        const params = buildQueryRangeRankingParams([Number(selectedCategoryFull.id)], lastEvaluatedKey);
        const result = await queryRangeCommand(params);
        resultItems = resultItems.concat(result.Items as GenericStringIndex[]);
        lastEvaluatedKey = result.LastEvaluatedKey;
      } while (lastEvaluatedKey !== undefined)
  
      if (!resultItems.length) {
        return;
      }

      const sortDirection = selectedCategoryFull?.sortDirection as string;
      sortBy('perfRetained', resultItems, sortDirection);
      setFullRankings(resultItems || []);
    }

    getData();
  }, [selectedDisciplineGroup, selectedCategory, categoryList]);

  useEffect(() => {
    const filterRankings = async () => {
      const filter: string[] = [];
  
      if (withOpen) {
        filter.push('Open');
      }
      if (withSelective) {
        filter.push('Sélective');
      }
      if (withCupRound) {
        filter.push('Manche de Coupe de France');
      }
      const ids: number[] = await getTypeCompetitionsIds(filter);
      const filteredData: GenericStringIndex[] = [];
  
      // Full rankings LOOP
      fullRankings.forEach((item) => {
        // Include competition types (selective, open , cup)
        if (ids.includes(Number(item.competitionId))) {
          if (rankingType === 'performance') {
            // Push ALL perfs
            filteredData.push(item);
          } else {
            // Don't push duplicates
            const duplicate = filteredData.find((itemBis) => 
              item.lastName === itemBis?.lastName && 
              item.firstName === itemBis?.firstName &&
              item.dateOfBirth === itemBis?.dateOfBirth);
            
            if (!duplicate){
              filteredData.push(item);
            }
          }
        }
      })
  
      setFilteredResults(filteredData);
    }

    filterRankings();
  },[fullRankings, withOpen, withSelective, withCupRound, rankingType]);

  return (
    <div className="page page-rankings">
      <h2 className="page page-title">Classements</h2>
      <InputSelect
        id="category-group-list"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setSelectedDisciplineGroup(e.target.value);
        }}
        value={selectedDisciplineGroup}
        defaultText='Choisissez une discipline'
        options={CATEGORY_GROUP_LIST}
        schema='category-group-list'
      />
      {
        selectedDisciplineGroup && (
          <InputSelect
            id="catagory-list"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectedCategory(e.target.value);
            }}
            value={selectedCategory}
            defaultText='Choisissez une catégorie'
            options={CATEGORY_LIST}
            schema='ranking-discipline-list'
          />
        )
      }
      {selectedDisciplineGroup && selectedCategory &&
        <>
          <RankingFilter 
            withOpen={withOpen}
            updateWithOpen={(newState: boolean) => setWithOpen(newState)}
            withSelective={withSelective}
            updateWithSelective={(newState: boolean) => setWithSelective(newState)}
            withCupRound={withCupRound}
            updateWithCupRound={(newState: boolean) => setWithCupRound(newState)}
            rankingType={rankingType}
            updateRankingType={(newState: string) => setRankingType(newState)}
          />

          {
            Boolean(fullRankings.length) && (
              <>
                <div className="table-title"><p>{selectedCategory}</p></div>
                <table>
                  <thead>
                    <tr>
                      {Boolean(tableAttributes?.length) && tableAttributes.map((attr) => {
                        if (!attr.displayRanking) {
                          return null;
                        }
                        return <th key={attr.name}>{attr.label}</th>
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {
                      filteredResults.map((val: GenericStringIndex, j: number) => {
                        return (
                          <tr key={j}>
                          {tableAttributes.map((attr) => {
                            const perfCell = attr.name.startsWith("perf");
                            /////////////////////////////////////////////////
                            const perfByDistance = true; ///////// A MODIFIER TRUE EN DUR (pour éviter la fonction numberToStringTwoDecimals) !!!!
                            /////////////////////////////////////////////////
                            const cellPerfByDistance = perfByDistance && perfCell;
                            const value = cellPerfByDistance ? numberToStringTwoDecimals(val[attr.name] as number) : val[attr.name]
                            const pos = attr.name === 'position' ? j+1 : null;
                            return attr.displayRanking ? <td key={attr.name}>{pos || value}</td> : null
                          })}
                        </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </>
            )
          }
        </>
      }
    </div>
  );
}

export default Rankings;
