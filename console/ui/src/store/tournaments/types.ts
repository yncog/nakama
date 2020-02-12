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
  FETCH_MANY_REQUEST = '@@storage/FETCH_MANY_REQUEST',
  FETCH_MANY_SUCCESS = '@@storage/FETCH_MANY_SUCCESS',
  FETCH_MANY_ERROR = '@@storage/FETCH_MANY_ERROR',
  DELETE_MANY_REQUEST = '@@storage/DELETE_MANY_REQUEST',
  DELETE_MANY_SUCCESS = '@@storage/DELETE_MANY_SUCCESS',
  DELETE_MANY_ERROR = '@@storage/DELETE_MANY_ERROR',
  CREATE_REQUEST = '@@storage/CREATE_REQUEST',
  CREATE_SUCCESS = '@@storage/CREATE_SUCCESS',
  CREATE_ERROR = '@@storage/CREATE_ERROR',
  FETCH_REQUEST = '@@storage/FETCH_REQUEST',
  FETCH_SUCCESS = '@@storage/FETCH_SUCCESS',
  FETCH_ERROR = '@@storage/FETCH_ERROR',
  UPDATE_REQUEST = '@@storage/UPDATE_REQUEST',
  UPDATE_SUCCESS = '@@storage/UPDATE_SUCCESS',
  UPDATE_ERROR = '@@storage/UPDATE_ERROR',
  DELETE_REQUEST = '@@storage/DELETE_REQUEST',
  DELETE_SUCCESS = '@@storage/DELETE_SUCCESS',
  DELETE_ERROR = '@@storage/DELETE_ERROR'
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
