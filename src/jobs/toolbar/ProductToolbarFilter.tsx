import { IProduct, IToolbarFilterProps } from "types";
import { ToolbarFilter } from "@patternfly/react-core";
import ProductSelect from "./ProductSelect";

export default function ProductToolbarFilter({
  id,
  onSelect,
  onClear,
  showToolbarItem = true,
}: IToolbarFilterProps<IProduct>) {
  return (
    <ToolbarFilter
      labels={id ? [id] : []}
      deleteLabel={onClear}
      categoryName="Product id"
      showToolbarItem={showToolbarItem}
    >
      <ProductSelect id={id} onSelect={onSelect} onClear={onClear} />
    </ToolbarFilter>
  );
}
