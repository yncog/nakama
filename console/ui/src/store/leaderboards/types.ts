import {JSONObject} from "../common";

export interface NewTournamentRequest
{
  title: string,
  description?: string,
  category: number,
  sort_order: string,
  operator: string,
  max_size: number,
  max_num_scores: number,
  duration: number,
  start_time: number,
  end_time:number,
  reset: string,
  metadata: string,
  join_required: boolean
}

export interface TournamentReference
{
  id: string
}

export interface TournamentObject
{
  id: string,
  title: string,
  description?: string,
  category: number,
  sort_order: string,
  size: number,
  max_size: number,
  max_num_score: number,
  can_enter: boolean,
  duration: number,
  create_time: number,
  start_time: number,
  end_time:number,
  start_active: number
  end_active: number,
  next_reset: number,
  metadata: JSONObject
};

export interface TournamentsObject
{
  tournaments: TournamentObject[],
  total_count: number
};

export interface TournamentsObjectRequest
{
};


export enum TournamentActionTypes
{
  FETCH_MANY_REQUEST = '@@tournaments/FETCH_MANY_REQUEST',
  FETCH_MANY_SUCCESS = '@@tournaments/FETCH_MANY_SUCCESS',
  FETCH_MANY_ERROR = '@@tournaments/FETCH_MANY_ERROR',
  DELETE_MANY_REQUEST = '@@tournaments/DELETE_MANY_REQUEST',
  DELETE_MANY_SUCCESS = '@@tournaments/DELETE_MANY_SUCCESS',
  DELETE_MANY_ERROR = '@@tournaments/DELETE_MANY_ERROR',
  CREATE_REQUEST = '@@tournaments/CREATE_REQUEST',
  CREATE_SUCCESS = '@@tournaments/CREATE_SUCCESS',
  CREATE_ERROR = '@@tournaments/CREATE_ERROR',
  FETCH_REQUEST = '@@tournaments/FETCH_REQUEST',
  FETCH_SUCCESS = '@@tournaments/FETCH_SUCCESS',
  FETCH_ERROR = '@@tournaments/FETCH_ERROR',
  UPDATE_REQUEST = '@@tournaments/UPDATE_REQUEST',
  UPDATE_SUCCESS = '@@tournaments/UPDATE_SUCCESS',
  UPDATE_ERROR = '@@tournaments/UPDATE_ERROR',
  DELETE_REQUEST = '@@tournaments/DELETE_REQUEST',
  DELETE_SUCCESS = '@@tournaments/DELETE_SUCCESS',
  DELETE_ERROR = '@@tournaments/DELETE_ERROR'
};

export interface NewTournamentState
{
  readonly loading: boolean,
  readonly data: TournamentReference,
  readonly errors?: string
};

export interface TournamentsState
{
  readonly loading: boolean,
  readonly data: TournamentsObject,
  readonly errors?: string
};

export interface TournamentState
{
  readonly loading: boolean,
  readonly updated: boolean,
  readonly data: TournamentObject,
  readonly errors?: string
};
