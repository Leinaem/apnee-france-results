'use client';
import { useState, useEffect } from "react";

// Utils
import { scanTable } from "../../../lib/database/dbCommands";
import { queryRangeResults } from "../../../lib/database/dbutils";
import { sortBy } from "@/utils/sort";

// Components
import InputSelect from "@/app/components/partials/inputSelect";

// Types
import { AttributesType, DatabaseAttributesType } from "@/app/type/database";
import { GenericStringIndex } from "@/app/type/generic";

// Others
import databaseAttributes from '../json/databaseAttributes.json';


const Results = () => {
  const [competitionList, setCompetitionList] = useState<GenericStringIndex[]>([]);
  const [categoryList, setCategoryList] = useState<GenericStringIndex[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [parsedData, setParsedData] = useState<GenericStringIndex[]>([]);
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);

  const dataType = 'results';
  
  
  console.log('selectedCompetition : ', selectedCompetition);
  console.log('selectedCategory : ', selectedCategory);
  console.log('tableAttributes : ', tableAttributes);

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
    const dataAttributesProperty = dataType;
    const tableAttributes = databaseAttributesObj[dataAttributesProperty as keyof DatabaseAttributesType];
    setTableAttributes(tableAttributes);
  }


  const getData = async (args: GenericStringIndex) => {
    console.log('GET DATA');
    const data = await queryRangeResults(args) || [];
    console.log('data', data);
  }

  useEffect(() => {
    getCompetitionList();
    getCategoryList();
    getTableAttributes();
  }, []);

  useEffect(() => {
    if (selectedCompetition || selectedCategory) {
      getData({
        tableName: 'results',
        selectedCompetition: Number(selectedCompetition),
        selectedCategory: Number(selectedCategory),
      });
    }
  }, [selectedCompetition, selectedCategory])

  return (
    <>
      <InputSelect
        id="competition-list"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setSelectedCompetition(e.target.value);
          setParsedData([]);
        }}
        value={selectedCompetition}
        defaultText='Choisissez une comptétition'
        options={competitionList}
        schema='competition-name'
      />
      <InputSelect
        id="catagory-list"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          console.log('e', e.target.value);
          setSelectedCategory(e.target.value);
          setParsedData([]);
        }}
        value={selectedCategory}
        defaultText='Choisissez une catégorie'
        options={categoryList}
        schema='category-name'
      />
      <div>
        <table>
          <thead>
            <tr>
              {Boolean(tableAttributes?.length) && tableAttributes.map((attr) => <th key={attr.name}>{attr.label}</th>)}
            </tr>
          </thead>
        </table>
      </div>
     </>
  )
} 

export default Results;
