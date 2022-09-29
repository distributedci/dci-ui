import * as React from "react";
import useLocalStorage from "hooks/useLocalStorage";


interface NewsContextType {
  seeNews: (newsId: string) => void;
  hasSeenNews: (newsId: string) => boolean;
  hasNotSeenNews: (newsId: string) => boolean;
}
export const NewsContext = React.createContext<NewsContextType>(null!);

type NewsProviderProps = {
  children: React.ReactNode;
};

export function NewsProvider({ children }: NewsProviderProps) {
  const [newsIds, setNewsIds] = useLocalStorage<string[]>("newsIds", []);

  return (
    <NewsContext.Provider
      value={{
        seeNews: (newsId) => {
          if (newsIds.indexOf(newsId) === -1) {
            setNewsIds([...newsIds, newsId]);
          }
        },
        hasSeenNews: (newsId) => {
          return newsIds.indexOf(newsId) !== -1;
        },
        hasNotSeenNews: (newsId) => {
          return newsIds.indexOf(newsId) === -1;
        },
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  return React.useContext(NewsContext);
}
