import { createReducer, on } from '@ngrx/store';
import { CurrentUser } from 'src/app/models/currente-user.model';
import { setUser, unSetUser } from './auth.actions';

export interface State {
    user: CurrentUser; 
}

export const initialState: State = {
   user:
    {
        email   : '',
        pass    : '',
        uid     : '',            
        active  : true,
        expire  : '',        
        type    : 0,           
        role    : 0,               
        time    : 10800000 ,
    }
   
}

const _authReducer = createReducer(initialState,

    on(setUser, (state, {user}) => ({ ...state, user: {...user}})),
    on(unSetUser, state => ({ ...state, user: {
                                                email   : '',
                                                pass    : '',
                                                uid     : '',            
                                                active  : true,
                                                expire  : '',        
                                                type    : 0,           
                                                role    : 0,               
                                                time    : 10800000 ,
                                            } 
    })),

);

export function authReducer(state: any, action: any) {
    return _authReducer(state, action);
}