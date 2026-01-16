import { CopyIconButton } from "ui";
import type { IProduct } from "types";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ActionsColumn,
  type IAction,
} from "@patternfly/react-table";
import { fromNow } from "services/date";
import ProductIcon from "products/ProductIcon";
import { Label } from "@patternfly/react-core";
import { t_global_color_status_danger_default } from "@patternfly/react-tokens";
import { useUpdateProductMutation } from "products/productsApi";

interface ProductsAdminTableProps {
  products: IProduct[];
  onEdit: (product: IProduct) => void;
}

export default function ProductsAdminTable({
  products,
  onEdit,
}: ProductsAdminTableProps) {
  const [updateProduct] = useUpdateProductMutation();

  const buildProductActions = (product: IProduct): IAction[] => {
    const actions: IAction[] = [
      {
        title: "Edit",
        onClick: () => onEdit(product),
      },
    ];
    if (product.state === "active") {
      actions.push({
        title: (
          <span style={{ color: t_global_color_status_danger_default.var }}>
            Deactivate
          </span>
        ),
        onClick: () => updateProduct({ ...product, state: "inactive" }),
      });
    } else {
      actions.push({
        title: "Reactivate",
        onClick: () => updateProduct({ ...product, state: "active" }),
      });
    }
    return actions;
  };

  return (
    <Table borders={false}>
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Name</Th>
          <Th>Description</Th>
          <Th>Active</Th>
          <Th>Created</Th>
          <Th className="text-center">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {products.map((product) => {
          const productActions = buildProductActions(product);
          return (
            <Tr key={`${product.id}.${product.etag}`}>
              <Td>
                <span>
                  <CopyIconButton
                    text={product.id}
                    textOnSuccess="copied"
                    className="pf-v6-u-mr-xs pointer"
                  />
                  {product.id}
                </span>
              </Td>
              <Td>
                <span>
                  <ProductIcon name={product.name} className="pf-v6-u-mr-xs" />
                  {product.name}
                </span>
              </Td>
              <Td>{product.description}</Td>
              <Td>
                {product.state === "active" ? (
                  <Label color="green">active</Label>
                ) : (
                  <Label color="red">inactive</Label>
                )}
              </Td>
              <Td>
                <time title={product.created_at} dateTime={product.created_at}>
                  {fromNow(product.created_at)}
                </time>
              </Td>
              <Td className="text-center">
                <ActionsColumn items={productActions} />
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
