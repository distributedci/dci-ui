import {
  Button,
  ButtonVariant,
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  Modal,
  ModalVariant,
  Popper,
  SearchInput,
  TextContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Text,
  TextVariants,
  CodeBlock,
} from "@patternfly/react-core";
import MainPage from "pages/MainPage";
import { FormEvent, useEffect, useRef, useState } from "react";
import { getOptions } from "./autocomplete";
import { JobStatuses } from "types";
import { QuestionCircleIcon } from "@patternfly/react-icons";

export default function JobsPage() {
  const autocompleteOptions = [
    "name=",
    "pipeline.id=",
    "pipeline.name=",
    "config=",
    "team.id=",
    "team.name=",
    "team.external=",
    "team.state=",
    "team.has_pre_release_access=",
    "team.etag=",
    "team.created_at=",
    "team.updated_at=",
    ...[...JobStatuses].map((status) => `status=${status}`),
    "topic.id=",
    "topic.name=",
    "topic.export_control=",
    "topic.state=",
    "topic.etag=",
    "topic.created_at=",
    "topic.updated_at=",
    "topic.next_topic_id=",
    "topic.product_id=",
  ];

  const [search, setSearch] = useState("");
  const [hint, setHint] = useState("");
  const [showHelperModal, setShowHelperModal] = useState(false);
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
            <ToolbarItem widths={{default: "calc(100% - 150px)"}}>
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
                appendTo={() =>
                  document.querySelector("#job-search") as HTMLElement
                }
              />
            </ToolbarItem>
            <ToolbarItem spacer={{ default: "spacerNone" }}>
              <Button
                variant="secondary"
                type="button"
                onClick={() => alert(search)}
              >
                Search
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button
                variant={ButtonVariant.plain}
                aria-label="show helper modal"
                type="button"
                onClick={() => setShowHelperModal(!showHelperModal)}
              >
                <QuestionCircleIcon />
              </Button>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      }
    >
      <Modal
        id="advanced-search-modal"
        aria-label="Advanced search modal"
        variant={ModalVariant.medium}
        title="Advanced search"
        isOpen={showHelperModal}
        onClose={() => setShowHelperModal(false)}
      >
        <TextContent>
          <Text component={TextVariants.p}>
            The advanced search allows you to build structured queries using the
            DCI DSL to search for jobs. You can specify criteria that cannot be
            defined in the basic search.
          </Text>
          <Text component={TextVariants.h3}>Constructing queries</Text>
          <Text component={TextVariants.h4}>Example 1</Text>
          <Text component={TextVariants.p}>
            Find all job with name
            <span className="pf-v5-u-background-color-200 pf-v5-u-px-xs pf-v5-u-mx-xs">
              foo
            </span>
          </Text>
          <CodeBlock>name=foo</CodeBlock>
          <Text component={TextVariants.h4}>Example 2</Text>
          <Text component={TextVariants.p}>
            Find all job with name
            <span className="pf-v5-u-background-color-200 pf-v5-u-px-xs pf-v5-u-mx-xs">
              bar
            </span>
            and status
            <span className="pf-v5-u-background-color-success pf-v5-u-px-xs pf-v5-u-mx-xs">
              success
            </span>
          </Text>
          <CodeBlock>name=bar and status=success</CodeBlock>
          <Text component={TextVariants.h4}>Example 3</Text>
          <Text component={TextVariants.p}>
            Find all job with name
            <span className="pf-v5-u-background-color-200 pf-v5-u-px-xs pf-v5-u-mx-xs">
              baz
            </span>
            and status
            <span className="pf-v5-u-background-color-danger pf-v5-u-px-xs pf-v5-u-mx-xs">
              failure
            </span>
            or
            <span className="pf-v5-u-background-color-danger pf-v5-u-px-xs pf-v5-u-mx-xs">
              error
            </span>
          </Text>
          <CodeBlock>name=baz and (status=failure or status=error)</CodeBlock>
        </TextContent>
      </Modal>
    </MainPage>
  );
}
