import { Tooltip, Label } from "@patternfly/react-core";
import { createSearchParams, useLocation, useNavigate } from "react-router";
import { AnalyticsSearches } from "types";

export default function QueryToolbarSavedSearches({
  searches,
  setSearches,
  ...props
}: {
  searches: AnalyticsSearches;
  setSearches: (newSearches: AnalyticsSearches) => void;
  [key: string]: any;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const searchKeys = Object.keys(searches);
  return (
    <div {...props}>
      {searchKeys.map((searchName) => (
        <Tooltip content={searches[searchName].query} key={searchName}>
          <Label
            color="green"
            className="pf-v6-u-mr-xs"
            isCompact
            title={searches[searchName].query}
            onClick={() => {
              navigate({
                pathname: location.pathname,
                search: createSearchParams({
                  ...searches[searchName],
                }).toString(),
              });
              navigate(0);
            }}
            onClose={() => {
              const newSearches = {
                ...searches,
              };
              delete newSearches[searchName];
              setSearches(newSearches);
            }}
          >
            {searchName}
          </Label>
        </Tooltip>
      ))}
    </div>
  );
}
