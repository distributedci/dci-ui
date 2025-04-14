import {
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  Popper,
  SearchInput,
} from "@patternfly/react-core";
import {
  applyCompletion,
  Completion,
  getCompletions,
} from "analytics/autocompletion/autocompletion";
import { useEffect, useRef, useState } from "react";

export interface QueryToolBarInputSearchProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export default function QueryToolBarInputSearch({
  value,
  onChange,
}: QueryToolBarInputSearchProps) {
  const [cursor, setCursor] = useState(0);

  const [completions, setCompletions] = useState<Completion[]>([]);
  const isAutocompleteOpen = completions.length > 0;

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value) {
      setCompletions(getCompletions(value, cursor));
    }
  }, [value, cursor]);

  const onClear = () => {
    onChange("");
  };

  const onSelect = (
    event?: React.MouseEvent,
    completionValue?: string | number,
  ) => {
    event?.stopPropagation();
    const completion = completions.find((c) => c.value === completionValue);
    if (completion) {
      const { newValue, newCursor } = applyCompletion({
        value,
        cursor,
        completion,
      });
      onChange(newValue);
      setCursor(newCursor);
    }
    searchInputRef?.current?.focus();
  };

  useEffect(() => {
    const handleMenuKeys = (event: KeyboardEvent) => {
      if (isAutocompleteOpen && event.key === "Escape") {
        setCompletions([]);
        searchInputRef?.current?.focus();
      }
      if (isAutocompleteOpen && searchInputRef.current === event.target) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          const buttons =
            autocompleteRef?.current?.querySelectorAll<HTMLDivElement>(
              "li > button:not(:disabled)",
            );
          if (buttons === undefined || buttons.length === 0) return;
          if (event.key === "ArrowDown") {
            buttons[0].focus();
          } else {
            buttons[buttons.length - 1].focus();
          }
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isAutocompleteOpen &&
        autocompleteRef &&
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node)
      ) {
        setCompletions([]);
      }
    };

    window.addEventListener("keydown", handleMenuKeys);
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleMenuKeys);
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isAutocompleteOpen]);

  const updateCursorPosition = (target: EventTarget) => {
    if (target instanceof HTMLInputElement) {
      setCursor(target.selectionStart ?? 0);
    }
  };

  return (
    <Popper
      trigger={
        <SearchInput
          id="job-search"
          value={value}
          onChange={(event, value) => {
            onChange(value);
            updateCursorPosition(event.target);
          }}
          onClick={(event) => {
            updateCursorPosition(event.target);
          }}
          onKeyDown={(event) => {
            setTimeout(() => {
              updateCursorPosition(event.target);
            }, 0);
          }}
          onClear={onClear}
          ref={searchInputRef}
        />
      }
      triggerRef={searchInputRef}
      popper={
        <Menu ref={autocompleteRef} onSelect={onSelect}>
          <MenuContent>
            <MenuList>
              {completions.map((option, index) => (
                <MenuItem itemId={option.value} key={index}>
                  {option.value}
                </MenuItem>
              ))}
            </MenuList>
          </MenuContent>
        </Menu>
      }
      popperRef={autocompleteRef}
      isVisible={isAutocompleteOpen}
      enableFlip={false}
    />
  );
}
