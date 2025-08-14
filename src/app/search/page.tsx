"use client";
import { useState, useEffect, useRef } from "react";

// Components
import InputText from "../components/partials/InputText";
import InputRadio from "../components/partials/InputRadio";

// Types
import { GenericStringIndex } from "@/app/type/generic";
import { sortBy } from "@/utils/sort";
import { AttributesType } from "@/app/type/database";

// Others
import databaseAttributes from "../json/databaseAttributes.json";

type FormattedDataType = {
  name?: string;
  id?: number;
  data?: [];
  type?: string;
};

const Search = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<GenericStringIndex[]>([]);
  const [suggestions, setSuggestions] = useState<GenericStringIndex[]>([]);
  const [selectedCharData, setSelectedCharData] = useState<GenericStringIndex[]>([]);
  const [groupBy, setGroupBy] = useState<string>("discipline");
  const [formattedData, setFormattedData] = useState<FormattedDataType[]>([]);
  const [selectedChar, setSelectedChar] = useState<GenericStringIndex>({});
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const highlightWord = (text: string) => {
    const regex = new RegExp(`(${search})`, "ig");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span className="search-suggestion-highlight" key={index}>
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const getTableAttributes = () => {
    const tableAttributes: AttributesType[] = databaseAttributes["results"];
    setTableAttributes(tableAttributes);
  };

  const timeoutRef = useRef<number | undefined>(undefined);
  const handleFocus = () => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
    }
    setIsFocused(true);
  };

  const handleBlur = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsFocused(false);
    }, 150);
  };

  useEffect(() => {
    getTableAttributes();
  }, []);

  useEffect(() => {
    if (search.length < 3) {
      setSearchResult([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetch(`/api/get-data?search=${encodeURIComponent(search)}&includeCompetition=true&includeDiscipline=true&fields=disciplineId,place,perfAnnounced,perfAchieved,perfRetained,faultDisq,penality,firstName,lastName,comment,competitionId`)
        .then(res => res.json())
        .then(data => {
          console.log('--- data 2', data);
          setSearchResult(data);
        })
        .catch(err => {
          console.error("Erreur API:", err);
        });

    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Manage suggestion list
  useEffect(() => {
    if (!searchResult.length) {
      setSuggestions([]);
    }

    const buildCharacterList: GenericStringIndex[] = [];
    searchResult.forEach((item) => {
      const duplicate = buildCharacterList.find(
        (char) =>
          char.firstName === item.firstName &&
          char.lastName === item.lastName &&
          char.dateOfBirth === item.dateOfBirth,
      );
      if (!duplicate) {
        buildCharacterList.push({
          firstName: item.firstName,
          lastName: item.lastName,
          dateOfBirth: item.dateOfBirth,
        });
      }
    });
    setSuggestions(buildCharacterList);
  }, [searchResult]);

  // Prepare data to display
  useEffect(() => {
    const formattedDataTemp: FormattedDataType[] = [];
    selectedCharData.forEach((item) => {
      if (!formattedDataTemp.find((i) => i.name === item.season)) {
        formattedDataTemp.push({
          name: item.season as string,
          type: groupBy,
          data: [],
        });
      }
      const itemYeardata: FormattedDataType[] =
        formattedDataTemp.find((i) => i.name === item.season)?.data || [];

      /// Discipline
      if (groupBy === "discipline") {
        if (
          !itemYeardata?.find(
            (i: FormattedDataType) => i.id === item.disciplineId,
          )
        ) {
          itemYeardata?.push({
            id: item.disciplineId as number,
            name: item.disciplineName as string,
            type: "discipline",
            data: [],
          });
        }
        const itemDisciplineData: GenericStringIndex[] =
          itemYeardata?.find((i: FormattedDataType) => i.id === item.disciplineId)
            ?.data || [];
        itemDisciplineData?.push(item);
      } else if (groupBy === "competition") {
        // Competition
        if (
          !itemYeardata?.find(
            (i: FormattedDataType) => i.id === item.competitionId,
          )
        ) {
          itemYeardata?.push({
            id: item.competitionId as number,
            name: item.competitionName as string,
            type: "competition",
            data: [],
          });
        }
        const itemCompetitionData: GenericStringIndex[] =
          itemYeardata?.find(
            (i: FormattedDataType) => i.id === item.competitionId,
          )?.data || [];
        itemCompetitionData?.push(item);
      }
    });

    // Sort Year Desc
    sortBy("name", formattedDataTemp, "desc");

    formattedDataTemp.forEach((years) => {
      // Sort lvl 2
      sortBy(
        "id",
        years.data as GenericStringIndex[],
        years.type === "discipline" ? "asc" : "desc",
      );

      years.data?.forEach((lvlTwo) => {
        const { type, data } = lvlTwo;
        sortBy(
          type === "discipline" ? "competitionId" : "disciplineId",
          data,
          type === "discipline" ? "desc" : "asc",
        );
      });
    });

    setFormattedData(formattedDataTemp);
  }, [groupBy, selectedCharData]);

  useEffect(() => {
    if (Object.keys(selectedChar).length) {
      const data = searchResult.filter((item) => {
        const disciplineName: string = item.disciplineName as string;
        return (
          selectedChar.lastName === item.lastName &&
          selectedChar.firstName === item.firstName &&
          selectedChar.dateOfBirth === item.dateOfBirth &&
          !disciplineName.includes("Classement general")
        );
      });
      setSelectedCharData(data);
      setSearch("");
      setSuggestions([]);
      setSelectedChar({});
    }
  }, [selectedChar, searchResult]);

  return (
    <div className="page page-search">
      <h2 className="page page-title">Recherche</h2>
      <div className="search-container">
        <InputText
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Rechercher par nom ou prénom"
          value={search}
          icon="search"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {Boolean(suggestions.length) && isFocused && (
          <div className="search-suggestion">
            {suggestions.map((sug, i) => (
              <p
                className="search-suggestion-item"
                key={i}
                onClick={() => setSelectedChar(sug)}
              >
                {highlightWord(sug.firstName as string)}{" "}
                {highlightWord(sug.lastName as string)}
              </p>
            ))}
          </div>
        )}
      </div>
      {Boolean(Object.entries(selectedCharData).length) && (
        <div className="group-by-container">
          <legend>Grouper par :</legend>
          <div className="group-by-radio">
            <InputRadio
              id="discipline"
              name="group-by"
              value="discipline"
              onChange={(e) => setGroupBy(e.target.value)}
              checked={groupBy === "discipline"}
              labelText="Discipline"
              labelHtmlFor="discipline"
            />
            <InputRadio
              id="competition"
              name="group-by"
              value="competition"
              onChange={(e) => setGroupBy(e.target.value)}
              checked={groupBy === "competition"}
              labelText="Compétition"
              labelHtmlFor="competition"
            />
          </div>
        </div>
      )}
      {Boolean(formattedData.length) && (
        <div>
          <h3>{}</h3>
          {formattedData.map((years, i) => {
            return (
              <div key={i}>
                <h3>{years.name}</h3>
                {years?.data?.map((levelTwo: GenericStringIndex, j) => {
                  // Return table

                  return (
                    <div key={j}>
                      <div className="table-title">{levelTwo.name}</div>
                      <div className="table-container">
                        <table>
                          <thead>
                            <tr>
                              {Boolean(tableAttributes?.length) &&
                                tableAttributes.map((attr) => {
                                  if (!attr.displaySearch?.[groupBy]) {
                                    return null;
                                  }
                                  return <th key={attr.name}>{attr.label}</th>;
                                })}
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(levelTwo.data) &&
                              levelTwo.data.map((item, k) => {
                                // console.log('item', item);
                                // TR
                                return (
                                  <tr key={k}>
                                    {tableAttributes.map((attr) => {
                                      // console.log('attr', attr);
                                      const value = item[attr.name];

                                      return attr.displaySearch?.[groupBy] ? (
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Search;
