"use client";

import { useState, useEffect } from "react";

// Types
import { GenericStringIndex } from "@/app/type/generic";
import { AttributesType } from "@/app/type/database";

// JSON
import databaseAttributes from "../json/databaseAttributes.json";

interface CompetitionsClientProps {
  competitionList: GenericStringIndex[];
}

const CompetitionsClient = ({ competitionList }: CompetitionsClientProps) => {
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);

  useEffect(() => {
    setTableAttributes(databaseAttributes["competitions"]);
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
                            {comp[attr.name]}
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

export default CompetitionsClient;
