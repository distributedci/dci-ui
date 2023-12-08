import {
  parseFiltersFromSearch,
  createSearchFromFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
} from "./filters";

describe("parseFiltersFromSearch", () => {
  test("parse limit and offset from empty search", () => {
    const { limit, offset } = parseFiltersFromSearch("");
    expect(limit).toBe(20);
    expect(offset).toBe(0);
  });
  test("parse limit and offset from search", () => {
    const { limit, offset } = parseFiltersFromSearch("?limit=100&offset=100");
    expect(limit).toBe(100);
    expect(offset).toBe(100);
  });
  test("parse limit and not offset from search", () => {
    const { limit, offset } = parseFiltersFromSearch("?limit=100");
    expect(limit).toBe(100);
    expect(offset).toBe(0);
  });
  test("parse limit and offset from legacy search (page and perPage)", () => {
    const { limit, offset } = parseFiltersFromSearch("?page=2&perPage=40");
    expect(limit).toBe(40);
    expect(offset).toBe(40);
  });
  test("parse sort from empty search", () => {
    expect(parseFiltersFromSearch("").sort).toBe("-created_at");
  });
  test("parse sort from search", () => {
    expect(parseFiltersFromSearch("?sort=-released_at").sort).toBe(
      "-released_at",
    );
    expect(parseFiltersFromSearch("?sort=released_at").sort).toBe(
      "released_at",
    );
    expect(parseFiltersFromSearch("?sort=-created_at").sort).toBe(
      "-created_at",
    );
    expect(parseFiltersFromSearch("?sort=created_at").sort).toBe("created_at");
    expect(parseFiltersFromSearch("?sort=-updated_at").sort).toBe(
      "-updated_at",
    );
    expect(parseFiltersFromSearch("?sort=updated_at").sort).toBe("updated_at");
  });
  test("parse where from empty search", () => {
    expect(parseFiltersFromSearch("").where).toEqual({
      state: "active",
      name: null,
      display_name: null,
      email: null,
      team_id: null,
    });
  });
  test("parse where from search", () => {
    expect(
      parseFiltersFromSearch("?where=name:RHEL-8*,state:inactive").where,
    ).toEqual({
      state: "inactive",
      name: "RHEL-8*",
      display_name: null,
      email: null,
      team_id: null,
    });
  });
  test("parse where from custom search", () => {
    expect(parseFiltersFromSearch("?where=display_name:RHEL-8*").where).toEqual(
      {
        state: "active",
        name: null,
        team_id: null,
        display_name: "RHEL-8*",
        email: null,
      },
    );
  });
  test("parse where from search where name has multiple colon", () => {
    expect(parseFiltersFromSearch("?where=name:1.2.3:5*").where.name).toBe(
      "1.2.3:5*",
    );
  });
  test("parse search with default value", () => {
    const { limit, offset, sort } = parseFiltersFromSearch("", {
      limit: 100,
      offset: 100,
      sort: "released_at",
    });
    expect(limit).toBe(100);
    expect(offset).toBe(100);
    expect(sort).toBe("released_at");
  });
  test("parse search with default value use info from search string", () => {
    const { limit, offset, sort } = parseFiltersFromSearch(
      "?limit=20&offset=0&sort=-created_at",
      {
        limit: 100,
        offset: 100,
        sort: "released_at",
      },
    );
    expect(limit).toBe(20);
    expect(offset).toBe(0);
    expect(sort).toBe("-created_at");
  });
});

describe("createSearchFromFilters", () => {
  test("create search from default filters", () => {
    expect(
      createSearchFromFilters({
        limit: 100,
        offset: 0,
        sort: "-created_at",
        where: {
          name: null,
          display_name: null,
          email: null,
          team_id: null,
          state: "active",
        },
      }),
    ).toEqual("?limit=100&offset=0&sort=-created_at&where=state:active");
  });

  test("create search from complex filters", () => {
    expect(
      createSearchFromFilters({
        limit: 200,
        offset: 20,
        sort: "-released_at",
        where: {
          name: "name1",
          display_name: "display_name2",
          team_id: "e5147a96-7c76-4415-b01e-edefba96a9c8",
          state: "active",
          email: "test@example.org",
        },
      }),
    ).toEqual(
      "?limit=200&offset=20&sort=-released_at&where=name:name1,display_name:display_name2,team_id:e5147a96-7c76-4415-b01e-edefba96a9c8,state:active,email:test@example.org",
    );
  });
});

describe("offset limit", () => {
  test("offsetAndLimitToPage", () => {
    expect(offsetAndLimitToPage(0, 100)).toBe(1);
    expect(offsetAndLimitToPage(100, 100)).toBe(2);
    expect(offsetAndLimitToPage(10, 100)).toBe(1);
  });

  test("pageAndLimitToOffset", () => {
    expect(pageAndLimitToOffset(1, 100)).toBe(0);
    expect(pageAndLimitToOffset(2, 100)).toBe(100);
    expect(pageAndLimitToOffset(0, 100)).toBe(0);
  });
});
