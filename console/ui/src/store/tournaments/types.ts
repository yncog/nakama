import {JSONObject} from "../common";

export interface TournamentObjectRequest
{

}

export interface TournamentObject
{
  id: string,
  title: string,
  description?: string,
  category: number,
  sort: string,
  size: number,
  operator: string,
  maxSize: number,
  maxNumScore: number,
  canEnter: boolean,
  duration: number,
  createTime: Date,
  startTime: Date,
  endTime:Date,
  startActive: Date
  endActive: Date,
  nextReset: Date,
  metadata: JSONObject,
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
