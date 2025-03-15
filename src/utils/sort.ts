import { GenericStringIndex } from "@/app/type/generic";

/**
 * Sort an array of objects by a choosen property with alphabetic values
 *
 * @param {String} type property to sort
 * @param {Array} array Array to sort
 * @return {Array | void} sorted array
 */
export const sortByAlpha = (type: string, array: GenericStringIndex[]) =>
  array?.sort((a, b) => {
    if (a[type] > b[type]) {
      return 1;
    }
    if (b[type] > a[type]) {
      return -1;
    }

    return 0;
  }
);
