# TODO

- Replace user.team by user.teams in GET /users (Need API change)
- Use ui/form everywhere and remove ref in form (see src/topics/TopicForm.tsx with a better implementation)
- improve src/users/UserPage.tsx in tablet view
- useFormik in src/remotecis/RemoteciForm.tsx
- update src/remotecis/CreateRemoteciModal.tsx
- show error message globally https://redux-toolkit.js.org/rtk-query/usage/error-handling#handling-errors-at-a-macro-level
- ITest and IResult seems similar, investigate to see if we can use only one
- logging page in dark mode
- /files/:id/junit backend should return name of the file (update src/jobs/job/tests/test/JobTestPage.tsx) > Test suites for {file_id}
- login error on the basic login page is not working