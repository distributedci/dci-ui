import { skipToken } from "@reduxjs/toolkit/query";
import { useGetProductQuery, useListProductsQuery } from "products/productsApi";
import type { IProduct } from "types";
import Select from "ui/form/Select";

interface ProductSelectProps {
  value?: string;
  id?: string;
  placeholder?: string;
  onSelect: (item: IProduct | null) => void;
  onClear?: () => void;
}

export default function ProductSelect({
  onSelect,
  onClear,
  value,
  placeholder,
}: ProductSelectProps) {
  const { data, isFetching } = useListProductsQuery();
  const { data: product } = useGetProductQuery(value ? value : skipToken);
  const products = data?.products || [];
  return (
    <Select
      placeholder={placeholder || "Select a product"}
      onClear={onClear}
      onSelect={(selectedProduct) => {
        if (selectedProduct) {
          onSelect(selectedProduct);
        }
      }}
      item={
        product
          ? {
              ...product,
              label: product.name,
              value: product.id,
            }
          : undefined
      }
      items={products.map((p) => ({ ...p, label: p.name, value: p.id }))}
      isLoading={isFetching}
    />
  );
}
