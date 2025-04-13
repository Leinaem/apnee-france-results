import { scanTable } from "./dbCommands";
import { GenericStringIndex } from "@/app/type/generic";

export const buildQueryRangeResultsParams = (
  selectedCompetition: number,
  selectedDisciplinesId: number[],
) => {

  // Custom filter with values
  const filterExpressions: string[] = [];
  const ExpressionAttributeValues: Record<string, number> = {};

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

export const buildQueryRangeRankingParams = (selectedCategoryId: number[], lastEvaluatedKey: object | undefined) => {
  const filterExpressions: string[] = [];
  const ExpressionAttributeValues: Record<string, number> = {};
  selectedCategoryId.forEach((data, index) => {
    filterExpressions.push(`:id${index}`);
    ExpressionAttributeValues[`:id${index}`] = data;
  });

  const params = {
    TableName: "results",
    IndexName: 'season-index',
    KeyConditionExpression:'season = :season',
    FilterExpression:`categoryId IN (${filterExpressions.join(',')})`,
    ExpressionAttributeValues: {
      ...ExpressionAttributeValues,
      ":season": '2024-25',
    },
    ...(lastEvaluatedKey && {ExclusiveStartKey: lastEvaluatedKey})
  }

  return params;
}

export const getCompetitionList = async (): Promise<GenericStringIndex[]> => {
  const data = await scanTable('competitions');
  if (data) {
    return data;
  }

  return [];
}

export const getTypeCompetitionsIds = async (types: string[]): Promise<number[]> => {
  const competitionList = await getCompetitionList();
  const ids: number[] = []

  competitionList.forEach((comp) => {
    if (types.includes(String(comp.type))) {
      ids.push(Number(comp.id));
    }
  });

  return ids;
}
