"use client";
import { useState, useEffect, Suspense } from "react";

// Utils
import { sortBy } from "@/utils/sort";
import { numberToStringTwoDecimals, getCategoryMappingId, convertPerfFieldsToNumbers } from "@/utils/utils";

// Components
import InputSelect from "@/app/components/partials/inputSelect";
import CompetitionListSelect from "@/app/components/results/CompetitionListSelect";
import YearTabs from "@/app/components/YearTabs";

// Types
import { AttributesType } from "@/app/type/database";
import { GenericStringIndex, CategoryMappingIdType } from "@/app/type/generic";

// Others
import databaseAttributes from "../../json/databaseAttributes.json";

// Const
import { DISCIPLINE_GROUP_LIST } from "@/utils/const";

interface ResultsClientProps {
  competitionList: GenericStringIndex[];
  disciplineList: GenericStringIndex[];
  competitionResults: object;
  competitionData: GenericStringIndex;
}

const ResultsClient = ({ disciplineList, competitionResults, competitionData }: ResultsClientProps) => {
  const [selectedDisciplineGroup, setSelectedDisciplineGroup] = useState<string>("");
  const [selectedDisciplinesListId, setSelectedDisciplinesListId] = useState<number[]>([]);
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);
  const [categoryMappingId, setCategoryMappingId] = useState<CategoryMappingIdType>({});

  const getTableAttributes = () => {
    const tableAttributes: AttributesType[] = databaseAttributes["results"];
    setTableAttributes(tableAttributes);
  };

  useEffect(() => {
    getTableAttributes();
  }, []);

  useEffect(() => {
    setCategoryMappingId(getCategoryMappingId(disciplineList));
  }, [disciplineList]);

  return (
    <>
      <InputSelect
        id="discipline-list"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const disciplinesList = categoryMappingId[e.target.value] || [];
          const disciplinesListId: number[] = disciplinesList.map((disc) => disc.id as number);
          setSelectedDisciplineGroup(e.target.value);
          setSelectedDisciplinesListId(disciplinesListId || []);
        }}
        value={selectedDisciplineGroup}
        defaultText="Choisissez une discipline"
        options={DISCIPLINE_GROUP_LIST}
        schema=""
      />
      <h3>{competitionData.name} - {competitionData.city} - {competitionData.season}</h3>
      <div className="page page-results">
        {Object.entries(competitionResults).map((section, i) => {
          const categoryId = Number(section[0]);
          const currentDiscipline = disciplineList.find(
            (disc) => disc.id === categoryId,
          );
          const categoryName = currentDiscipline?.name;
          const sortDirection = currentDiscipline?.sortDirection as string;
          const perfByDistance = currentDiscipline?.perfUnitType === "distance";
          const sectionData =  perfByDistance ? section[1].map((item: GenericStringIndex) => convertPerfFieldsToNumbers(item)) : section[1] as GenericStringIndex[];
          sortBy("perfRetained", sectionData as GenericStringIndex[], sortDirection, "club");
          const display = selectedDisciplinesListId.includes(currentDiscipline?.id as number)

          if (selectedDisciplinesListId.length && !display) {
            return null;
          }

          return (
            <div key={i}>
              <div className="table-title">
                <p>{categoryName}</p>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      {Boolean(tableAttributes?.length) &&
                        tableAttributes.map((attr) => {
                          if (!attr.displayResult) {
                            return null;
                          }
                          return <th key={attr.name}>{attr.label}</th>;
                        })}
                    </tr>
                  </thead>
                  <tbody>
                    {sectionData.map((val: GenericStringIndex, j: number) => {
                      return (
                        <tr key={j}>
                          {tableAttributes.map((attr) => {
                            const perfCell = attr.name.startsWith("perf");
                            const cellPerfByDistance = perfByDistance && perfCell;
                            const value = cellPerfByDistance
                              ? numberToStringTwoDecimals(
                                  val[attr.name] as number,
                                )
                              : val[attr.name];

                            return attr.displayResult ? (
                              <td key={attr.name}>{value}</td>
                            ) : null;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const Results = ({ competitionList, disciplineList, competitionResults, competitionData }: ResultsClientProps) => {
  const [activeTab, setActiveTab] = useState(competitionData.season);
  const options = competitionList.find((list) => list.year === activeTab)?.data as GenericStringIndex[] || [];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <YearTabs activeTab={activeTab as string} competitionList={competitionList} setActiveTab={setActiveTab} />
      <CompetitionListSelect options={options} />
      <ResultsClient
        competitionList={options}
        disciplineList={disciplineList}
        competitionResults={competitionResults}
        competitionData={competitionData}
      />
    </Suspense>
  );
};

export default Results;
