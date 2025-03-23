import { scanTable } from "./dbCommands";
import { GenericStringIndex } from "@/app/type/generic";

export const buildQueryRangeResultsParams = (
  selectedCompetition: number,
  selectedDisciplines: number[],
) => {


  // Custom filter with values
  const filterExpressions: string[] = [];
  const ExpressionAttributeValues: Record<number, number> = {};

  if (selectedDisciplines && selectedDisciplines.length) {
    selectedDisciplines.forEach((data, index) => {
      filterExpressions.push(`:id${index}`);
      ExpressionAttributeValues[`:id${index}`] = data;
    });
  
    ExpressionAttributeValues[':competitionId'] = selectedCompetition;
  }


  const params = {
    TableName: "results",
    ConditionExpression:'attribute_not_exists(id)',
    ...selectedCompetition && {
      IndexName: 'competitionId-index',
      KeyConditionExpression:'competitionId = :competitionId',
      ExpressionAttributeValues: {
        ':competitionId': selectedCompetition,
        }
    },

    ...(selectedDisciplines && selectedDisciplines.length && {
      FilterExpression:`categoryId IN (${filterExpressions.join(',')})`,
      ExpressionAttributeValues: {
        ...ExpressionAttributeValues
      }
    }),
  }

  return params;
}

export const getCompetitionList = async (): GenericStringIndex[] => {
  const data = await scanTable('competitions');
  if (data) {
    return data;
  }

  return [];
}