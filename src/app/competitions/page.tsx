
"use client"
import { useState, useEffect, ReactNode } from "react";
import { scanTable } from "../../../lib/database/dbCommands";

// Compoents
import ConditionalWrapper from "../components/partials/ConditionalWrapper";

// Utils.
import { sortBy } from "@/utils/sort";

// Types.
import { GenericStringIndex } from "@/app/type/generic";
import { AttributesType } from "@/app/type/database";

// Others.
import databaseAttributes from '../json/databaseAttributes.json';

const Competitions = () => {
  const [competitionList, setCompetitionList] = useState<GenericStringIndex[]>([]);
  const [tableAttributes, setTableAttributes] = useState<AttributesType[]>([]);
  const pageType = 'competitions';

  const getCompetitionList = async () => {
    const data = await scanTable(pageType);
    if (data) {
      sortBy('id', data);
      setCompetitionList(data);
    }
  }

  useEffect(() => {
        getCompetitionList();
        const tableAttributes: AttributesType[] = databaseAttributes['results'];
        setTableAttributes(tableAttributes);
  }, []);
  

  return (
    <div className="page page-competitions">
      <h2 className="page page-title">Liste des compétitions</h2>
      <table>
        <thead>
          <tr>
            {Boolean(tableAttributes?.length) && tableAttributes.map((attr) => {
              if (!attr.displayCompetitionsTable) {
                return null;
              }
              return <th key={attr.name}>{attr.label}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {competitionList.map((comp: GenericStringIndex , i) => {
            return (
              <tr key={i}>
                {tableAttributes.map((attr) => {
                  if (!attr.displayCompetitionsTable) {
                    return null;
                  }
                  return (
                    <td key={attr.name}>
                      <ConditionalWrapper
                        condition={attr.name === 'name'}
                        wrapper={(children: ReactNode) => {
                          return <a href={`/results?competitionid=${comp.id}`}  className='af-f-color-main'>{children}</a>;
                      }}
                      >
                        {String(comp[attr.name as string])}
                        
                      </ConditionalWrapper>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Competitions;
