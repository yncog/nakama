import {AnyAction} from 'redux';
import {all, call, fork, put, takeEvery} from 'redux-saga/effects';
import {doConsoleRpc} from '../common';
import {TournamentActionTypes} from './types';
import {
  tournamentFetchManySuccess,
  tournamentFetchManyError,
  tournamentCreateSuccess,
  tournamentCreateError,
  tournamentFetchSuccess,
  tournamentFetchError,
  tournamentDeleteSuccess,
  tournamentDeleteError
} from './actions';

function* handleFetchMany({payload}: AnyAction)
{
  try
  {
    const res = yield call(
      doConsoleRpc,
      'list_tournaments',
      payload
    );
    if(res.error)
    {
      yield put(tournamentFetchManyError(res.error));
    }
    else
    {
      yield put(tournamentFetchManySuccess(res));
    }
  }
  catch(err)
  {
    console.error(err);
    if(err.status === 401)
    {
      localStorage.clear();
      window.location.href = '/';
    }
    else if(err.json)
    {
      const json = yield err.json();
      yield put(tournamentFetchManyError(json.error || JSON.stringify(json)));
    }
    else if(err instanceof Error)
    {
      yield put(tournamentFetchManyError(err.stack!));
      localStorage.clear();
      window.location.href = '/';
    }
    else
    {
      yield put(tournamentFetchManyError('An unknown error occured.'));
    }
  }
}

function* handleCreate({payload}: AnyAction)
{
  try
  {
    const res = yield call(      
      doConsoleRpc,
      'create_tournament',
      payload
    );
    if(res.error)
    {
      yield put(tournamentCreateError(res.error));
    }
    else
    {
      yield put(tournamentCreateSuccess(res));
    }
  }
  catch(err)
  {
    console.error(err);
    if(err.status === 401)
    {
      localStorage.clear();
      window.location.href = '/';
    }
    else if(err.json)
    {
      const json = yield err.json();
      yield put(tournamentCreateError(json.error || JSON.stringify(json)));
    }
    else if(err instanceof Error)
    {
      yield put(tournamentCreateError(err.stack!));
      localStorage.clear();
      window.location.href = '/';
    }
    else
    {
      yield put(tournamentCreateError('An unknown error occured.'));
    }
  }
}

function* handleFetch({payload}: AnyAction)
{
  try
  {
    const res = yield call(
      doConsoleRpc,
      'get_tournament',
      payload
    );
    if(res.error)
    {
      yield put(tournamentFetchError(res.error));
    }
    else
    {
      yield put(tournamentFetchSuccess(res));
    }
  }
  catch(err)
  {
    console.error(err);
    if(err.status === 401)
    {
      localStorage.clear();
      window.location.href = '/';
    }
    else if(err.json)
    {
      const json = yield err.json();
      yield put(tournamentFetchError(json.error || JSON.stringify(json)));
    }
    else if(err instanceof Error)
    {
      yield put(tournamentFetchError(err.stack!));
      localStorage.clear();
      window.location.href = '/';
    }
    else
    {
      yield put(tournamentFetchError('An unknown error occured.'));
    }
  }
}

function* handleDelete({payload}: AnyAction)
{
  try
  {
    const res = yield call(
      doConsoleRpc,
      'delete_tournament',
      payload
    );
    if(res.error)
    {
      yield put(tournamentDeleteError(res.error));
    }
    else
    {
      yield put(tournamentDeleteSuccess());
      yield handleFetchMany({type: '@@tournaments/FETCH_MANY_REQUEST', payload: {} });
    }
  }
  catch(err)
  {
    console.error(err);
    if(err.status === 401)
    {
      localStorage.clear();
      window.location.href = '/';
    }
    else if(err.json)
    {
      const json = yield err.json();
      yield put(tournamentDeleteError(json.error || JSON.stringify(json)));
    }
    else if(err instanceof Error)
    {
      yield put(tournamentDeleteError(err.stack!));
      localStorage.clear();
      window.location.href = '/';
    }
    else
    {
      yield put(tournamentDeleteError('An unknown error occured.'));
    }
  }
}

function* watchFetchMany()
{
  yield takeEvery(TournamentActionTypes.FETCH_MANY_REQUEST, handleFetchMany);
}

function* watchCreate()
{
  yield takeEvery(TournamentActionTypes.CREATE_REQUEST, handleCreate);
}

function* watchFetch()
{
  yield takeEvery(TournamentActionTypes.FETCH_REQUEST, handleFetch);
}

function* watchDelete()
{
  yield takeEvery(TournamentActionTypes.DELETE_REQUEST, handleDelete);
}

export function* tournamentSaga()
{
  yield all([
    fork(watchFetchMany),
    fork(watchCreate),
    fork(watchFetch),
    fork(watchDelete)
  ]);
}
