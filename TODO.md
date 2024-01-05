# TODO

- Replace user.team by user.teams in GET /users (Need API change)
- Replace axios-mock-adapter by msw
- Remove duplication between src/teams/TeamForm.tsx and src/teams/CreateTeamForm.tsx (factorize TeamSchema for example)
- Use ui/form everywhere and remove ref in form (see src/topics/TopicForm.tsx with a better implementation)
- improve src/users/UserPage.tsx in tablet
- remove src/jobs/toolbar/filters.ts
- useFormik in src/remotecis/RemoteciForm.tsx
- update src/remotecis/CreateRemoteciModal.tsxs
- show error message globally https://redux-toolkit.js.org/rtk-query/usage/error-handling#handling-errors-at-a-macro-level
- transform all it('') in tests to test('')