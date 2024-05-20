import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  numberrandom: number=0;

  ngOnInit(): void {
    this.random();
  }

  navigatelogin() {
    this.router.navigate(['/login']);
  }

  navigatepokedex() {
    this.router.navigate(['/pokedex']);
  }
  navigateregister() {
    this.router.navigate(['/register']);
  }

  random() {
    this.numberrandom = Math.floor(Math.random() * 4);
  }
}
