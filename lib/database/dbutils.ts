// Type.
export const buildQueryRangeResultsParams = (
  selectedCompetition: number,
  selectedCategory: number
) => {
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

    return params;
  }