import { scanTable } from "./dbCommands";
import { GenericStringIndex } from "@/app/type/generic";

export const buildQueryRangeResultsParams = (
  selectedCompetition: number,
  selectedDisciplinesId: number[],
) => {

  // Custom filter with values
  const filterExpressions: string[] = [];
  const ExpressionAttributeValues: Record<number, number> = {};

  if (selectedDisciplinesId && selectedDisciplinesId.length) {
    selectedDisciplinesId.forEach((data, index) => {
      filterExpressions.push(`:id${index}`);
      ExpressionAttributeValues[`:id${index}` as any] = data;
    });
  
    ExpressionAttributeValues[':competitionId' as any] = selectedCompetition;
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

export const buildQueryRangeRankingParams = (selectedCategoryId: number[], lastEvaluatedKey: object) => {
  const filterExpressions: string[] = [];
  const ExpressionAttributeValues: Record<number, number> = {};
  selectedCategoryId.forEach((data, index) => {
    filterExpressions.push(`:id${index}`);
    ExpressionAttributeValues[`:id${index}` as any] = data;
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

export const getTypeCompetitionsIds = async (types: String[]): Promise<number[]> => {
  const competitionList = await getCompetitionList();
  const ids: number[] = []

  competitionList.forEach((comp, i) => {
    if (types.includes(String(comp.type))) {
      ids.push(Number(comp.id));
    }
  });

  return ids;
}
