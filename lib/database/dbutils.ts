import { prisma } from "@lib/database/prisma";
import type { Prisma } from "@prisma/client";
import { sortBy } from "@/utils/sort";
import { GenericStringIndexWithDate } from "@/app/type/generic";

export const buildQueryRangeSearchParams = (
  search: string,
  lastEvaluatedKey: object | undefined
) => {

  const params = {
    TableName: "results",
    FilterExpression: "contains(#ln, :lastNameVal) OR contains(#fn, :firstNameVal) OR contains(#fn, :firstNameValMin)",
    ExpressionAttributeNames: {
      "#ln": "lastName",
      "#fn": "firstName"
    },
    ExpressionAttributeValues: {
      ":lastNameVal": search.toUpperCase(),    // car lastName est stocké en MAJ
      ":firstNameVal": search.charAt(0).toUpperCase() + search.slice(1).toLowerCase(), // car firstName est stocké en minuscule avec La 1ère lattre en majuscule
      ":firstNameValMin": search, // car tout en minuscule après la 1ère lettre
    },
    ...(lastEvaluatedKey && {ExclusiveStartKey: lastEvaluatedKey}),
  }

  return params;
}

type CompetitionField = keyof Prisma.CompetitionSelect;
export const getCompetitionList = async (fields?: CompetitionField[]): Promise<GenericStringIndexWithDate[]> => {

  const select = fields?.length
    ? fields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {} as Prisma.CompetitionSelect)
    : undefined;

  const competitions = await prisma.competition.findMany({ select });
  if (competitions?.length) {
    sortBy("id", competitions);
    return competitions; 
  }

  return [];
};

type DisciplinesField = keyof Prisma.DisciplineSelect;
export const getDisciplineList = async (fields?: DisciplinesField[]): Promise<GenericStringIndexWithDate[]> => {

  const select = fields?.length
    ? fields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {} as Prisma.DisciplineSelect)
    : undefined;

  const disciplines = await prisma.discipline.findMany({ select });

  if (disciplines?.length) {
    sortBy("id", disciplines);
    return disciplines; 
  }

  return [];
}

export const getResultsByCompetitionId = async (competitionId: number) => {
  return prisma.result.findMany({
    where: { competitionId }
  });
};
