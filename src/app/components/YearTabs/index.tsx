import { Fragment } from "react";

// Types
import { GenericStringIndex } from "@/app/type/generic";

// Components
import TabItem from "../partials/TabItem";

interface YearTabsProps {
  activeTab: string;
  competitionList: GenericStringIndex[];
  setActiveTab(newValue: string): void;
}

const YearTabs = ({activeTab, setActiveTab, competitionList}: YearTabsProps) => {
  return (
    <div className="tabs-container">
      {competitionList.map((season) => {
        return (
          <Fragment key={season.year as string}>
            <TabItem value={season.year as string} setActiveTab={setActiveTab} activeTab={activeTab} />
          </Fragment>
        )
      })}
    </div>
  );
}

export default YearTabs;
