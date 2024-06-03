import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs';
import { register_user } from './user_register';
import { EquipoPokemon } from "./equipo-pokemon";

@Injectable({
  providedIn: 'root'
})
export class ServiceusersService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  //URL obtiene el API de POKEMONS
  private baseURL="https://ec2-3-209-208-3.compute-1.amazonaws.com:8443/api";

  private authToken: string | null = null;


  constructor(private httpClient:HttpClient) { }

  deletepokemon(pokemonId:string,userPokemonId:string):Observable<any>{
    return this.httpClient.delete<any>(`${this.baseURL}/deletepokemon`,{
      body:{pokemonId,userPokemonId}
    })
  }
  guardarTeam(equipo: EquipoPokemon): Observable<any> {
    return this.httpClient.post<any>(`${this.baseURL}/guardarEquipo`, equipo);
  }

  guardarUserPokemon(userData:register_user): Observable<any> {
    return this.httpClient.post<any>(`${this.baseURL}/regist`, userData);
  }

  login(credentials:{nombre:string; contrasena:string}): Observable<any>{
    return this.httpClient.post<any>(`${this.baseURL}/loginn`, credentials);
  }
  setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('token', token);
  }

  getAuthToken(): string | null {
    if (!this.authToken) {
      this.authToken = localStorage.getItem('token');
    }
    return this.authToken;
  }

  logout(): void {
    this.authToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('primerPoke');
    this.isLoggedInSubject.next(false);
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

  getAuthenticationState(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  handleLogin(response: any): void {
    this.setAuthToken(response.token);
    this.isLoggedInSubject.next(true); 
  }

  handleLoginError(error: any): void {
    console.error('Error en la autenticación:', error);
  }
}
