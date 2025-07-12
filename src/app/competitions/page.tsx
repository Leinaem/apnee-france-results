"use client";

import { useState, useEffect } from "react";

// Compoents
// import ConditionalWrapper from "../components/partials/ConditionalWrapper";

// Utils.
import { sortBy } from "@/utils/sort";
import { formatDateISOToString } from "@/utils/utils";

// Types.
import { GenericStringIndex } from "@/app/type/generic";
import { AttributesType } from "@/app/type/database";

// Others.
import databaseAttributes from "../json/databaseAttributes.json";

const Competitions = () => {
  const [competitionList, setCompetitionList] = useState<GenericStringIndex[]>(
    [],
  );
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);
  const pageType = "competitions";

  useEffect(() => {
    const getCompetitionList = async () => {
      const table = "competitions";
      const res = await fetch(`/api/get-data?table=${table}`);
      const data = await res.json();

      if (data?.length) {
        sortBy("id", data);
        setCompetitionList(data);
      }
    };

    getCompetitionList();
    const tableAttributes: AttributesType[] = databaseAttributes[pageType];
    setTableAttributes(tableAttributes);
  }, []);

  return (
    <div className="page page-competitions">
      <h2 className="page page-title">Liste des compétitions</h2>
      <div className="table-container">
        {Boolean(tableAttributes?.length) &&
          Boolean(competitionList?.length) && (
            <table>
              <thead>
                <tr>
                  {tableAttributes.map((attr) => {
                    if (!attr.displayCompetitionsTable) {
                      return null;
                    }
                    return <th key={attr.name}>{attr.label}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {competitionList.map((comp: GenericStringIndex, i) => {
                  return (
                    <tr key={i}>
                      {tableAttributes.map((attr) => {
                        if (!attr.displayCompetitionsTable) {
                          return null;
                        }
                        const isDate =
                          attr.name === "endedAt" || attr.name === "startedAt";
                        return (
                          <td
                            key={attr.name}
                            className={isDate ? "nowrap" : ""}
                          >
                            {isDate
                              ? formatDateISOToString(comp[attr.name] as String)
                              : comp[attr.name]}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
      </div>
    </div>
  );
};

export default Competitions;
