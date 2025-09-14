// Components
import Result from './ResultsClient';

// Utils
import { getCompetitionList, getDisciplineList, getResultsByCompetitionId } from "@lib/database/dbutils";

// Types
import { GenericStringIndex } from "@/app/type/generic";
import { TableListResultsType } from "@/app/type/database";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResultsPage = async ({ params }: any) => {
  const competitionId = parseInt(params.competitionId, 10);
  const [competitionList, disciplineList, initialRresults] = await Promise.all([
    getCompetitionList(["id", "name", "city", "season"]),
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

    function findById(id: number) {
    for (const yearBlock of competitionList) {
      const yearBlockData = yearBlock.data as GenericStringIndex[];
      const found = yearBlockData.find((item) => item.id === id);
      if (found) return found;
    }
    return undefined;
  }

  const competitionData = findById(competitionId);
  
  return (
    <div>
      <Result
        competitionList={competitionList as GenericStringIndex[]}
        disciplineList={disciplineList as GenericStringIndex[]}
        competitionResults={results}
        competitionData={competitionData as GenericStringIndex}
      />
    </div>
  );
};

export default ResultsPage;
