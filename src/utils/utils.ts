import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { GenericStringIndex, CategoryMappingIdType } from "@/app/type/generic";
import { CATEGORY_GROUP_LIST } from "./const";

export const getAssetsUrl = (url: string): string =>
  `${process.env.NEXT_PUBLIC_ASSET_URL}${url}`;

export const stringToNumber = (str: string): number | string => {
  const num: number = Number(parseFloat(str.replace(",", ".")).toFixed(2));
  return isNaN(num) ? str : num;
};

export const numberToStringTwoDecimals = (num: number): string | number => {
  if (isNaN(num) || !num) {
    return num;
  }
  return num.toFixed(2);
};

// Used to get categories where perf are distance.
export const getDisciplinePerfByDistance = (
  disciplineList: GenericStringIndex[],
) => {
  const categoryPerfByDistance: Array<number> = [];
  disciplineList.forEach((disc) => {
    const id = disc.id as number;
    if (disc.perfUnitType === "distance") {
      categoryPerfByDistance.push(id);
    }
  });

  return categoryPerfByDistance;
};

export const getCategoryMappingId = (categoryList: GenericStringIndex[]) => {
  const categoryMappingId: CategoryMappingIdType = {};
  CATEGORY_GROUP_LIST.map((shortName) => {
    categoryMappingId[shortName] = [];
    categoryList.forEach((cat) => {
      if (String(cat.name)?.includes(shortName)) {
        categoryMappingId[shortName].push({
          id: Number(cat.id),
          name: cat.name,
        });
      }
    });
  });

  return categoryMappingId;
};

export const formatDateISOToString = (isoDate: Date) => {
  if (!isoDate) {
    return "";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
    .format(new Date(isoDate as Date))
    .replace(/\b(\w+)\./, "$1"); // supprime le point si nécessaire (ex: "oct.")
};
