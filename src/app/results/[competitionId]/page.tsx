

// Components
import Result from './ResultsClient';

// Utils
import { getCompetitionList, getDisciplineList, getResultsByCompetitionId } from "@lib/database/dbutils";

// Types
import { GenericStringIndex } from "@/app/type/generic";
import { TableListResultsType } from "@/app/type/database";

// Components
import CompetitionListSelect from "../../components/results/CompetitionListSelect";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResultsPage = async ({ params }: any) => {
  const competitionId = parseInt(params.competitionId, 10);
  const [competitionList, disciplineList, initialRresults] = await Promise.all([
    getCompetitionList(["id", "name", "city"]),
    getDisciplineList(),
    getResultsByCompetitionId(competitionId),
  ]);

  
  const results = {} as TableListResultsType;
  if (initialRresults.length) {
    initialRresults.forEach((item: GenericStringIndex) => {
      const disciplineId = item.disciplineId as keyof typeof results;
      if (disciplineId) {
        if (results[disciplineId] === undefined) {
          results[disciplineId] = [];
          Object.defineProperty(results, disciplineId, []);
        }
      }
      results[disciplineId as keyof typeof results]?.push(
        item,
      );
    });
  }
  
  return (
    <div>
      <CompetitionListSelect options={competitionList as GenericStringIndex[]} />
      <Result
        competitionList={competitionList as GenericStringIndex[]}
        disciplineList={disciplineList as GenericStringIndex[]}
        competitionId={competitionId}
        results={results}
      />
    </div>
  );
};

export default ResultsPage;
