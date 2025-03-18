// Type.
import { GenericStringIndex } from '@/app/type/generic';

export const queryRangeResults = async (args: GenericStringIndex) => {
    const { tableName, selectedCompetition, selectedCategory } = args;
  
  
    const params = {
      TableName: "results",
      ...selectedCompetition && {
        IndexName: 'competitionId-index',
        KeyConditionExpression:'competitionId = :competitionId',
        ExpressionAttributeValues: {
          ':competitionId': selectedCompetition,
          }
      },
      ...(!selectedCompetition && selectedCategory) && {
        IndexName: 'categoryId-index',
        KeyConditionExpression:'categoryId = :categoryId',
        ExpressionAttributeValues: {
          ':categoryId': selectedCategory,
          }
      },
      ...(selectedCompetition && selectedCategory) && {
        FilterExpression:'categoryId = :categoryId',
        ExpressionAttributeValues: {
          ":categoryId": selectedCategory,
          ':competitionId': selectedCompetition,
        }
      }
    }
    const command = new QueryCommand(params);
  
    const response = await ddbClient.send(command);
    console.log(response);
    return response;
  }