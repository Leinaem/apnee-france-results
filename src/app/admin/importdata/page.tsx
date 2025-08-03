// Components
import ImportDataClent from './ImportDataClent';

// Utils
import { getCompetitionList, getDisciplineList } from "@lib/database/dbutils";

const ImportData = async () => {

    const competitionList = await getCompetitionList();
    const disciplineList = await getDisciplineList();

    return <ImportDataClent competitionList={competitionList} disciplineList={disciplineList} />;
}

export default ImportData;
