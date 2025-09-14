"use client";
import { useState } from "react";

// components
import CompetitionListSelect from "../components/results/CompetitionListSelect";

// Types
import { GenericStringIndex } from "@/app/type/generic";
import YearTabs from "../components/YearTabs";

interface ResultsClientProps {
  competitionList: GenericStringIndex[];
}

const ResultClient = ({competitionList}: ResultsClientProps) => {
  const [activeTab, setActiveTab] = useState(competitionList[0].year);
  const options = competitionList.find((list) => list.year === activeTab)?.data as GenericStringIndex[] || [];

  return (
    <>
      <YearTabs activeTab={activeTab as string} competitionList={competitionList} setActiveTab={setActiveTab} />
      <CompetitionListSelect options={options as GenericStringIndex[]} />
    </>
  )
}

export default ResultClient;
