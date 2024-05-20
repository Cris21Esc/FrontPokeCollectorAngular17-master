import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ServiceusersService} from "../../service-users.service";

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent implements OnInit {
  links: string[] = [];

  constructor(private router: Router, private serviceUsers: ServiceusersService) {}

  navigate(link: string) {
    this.router.navigate(['/' + link]);
  }

  ngOnInit() {
    this.serviceUsers.getAuthenticationState().subscribe(isLoggedIn => {
      this.updateLinks();
    });
  }
  isLoggedIn(){
    if (sessionStorage.getItem('user') != null) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.serviceUsers.logout();
    this.router.navigate(['/']);
  }

  updateLinks() {
    if (sessionStorage.getItem('user') != null && sessionStorage.getItem("token") != null) {
      this.links = ['inicio', 'pokedex','user','pokemon','combate']; // Menús cuando el usuario está conectado
    } else {
      this.links = ['inicio', 'login','register']; // Menús cuando el usuario no está conectado
    }
  }
}
