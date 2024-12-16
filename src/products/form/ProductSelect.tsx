import { skipToken } from "@reduxjs/toolkit/query";
import { useState } from "react";
import { useGetProductQuery, useListProductsQuery } from "products/productsApi";
import { IProduct } from "types";
import TypeaheadSelect from "ui/form/TypeaheadSelect";

export default function ProductSelect({
  onSelect,
  id = "product-select",
  value,
  ...props
}: {
  onSelect: (item: IProduct | null) => void;
  value?: string;
  id?: string;
  [key: string]: any;
}) {
  const [search, setSearch] = useState<string | null>(null);
  const { data, isFetching } = useListProductsQuery({ name: search });
  const { data: product, isFetching: isFetchingProduct } = useGetProductQuery(
    value ? value : skipToken,
  );
  return (
    <TypeaheadSelect
      id={id}
      name="product_id"
      isFetching={isFetching || isFetchingProduct}
      item={product}
      items={data?.products || []}
      onSelect={onSelect}
      onSearch={(newSearch) => {
        if (newSearch.trim().endsWith("*")) {
          setSearch(newSearch);
        } else {
          setSearch(`${newSearch}*`);
        }
      }}
      {...props}
    />
  );
}
