import { Routes } from "@angular/router";
import { AddchannelComponent } from "./addchannel/addchannel.component";
import { AdduserComponent } from "./adduser/adduser.component";
import { DashboardComponent } from "./dashboard.component";
import { DrmComponent } from "./drm/drm.component";
import { SeechannelsComponent } from "./seechannels/seechannels.component";
import { SeeusersComponent } from "./seeusers/seeusers.component";
import { SellersComponent } from "./sellers/sellers.component";
import { SplashComponent } from "./splash/splash.component";



export const dashboardRoutes: Routes = [
    {path: 'splash', component: SplashComponent},
    {path: 'addusers', component: AdduserComponent},
    {path: 'dashboard', component: AdduserComponent},
    {path: 'users', component: SeeusersComponent},
    {path: 'addchannel', component: AddchannelComponent},
    {path: 'channels', component: SeechannelsComponent},
    {path: 'drm', component: DrmComponent},
    {path: 'sellers', component: SellersComponent}
]