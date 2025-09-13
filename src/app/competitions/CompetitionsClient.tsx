"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from 'next/link';

// Types
import { GenericStringIndex } from "@/app/type/generic";
import { AttributesType } from "@/app/type/database";

// JSON
import databaseAttributes from "../json/databaseAttributes.json";

// Components
import ConditionalWrapper from "../components/partials/ConditionalWrapper";
import YearTabs from "../components/YearTabs";

interface CompetitionsClientProps {
  competitionList: GenericStringIndex[];
}

const CompetitionsClient = ({ competitionList }: CompetitionsClientProps) => {
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);
  const [activeTab, setActiveTab] = useState(competitionList[0].year);

  useEffect(() => {
    setTableAttributes(databaseAttributes["competitions"]);
  }, []);

  return (
    <div className="page page-competitions">
    <h2 className="page page-title">Liste des compétitions</h2>
      {/* Onglets */}
      <YearTabs activeTab={activeTab as string} setActiveTab={setActiveTab} competitionList={competitionList} />
      {/* Contenu */}
        <div className="table-container">
        {
          Boolean(tableAttributes?.length) &&
          competitionList.map((season) => season.year === activeTab && (
            <table key={season.year as string}>
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
                {Array.isArray(season.data) && season.data.map((comp: GenericStringIndex) => {
                  return (
                    <tr key={comp.id as string}>
                      {tableAttributes.map((attr) => {
                        if (!attr.displayCompetitionsTable) {
                          return null;
                        }
                        const isDate =
                          attr.name === "endedAt" || attr.name === "startedAt";
                        return (
                          <td key={attr.name} className={isDate ? "nowrap" : ""} >
                            <ConditionalWrapper
                              condition={attr.name === 'name'}
                              wrapper={(children: ReactNode) => {
                                return <Link href={`/results/${comp.id}/`}>{children}</Link>;
                              }}
                            >
                              {comp[attr.name]}
                            </ConditionalWrapper>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ))
        }
      </div>
    </div>
  );
};

export default CompetitionsClient;
