import { waitFor } from "@testing-library/react";
import { renderWithProviders } from "__tests__/renders";
import { vi } from "vitest";
import ProductSelect from "./ProductSelect";
import { products } from "__tests__/data";
import { server } from "__tests__/node";
import { http, HttpResponse } from "msw";
import { IGetProducts } from "types";

test("test ProductSelect when user type, a debounced request with query is made", async () => {
  const search = products[1].name;
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/products", ({ request }) => {
      const url = new URL(request.url);
      const where = url.searchParams.get("where") || "";
      if (where.includes(search)) {
        return HttpResponse.json({
          _meta: {
            count: 1,
          },
          products: [products[1]],
        } as IGetProducts);
      }
      return HttpResponse.json({
        _meta: {
          count: 0,
        },
        products: [products[0]],
      } as IGetProducts);
    }),
  );

  const mockOnSelect = vi.fn();
  const { user, getByRole } = renderWithProviders(
    <ProductSelect
      id="product-select"
      name="product_id"
      onSelect={mockOnSelect}
    />,
  );

  const textInput = getByRole("textbox");
  await user.type(textInput, search);

  await waitFor(() => {
    const option = getByRole("option", { name: products[1].name });
    expect(option).toBeVisible();
  });
});
