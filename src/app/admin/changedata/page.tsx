"use client"

import { useEffect, useState } from "react"
import { 
  scanTable,
  queryRangeCommand,
  // updateData
} from "../../../../lib/database/dbCommands";
import { sortBy } from "@/utils/sort";
import { GenericStringIndex } from "@/app/type/generic";

const ChangeData = () => {
  const [competitionList, setCompetitionList] = useState<GenericStringIndex[]>([]);
  const [fullResults, setFullResults] = useState<GenericStringIndex[]>([]);

  // const updateItem = async (tableName: string, keys: object, data: object) => {
  //   setTimeout(() => {
  //     console.log('itemToUpdate', data);

  //   },200);
  //   await updateData(tableName, keys, data);
  // }

  const change = async () => {
    for await (const item of fullResults) {
      const newCity = competitionList.find((comp) => comp.id === item.competitionId)?.city as string;
      item.city = newCity;
      console.log('itemToUpdate', item);
      // const status = await updateItem('results', { id: item.id }, item);
      // console.log('status' ,status);
    }
  }

  const getCompetitionList = async () => {
      const data = await scanTable('competitions');
      if (data) {
        sortBy('id', data);
        setCompetitionList(data);
      }
  }

  useEffect(() => {
    getCompetitionList();
  }, []);

  useEffect(() => {
    const buildQuery = (lastEvaluatedKey: object | undefined) => {
      const params = {
        TableName: "results",
        IndexName: 'season-index',
        KeyConditionExpression:'season = :season',
        ExpressionAttributeValues: {
          ":season": '2024-25',
        },
        ...(lastEvaluatedKey && {ExclusiveStartKey: lastEvaluatedKey})
      }

      return params;
    }

    const getData = async () => {
      let lastEvaluatedKey: object | undefined = undefined;
      let resultItems: GenericStringIndex[] = [];
  
      do {
        const params = buildQuery(lastEvaluatedKey);
        const result = await queryRangeCommand(params);
        resultItems = resultItems.concat(result.Items as GenericStringIndex[]);
        lastEvaluatedKey = result.LastEvaluatedKey;
      } while (lastEvaluatedKey !== undefined)
  
      if (!resultItems.length) {
        return;
      }

      sortBy('perfRetained', resultItems);
      setFullResults(resultItems || []);
    }

    getData();
  }, []);

  return (
    <button onClick={() => change()}>Action</button>
  )
}

export default ChangeData;
