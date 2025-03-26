
"use client"
import { useState, useEffect } from "react";

// Utils
import { scanTable, queryRangeCommand } from "../../../lib/database/dbCommands";
import { buildQueryRangeRankingParams } from "../../../lib/database/dbUtils";
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
import { CATEGORY_LIST_GROUP, CATEGORY_LIST } from "@/utils/const";

const Rankings = () => {
  const [categoryList, setCategoryList] = useState<GenericStringIndex[]>([]);
  const [selectedDisciplineGroup, setSelectedDisciplineGroup] = useState<string>('');
  const [selectedDisciplinesList, setSelectedDisciplinesList] = useState<GenericStringIndex[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoryMappingId, setCategoryMappingId] = useState<CategoryMappingIdType>({});
  const [rankings, setRankings] = useState<TableListResultsType>({});
  const [filteredResults, setFilteredResults] = useState({});
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);

  console.log('rankings : ', rankings);

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

  const formatRankingData = (data: GenericStringIndex[]) => {
    const tableByCategory = {} as TableListResultsType;
    data.forEach((item) => {
      const categoryId = item.categoryId as keyof typeof tableByCategory;
      if (categoryId) {
        if (tableByCategory[categoryId] === undefined
        ) {
          tableByCategory[categoryId] = [];
          Object.defineProperty(tableByCategory, categoryId, []);
        }
      }
      tableByCategory[categoryId as keyof typeof tableByCategory]?.push(item);
    });

    /////////////////
    Object.entries(tableByCategory).map((section, i) => {
      const categoryId =  Number(section[0]);
      const currentCategory = categoryList.find((cat) => cat.id === categoryId);
      const sortDirection = currentCategory?.sortDirection as string;
      const sectionData = section[1] as GenericStringIndex[];
      sortBy('perfRetained', sectionData, sortDirection);
    })
    /////////////////


    console.log('tableByCategory : ', tableByCategory);
    return tableByCategory;
  }

  const getData = async () => {
    if (!selectedDisciplineGroup) {
      return;
    }
    
    const selectedCategoryMultipleId: number[] = selectedDisciplinesList.map((disc) => Number(disc.id));
    const selectedCategoryId: number[] = selectedCategory ? [categoryList.find((cat) => 
      String(cat.name)?.includes(selectedDisciplineGroup) && 
      String(cat.name)?.includes(selectedCategory))?.id] : null;
    const params = buildQueryRangeRankingParams(selectedCategoryId || selectedCategoryMultipleId);
    const data = await queryRangeCommand(params);

    if (!data?.Items?.length) {
      return;
    }
    const formatedData = formatRankingData(data.Items);
    setRankings(formatedData || []);
  }

  useEffect(() => {
    setCategoryMappingId(getCategoryMappingId(categoryList))
  },[categoryList]);

  useEffect(() => {
    getCategoryList();
    getTableAttributes();
  }, []);

  useEffect(() => {
    getData();
  }, [selectedDisciplineGroup, selectedCategory]);

  return (
    <div className="page page-rankings">
      <h2 className="page page-title">Classements</h2>
      <InputSelect
        id="discipline-list"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const disciplinesList = categoryMappingId[e.target.value];
          setSelectedDisciplineGroup(e.target.value);
          setSelectedDisciplinesList(disciplinesList);
          setRankings({});
        }}
        value={selectedDisciplineGroup}
        defaultText='Choisissez une discipline'
        options={CATEGORY_LIST_GROUP}
        schema=''
      />
      {
        selectedDisciplinesList && Boolean(selectedDisciplinesList.length) && (
          <InputSelect
          id="catagory-list"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedCategory(e.target.value);
            setRankings({});
          }}
          value={selectedCategory}
          defaultText='Choisissez une catégorie'
          options={CATEGORY_LIST}
          schema=''
        />
        )
      }
      <h3>{Boolean(Number(selectedDisciplineGroup)) && selectedDisciplineGroup}</h3>
      {
        Object.entries(rankings).map((section, i) => {
          const categoryId =  Number(section[0]);
          const currentCategory = categoryList.find((cat) => cat.id === categoryId);
          const categoryName = currentCategory?.name;
          const perfByDistance = currentCategory?.perfUnitType === 'distance';
          const sectionData = section[1] as GenericStringIndex[];
          
          return (
            <div key={i}>
            <div className="table-title"><p>{categoryName}</p></div>
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
                  sectionData.map((val: GenericStringIndex, j: number) => {
                    return (
                      <tr key={j}>
                      {tableAttributes.map((attr) => {
                        const perfCell = attr.name.startsWith("perf");
                        const cellPerfByDistance = perfByDistance && perfCell;
                        const value = cellPerfByDistance ? numberToStringTwoDecimals(val[attr.name] as number) : val[attr.name]

                        return attr.displayRanking ? <td key={attr.name}>{value}</td> : null
                      })}
                    </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          )

        })
      }
    </div>
  );
}

export default Rankings;
