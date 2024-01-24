import {
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  Popper,
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import MainPage from "pages/MainPage";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { getOptions } from "./autocomplete";
import { JobStatuses } from "types";

export default function JobsPage() {
  const filters = {
    "name:": [],
    "pipeline.": ["id", "name:"],
    "config:": [],
    "team.": [
      "id",
      "name",
      "external",
      "state",
      "has_pre_release_access",
      "etag",
      "created_at",
      "updated_at",
    ],
    "status:": [...JobStatuses],
    "topic.": [
      "id",
      "name",
      "export_control",
      "state",
      "etag",
      "created_at",
      "updated_at",
      "next_topic_id",
      "product_id",
    ],
  };
  const [search, setSearch] = useState("");
  const [hint, setHint] = useState("");
  const [autocompleteOptions, setAutocompleteOptions] = useState<ReactNode[]>(
    [],
  );

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
      setIsAutocompleteOpen(true);

      let options = getOptions(newValue, filters)
        .slice(0, 10)
        .map((option) => (
          <MenuItem itemId={option} key={option}>
            {option}
          </MenuItem>
        ));
      setHint(options.length === 1 ? options[0].props.itemId : "");
      setIsAutocompleteOpen(options.length > 0);
      setAutocompleteOptions(options);
    } else {
      setIsAutocompleteOpen(false);
      setHint("");
    }
    setSearch(newValue);
  };

  const onSelect = (event?: React.MouseEvent, itemId?: string | number) => {
    if (event) {
      event.stopPropagation();
    }
    if (itemId) {
      const existingSearch = search
        .split(" ")
        .filter((s) => s.includes(":"))
        .join(" ");
      setSearch(
        existingSearch === ""
          ? (itemId as string)
          : `${existingSearch} ${itemId}`,
      );
    }
    setIsAutocompleteOpen(false);
    if (searchInputRef && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

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

  useEffect(() => {
    window.addEventListener("keydown", handleMenuKeys);
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleMenuKeys);
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isAutocompleteOpen, hint, searchInputRef.current]);

  const searchInput = (
    <SearchInput
      id="job-search"
      value={search}
      onChange={onChange}
      onClear={onClear}
      ref={searchInputRef}
      hint={hint}
    />
  );

  const autocomplete = (
    <Menu ref={autocompleteRef} onSelect={onSelect}>
      <MenuContent>
        <MenuList>{autocompleteOptions}</MenuList>
      </MenuContent>
    </Menu>
  );

  return (
    <MainPage
      title="Jobs"
      description=""
      Toolbar={
        <Toolbar
          id="toolbar-components"
          collapseListedFiltersBreakpoint="xl"
          clearAllFilters={() => console.log("clearAllFilters")}
        >
          <ToolbarContent>
            <ToolbarGroup>
              <Popper
                trigger={searchInput}
                triggerRef={searchInputRef}
                popper={autocomplete}
                popperRef={autocompleteRef}
                isVisible={isAutocompleteOpen}
                enableFlip={false}
                appendTo={() =>
                  document.querySelector("#job-search") as HTMLElement
                }
              />
            </ToolbarGroup>
            <ToolbarGroup style={{ flex: "1" }}>
              <ToolbarItem
                variant="pagination"
                align={{ default: "alignRight" }}
              >
                pagination
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      }
    >
      Jobs
    </MainPage>
  );
}
