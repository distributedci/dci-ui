import { useCombobox, useMultipleSelection } from "downshift";
import { useState } from "react";
import { ITeam } from "types";

interface GetTeams {
  data: {
    teams: ITeam[];
  };
}

export default function SearchJob({
  getTeams,
}: {
  getTeams: () => Promise<GetTeams>;
}) {
  const [inputValue, setInputValue] = useState("");
  const items = ["team:", "remoteci:", "topic:"];

  const getFilteredItems = (inputValue: string) =>
    items.filter((item) =>
      item.toLocaleLowerCase().startsWith(inputValue.toLocaleLowerCase())
    );

  const {
    getComboboxProps,
    getLabelProps,
    getInputProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
    isOpen,
    highlightedIndex,
  } = useCombobox({
    inputValue,
    items,
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          if (inputValue) {
            setInputValue(inputValue);
          }
          break;
        default:
          break;
      }
    },
  });

  return (
    <div>
      <div {...getComboboxProps()}>
        <label {...getLabelProps()}>Filter job</label>
        <input {...getInputProps()} />
        <button {...getToggleButtonProps()}>{isOpen ? "close" : "open"}</button>
      </div>
      <ul {...getMenuProps()}>
        {isOpen &&
          getFilteredItems(inputValue).map((item, index) => (
            <li
              key={index}
              {...getItemProps({
                item,
                key: index,
                style:
                  highlightedIndex === index
                    ? { backgroundColor: "#bde4ff" }
                    : {},
              })}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  );
}
