// Components
import CompetitionsClient from "./CompetitionsClient"

// Utils
import { getCompetitionList } from "@lib/database/dbutils";

const Competitions = async () => {
  const data = await getCompetitionList(); // cette fonction sera effectuée coté serveur

  return <CompetitionsClient competitionList={data} />;
};

export default Competitions;
