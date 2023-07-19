import { Dispatch, ReactNode } from 'react';
import { httpClient } from '../api/HttpClient';

export interface Sick {
  sickCd: string;
  sickNm: string;
}

export interface SickState {
  sickList: {
    data: Sick[] | null;
    cache: Sick[] | null;
  };
}

export type SickAction =
  | { type: 'GET_SICK_RECOMMEND_SEARCH'; data: Sick[] }
  | { type: 'CLEAR_SEARCH' };

export interface ApiProps {
  getRecommendSickSearch: (dispatch: Dispatch<SickAction>, query: String) => Promise<void>;
}

export interface sickProviderProps {
  httpClient: httpClient;
  children: ReactNode;
}
