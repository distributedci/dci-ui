import {
  injectCreateEndpoint,
  injectGetEndpoint,
  injectListEndpoint,
  injectUpdateEndpoint,
  api,
} from "api";
import type { RootState } from "store";
import type {
  ICurrentUser,
  IRemoteci,
  IRemoteciWithApiSecret,
  IRemoteciWithTeam,
} from "types";

const resource = "Remoteci";

export const { useCreateRemoteciMutation } =
  injectCreateEndpoint<IRemoteciWithApiSecret>(resource);
export const { useGetRemoteciQuery } = injectGetEndpoint<IRemoteci>(resource);
const listRemotecisApi = injectListEndpoint<IRemoteciWithTeam>(resource);
export const { useListRemotecisQuery } = listRemotecisApi;
export const { useUpdateRemoteciMutation } =
  injectUpdateEndpoint<IRemoteci>(resource);

export const {
  useSubscribeToARemoteciMutation,
  useUnsubscribeFromARemoteciMutation,
  useListSubscribedRemotecisQuery,
} = api
  .enhanceEndpoints({ addTagTypes: ["CurrentUserRemoteci"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      listSubscribedRemotecis: builder.query<
        {
          _meta: { count: number };
          remotecis: IRemoteci[];
        },
        ICurrentUser
      >({
        query: (currentUser) => `/users/${currentUser.id}/remotecis`,
        providesTags: [{ type: "CurrentUserRemoteci", id: "LIST" }],
      }),
      subscribeToARemoteci: builder.mutation<
        void,
        { currentUser: ICurrentUser; remoteci: IRemoteci }
      >({
        query({ currentUser, remoteci }) {
          return {
            url: `/remotecis/${remoteci.id}/users`,
            method: "POST",
            body: currentUser,
          };
        },
        invalidatesTags: ["CurrentUserRemoteci"],
      }),
      unsubscribeFromARemoteci: builder.mutation<
        { success: boolean; id: string },
        { currentUser: ICurrentUser; remoteci: IRemoteci }
      >({
        query({ currentUser, remoteci }) {
          return {
            url: `/remotecis/${remoteci.id}/users/${currentUser.id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["CurrentUserRemoteci"],
      }),
    }),
  });

export const {
  useReactivateRemoteciMutation,
  useDeactivateRemoteciMutation,
  useRefreshRemoteciApiSecretMutation,
} = api.enhanceEndpoints({ addTagTypes: [resource] }).injectEndpoints({
  endpoints: (builder) => ({
    refreshRemoteciApiSecret: builder.mutation<
      {
        remoteci: IRemoteciWithApiSecret;
      },
      IRemoteci
    >({
      query(remoteci) {
        return {
          url: `/remotecis/${remoteci.id}/api_secret`,
          headers: { "If-Match": remoteci.etag },
          method: "PUT",
        };
      },
      async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const updatedRemoteci = data.remoteci;
          const state = getState() as RootState;
          const remotecisCache = listRemotecisApi.util.selectInvalidatedBy(
            state,
            [{ type: resource, id: "LIST" }],
          );
          remotecisCache
            .filter(({ endpointName }) => endpointName === "listRemotecis")
            .forEach(({ originalArgs }) => {
              dispatch(
                listRemotecisApi.util.updateQueryData(
                  "listRemotecis",
                  originalArgs,
                  (draft) => {
                    for (let i = 0; i < draft.remotecis.length; i++) {
                      if (draft.remotecis[i].id === updatedRemoteci.id) {
                        Object.assign(draft.remotecis[i], updatedRemoteci);
                        break;
                      }
                    }
                  },
                ),
              );
            });
        } catch {
          listRemotecisApi.util.invalidateTags([
            { type: resource, id: "LIST" },
          ]);
        }
      },
    }),
    reactivateRemoteci: builder.mutation<void, IRemoteci>({
      query(remoteci) {
        const { id, etag } = remoteci;
        return {
          url: `/remotecis/${id}`,
          headers: { "If-Match": etag },
          method: "PUT",
          body: { state: "active" },
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: resource, id }],
    }),
    deactivateRemoteci: builder.mutation<void, IRemoteci>({
      query(remoteci) {
        const { id, etag } = remoteci;
        return {
          url: `/remotecis/${id}`,
          headers: { "If-Match": etag },
          method: "PUT",
          body: { state: "inactive" },
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: resource, id }],
    }),
  }),
});
