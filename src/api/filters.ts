import qs from "qs";
import { state, Filters } from "types";

function _parseWhere(
  where: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined,
) {
  const defaultWhere = {
    name: null,
    display_name: null,
    state: "active" as state,
  };
  if (typeof where !== "string" || where === undefined) {
    return {
      ...defaultWhere,
    };
  }
  return where.split(",").reduce(
    (acc: Filters["where"], filter: string) => {
      const [key, ...rest] = filter.split(":");
      const value = rest.join(":");
      switch (key) {
        case "name":
        case "display_name":
          acc[key] = value;
          break;
        case "state":
          acc[key] = (value as state) || "active";
          break;
        default:
        // pass
      }
      return acc;
    },
    {
      ...defaultWhere,
    },
  );
}

export function parseFiltersFromSearch(search: string): Filters {
  const {
    limit: limitParam,
    offset: offsetParam,
    page: pageString = "1",
    perPage: perPageString = "20",
    sort = "-created_at",
    where: whereString,
  } = qs.parse(search.replace(/^\?/, ""));
  const limit =
    limitParam === undefined
      ? parseInt(perPageString as string, 10)
      : parseInt(limitParam as string, 10);
  const offset =
    offsetParam === undefined
      ? (parseInt(pageString as string, 10) - 1) * limit
      : parseInt(offsetParam as string, 10);
  return {
    limit,
    offset,
    sort: sort as string,
    where: _parseWhere(whereString),
  };
}

function _getWhereFromFilters(whereFilters: Filters["where"]) {
  let keyValues: string[] = [];
  Object.entries(whereFilters).forEach(([key, value]) => {
    if (["name", "display_name", "state"].includes(key) && value) {
      keyValues.push(`${key}:${value}`);
    }
  });
  return keyValues.join(",");
}

export function createSearchFromFilters(filters: Filters): string {
  let search = `?limit=${filters.limit}&offset=${filters.offset}&sort=${filters.sort}`;
  const where = _getWhereFromFilters(filters.where);
  if (where) {
    search += `&where=${where}`;
  }
  return search;
}

export function offsetAndLimitToPage(offset: number, limit: number) {
  return limit > 0 ? Math.round(offset / limit) + 1 : 1;
}

export function pageAndLimitToOffset(page: number, limit: number) {
  const offset = (page - 1) * limit;
  return offset > 0 ? offset : 0;
}
