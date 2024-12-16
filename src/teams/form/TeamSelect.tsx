import { useState } from "react";
import { useListTeamsQuery } from "teams/teamsApi";
import { ITeam } from "types";
import TypeaheadSelect from "ui/form/TypeaheadSelect";

export default function TeamSelect({
  id,
  name,
  onSelect,
  ...props
}: {
  id: string;
  name: string;
  onSelect: (item: ITeam | null) => void;
  [key: string]: any;
}) {
  const [search, setSearch] = useState<string | null>(null);
  const { data, isFetching } = useListTeamsQuery({ name: search });
  return (
    <TypeaheadSelect
      id={id}
      name={name}
      isFetching={isFetching}
      items={data?.teams || []}
      onSelect={onSelect}
      onSearch={(newSearch) => {
        if (newSearch.trim().endsWith("*")) {
          setSearch(newSearch);
        } else {
          setSearch(`${newSearch}*`);
        }
      }}
      {...props}
    />
  );
}
