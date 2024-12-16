import { useEffect, useRef, useState } from "react";
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
import { useDebouncedValue } from "hooks/useDebouncedValue";

type Item = {
  id: string;
  name: string;
};

export default function TypeaheadSelect<T extends Item>({
  id,
  name,
  items,
  onSelect,
  onSearch,
  placeholder = "",
  isFetching = false,
  ...props
}: {
  id: string;
  name: string;
  items: T[];
  onSelect: (item: T | null) => void;
  onSearch: (s: string) => void;
  placeholder?: string;
  isFetching?: boolean;
  [key: string]: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedInputValue = useDebouncedValue(inputValue, 500);
  const textInputRef = useRef<HTMLInputElement>(null);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(inputValue.toLowerCase()),
  );
  const isLoading = isFetching || inputValue !== debouncedInputValue;

  const toggleSetIsOpen = () => {
    if (!isOpen) {
      textInputRef?.current?.select();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    onSearch(debouncedInputValue);
  }, [onSearch, debouncedInputValue]);

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
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            switch (event.key) {
              case "Enter":
                event.preventDefault();
                if (isOpen && focusedItemIndex !== null) {
                  const selectedItem = filteredItems[focusedItemIndex];
                  onSelect(selectedItem);
                  setInputValue(selectedItem.name);
                }
                setIsOpen((prevIsOpen) => !prevIsOpen);
                setFocusedItemIndex(null);
                break;
              case "Tab":
              case "Escape":
                setIsOpen(false);
                setFocusedItemIndex(null);
                break;
              case "ArrowUp":
                event.preventDefault();
                setIsOpen(true);
                if (focusedItemIndex === null || focusedItemIndex <= 0) {
                  setFocusedItemIndex(filteredItems.length - 1);
                } else {
                  setFocusedItemIndex(focusedItemIndex - 1);
                }
                break;
              case "ArrowDown":
                event.preventDefault();
                setIsOpen(true);
                if (
                  focusedItemIndex === null ||
                  focusedItemIndex >= filteredItems.length - 1
                ) {
                  setFocusedItemIndex(0);
                } else {
                  setFocusedItemIndex(focusedItemIndex + 1);
                }
                break;
            }
          }}
          id={`toggle-${id}`}
          autoComplete="off"
          ref={textInputRef}
        />
      </TextInputGroup>
    </MenuToggle>
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
        {isLoading && (
          <div className="pf-v6-u-px-lg pf-v6-u-py-xs">
            <Spinner size="md" aria-label="loading" />
          </div>
        )}
        {filteredItems.length === 0 && !isLoading && (
          <SelectOption value="" isAriaDisabled={true} isDisabled>
            No results found for "{inputValue}"
          </SelectOption>
        )}
        {filteredItems.map((filteredItem, index) => (
          <SelectOption
            id={`${id}[${index}]`}
            key={filteredItem.id}
            value={filteredItem.id}
            isFocused={focusedItemIndex === index}
          >
            {filteredItem.name}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
}
