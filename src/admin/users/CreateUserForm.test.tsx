import { waitFor } from "@testing-library/react";
import { renderWithProviders } from "__tests__/renders";
import CreateUserForm from "./CreateUserForm";
import { vi } from "vitest";
import { Button } from "@patternfly/react-core";

test("test CreateUserForm submit the correct values", async () => {
  const mockOnSubmit = vi.fn();
  const { user, getByRole, getByLabelText } = renderWithProviders(
    <>
      <CreateUserForm id="create-user-form" onSubmit={mockOnSubmit} />
      <Button variant="primary" type="submit" form="create-user-form">
        Create a user
      </Button>
    </>,
  );

  const login = getByLabelText(/Login/i);
  await user.type(login, "login");

  const fullname = getByLabelText(/Full name/i);
  await user.type(fullname, "fullname");

  const email = getByLabelText(/Email/i);
  await user.type(email, "distributed-ci@redhat.com");

  const password = getByLabelText(/Password/i);
  expect(password).toHaveAttribute("type", "password");
  await user.type(password, "password");

  const createButton = getByRole("button", { name: /Create a user/i });
  await user.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "login",
      fullname: "fullname",
      email: "distributed-ci@redhat.com",
      password: "password",
    });
  });
});

test("test CreateUserForm display error message", async () => {
  const mockOnSubmit = vi.fn();
  const { user, getByRole, getByText } = renderWithProviders(
    <>
      <CreateUserForm id="create-user-form" onSubmit={mockOnSubmit} />
      <Button variant="primary" type="submit" form="create-user-form">
        Create a user
      </Button>
    </>,
  );

  const createButton = getByRole("button", { name: /Create a user/i });
  await user.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(0);
    expect(getByText("User name is required")).toBeVisible();
    expect(getByText("Full name is required")).toBeVisible();
    expect(getByText("Email is required")).toBeVisible();
    expect(getByText("User password is required")).toBeVisible();
  });
});
