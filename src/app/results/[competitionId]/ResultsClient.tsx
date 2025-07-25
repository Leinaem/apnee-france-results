"use client";
import { useState, useEffect, Suspense } from "react";


// Utils
import { sortBy } from "@/utils/sort";
import { numberToStringTwoDecimals, getCategoryMappingId, convertPerfFieldsToNumbers } from "@/utils/utils";

// Components
import InputSelect from "@/app/components/partials/inputSelect";

// Types
import { AttributesType, TableListResultsType } from "@/app/type/database";
import { GenericStringIndex, CategoryMappingIdType } from "@/app/type/generic";

// Others
import databaseAttributes from "../../json/databaseAttributes.json";

// Const
import { DISCIPLINE_GROUP_LIST } from "@/utils/const";

interface ResultsClientProps {
  competitionList: GenericStringIndex[];
  disciplineList: GenericStringIndex[];
  competitionId: number;
  results: object;
}

const ResultsClient = ({ competitionList, disciplineList, competitionId, results }: ResultsClientProps) => {
  const [selectedDisciplineGroup, setSelectedDisciplineGroup] = useState<string>("");
  const [selectedDisciplinesListId, setSelectedDisciplinesListId] = useState<number[]>([]);
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);
  const [categoryMappingId, setCategoryMappingId] = useState<CategoryMappingIdType>({});
  

  const getCompetitionName = (): string => {
    const selectionCompetition =
      competitionList.find((comp) => comp.id === competitionId) || {};
    return `${selectionCompetition.name} - ${selectionCompetition.city}`;
  };

  const getTableAttributes = () => {
    const tableAttributes: AttributesType[] = databaseAttributes["results"];
    setTableAttributes(tableAttributes);
  };

  useEffect(() => {
    getTableAttributes();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(
          `/api/get-data?competitionId=${competitionId}&fields=lastName,firstName,place,dateOfBirth,club,perfRetained,disciplineId,perfAnnounced,perfAchieved,faultDisq,comment,penality,licenseNumber`
        );
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();

        if (data.length) {
          const tableByDiscipline = {} as TableListResultsType;
          sortBy("disciplineId", data);
          data.forEach((item: GenericStringIndex) => {
            const disciplineId = item.disciplineId as keyof typeof tableByDiscipline;
            if (disciplineId) {
              if (tableByDiscipline[disciplineId] === undefined) {
                tableByDiscipline[disciplineId] = [];
                Object.defineProperty(tableByDiscipline, disciplineId, []);
              }
            }
            tableByDiscipline[disciplineId as keyof typeof tableByDiscipline]?.push(
              item,
            );
          });
        }
      } catch (error) {
        console.error("Erreur fetch results:", error);
      }
    }

    if (competitionId) {
      getData();
    } else {
    }
  }, [competitionId]);

  useEffect(() => {
    setCategoryMappingId(getCategoryMappingId(disciplineList));
  }, [disciplineList]);

  return (
    <>
      {Boolean(competitionId) && (
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
          <h3>{getCompetitionName()}</h3>
        </>
      )}
    <div className="page page-results" style={{display: "inline-block"}}>
      {Object.entries(results).map((section, i) => {
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

const Results = ({ competitionList, disciplineList, competitionId, results }: ResultsClientProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsClient
        competitionList={competitionList}
        disciplineList={disciplineList}
        competitionId={competitionId}
        results={results}
      />
    </Suspense>
  );
};

export default Results;
