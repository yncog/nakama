import {action} from 'typesafe-actions';
import {TournamentActionTypes, TournamentObjectRequest, TournamentsObjectRequest, TournamentObject, TournamentsObject} from './types';

export const tournamentFetchManyRequest = (data: TournamentsObjectRequest) => action(
  TournamentActionTypes.FETCH_MANY_REQUEST,
  data
);
export const tournamentFetchManySuccess = (data: TournamentsObject) => action(
  TournamentActionTypes.FETCH_MANY_SUCCESS,
  data
);
export const tournamentFetchManyError = (message: string) => action(
  TournamentActionTypes.FETCH_MANY_ERROR,
  message
);

export const tournamentCreateRequest = (data: TournamentObject) => action(
  TournamentActionTypes.CREATE_REQUEST,
  data
);
export const tournamentCreateSuccess = (data: TournamentObject) => action(
  TournamentActionTypes.CREATE_SUCCESS,
  data
);
export const tournamentCreateError = (message: string) => action(
  TournamentActionTypes.CREATE_ERROR,
  message
);

export const tournamentFetchRequest = (data: TournamentObjectRequest) => action(
  TournamentActionTypes.FETCH_REQUEST,
  data
);
export const tournamentFetchSuccess = (data: TournamentObject) => action(
  TournamentActionTypes.FETCH_SUCCESS,
  data
);
export const tournamentFetchError = (message: string) => action(
  TournamentActionTypes.FETCH_ERROR,
  message
);
export const tournamentDeleteRequest = (data: TournamentObjectRequest) => action(
  TournamentActionTypes.DELETE_REQUEST,
  data,
);
export const tournamentDeleteSuccess = () => action(
  TournamentActionTypes.DELETE_SUCCESS
);
export const tournamentDeleteError = (message: string) => action(
  TournamentActionTypes.DELETE_ERROR,
  message
);
