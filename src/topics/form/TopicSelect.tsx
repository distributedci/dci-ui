import { useState } from "react";
import { useListTopicsQuery } from "topics/topicsApi";
import type { ITopic } from "types";
import TypeaheadSelect from "ui/form/TypeaheadSelect";

interface TopicSelectProps
  extends Omit<
    React.ComponentProps<typeof TypeaheadSelect<ITopic>>,
    "items" | "onSearch" | "toggle" | "id" | "onSelect" | "name"
  > {
  id?: string;
  name?: string;
  onSelect: (item: ITopic | null) => void;
}

export default function TopicSelect({
  onSelect,
  id = "topic-select",
  name = "topic_id",
  ...props
}: TopicSelectProps) {
  const [search, setSearch] = useState<string | null>(null);
  const { data, isFetching } = useListTopicsQuery({ name: search });
  return (
    <TypeaheadSelect
      id={id}
      name={name}
      isFetching={isFetching}
      items={data?.topics || []}
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
