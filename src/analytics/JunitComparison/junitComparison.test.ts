import {
  createJunitComparisonSearchFromFilters,
  parseJunitComparisonFiltersFromSearch,
} from "./JunitComparisonPage";

it("parse filters from search", () => {
  const search = "?topic_id1=to1&topic_id2=to2";
  const expectedFilters = {
    topic_id1: "to1",
    topic_id2: "to2",
  };
  expect(parseJunitComparisonFiltersFromSearch(search)).toEqual(
    expectedFilters
  );
});

it("parse filters from empty search", () => {
  const search = "";
  const expectedFilters = {
    topic_id1: null,
    topic_id2: null,
  };
  expect(parseJunitComparisonFiltersFromSearch(search)).toEqual(
    expectedFilters
  );
});

test("create search from filters", () => {
  const filters = {
    topic_id1: "to1",
    topic_id2: "to2",
  };
  const expectedSearch = "?topic_id1=to1&topic_id2=to2";
  expect(createJunitComparisonSearchFromFilters(filters)).toEqual(
    expectedSearch
  );
});

test("create search from filters remove null", () => {
  const filters = {
    topic_id1: null,
    topic_id2: null,
  };
  const expectedSearch = "";
  expect(createJunitComparisonSearchFromFilters(filters)).toEqual(
    expectedSearch
  );
});
