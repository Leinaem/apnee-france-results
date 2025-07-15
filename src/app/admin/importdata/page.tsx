"use client";
import { useState, useEffect } from "react";
import Papa from "papaparse";

// Utils
import { addMultiData } from "../../../../lib/database/dbCommands";
import { sortBy } from "@/utils/sort";
import { stringToNumber } from "@/utils/utils";
import {
  getDisciplinePerfByDistance,
  formatDateISOToString,
} from "@/utils/utils";

// Components
import InputSelect from "@/app/components/partials/inputSelect";

// Types
import { AttributesType } from "@/app/type/database";
import { GenericStringIndex } from "@/app/type/generic";

// Others
import databaseAttributes from "../../json/databaseAttributes.json";

const ImportData = () => {
  const [preparedData, setPreparedData] = useState<GenericStringIndex[]>([]);
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [competitionList, setCompetitionList] = useState<GenericStringIndex[]>(
    [],
  );
  const [disciplinesList, setDisciplinesList] = useState<GenericStringIndex[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>("");
  const [season, setSeason] = useState<string>("2024-25");

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    Papa?.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results: { data: GenericStringIndex[] }) {
        const parsedData = results.data;
        setPreparedData(prepareData(parsedData));
      },
    });
  };

  const prepareData = (data: GenericStringIndex[]) => {
    const disciplinePerfByDistance = getDisciplinePerfByDistance(disciplinesList);

    if (selectedTable === "results" && disciplinesList.length) {
      const competitionId = selectedCompetition;
      // const city = competitionList.find(
      //   (comp) => comp.id === Number(competitionId),
      // )?.city as string;

      const validData = data.map((item: GenericStringIndex) => {
        const disciplineId = disciplinesList.find(
          (disc) =>
            String(disc.name).toLowerCase() ===
            String(item.disciplineName).toLowerCase(),
        )?.id as number;
        const id = `${competitionId}_${disciplineId}_${item.lastName}_${item.firstName}`;
        item.id = id.replaceAll(" ", "-");
        item.competitionId = Number(selectedCompetition);
        item.disciplineId = disciplineId;
        if (disciplinePerfByDistance.includes(disciplineId)) {
          item.perfRetained = stringToNumber(item.perfRetained as string);
          item.perfAnnounced = stringToNumber(item.perfAnnounced as string);
          item.perfAchieved = stringToNumber(item.perfAchieved as string);
        }
        if (typeof item.firstName === "string") {
          item.firstName =
            item.firstName.charAt(0).toUpperCase() +
            item.firstName.slice(1).toLowerCase();
        }
        item.season = season;
        // item.city = city;
        delete item.disciplineName;

      });
    } else if (selectedTable === "competitions") {
      data.forEach((item: GenericStringIndex) => {
        Number(item.id);
        item.id = Number(item.id);
        item.season = season;
        item.startedAt = new Date(item.startedAt as string);
        item.endedAt = new Date(item.endedAt as string);
      });
    }

    return data;
  };

  const getCompetitionList = async () => {
      const table = "competitions";
      const res = await fetch(`/api/get-data?table=${table}&fields=id,name,city`);
      const data = await res.json();
    if (Array.isArray(data) && data.length) {
      sortBy("id", data);
      setCompetitionList(data);
    }
  };

  const getDisciplinesList = async () => {
    const table = "disciplines";
    const res = await fetch(`/api/get-data?table=${table}&fields=id,name`);
    const data = await res.json();
    if (data) {
      setDisciplinesList(data);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addMultiData(selectedTable, preparedData);
    setPreparedData([]);
    setSelectedTable("");
  };

  useEffect(() => {
    const getTableAttributes = () => {
      const tableAttributes: AttributesType[] =
        databaseAttributes[selectedTable as keyof typeof databaseAttributes];
      setTableAttributes(tableAttributes);
    };

    if (databaseAttributes && selectedTable) {
      getTableAttributes();
    }

    if (selectedTable === "results") {
      getCompetitionList();
      getDisciplinesList();
    }
  }, [selectedTable]);

  return (
    <form onSubmit={handleSubmit} id="addData-form">
      <InputSelect
        id="tableList"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setSelectedTable(e.target.value);
          setSelectedCompetition("");
          setPreparedData([]);
        }}
        value={selectedTable}
        defaultText="Choisissez un type d'import"
        options={["competitions", "results"]}
      />
      {selectedTable && (
        <>
          <InputSelect
            id="seasonList"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSeason(e.target.value);
              setPreparedData([]);
            }}
            value={season}
            defaultText="Choisissez une saison"
            options={["2024-25", "2025-26"]}
          />
          {selectedTable === "results" && Boolean(competitionList.length) && (
            <>
              <InputSelect
                id="competitionList"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSelectedCompetition(e.target.value);
                  setPreparedData([]);
                }}
                value={selectedCompetition}
                defaultText="Choisissez une comptétition"
                options={competitionList}
                schema="competition-name"
              />
            </>
          )}
          {(selectedTable === "competitions" || selectedCompetition) && (
            <input
              type="file"
              name="file"
              onChange={changeHandler}
              accept=".csv"
            />
          )}
          {Boolean(preparedData.length) && (
            <button type="submit">Submit</button>
          )}
          <table>
            <thead>
              <tr>
                {Boolean(tableAttributes?.length) &&
                  tableAttributes.map((attr) => {
                      if (!attr.displayImport) {
                        return null;
                      }
                    return <th key={attr.name}>{attr.label}</th>
                  })}
              </tr>
            </thead>
            <tbody>
              {preparedData.map((val: GenericStringIndex, i) => {
                return (
                  <tr key={i}>
                    {tableAttributes.map((attr) => {
                      if (!attr.displayImport) {
                        return null;
                      }
                      if (
                        attr.name !== "startedAt" &&
                        attr.name !== "endedAt"
                      ) {
                        return <td key={attr.name}>{val[attr.name] as string}</td>;
                      } else {
                        const value = val[attr.name] as string;
                        return (
                          <td key={attr.name}>
                            {formatDateISOToString(value as string)}
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </form>
  );
};

export default ImportData;
