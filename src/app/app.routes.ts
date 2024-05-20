import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { PokedexComponent } from './Components/pokedex/pokedex.component';
import { UserComponent } from './Components/user/user.component';
import { loginGuard } from './Components/guards/login.guard';
import { ErrorPersonalizadoComponent } from "./Components/error-personalizado/error-personalizado-component.component";
import { LoginComponent } from './Components/login/login.component';
import { PokemonComponent } from './Components/pokemon/pokemon.component';
import { RegisterComponent } from './Components/register/register.component';
import { CombateComponent } from './Components/combate/combate.component';

export const routes: Routes = [
        {path:'',component:HomeComponent},
        {path:'inicio',component:HomeComponent},
        {path:'pokedex',component:PokedexComponent},
        {path:'user',component:UserComponent,
        canActivate:[loginGuard]
        },
        {path:'pokemon',component:PokemonComponent,
        canActivate:[loginGuard]
        },
        {path:'combate',component:CombateComponent,
        canActivate:[loginGuard]
        },
        {path:'login',component:LoginComponent},
        {path:'register',component:RegisterComponent},
        {path:'**',component:ErrorPersonalizadoComponent}

      ];

