import { EmptyState, Breadcrumb, Truncate, CardSecondaryTitle } from "ui";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Content,
  Gallery,
  PageSection,
} from "@patternfly/react-core";
import { useListProductsQuery } from "./productsApi";
import LoadingPageSection from "ui/LoadingPageSection";
import ProductIcon from "./ProductIcon";
import { useNavigate } from "react-router";

function ProductsGallery() {
  const navigate = useNavigate();
  const { data, isLoading } = useListProductsQuery();

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!data || data.products.length === 0) {
    return <EmptyState title="There is no products" />;
  }

  return (
    <Gallery hasGutter>
      {data.products.map((product) => (
        <Card isCompact key={product.id} id={product.id}>
          <CardHeader>
            <ProductIcon name={product.name} style={{ fontSize: "1.2rem" }} />
          </CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardSecondaryTitle className="pf-v6-u-font-family-monospace">
            <Truncate>{product.id}</Truncate>
          </CardSecondaryTitle>
          <CardBody className="flex flex-col justify-between gap-md">
            <p>{product.description}</p>
            <div>
              <Button
                variant="link"
                isInline
                onClick={() =>
                  navigate(`/topics?where=product_id:${product.id}`)
                }
              >
                View topics
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </Gallery>
  );
}

export default function ProductsPage() {
  return (
    <PageSection>
      <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Products" }]} />
      <Content component="h1">Products</Content>
      <Content component="p">All available Red Hat products in DCI</Content>
      <ProductsGallery />
    </PageSection>
  );
}
