import axios, { AxiosInstance } from 'axios';
import { Dispatch } from 'react';
import { SickAction } from '../types/sickType';

export class httpClient {
  #baseURL: string | undefined;
  #sickAxios: AxiosInstance | null;

  constructor() {
    this.#baseURL = 'http://localhost:4000/sick';
    this.#sickAxios = null;
    this.create();
  }

  create() {
    this.#sickAxios = axios.create({
      baseURL: this.#baseURL,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  async getRecommendSickSearch(dispatch: Dispatch<SickAction>, query: String) {
    try {
      if (query === '') {
        dispatch({ type: 'CLEAR_SEARCH' });
        return;
      }
      const res = await this.#sickAxios?.get(`?q=${query}`);
      console.info('calling api');

      dispatch({ type: 'GET_SICK_RECOMMEND_SEARCH', data: res?.data });
    } catch (error) {
      console.log(error);
    }
  }
}
