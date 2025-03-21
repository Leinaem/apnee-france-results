import { GenericStringIndex } from "@/app/type/generic";

export const getAssetsUrl = (url: string): string => `${process.env.NEXT_PUBLIC_ASSET_URL}${url}`;

export const stringToNumber = (str: string): number | string => {
  const num: number = Number(parseFloat(str.replace(',','.')).toFixed(2));
  return isNaN(num) ? str : num;
}

export const numberToStringTwoDecimals = (num: number): string | number => {
  if (isNaN(num)) {
    return num;
  }
  return num.toFixed(2);
}

// Used to get categories where perf are distance.
export const getCategoryPerfByDistance = (categoryList: GenericStringIndex[]) => {
  const categoryPerfByDistance: Array<number>= [];
  categoryList.forEach((category) => {
    const id = category.id as number 
    if (category.perfUnitType === 'distance') {
      categoryPerfByDistance.push(id);
    }
  });

  return categoryPerfByDistance;
}
