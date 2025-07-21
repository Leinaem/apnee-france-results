// Components
import CompetitionsClient from "./CompetitionsClient"

// Utils
import { getCompetitionList } from "@lib/database/dbutils";
import { formatDateISOToString } from "@/utils/utils";

const Competitions = async () => {
  const data = await getCompetitionList(); // cette fonction sera effectuée coté serveur

    const formattedData = data.map((comp) => ({
    ...comp,
    startedAt: comp.startedAt
      ? formatDateISOToString(comp.startedAt as Date)
      : "",
    endedAt: comp.endedAt
    ? formatDateISOToString(comp.endedAt as Date)
      : "",
  }));

  return <CompetitionsClient competitionList={formattedData} />;
};

export default Competitions;
