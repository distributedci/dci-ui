import { createReducer } from "./apiReducers";
import { createActionsTypes } from "./apiActionsTypes";

const jobActionsTypes = createActionsTypes("job");
const userActionsTypes = createActionsTypes("user");

it("reducer initial state", () => {
  expect(createReducer("job")(undefined, {})).toEqual({
    byId: {},
    allIds: [],
    errorMessage: null,
    isFetching: false,
    count: 0
  });
});

it("FETCH_REQUEST", () => {
  const state = createReducer("job")(undefined, {
    type: jobActionsTypes.FETCH_ALL_REQUEST
  });
  expect(state.isFetching).toBe(true);
});

it("FETCH_SUCCESS ignore undefined id", () => {
  const state = createReducer("job")(
    {
      byId: {},
      allIds: [],
      errorMessage: null,
      isFetching: true
    },
    {
      type: jobActionsTypes.FETCH_ALL_SUCCESS,
      result: [undefined, "j2"],
      entities: {
        jobs: { undefined: {}, j2: { id: "j2" } }
      }
    }
  );

  const expectedState = {
    byId: { j2: { id: "j2" } },
    allIds: ["j2"],
    errorMessage: null,
    isFetching: false
  };
  expect(state).toEqual(expectedState);
});

it("FETCH_SUCCESS", () => {
  const state = createReducer("job")(
    {
      byId: {},
      allIds: [],
      errorMessage: null,
      isFetching: true
    },
    {
      type: jobActionsTypes.FETCH_ALL_SUCCESS,
      result: ["j1"],
      entities: {
        jobs: { j1: { id: "j1" } }
      }
    }
  );
  const expectedState = {
    byId: { j1: { id: "j1" } },
    allIds: ["j1"],
    errorMessage: null,
    isFetching: false
  };
  expect(state).toEqual(expectedState);
});

it("CLEAR_CACHE", () => {
  const state = createReducer("job")(
    {
      byId: { j1: { id: "j1" } },
      allIds: ["j1"],
      errorMessage: null,
      isFetching: false
    },
    {
      type: jobActionsTypes.CLEAR_CACHE
    }
  );
  const expectedState = {
    byId: {},
    allIds: [],
    errorMessage: null,
    isFetching: false,
    count: 0
  };
  expect(state).toEqual(expectedState);
});

it("SET_COUNT", () => {
  const state = createReducer("job")(
    {
      byId: {},
      allIds: [],
      errorMessage: null,
      isFetching: true,
      count: 0
    },
    {
      type: jobActionsTypes.SET_COUNT,
      count: 10
    }
  );
  expect(state.count).toBe(10);
});

it("FETCH_FAILURE", () => {
  const state = createReducer("job")(
    {
      byId: {},
      allIds: [],
      errorMessage: null,
      isFetching: true
    },
    {
      type: jobActionsTypes.FETCH_ALL_FAILURE,
      message: "Authorization header missing"
    }
  );
  const expectedState = {
    byId: {},
    allIds: [],
    errorMessage: "Authorization header missing",
    isFetching: false
  };
  expect(state).toEqual(expectedState);
});

it("fetch another reducer with updated entity", () => {
  const state = createReducer("job")(
    {
      byId: { j1: { id: "j1" } },
      allIds: ["j1"],
      errorMessage: null,
      isFetching: false
    },
    {
      type: userActionsTypes.FETCH_ALL_SUCCESS,
      result: ["u1"],
      entities: {
        users: { u1: { id: "u1" } },
        jobs: { j2: { id: "j2" } }
      }
    }
  );
  const expectedState = {
    byId: { j1: { id: "j1" }, j2: { id: "j2" } },
    allIds: ["j1", "j2"],
    errorMessage: null,
    isFetching: false
  };
  expect(state).toEqual(expectedState);
});

it("fetch one entity", () => {
  const state = createReducer("job")(
    {
      byId: { j1: { id: "j1" } },
      allIds: ["j1"],
      errorMessage: null,
      isFetching: false
    },
    {
      type: jobActionsTypes.FETCH_SUCCESS,
      result: "j2",
      entities: {
        jobs: { j2: { id: "j2" } }
      }
    }
  );
  const expectedState = {
    byId: { j1: { id: "j1" }, j2: { id: "j2" } },
    allIds: ["j1", "j2"],
    errorMessage: null,
    isFetching: false
  };
  expect(state).toEqual(expectedState);
});

it("update one entity", () => {
  const state = createReducer("job")(
    {
      byId: { j1: { id: "j1", etag: "e1" } },
      allIds: ["j1"],
      errorMessage: null,
      isFetching: false
    },
    {
      type: jobActionsTypes.UPDATE_SUCCESS,
      result: "j1",
      entities: {
        jobs: { j1: { id: "j1", etag: "e2" } }
      }
    }
  );
  const expectedState = {
    byId: { j1: { id: "j1", etag: "e2" } },
    allIds: ["j1"],
    errorMessage: null,
    isFetching: false
  };
  expect(state).toEqual(expectedState);
});

it("delete one entity", () => {
  const state = createReducer("job")(
    {
      byId: { j1: { id: "j1" } },
      allIds: ["j1"],
      errorMessage: null,
      isFetching: false
    },
    {
      type: jobActionsTypes.DELETE_SUCCESS,
      id: "j1"
    }
  );
  const expectedState = {
    byId: {},
    allIds: [],
    errorMessage: null,
    isFetching: false
  };
  expect(state).toEqual(expectedState);
});
