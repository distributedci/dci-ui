import qs from "qs";
import { state, Filters } from "types";

function _parseWhere(
  where: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined,
  defaultWhere: Filters["where"],
) {
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
        case "team_id":
        case "email":
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

export function offsetAndLimitToPage(offset: number, limit: number) {
  return limit > 0 ? Math.round(offset / limit) + 1 : 1;
}

export function pageAndLimitToOffset(page: number, limit: number) {
  const offset = (page - 1) * limit;
  return offset > 0 ? offset : 0;
}

export function parseFiltersFromSearch(
  search: string,
  filters: Partial<Filters> = {},
): Filters {
  const defaultFilters: Filters = {
    limit: 20,
    offset: 0,
    sort: "-created_at",
    ...filters,
    where: {
      name: null,
      display_name: null,
      team_id: null,
      email: null,
      state: "active" as state,
      ...filters.where,
    },
  };
  const {
    limit: limitParam,
    offset: offsetParam,
    page: pageString,
    perPage: perPageString,
    sort,
    where: whereString,
  } = qs.parse(search.replace(/^\?/, ""));
  const limit =
    limitParam === undefined
      ? perPageString === undefined
        ? defaultFilters.limit
        : parseInt(perPageString as string, 10)
      : parseInt(limitParam as string, 10);
  const offset =
    offsetParam === undefined
      ? pageString === undefined
        ? defaultFilters.offset
        : pageAndLimitToOffset(parseInt(pageString as string, 10), limit)
      : parseInt(offsetParam as string, 10);
  return {
    limit,
    offset,
    sort: sort === undefined ? defaultFilters.sort : (sort as string),
    where: _parseWhere(whereString, defaultFilters.where),
  };
}

function _getWhereFromFilters(whereFilters: Filters["where"]) {
  let keyValues: string[] = [];
  Object.entries(whereFilters).forEach(([key, value]) => {
    if (["name", "display_name", "email", "team_id", "state"].includes(key) && value) {
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
