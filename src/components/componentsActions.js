import http from "services/http";

export function fetchLatestComponents(topic) {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "get",
      url: `${state.config.apiURL}/api/v1/topics/${topic.id}`
    }).then(response => {
      const componentTypes = response.data.topic.component_types;
      return Promise.all(
        componentTypes.map(componentType =>
          http({
            method: "get",
            url: `${state.config.apiURL}/api/v1/topics/${topic.id}/components`,
            params: {
              sort: "-created_at",
              limit: 3,
              offset: 0,
              where: `type:${componentType},state:active`
            }
          })
        )
      ).then(results => {
        const components = results.reduce(
          (acc, result) => acc.concat(result.data.components),
          []
        );
        return Promise.resolve({ data: { components } });
      });
    });
  };
}
