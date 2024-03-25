import { useState } from "react";
import { ToolbarFilter } from "@patternfly/react-core";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useListRemotecisQuery,
  useGetRemoteciQuery,
} from "remotecis/remotecisApi";
import TypeheadSelect from "../../ui/form/TypeheadSelect";
import { IRemoteci } from "types";

interface RemoteciSelectProps {
  id: string | null;
  onSelect: (remoteci: IRemoteci) => void;
  onClear: () => void;
  placeholder?: string;
}

export function RemoteciSelect({
  id,
  onSelect,
  onClear,
  placeholder = "Search by name",
}: RemoteciSelectProps) {
  const [search, setSearch] = useState("");
  const { data, isFetching } = useListRemotecisQuery({
    name: search.endsWith("*") ? search : `${search}*`,
  });
  const { data: getRemoteciData, isFetching: isFetchingRemoteci } =
    useGetRemoteciQuery(id ? id : skipToken);
  const remotecis = data?.remotecis || [];
  const remoteci =
    isFetchingRemoteci || getRemoteciData === undefined
      ? null
      : getRemoteciData;
  return (
    <TypeheadSelect
      placeholder={placeholder}
      onClear={onClear}
      onSelect={(item) => {
        const selectedRemoteci =
          item && remotecis.find((r) => r.id === item.value);
        if (selectedRemoteci) {
          onSelect(selectedRemoteci);
        }
      }}
      item={
        id
          ? remoteci === null
            ? { value: id, label: "" }
            : { value: remoteci.id, label: remoteci.name }
          : null
      }
      items={remotecis.map((remoteci) => ({
        value: remoteci.id,
        label: remoteci.name,
      }))}
      isLoading={isFetching}
      search={setSearch}
    />
  );
}

export default function RemoteciToolbarFilter({
  id,
  onSelect,
  onClear,
  placeholder = "Search by name",
}: RemoteciSelectProps) {
  return (
    <ToolbarFilter
      chips={id ? [id] : []}
      categoryName="Remoteci id"
      deleteChip={() => onClear()}
    >
      <RemoteciSelect
        id={id}
        onSelect={onSelect}
        placeholder={placeholder}
        onClear={onClear}
      />
    </ToolbarFilter>
  );
}
