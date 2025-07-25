import { getCompetitionList } from "@lib/database/dbutils";

// Components
import CompetitionListSelect from "../components/results/CompetitionListSelect";

// Types
import { GenericStringIndexWithDate, GenericStringIndex } from "@/app/type/generic";

const ResultsPage = async () => {

  const [competitionList]: [GenericStringIndexWithDate[]] = await Promise.all([
    getCompetitionList(["id", "name", "city"])
  ]);

  return (
    <div>
      <h3>Veuillez sélectionner une compétition pour voir les résultats.</h3>
      <CompetitionListSelect options={competitionList as GenericStringIndex[]} />
    </div>
  );
};

export default ResultsPage;
