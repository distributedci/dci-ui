import { createSelector } from "reselect";
import { fromNow } from "services/date";
import { RootState } from "store";
import { IPipelinesById, IEnhancedPipeline } from "types";

export const getPipelinesById = (state: RootState): IPipelinesById =>
  state.pipelines.byId;

export const getPipelinesAllIds = (state: RootState): string[] =>
  state.pipelines.allIds;

export const getPipelineById = (id: string | null | undefined) => {
  return createSelector(getPipelinesById, (pipelines) => {
    if (id === null || id === undefined) return null;
    const pipeline = pipelines[id];
    if (!pipeline) return null;
    return {
      ...pipeline,
      from_now: fromNow(pipeline.created_at),
    } as IEnhancedPipeline;
  });
};

export const isFetchingPipelines = (state: RootState): boolean =>
  state.pipelines.isFetching;

export const getPipelines = createSelector(
  getPipelinesById,
  getPipelinesAllIds,
  (pipelines, pipelinesAllIds) =>
    pipelinesAllIds.map((id) => {
      const pipeline = pipelines[id];
      return {
        ...pipeline,
        from_now: fromNow(pipeline.created_at),
      };
    })
);

export const getActivePipelines = createSelector(getPipelines, (pipelines) =>
  pipelines.filter((t) => t.state === "active")
);
