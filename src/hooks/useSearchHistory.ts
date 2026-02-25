import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  score: number;
}

export interface SearchHistory {
  queries: SearchHistoryItem[];
}

const SEARCH_HISTORY_KEY = "search_history";
const MAX_QUERIES = 50;
const INITIAL_SCORE = 1;
const SCORE_INCREMENT = 1;

export function addQueryToHistory(
  history: SearchHistory,
  query: string,
): SearchHistory {
  if (!query.trim()) {
    return history;
  }

  const normalizedQuery = query.trim();
  const existingIndex = history.queries.findIndex(
    (item) => item.query === normalizedQuery,
  );

  let updatedQueries: SearchHistoryItem[];

  if (existingIndex === -1) {
    const newItem: SearchHistoryItem = {
      query: normalizedQuery,
      timestamp: Date.now(),
      score: INITIAL_SCORE,
    };
    updatedQueries = [newItem, ...history.queries];
  } else {
    updatedQueries = [...history.queries];
    updatedQueries[existingIndex] = {
      ...updatedQueries[existingIndex],
      score: updatedQueries[existingIndex].score + SCORE_INCREMENT,
      timestamp: Date.now(),
    };
  }

  updatedQueries.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.timestamp - a.timestamp;
  });

  if (updatedQueries.length > MAX_QUERIES) {
    updatedQueries = updatedQueries.slice(0, MAX_QUERIES);
  }

  return { queries: updatedQueries };
}

export function deleteQueryFromHistory(
  history: SearchHistory,
  query: string,
): SearchHistory {
  const normalizedQuery = query.trim();
  const updatedQueries = history.queries.filter(
    (item) => item.query !== normalizedQuery,
  );

  return { queries: updatedQueries };
}

export default function useSearchHistory(): [
  string[],
  (query: string) => void,
  (query: string) => void,
] {
  const [history, setHistory] = useLocalStorage<SearchHistory>(
    SEARCH_HISTORY_KEY,
    { queries: [] },
    1,
  );

  const addQuery = useCallback(
    (query: string) => {
      const updatedHistory = addQueryToHistory(history, query);
      setHistory(updatedHistory);
    },
    [history, setHistory],
  );

  const deleteQuery = useCallback(
    (query: string) => {
      const updatedHistory = deleteQueryFromHistory(history, query);
      setHistory(updatedHistory);
    },
    [history, setHistory],
  );

  return [history.queries.map((item) => item.query), addQuery, deleteQuery];
}
