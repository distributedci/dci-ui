import {
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  Popper,
  SearchInput,
} from "@patternfly/react-core";
import { FormEvent, useEffect, useRef, useState } from "react";
import { getOptions } from "./autocomplete";
import { JobStatuses } from "types";

export default function JobSearchAutoComplete() {
  const autocompleteOptions = [
    "name=",
    "pipeline.name=",
    "pipeline.id=",
    "config=",
    "team.name=",
    "team.external=",
    "team.id=",
    ...[...JobStatuses].map((status) => `status=${status}`),
    "topic.name=",
    "topic.export_control=",
    "topic.next_topic_id=",
    "topic.id=",
    "product.name=",
    "product.id=",
    "components.display_name=",
    "components.version=",
    "components.type=",
    "components.id=",
    "components.uid=",
    "components.state=",
    "components.url=",
    "remoteci.name=",
    "tags in (",
    "and ",
    "or ",
    "in ",
    "order by ",
    "created_at",
    "updated_at",
    "ASC",
    "DESC",
    "from=",
    "to=",
  ];

  const [search, setSearch] = useState("");
  const [hint, setHint] = useState("");
  const [filteredAutocompleteOptions, setFilteredAutocompleteOptions] =
    useState<string[]>([]);

  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<HTMLDivElement | null>(null);

  const onClear = () => {
    setSearch("");
  };

  const onChange = (_event: FormEvent<HTMLInputElement>, newValue: string) => {
    if (
      newValue !== "" &&
      searchInputRef &&
      searchInputRef.current &&
      searchInputRef.current.contains(document.activeElement)
    ) {
      let options = getOptions(newValue, autocompleteOptions).slice(0, 10);
      setHint(options.length === 1 ? options[0] : "");
      setFilteredAutocompleteOptions(options);
      setIsAutocompleteOpen(options.length > 0);
    } else {
      setIsAutocompleteOpen(false);
      setHint("");
    }
    setSearch(newValue);
  };

  const onSelect = (event?: React.MouseEvent, itemId?: string | number) => {
    event?.stopPropagation();
    setSearch((itemId || "").toString());
    setIsAutocompleteOpen(false);
    searchInputRef?.current?.focus();
  };

  useEffect(() => {
    const handleMenuKeys = (event: KeyboardEvent) => {
      if (
        hint &&
        (event.key === "Tab" || event.key === "ArrowRight") &&
        searchInputRef.current === event.target
      ) {
        setSearch(hint);
        setHint("");
        setIsAutocompleteOpen(false);
        searchInputRef?.current?.focus();
        event.preventDefault();
      }
      if (
        (event.key === "Tab" || event.key === "ArrowRight") &&
        autocompleteRef?.current?.contains(event.target as Node)
      ) {
        if (event.target) {
          setSearch((event.target as HTMLButtonElement).innerText);
        }
        searchInputRef?.current?.focus();
        event.preventDefault();
      }
      if (isAutocompleteOpen && event.key === "Escape") {
        setIsAutocompleteOpen(false);
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
        setIsAutocompleteOpen(false);
      }
    };

    window.addEventListener("keydown", handleMenuKeys);
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleMenuKeys);
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isAutocompleteOpen, hint]);

  return (
    <Popper
      trigger={
        <SearchInput
          id="job-search"
          value={search}
          onChange={onChange}
          onClear={onClear}
          ref={searchInputRef}
          hint={hint}
        />
      }
      triggerRef={searchInputRef}
      popper={
        <Menu ref={autocompleteRef} onSelect={onSelect}>
          <MenuContent>
            <MenuList>
              {filteredAutocompleteOptions.map((option) => (
                <MenuItem itemId={option} key={option}>
                  {option}
                </MenuItem>
              ))}
            </MenuList>
          </MenuContent>
        </Menu>
      }
      popperRef={autocompleteRef}
      isVisible={isAutocompleteOpen}
      enableFlip={false}
      appendTo={() => document.querySelector("#job-search") as HTMLElement}
    />
  );
}
