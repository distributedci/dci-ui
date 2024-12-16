import { useRef, useState } from "react";
import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  TextInputGroup,
  TextInputGroupMain,
  Spinner,
} from "@patternfly/react-core";

type Item = {
  id: string;
  name: string;
};

export default function TypeaheadSelect<T extends Item>({
  id,
  name,
  items,
  onSelect,
  placeholder = "",
  isFetching = false,
  ...props
}: {
  id: string;
  name: string;
  items: T[];
  onSelect: (item: T | null) => void;
  placeholder?: string;
  isFetching?: boolean;
  [key: string]: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const textInputRef = useRef<HTMLInputElement>(null);

  const toggleSetIsOpen = () => {
    if (!isOpen) {
      textInputRef?.current?.select();
    }
    setIsOpen(!isOpen);
  };

  const ToolbarFilterToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      aria-label={`Toggle ${name} select`}
      isFullWidth
      isExpanded={isOpen}
      onClick={toggleSetIsOpen}
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          placeholder={placeholder}
          value={inputValue}
          onClick={toggleSetIsOpen}
          onChange={(e, v) => {
            setInputValue(v);
          }}
          id={`toggle-${id}`}
          autoComplete="off"
          ref={textInputRef}
        />
      </TextInputGroup>
    </MenuToggle>
  );

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <Select
      id={id}
      isOpen={isOpen}
      onSelect={(e, v) => {
        const selectedItem = items.find((i) => i.id === (v as string));
        if (selectedItem) {
          setInputValue(selectedItem.name);
          onSelect(selectedItem);
        }
        setIsOpen(false);
      }}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      toggle={ToolbarFilterToggle}
      shouldFocusToggleOnSelect
      {...props}
    >
      <SelectList>
        {filteredItems.length === 0 ? (
          isFetching ? (
            <Spinner size="md" aria-label="loading" />
          ) : (
            <SelectOption value="" isAriaDisabled={true} isDisabled>
              No results found for "{inputValue}"
            </SelectOption>
          )
        ) : null}
        {filteredItems.map((filteredItem, index) => (
          <SelectOption
            id={`${id}[${index}]`}
            key={filteredItem.id}
            value={filteredItem.id}
          >
            {filteredItem.name}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
}
