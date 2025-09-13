import { prisma } from "@lib/database/prisma";

// Types
import type { Prisma } from "@prisma/client";
import { GenericStringIndexWithDate, GenericStringIndex } from "@/app/type/generic";

// Utils
import { sortBy } from "@/utils/sort";
import { formatDateISOToString } from "@/utils/utils";

type CompetitionField = keyof Prisma.CompetitionSelect;
export const getCompetitionList = async (fields?: CompetitionField[]): Promise<GenericStringIndex[]> => {

  const select = fields?.length
    ? fields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {} as Prisma.CompetitionSelect)
    : undefined;

  const competitions = await prisma.competition.findMany({ select });
  if (competitions?.length) {
    sortBy("id", competitions);

    const formattedData: GenericStringIndex[] = [];
    competitions.forEach((item) => {
      const formattedItem = {
      ...item,
      startedAt: item.startedAt
        ? formatDateISOToString(item.startedAt as Date)
        : "",
      endedAt: item.endedAt
        ? formatDateISOToString(item.endedAt as Date)
        : "",
      }

      if (!formattedData.find((i) => i.year === item.season)) {
        formattedData.push({
          year: item.season as string,
          data: [],
        });
      }

      const formattedDataYearTemp: GenericStringIndex[] = formattedData.find((i) => i.year === item.season)?.data as [] || [];
      formattedDataYearTemp.push(formattedItem as GenericStringIndex);
    });

    return formattedData; 
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
