import { act } from "react";
import { renderHook } from "@testing-library/react";
import { beforeEach, afterEach, describe, test, expect, vi } from "vitest";
import useSearchHistory, {
  addQueryToHistory,
  deleteQueryFromHistory,
  type SearchHistory,
} from "./useSearchHistory";

describe("addQueryToHistory", () => {
  beforeEach(() => {
    vi.spyOn(Date, "now").mockReturnValue(1000000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("adds new query with initial score", () => {
    const history: SearchHistory = { queries: [] };
    const result = addQueryToHistory(history, "test query");

    expect(result.queries).toHaveLength(1);
    expect(result.queries[0]).toEqual({
      query: "test query",
      timestamp: 1000000,
      score: 1,
    });
  });

  test("trims query before adding", () => {
    const history: SearchHistory = { queries: [] };
    const result = addQueryToHistory(history, "  test query  ");

    expect(result.queries[0].query).toBe("test query");
  });

  test("ignores empty queries", () => {
    const history: SearchHistory = { queries: [] };
    const result = addQueryToHistory(history, "   ");

    expect(result.queries).toHaveLength(0);
  });

  test("increases score for existing query", () => {
    const history: SearchHistory = {
      queries: [{ query: "existing query", timestamp: 900000, score: 3 }],
    };
    const result = addQueryToHistory(history, "existing query");

    expect(result.queries).toHaveLength(1);
    expect(result.queries[0]).toEqual({
      query: "existing query",
      timestamp: 1000000,
      score: 4,
    });
  });

  test("updates timestamp for existing query", () => {
    const history: SearchHistory = {
      queries: [{ query: "test", timestamp: 500000, score: 1 }],
    };
    const result = addQueryToHistory(history, "test");

    expect(result.queries[0].timestamp).toBe(1000000);
  });

  test("sorts queries by score descending", () => {
    const history: SearchHistory = {
      queries: [
        { query: "low", timestamp: 1000000, score: 1 },
        { query: "medium", timestamp: 1000000, score: 3 },
      ],
    };
    const result = addQueryToHistory(history, "high");

    vi.spyOn(Date, "now").mockReturnValue(1000001);
    const result2 = addQueryToHistory(result, "high");
    const result3 = addQueryToHistory(result2, "high");

    expect(result3.queries[0].query).toBe("high");
    expect(result3.queries[0].score).toBe(3);
    expect(result3.queries[1].query).toBe("medium");
  });

  test("sorts by timestamp when scores are equal", () => {
    vi.spyOn(Date, "now").mockReturnValue(1000000);
    const history: SearchHistory = {
      queries: [{ query: "old", timestamp: 500000, score: 2 }],
    };

    vi.spyOn(Date, "now").mockReturnValue(2000000);
    const result = addQueryToHistory(history, "new");

    expect(result.queries[0].query).toBe("old");
    expect(result.queries[1].query).toBe("new");

    vi.spyOn(Date, "now").mockReturnValue(3000000);
    const result2 = addQueryToHistory(result, "new");

    expect(result2.queries[0].query).toBe("new");
    expect(result2.queries[0].timestamp).toBe(3000000);
  });

  test("limits queries to 50 items", () => {
    const queries = Array.from({ length: 50 }, (_, i) => ({
      query: `query${i}`,
      timestamp: 1000000 + i,
      score: 1,
    }));
    const history: SearchHistory = { queries };

    const result = addQueryToHistory(history, "new query");

    expect(result.queries).toHaveLength(50);
    expect(result.queries.some((q) => q.query === "new query")).toBe(true);
  });

  test("removes lowest score query when at max limit", () => {
    const queries = Array.from({ length: 50 }, (_, i) => ({
      query: `query${i}`,
      timestamp: 1000000 + i,
      score: 1,
    }));
    const history: SearchHistory = { queries };

    vi.spyOn(Date, "now").mockReturnValue(3000000);
    let result = history;
    for (let i = 0; i < 51; i++) {
      result = addQueryToHistory(result, "high score");
    }

    expect(result.queries).toHaveLength(50);
    expect(result.queries[0].query).toBe("high score");
    expect(result.queries[0].score).toBe(51);
    expect(result.queries.some((q) => q.query === "query0")).toBe(false);
  });
});

describe("deleteQueryFromHistory", () => {
  test("removes query from history", () => {
    const history: SearchHistory = {
      queries: [
        { query: "query1", timestamp: 1000000, score: 1 },
        { query: "query2", timestamp: 2000000, score: 2 },
        { query: "query3", timestamp: 3000000, score: 3 },
      ],
    };

    const result = deleteQueryFromHistory(history, "query2");

    expect(result.queries).toHaveLength(2);
    expect(result.queries.some((q) => q.query === "query2")).toBe(false);
    expect(result.queries[0].query).toBe("query1");
    expect(result.queries[1].query).toBe("query3");
  });

  test("trims query before deleting", () => {
    const history: SearchHistory = {
      queries: [
        { query: "test query", timestamp: 1000000, score: 1 },
        { query: "another query", timestamp: 2000000, score: 2 },
      ],
    };

    const result = deleteQueryFromHistory(history, "  test query  ");

    expect(result.queries).toHaveLength(1);
    expect(result.queries[0].query).toBe("another query");
  });

  test("does nothing if query does not exist", () => {
    const history: SearchHistory = {
      queries: [
        { query: "query1", timestamp: 1000000, score: 1 },
        { query: "query2", timestamp: 2000000, score: 2 },
      ],
    };

    const result = deleteQueryFromHistory(history, "nonexistent");

    expect(result.queries).toHaveLength(2);
    expect(result.queries).toEqual(history.queries);
  });

  test("removes all queries with matching value", () => {
    const history: SearchHistory = {
      queries: [
        { query: "test", timestamp: 1000000, score: 1 },
        { query: "other", timestamp: 2000000, score: 2 },
        { query: "test", timestamp: 3000000, score: 3 },
      ],
    };

    const result = deleteQueryFromHistory(history, "test");

    expect(result.queries).toHaveLength(1);
    expect(result.queries[0].query).toBe("other");
  });

  test("handles empty history", () => {
    const history: SearchHistory = { queries: [] };

    const result = deleteQueryFromHistory(history, "any query");

    expect(result.queries).toHaveLength(0);
  });
});

describe("useSearchHistory", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Date, "now").mockReturnValue(1000000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("initializes with empty history", () => {
    const { result } = renderHook(useSearchHistory);
    expect(result.current[0]).toEqual([]);
  });

  test("adds query to history", () => {
    const { result } = renderHook(useSearchHistory);

    act(() => {
      result.current[1]("test query");
    });

    expect(result.current[0]).toHaveLength(1);
    expect(result.current[0][0]).toBe("test query");
  });

  test("persists history across hook instances", () => {
    const { result: result1 } = renderHook(useSearchHistory);

    act(() => {
      result1.current[1]("test query");
    });

    const { result: result2 } = renderHook(useSearchHistory);

    expect(result2.current[0]).toHaveLength(1);
    expect(result2.current[0][0]).toBe("test query");
  });

  test("handles multiple queries", () => {
    const { result } = renderHook(useSearchHistory);

    act(() => {
      result.current[1]("query 1");
    });

    vi.spyOn(Date, "now").mockReturnValue(2000000);
    act(() => {
      result.current[1]("query 2");
    });

    vi.spyOn(Date, "now").mockReturnValue(3000000);
    act(() => {
      result.current[1]("query 3");
    });

    expect(result.current[0]).toHaveLength(3);
  });

  test("keeps single entry for repeated query", () => {
    const { result } = renderHook(useSearchHistory);

    act(() => {
      result.current[1]("repeated");
    });

    expect(result.current[0]).toHaveLength(1);
    expect(result.current[0][0]).toBe("repeated");

    vi.spyOn(Date, "now").mockReturnValue(2000000);
    act(() => {
      result.current[1]("repeated");
    });

    expect(result.current[0]).toHaveLength(1);
    expect(result.current[0][0]).toBe("repeated");

    vi.spyOn(Date, "now").mockReturnValue(3000000);
    act(() => {
      result.current[1]("repeated");
    });

    expect(result.current[0]).toHaveLength(1);
    expect(result.current[0][0]).toBe("repeated");
  });

  test("deletes query from history", () => {
    const { result } = renderHook(useSearchHistory);

    act(() => {
      result.current[1]("query 1");
    });

    vi.spyOn(Date, "now").mockReturnValue(2000000);
    act(() => {
      result.current[1]("query 2");
    });

    vi.spyOn(Date, "now").mockReturnValue(3000000);
    act(() => {
      result.current[1]("query 3");
    });

    expect(result.current[0]).toHaveLength(3);

    act(() => {
      result.current[2]("query 2");
    });

    expect(result.current[0]).toHaveLength(2);
    expect(result.current[0]).toContain("query 1");
    expect(result.current[0]).toContain("query 3");
    expect(result.current[0]).not.toContain("query 2");
  });

  test("deletes query persists across hook instances", () => {
    const { result: result1 } = renderHook(useSearchHistory);

    act(() => {
      result1.current[1]("query 1");
    });

    vi.spyOn(Date, "now").mockReturnValue(2000000);
    act(() => {
      result1.current[1]("query 2");
    });

    expect(result1.current[0]).toHaveLength(2);

    act(() => {
      result1.current[2]("query 1");
    });

    const { result: result2 } = renderHook(useSearchHistory);

    expect(result2.current[0]).toHaveLength(1);
    expect(result2.current[0][0]).toBe("query 2");
  });

  test("handles deleting non-existent query", () => {
    const { result } = renderHook(useSearchHistory);

    act(() => {
      result.current[1]("existing query");
    });

    expect(result.current[0]).toHaveLength(1);

    act(() => {
      result.current[2]("non-existent query");
    });

    expect(result.current[0]).toHaveLength(1);
    expect(result.current[0][0]).toBe("existing query");
  });
});
