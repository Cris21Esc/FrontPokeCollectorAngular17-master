import { Component, OnInit } from '@angular/core';
import { ServicepokemonsService} from "../../service-pokemons.service";
import { register_user} from "../../user_register";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registroexito:boolean|any;

  numerorandom:number=0;

  userData:{ contrasena: string; nombre: string; email: string } = {
    nombre: '',
    email: '',
    contrasena:''
  };

  user_register:register_user|undefined;

  constructor(private servicioPokemons:ServicepokemonsService) { }

  ngOnInit(): void {
    this.random();

  }
  registrarUsuarioPokemon() {
    this.servicioPokemons.guardarUserPokemon(<register_user>this.userData).subscribe(
      response => {
        this.registroexito=true;
      },
      error => {
        console.error('Error al registrar:', error);
        this.registroexito=false;   
      }
    );
  }
  random(){
    this.numerorandom=Math.floor(Math.random()*9)
  }

  onSubmit() {
    this.registrarUsuarioPokemon();
  }
}
