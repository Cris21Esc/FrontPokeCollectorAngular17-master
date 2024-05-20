import { Component } from '@angular/core';
import {Pokemon} from "../../pokemon";
import {ServicepokemonsService} from "../../service-pokemons.service";

@Component({
  selector: 'app-lista-pokemons',
  templateUrl: './lista-pokemons.component.html',
  styleUrl: './lista-pokemons.component.css'
})
export class ListaPokemonsComponent {

  pokemons:Pokemon[]=[];
  pokemonBackup: Pokemon[]=[];
  tiposPokemon: string[] = [
    "Todos",
    "Normal",
    "Planta",
    "Veneno",
    "Fuego",
    "Agua",
    "Electrico",
    "Hielo",
    "Volador",
    "Psiquico",
    "Fantasma",
    "Bicho",
    "Lucha",
    "Tierra",
    "Roca",
    "Dragon"
  ];

  tipoSeleccionado: string = "Todos";

  constructor(private servicepokemonsService:ServicepokemonsService) { }

  ngOnInit(): void {
    this.obtenerpokemons();

  }

  private obtenerpokemons(){
    this.servicepokemonsService.obtenerPokemons().subscribe(dato =>{
      this.pokemons=dato;
      this.pokemonBackup = dato ? dato.slice() : [];
      this.filtrar();
    })
  }

  filtrar() {
    if(this.tipoSeleccionado==="Todos"){
      this.pokemons = this.pokemonBackup.slice();
      return;
    }
    this.pokemons = this.pokemonBackup.filter(pokemon => {
      return pokemon.tipo.includes(this.tipoSeleccionado);
    });
  }
  getPokemonInfo(pokemon: Pokemon): string {
    return `HP: ${pokemon.hp}`;
  }

  getPokemonAtk(pokemon: Pokemon): string {
    return `ATK: ${pokemon.atk}`;
  }

  getPokemonAtkEsp(pokemon: Pokemon): string {
    return `ATK_ESP: ${pokemon.atk_esp}`;
  }

  getPokemonDef(pokemon: Pokemon): string {
    return `DEF: ${pokemon.def}`;
  }

  getPokemonDefEsp(pokemon: Pokemon): string {
    return `DEF_ESP: ${pokemon.def_esp}`;
  }

  getPokemonVel(pokemon: Pokemon): string {
    return `VEL: ${pokemon.vel}`;
  }

}
