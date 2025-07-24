

// Components
import Result from './ResultsClient';

// Utils
import { getCompetitionList, getDisciplineList } from "@lib/database/dbutils";

// Types
import { GenericStringIndex } from "@/app/type/generic";

const ResultsPage = async () => {
  const competitionList = await getCompetitionList(["id", "name", "city"]);
  const disciplineList = await getDisciplineList();
  
  return (
    <Result
      competitionList={competitionList as GenericStringIndex[]}
      disciplineList={disciplineList as GenericStringIndex[]}
    />
  );
};

export default ResultsPage;
