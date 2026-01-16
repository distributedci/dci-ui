import { useState } from "react";
import { EmptyState, Breadcrumb } from "ui";
import { Button, Content, PageSection, Skeleton } from "@patternfly/react-core";
import type { IProduct } from "types";

import LoadingPageSection from "ui/LoadingPageSection";
import { useAuth } from "auth/authSelectors";
import {
  useListProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from "products/productsApi";
import ProductsAdminTable from "./ProductsAdminTable";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import useModal from "hooks/useModal";

function ProductsList({ onEdit }: { onEdit: (product: IProduct) => void }) {
  const { data, isLoading, isFetching } = useListProductsQuery();

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!data) {
    return <EmptyState title="There is no products" />;
  }

  return (
    <div>
      {isFetching ? (
        <Skeleton />
      ) : data.products.length === 0 ? (
        <EmptyState
          title="There is no products"
          info="Do you want to create one?"
        />
      ) : (
        <ProductsAdminTable products={data.products} onEdit={onEdit} />
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  const { currentUser } = useAuth();
  const createModal = useModal(false);
  const editModal = useModal(false);
  const [productToEdit, setProductToEdit] = useState<IProduct | null>(null);

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  if (!currentUser) return null;

  const handleEdit = (product: IProduct) => {
    setProductToEdit(product);
    editModal.show();
  };

  return (
    <>
      <CreateProductModal
        isOpen={createModal.isOpen}
        onClose={createModal.hide}
        onSubmit={createProduct}
      />
      {productToEdit && (
        <EditProductModal
          product={productToEdit}
          isOpen={editModal.isOpen}
          onClose={editModal.hide}
          onSubmit={updateProduct}
        />
      )}
      <PageSection>
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Admin Products" }]}
        />
        <Content component="h1">Products</Content>
        <div className="pf-v6-u-mb-md">
          <Button variant="primary" onClick={createModal.show}>
            Create a new product
          </Button>
        </div>
        <ProductsList onEdit={handleEdit} />
      </PageSection>
    </>
  );
}
