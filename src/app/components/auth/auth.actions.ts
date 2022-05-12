import { createAction, props } from '@ngrx/store';
import { CurrentUser } from 'src/app/models/currente-user.model';

export const setUser = createAction(
    '[Auth] setUser',
    props<{user: CurrentUser}>()
    );

export const unSetUser = createAction('[Auth] unSetUser');