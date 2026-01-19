import { skipToken } from "@reduxjs/toolkit/query";
import { useState } from "react";
import { useGetTeamQuery, useListTeamsQuery } from "../teamsApi";
import type { ITeam } from "types";
import TypeaheadSelect from "ui/form/TypeaheadSelect";

interface TeamSelectProps
  extends Omit<
    React.ComponentProps<typeof TypeaheadSelect<ITeam>>,
    "items" | "onSearch" | "toggle" | "id" | "onSelect"
  > {
  id?: string;
  value?: string;
  onSelect: (item: ITeam | null) => void;
}

export default function TeamSelect({
  onSelect,
  id = "team-select",
  value,
  ...props
}: TeamSelectProps) {
  const [search, setSearch] = useState<string | null>(null);
  const { data, isFetching } = useListTeamsQuery({ name: search });
  const { data: team, isFetching: isFetchingTeam } = useGetTeamQuery(
    value ? value : skipToken,
  );
  return (
    <TypeaheadSelect
      id={id}
      name="team_id"
      isFetching={isFetching || isFetchingTeam}
      item={team}
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
