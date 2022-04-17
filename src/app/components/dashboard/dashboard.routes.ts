import { Routes } from "@angular/router";
import { LoginComponent } from "../auth/login/login.component";
import { AddchannelComponent } from "./addchannel/addchannel.component";
import { AdduserComponent } from "./adduser/adduser.component";
import { DrmComponent } from "./drm/drm.component";
import { SeechannelsComponent } from "./seechannels/seechannels.component";
import { SeeusersComponent } from "./seeusers/seeusers.component";



export const dashboardRoutes: Routes = [
    {path: 'dashboard', component: AdduserComponent},
    {path: 'users', component: SeeusersComponent},
    {path: 'addchannel', component: AddchannelComponent},
    {path: 'channels', component: SeechannelsComponent},
    {path: 'drm', component: DrmComponent},
]