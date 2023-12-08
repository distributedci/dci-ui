# TODO

- Replace user.team by user.teams in GET /users (Need API change)
- Replace axios-mock-adapter by msw
- Remove duplication between src/teams/TeamForm.tsx and src/teams/CreateTeamForm.tsx (factorize TeamSchema for example)
- Use ui/form everywhere and remove ref in form (see src/topics/TopicForm.tsx with a better implementation)