import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceusersService} from "../../service-users.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credentials = {
    nombre: '',
    contrasena: ''
  };

  private primerPoke: boolean = false;

  numerorandom:number=0;

  redireccion:boolean|null=null;

  constructor(private router: Router, private userService:ServiceusersService) { }

  ngOnInit(): void {
    this.random();
    const pokemonstrado = localStorage.getItem('primerPoke');
    if (pokemonstrado) {
      this.primerPoke = true;
    }
  }

  random(){
    this.numerorandom=Math.floor(Math.random()*9)
  }

  login(): void {
    this.userService.login(this.credentials).subscribe(
      response => {
        this.redireccion=true;
        if(this.redireccion===true){
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', response.nombre);
          this.router.navigate(["/user"]);
          }
          this.userService.handleLogin(response)
          if (!this.primerPoke) {
            this.mostrarprimerpoke();
          }
        },

      error => {
        this.redireccion=false;
        this.userService.handleLoginError(error);
      }
    );
  }

  mostrarprimerpoke(): void {
    // Mostrar el mensaje de bienvenida por primera vez
    console.log('¡Bienvenido por primera vez!');
    
    // Marcar que ya se ha mostrado el mensaje por primera vez
    this.primerPoke = true;
    localStorage.setItem('primerPoke', 'true');
  }

}
