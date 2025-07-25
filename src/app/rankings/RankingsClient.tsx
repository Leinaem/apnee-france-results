"use client";
import { useState, useEffect } from "react";

// Utils
import { sortBy } from "@/utils/sort";
import { numberToStringTwoDecimals } from "@/utils/utils";

// Components
import InputSelect from "@/app/components/partials/inputSelect";
import RankingFilter from "./RankingFilter";

// Types
import { AttributesType } from "@/app/type/database";
import { GenericStringIndex, GenericStringIndexWithDate } from "@/app/type/generic";

// Others
import databaseAttributes from "../json/databaseAttributes.json";

// Const
import { DISCIPLINE_GROUP_LIST, CATEGORY_LIST } from "@/utils/const";

interface RankingsClientProps {
  competitionList: GenericStringIndexWithDate[];
  disciplinesList: GenericStringIndexWithDate[];
}

const RankingsClient = ({disciplinesList, competitionList}: RankingsClientProps) => {
  const [selectedDisciplineGroup, setSelectedDisciplineGroup] =
    useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [fullRankings, setFullRankings] = useState<GenericStringIndex[]>([]);
  const [filteredResults, setFilteredResults] = useState<GenericStringIndex[]>(
    [],
  );
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);

  const [withOpen, setWithOpen] = useState<boolean>(false);
  const [withSelective, setWithSelective] = useState<boolean>(true);
  const [withCupRound, setWithCupRound] = useState<boolean>(false);
  const [withFranceChampionship, updateWithFranceChampionship] =
    useState<boolean>(false);
  const [rankingType, setRankingType] = useState<string>("performance");

  const getTableAttributes = () => {
    const tableAttributes: AttributesType[] = databaseAttributes["results"];
    setTableAttributes(tableAttributes);
  };

  useEffect(() => {
    getTableAttributes();
  }, []);

  useEffect(() => {
    const getData = async () => {
      if (!selectedDisciplineGroup || !selectedCategory) {
        return;
      }

      const selectedCategoryFull =
        disciplinesList.find(
          (disc) =>
            String(disc.name)?.includes(selectedDisciplineGroup) &&
            String(disc.name)?.includes(selectedCategory),
        ) || {};

      const res = await fetch(
        `/api/get-data?disciplineId=${selectedCategoryFull.id}&fields=lastName,firstName,perfRetained,dateOfBirth,club,competitionId&includeCompetition=true` 
      );
      
      if (!res.ok) {
        throw new Error("Erreur serveur");
      }

      const data = await res.json();
      
      if (!data.length) {
        return;
      }

      const sortDirection = selectedCategoryFull?.sortDirection as string;
      sortBy("perfRetained", data, sortDirection);
      setFullRankings(data || []);
    };

    getData();
  }, [selectedDisciplineGroup, selectedCategory, disciplinesList]);

  useEffect(() => {
    const filterRankings = async () => {
      const filter: string[] = [];

      if (withOpen) {
        filter.push("Open");
      }
      if (withSelective) {
        filter.push("Sélective");
      }
      if (withCupRound) {
        filter.push("Manche de Coupe de France");
      }
      if (withFranceChampionship) {
        filter.push("Championnat de France");
      }

      const ids: number[] = competitionList.filter((comp) => filter.includes(String(comp.type))).map(item => item.id as number);
      const filteredData: GenericStringIndex[] = [];

      // Full rankings LOOP
      fullRankings.forEach((item) => {
        // Include competition types (selective, open , cup, france championship)
        if (ids.includes(Number(item.competitionId))) {
          if (rankingType === "performance") {
            // Push ALL perfs
            filteredData.push(item);
          } else {
            // Don't push duplicates
            const duplicate = filteredData.find(
              (itemBis) =>
                item.lastName === itemBis?.lastName &&
                item.firstName === itemBis?.firstName &&
                item.dateOfBirth === itemBis?.dateOfBirth,
            );

            const isGuest = item.club === "INVITE - NON CLASSE";

            if (!duplicate && !isGuest) {
              filteredData.push(item);
            }
          }
        }
      });

      setFilteredResults(filteredData);
    };

    filterRankings();
  }, [
    fullRankings,
    withOpen,
    withSelective,
    withCupRound,
    rankingType,
    withFranceChampionship,
  ]);

  return (
    <>
      <InputSelect
        id="category-group-list"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setSelectedDisciplineGroup(e.target.value);
        }}
        value={selectedDisciplineGroup}
        defaultText="Choisissez une discipline"
        options={DISCIPLINE_GROUP_LIST}
        schema="category-group-list"
      />
      {selectedDisciplineGroup && (
        <InputSelect
          id="catagory-list"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedCategory(e.target.value);
          }}
          value={selectedCategory}
          defaultText="Choisissez une catégorie"
          options={CATEGORY_LIST}
          schema="ranking-discipline-list"
        />
      )}
      {selectedDisciplineGroup && selectedCategory && (
        <>
          <RankingFilter
            withOpen={withOpen}
            updateWithOpen={(newState: boolean) => setWithOpen(newState)}
            withSelective={withSelective}
            updateWithSelective={(newState: boolean) =>
              setWithSelective(newState)
            }
            withCupRound={withCupRound}
            updateWithCupRound={(newState: boolean) =>
              setWithCupRound(newState)
            }
            withFranceChampionship={withFranceChampionship}
            updateWithFranceChampionship={(newState: boolean) =>
              updateWithFranceChampionship(newState)
            }
            rankingType={rankingType}
            updateRankingType={(newState: string) => setRankingType(newState)}
          />

          {Boolean(fullRankings.length) && (
            <>
              <div className="table-title">
                <p>{selectedCategory}</p>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      {Boolean(tableAttributes?.length) &&
                        tableAttributes.map((attr) => {
                          if (!attr.displayRanking) {
                            return null;
                          }
                          return <th key={attr.name}>{attr.label}</th>;
                        })}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map(
                      (val: GenericStringIndex, j: number) => {
                        return (
                          <tr key={j}>
                            {tableAttributes.map((attr) => {
                              const perfCell = attr.name.startsWith("perf");
                              /////////////////////////////////////////////////
                              const perfByDistance = true; ///////// A MODIFIER TRUE EN DUR (pour éviter la fonction numberToStringTwoDecimals) !!!!
                              /////////////////////////////////////////////////
                              const cellPerfByDistance =
                                perfByDistance && perfCell;
                              const value = cellPerfByDistance
                                ? numberToStringTwoDecimals(
                                    val[attr.name] as number,
                                  )
                                : val[attr.name];
                              const pos =
                                attr.name === "position" ? j + 1 : null;
                              return attr.displayRanking ? (
                                <td key={attr.name}>{pos || value}</td>
                              ) : null;
                            })}
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default RankingsClient;
