import { Action, createReducer, on } from '@ngrx/store';
import { isLoading, stopLoading } from './ui.actions';

export interface State {
    isLoading: boolean; 
}

export const initialState: State = {
   isLoading: false,
}

const _uiReducer = createReducer(initialState,

    on( isLoading, state     => ({ ...state, isLoading: true }) ),
    on( stopLoading, state   => ({ ...state, isLoading: true }) ),

);

export function uiReducer(state: any, action: any) {
    return _uiReducer(state, action);
}