import { waitFor } from "@testing-library/react";
import { renderWithProviders } from "__tests__/renders";
import EditUserForm from "./EditUserForm";
import { vi } from "vitest";
import { users } from "__tests__/data";
import { Button } from "@patternfly/react-core";

test("test EditUserForm submit the correct values", async () => {
  const mockOnSubmit = vi.fn();
  const { user, getByRole, getByLabelText } = renderWithProviders(
    <>
      <EditUserForm
        id="edit-user-form"
        user={users[0]}
        onSubmit={mockOnSubmit}
      />
      <Button variant="primary" type="submit" form="edit-user-form">
        Edit
      </Button>
    </>,
  );
  const login = getByLabelText(/Login/i);
  await user.type(login, "2");

  const fullname = getByLabelText(/Full name/i);
  await user.clear(fullname);
  await user.type(fullname, "fullname");

  const password = getByLabelText(/Password/i);
  expect(password).toHaveAttribute("type", "password");
  await user.type(password, "password2");

  const editButton = getByRole("button", { name: /Edit/i });
  await user.click(editButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      id: users[0].id,
      etag: users[0].etag,
      name: "u12",
      fullname: "fullname",
      email: users[0].email,
      password: "password2",
      sso_username: "u1",
      state: users[0].state,
    });
  });
});

test("test EditUserForm without changing the password field", async () => {
  const mockOnSubmit = vi.fn();
  const { user, getByRole, getByLabelText } = renderWithProviders(
    <>
      <EditUserForm
        id="edit-user-form"
        user={users[0]}
        onSubmit={mockOnSubmit}
      />
      <Button variant="primary" type="submit" form="edit-user-form">
        Edit
      </Button>
    </>,
  );
  const fullname = getByLabelText(/Full name/i);
  await user.clear(fullname);
  await user.type(fullname, "Full Name");

  const editButton = getByRole("button", { name: /Edit/i });
  await user.click(editButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      id: users[0].id,
      etag: users[0].etag,
      name: users[0].name,
      fullname: "Full Name",
      email: users[0].email,
      sso_username: users[0].sso_username,
      state: users[0].state,
    });
  });
});
