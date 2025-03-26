import { scanTable } from "./dbCommands";
import { GenericStringIndex } from "@/app/type/generic";

export const buildQueryRangeResultsParams = (
  selectedCompetition: number,
  selectedDisciplinesId: number[],
) => {

  console.log('result params : ', selectedDisciplinesId);
  // Custom filter with values
  const filterExpressions: string[] = [];
  const ExpressionAttributeValues: Record<number, number> = {};

  if (selectedDisciplinesId && selectedDisciplinesId.length) {
    selectedDisciplinesId.forEach((data, index) => {
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

    ...(selectedDisciplinesId && selectedDisciplinesId.length && {
      FilterExpression:`categoryId IN (${filterExpressions.join(',')})`,
      ExpressionAttributeValues: {
        ...ExpressionAttributeValues
      }
    }),
  }

  return params;
}

export const buildQueryRangeRankingParams = (selectedCategoryId: number[]) => {

  const filterExpressions: string[] = [];
  const ExpressionAttributeValues: Record<number, number> = {};
  selectedCategoryId.forEach((data, index) => {
    filterExpressions.push(`:id${index}`);
    ExpressionAttributeValues[`:id${index}`] = data;
  });

  const params = {
    TableName: "results",
    ConditionExpression:'attribute_not_exists(id)',
    IndexName: 'season-index',
    KeyConditionExpression:'season = :season',
    FilterExpression:`categoryId IN (${filterExpressions.join(',')})`,
    ExpressionAttributeValues: {
      ...ExpressionAttributeValues,
      ":season": '2024-25',
    }
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