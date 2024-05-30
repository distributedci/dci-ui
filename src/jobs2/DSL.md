
DCI DSL

 * simple search by name equal foo: `name=foo`
 * simple AND logic operator: `name=foo AND status=success`
 * logic operators are case insensitive: `name=foo AND status=success` is the same as `name=foo AnD status=success` or `name=foo and status=success`
 * there is 3 logic operators `and`, `or` and `in`
 * to find jobs with tags with multiple values using the in operator: `tags in (tag1, tag2)`
 * paranthesis are used to group operand together: `(name=foo and version=v1) or (name=bar)`
 * multiple space can be ignored
 * if we need a space in a value, we can use double quotes: `name="OpenShift 4.12.45"`
 * nested values should be plural, for example to search for a component in job.components with name foo and type ocp: `components.name=foo and components.type=ocp`
 * find all jobs with 2 components, one with type `bar` and one with type `foo` and version `v1`: `(components.type=bar) and (components.type=foo and components.version=v1)`

