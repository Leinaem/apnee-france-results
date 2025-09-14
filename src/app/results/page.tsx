import { getCompetitionList } from "@lib/database/dbutils";

// Components
import ResultClient from "./ResultClient";

// Types
import { GenericStringIndexWithDate, GenericStringIndex } from "@/app/type/generic";

const ResultsPage = async () => {

  const [competitionList]: [GenericStringIndexWithDate[]] = await Promise.all([
    getCompetitionList(["id", "name", "city", "season"])
  ]);

  return (
    <div>
      <h3>Veuillez sélectionner une compétition pour voir les résultats.</h3>
      <ResultClient competitionList={competitionList as GenericStringIndex[]} />
    </div>
  );
};

export default ResultsPage;
