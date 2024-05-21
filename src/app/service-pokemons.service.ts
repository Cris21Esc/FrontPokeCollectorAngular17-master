import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from './pokemon';
import { register_user } from './user_register';
import { Movimiento } from "./movimiento";
import {EquipoPokemon} from "./equipo-pokemon";


@Injectable({
  providedIn: 'root'
})
export class ServicepokemonsService {
  //URL obtiene el API de POKEMONS
  private baseURL="http://localhost:8085/api";
  private authToken: string | null = null;

  constructor(private httpClient:HttpClient) { }

  obtenerPokemons():Observable<Pokemon[]>{

    return this.httpClient.get<Pokemon[]>(`${this.baseURL}/pokemon`);
  }
//ESTOS 2 A USERSERVICE
  guardarUserPokemon(userData:register_user): Observable<any> {
    return this.httpClient.post<any>(`${this.baseURL}/regist`, userData);
  }

  login(credentials:{nombre:string; contrasena:string}): Observable<any>{
    return this.httpClient.post<any>(`${this.baseURL}/loginn`, credentials);

  }

  obteneruserPokemons(nombre:string|null):Observable<string[]>{
    return this.httpClient.get<string[]>(`${this.baseURL}/users/pokemons?username=${nombre}`);
  }

  setAuthToken(token: string): void {
    this.authToken = token;
    sessionStorage.setItem('token', token);
  }

  getAuthToken(): string | null {
    if (!this.authToken) {
      this.authToken = sessionStorage.getItem('token');
    }
    return this.authToken;
  }

  logout(): void {
    this.authToken = null;
    sessionStorage.removeItem('token');
  }

  getUserInfo(): any {
    const token = this.getAuthToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { nombreUsuario: payload.sub};
    }
    return null;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  findUserIdByNombre(nombre: string|null): Observable<number> {
    return this.httpClient.post<number>(`${this.baseURL}/find-id`, { nombre });
  }

  findpokemonbyid(pokemonid:string): Observable<any>{
    return this.httpClient.get<any>(`${this.baseURL}/pokemon/`+pokemonid)
  }

  addpokemon(user_poke_info: { pokemonId: string; userPokemonId: string }): Observable<any> {
    return this.httpClient.post<any>(`${this.baseURL}/add-pokemon`, user_poke_info);
  }


  deletePokemon(pokemonId: string, userPokemonId: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseURL}/user_pokemon_caught`, {
      headers: this.getAuthHeaders(),
      body: { pokemonId, userPokemonId }
    });
  }

  movimientosPokemon(id:number):Observable<Movimiento[]>{
    return this.httpClient.get<Movimiento[]>(`${this.baseURL}/movimientos/`+id)
  }

  findAllEquiposByUserId(userId: number):Observable<EquipoPokemon[]> {    
    return this.httpClient.get<EquipoPokemon[]>(`${this.baseURL}/getAllEquipos/`+userId);
  }

}
