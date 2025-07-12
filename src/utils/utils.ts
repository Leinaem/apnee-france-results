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
export const getCategoryPerfByDistance = (
  categoryList: GenericStringIndex[],
) => {
  const categoryPerfByDistance: Array<number> = [];
  categoryList.forEach((category) => {
    const id = category.id as number;
    if (category.perfUnitType === "distance") {
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

export const formatDateISOToString = (ISODate: String) => {
  if (!ISODate) {
    return "";
  }

  const date = new Date(String(ISODate));
  return (
    date
      .toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replace(/\b(\w+)\./, "$1") || ""
  );
};
