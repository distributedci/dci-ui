import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemAction,
  MenuList,
  Popper,
  SearchInput,
} from "@patternfly/react-core";
import { TimesIcon } from "@patternfly/react-icons";
import { useLazyGetSuggestionsQuery } from "analytics/analyticsApi";
import {
  applyCompletion,
  getCompletions,
  type Completion,
  type AutoCompletionValues,
  type CompletionContext,
  defaultCompletionContext,
} from "analytics/autocompletion/autocompletion";
import { useCallback, useEffect, useRef, useState } from "react";
import { JobStatuses } from "types";
import { useDebounce } from "use-debounce";
import useSearchHistory from "hooks/useSearchHistory";

export interface QueryToolBarInputSearchProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function QueryToolBarInputSearch({
  value,
  onChange,
  onSubmit,
}: QueryToolBarInputSearchProps) {
  const [cursor, setCursor] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [debouncedValue] = useDebounce(value, 1000);
  const [suggestions, setSuggestions] = useState<AutoCompletionValues>({
    status: [...JobStatuses],
  });
  const [queries, addQuery, deleteQuery] = useSearchHistory();
  const [completionContext, setCompletionContext] = useState<CompletionContext>(
    {
      ...defaultCompletionContext,
      values: suggestions,
      history: {
        queries,
        maxSuggestions: 2,
      },
    },
  );
  const [apiSearch, setApiSearch] = useState<{
    field: string;
    value: string;
  } | null>(null);
  const isAutocompleteOpen = completionContext.completions.length > 0;
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<HTMLDivElement | null>(null);
  const [getApiSuggestions] = useLazyGetSuggestionsQuery();

  const _applyCompletion = useCallback(
    (completion: Completion | undefined) => {
      if (completion) {
        const newContext = applyCompletion(completionContext, completion);
        setCompletionContext(newContext);
        onChange(newContext.input);
        setCursor(newContext.cursor);
        setFocusedIndex(null);
      }
    },
    [onChange, completionContext],
  );

  const handleCursorPosition = () => {
    const input = searchInputRef.current;
    if (input) {
      setCursor(input.selectionStart || 0);
    }
  };

  useEffect(() => {
    if (value) {
      setCompletionContext(
        getCompletions({
          input: value,
          cursor,
          values: suggestions,
          history: {
            queries,
            maxSuggestions: 2,
          },
          completions: [],
          syntax: null,
        }),
      );
    }
  }, [value, suggestions, queries]);

  useEffect(() => {
    if (debouncedValue) {
      const syntax = completionContext.syntax;
      if (
        syntax &&
        syntax.type === "value" &&
        syntax.fieldName &&
        syntax.prefix !== undefined
      ) {
        setApiSearch({
          field: syntax.fieldName,
          value: syntax.prefix,
        });
      } else {
        setApiSearch(null);
      }
    }
  }, [debouncedValue, cursor]);

  useEffect(() => {
    if (apiSearch) {
      getApiSuggestions(apiSearch.field).then((response) => {
        setSuggestions((prev) => ({
          ...prev,
          [apiSearch.field]: response.data || [],
        }));
      });
    }
  }, [apiSearch, getApiSuggestions]);

  useEffect(() => {
    if (completionContext.completions.length === 0) {
      setFocusedIndex(null);
    }
  }, [completionContext.completions]);

  useEffect(() => {
    const input = searchInputRef.current;
    if (input && document.activeElement === input) {
      setTimeout(() => {
        input.setSelectionRange(cursor, cursor);
      }, 0);
    }
  }, [cursor, value]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isAutocompleteOpen) {
        setCompletionContext({
          ...completionContext,
          completions: [],
          syntax: null,
        });
        setFocusedIndex(null);
      }
      if (event.key === "ArrowDown" && isAutocompleteOpen) {
        event.preventDefault();
        setFocusedIndex((prev) => {
          if (prev === null || prev >= completionContext.completions.length - 1)
            return 0;
          return prev + 1;
        });
      } else if (event.key === "ArrowUp" && isAutocompleteOpen) {
        event.preventDefault();
        setFocusedIndex((prev) => {
          if (prev === null || prev <= 0)
            return completionContext.completions.length - 1;
          return prev - 1;
        });
      } else if (event.key === "Enter") {
        if (focusedIndex === null) {
          setCompletionContext({
            ...completionContext,
            completions: [],
            syntax: null,
          });
          setFocusedIndex(null);
          addQuery(value);
          onSubmit();
        } else {
          event.preventDefault();
          const completion = completionContext.completions[focusedIndex];
          _applyCompletion(completion);
        }
      }
    };
    const searchInput = searchInputRef.current;

    if (searchInput) {
      searchInput.addEventListener("keydown", handleKeydown);
    }
    return () => {
      if (searchInput) {
        searchInput.removeEventListener("keydown", handleKeydown);
      }
    };
  }, [
    isAutocompleteOpen,
    focusedIndex,
    _applyCompletion,
    onSubmit,
    value,
    cursor,
    completionContext,
    addQuery,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isAutocompleteOpen &&
        autocompleteRef &&
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node)
      ) {
        setCompletionContext({
          ...completionContext,
          completions: [],
          syntax: null,
        });
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isAutocompleteOpen]);

  return (
    <Popper
      trigger={
        <SearchInput
          id="job-search"
          placeholder="Try: (name = 'job name') and (status = 'success')"
          value={value}
          onChange={(_, value) => {
            onChange(value);
            handleCursorPosition();
          }}
          onClear={() => onChange("")}
          ref={searchInputRef}
        />
      }
      triggerRef={searchInputRef}
      popper={
        <Menu
          ref={autocompleteRef}
          onSelect={(
            event?: React.MouseEvent,
            completionValue?: string | number,
          ) => {
            event?.stopPropagation();
            const completion = completionContext.completions.find(
              (c) => c.value === completionValue,
            );
            _applyCompletion(completion);
            searchInputRef?.current?.focus();
          }}
        >
          <MenuContent>
            <MenuList>
              {completionContext.completions.map((option, index) => (
                <MenuItem
                  itemId={option.value}
                  key={index}
                  isFocused={index === focusedIndex}
                  isActive={index === focusedIndex}
                  actions={
                    option.type === "history" ? (
                      <MenuItemAction
                        actionId="delete"
                        icon={<TimesIcon />}
                        aria-label="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteQuery(option.value);
                        }}
                      />
                    ) : undefined
                  }
                >
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
