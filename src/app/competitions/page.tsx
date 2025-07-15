// Components
import CompetitionsClient from "./CompetitionsClient"

// Utils
import { getCompetitionList } from "@lib/database/dbutils";

const Competitions = async () => {
  const competitions = await getCompetitionList(); // cette fonction sera effectuée coté serveur

  return <CompetitionsClient competitionList={competitions} />;
};

export default Competitions;
