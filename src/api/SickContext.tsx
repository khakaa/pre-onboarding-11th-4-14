import { Dispatch, createContext, useContext, useReducer } from 'react';
import { SickState, SickAction, ApiProps, sickProviderProps } from '../types/sickType';

const initialState: SickState = {
  sickList: {
    data: [],
    cache: [],
  },
};

const SickContext = createContext<SickState | null>(null);
const SickAPIContext = createContext<ApiProps | null>(null);
const SickDispatchContext = createContext<Dispatch<SickAction> | null>(null);

function sickReducer(state: SickState, action: SickAction): SickState {
  switch (action.type) {
    case 'GET_SICK_RECOMMEND_SEARCH':
      return {
        sickList: { data: action.data, cache: state.sickList.cache },
      };
    case 'CLEAR_SEARCH':
      return {
        sickList: { data: [], cache: state.sickList.cache },
      };
  }
}

export function SickProvider({ httpClient, children }: sickProviderProps) {
  const getRecommendSickSearch = httpClient.getRecommendSickSearch.bind(httpClient);
  const [state, dispatch] = useReducer(sickReducer, initialState);

  return (
    <SickContext.Provider value={state}>
      <SickDispatchContext.Provider value={dispatch}>
        <SickAPIContext.Provider value={{ getRecommendSickSearch }}>
          {children}
        </SickAPIContext.Provider>
      </SickDispatchContext.Provider>
    </SickContext.Provider>
  );
}

export function useSickState(): SickState {
  const state = useContext(SickContext);
  if (!state) {
    throw new Error('Cannot find SickContext');
  }
  return state;
}

export function useSickDispatch(): Dispatch<SickAction> {
  const dispatch = useContext(SickDispatchContext);
  if (!dispatch) {
    throw new Error('Cannot find SickDispatch');
  }
  return dispatch;
}

export function useSickApi(): ApiProps {
  const apis = useContext(SickAPIContext);
  if (!apis) {
    throw new Error('Cannot find apis');
  }
  return apis;
}
