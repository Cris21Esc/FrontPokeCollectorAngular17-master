import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceusersService } from '../../service-users.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent implements OnInit {
  links: string[] = [];
  isMenuOpen = false; 
  collapsed = true;
  screenWidth = 0;

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();

  constructor(private router: Router, private serviceUsers: ServiceusersService) {}

  navigate(link: string) {
    this.router.navigate(['/' + link]);
  }

  ngOnInit() {
    this.serviceUsers.getAuthenticationState().subscribe(isLoggedIn => {
      this.updateLinks();
    });
  }

  isLoggedIn() {
    return localStorage.getItem('user') !== null;
  }

  logout() {
    this.serviceUsers.logout();
    this.router.navigate(['/']);
  }

  updateLinks() {
    if (localStorage.getItem('user') !== null && localStorage.getItem('token') !== null) {
      this.links = ['inicio', 'pokedex', 'user', 'pokemon', 'combate'];
    } else {
      this.links = ['inicio', 'login', 'register'];
    }
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.isMenuOpen = !this.isMenuOpen; 
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav() {
    this.collapsed = false;
    this.isMenuOpen = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }
}
