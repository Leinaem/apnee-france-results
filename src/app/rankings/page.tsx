import { getCompetitionList, getDisciplineList } from "@lib/database/dbutils";

// Components
import RankingsClient from "./RankingsClient";

// Types
import { GenericStringIndexWithDate } from "@/app/type/generic";

const RankingsPage = async () => {
  const [competitionList, disciplineList]: [GenericStringIndexWithDate[], GenericStringIndexWithDate[]] = await Promise.all([
    getCompetitionList(["id", "name", "city", "type"]),
    getDisciplineList(),
  ]);

  return (
    <div className="page page-rankings">
      <h2 className="page page-title">Classements</h2>
      <RankingsClient competitionList={competitionList} disciplineList={disciplineList} />
    </div>
  );
};

export default RankingsPage;
