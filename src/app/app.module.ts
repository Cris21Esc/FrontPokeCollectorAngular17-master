import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ServiceusersService} from "./service-users.service";
import { HomeComponent} from "./Components/home/home.component";
import { PokedexComponent} from "./Components/pokedex/pokedex.component";
import { UserComponent } from './Components/user/user.component';
import { PokemonComponent } from './Components/pokemon/pokemon.component';
import { RouterModule} from '@angular/router';
import { ErrorPersonalizadoComponent} from "./Components/error-personalizado/error-personalizado-component.component";
import { LoginComponent } from './Components/login/login.component';
import { ListaPokemonsComponent } from "./Components/lista-pokemons/lista-pokemons.component";
import { HttpClientModule} from '@angular/common/http';
import { RegisterComponent } from './Components/register/register.component';
import { MenuPrincipalComponent } from './Components/menu-principal/menu-principal.component';
import {CombateComponent} from "./Components/combate/combate.component";
import {ChatService} from "./chat.service";
import { routes } from './app.routes';

/*DECLARAMOS LOS NUEVO COMPONENTES*/
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PokedexComponent,
    UserComponent,
    PokemonComponent,
    ErrorPersonalizadoComponent,
    LoginComponent,
    ListaPokemonsComponent,
    RegisterComponent,
    MenuPrincipalComponent,
    CombateComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [
    ServiceusersService,
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
