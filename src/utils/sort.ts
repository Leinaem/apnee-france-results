import { GenericStringIndex } from "@/app/type/generic";

export const sortBy = (
  type: string,
  array: GenericStringIndex[],
  direction: string = "asc",
  additionalType: string = "",
) => {
  return array?.sort((a, b) => {
    const c = a[type] as number;
    const d = b[type] as number;
    const e = a[additionalType] as number;
    const f = b[additionalType] as number;

    if (typeof c === "string" && c === "DSQ") {
      return 1;
    } else if (typeof d === "string" && d === "DSQ") {
      return -1;
    }

    if (typeof c === "string" && c === "00:00:00") {
      return 1;
    } else if (typeof d === "string" && d === "00:00:00") {
      return -1;
    }

    if (typeof e === "string" && e === "INVITE - NON CLASSE") {
      return 1;
    } else if (typeof f === "string" && f === "INVITE - NON CLASSE") {
      return -1;
    }

    if (c > d) {
      return direction === "asc" ? 1 : -1;
    } else {
      return direction === "asc" ? -1 : 1;
    }
  });
};
