import { Component, OnInit, ElementRef, Renderer2, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServicepokemonsService } from "../../service-pokemons.service";
import { ServiceusersService } from "../../service-users.service";

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent implements OnInit, AfterViewInit {
  @ViewChild('pjElement') pjElement!: ElementRef;
  @ViewChild('captureZone') captureZone!: ElementRef;

  pokemonid: number = 1;
  user_poke_info = {
    pokemonId: '',
    userPokemonId: ''
  };
  token: string | null = null;
  userinfo: any;
  id: string = "";
  user = sessionStorage.getItem("token");
  successMessage: string | null = null;
  errorMessage: string | null = null;
  userid: any;

  // pokemon info por id
  pokemon: any;

  // MOVIMIENTOS
  positionX: number = 0;
  positionY: number = 0;
  stepSize: number = 7;
  isMovingdown: boolean = false;
  isMovingright: boolean = false;
  isMovingleft: boolean = false;
  isMovingup: boolean = false;

  randomGrassId:string | undefined;

  collisionDetected:boolean| undefined;

  pjdontmove:boolean|undefined;

  audioPlayer: HTMLAudioElement | null = null;

  originalAudioSrc: string = '/assets/sonidos/route1mix.mp3';


  //RECUPERAR BOTON Y ELEMENTO BACKPJ PARA ANIMACION LANZAR POKEMON 
  constructor(
    private router: Router, 
    private serviciosPokemon: ServicepokemonsService, 
    private serviceUser: ServiceusersService,
    private renderer: Renderer2, 
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.token = sessionStorage.getItem("token");
    this.userinfo = this.serviceUser.getUserInfo();
    console.log(sessionStorage.getItem('user'));
    this.findid(sessionStorage.getItem('user'));
    this.pokeongrass();
    const audioElement = document.querySelector('audio');
    if (audioElement instanceof HTMLAudioElement) {
      this.audioPlayer = audioElement;
    }  }

  ngAfterViewInit(): void {}

  //generar el pokemon en una hierba
  pokeongrass(): void {
    this.randomGrassId = 'grass-' + (Math.floor(Math.random() * 15) + 1);
    this.collisionDetected = false;
    this.pjdontmove=false;
  }

  findpokemonbyid(id: string) {
    console.log(id);
    this.serviciosPokemon.findpokemonbyid(id).subscribe(
      (response) => {
        this.pokemon = response;
        this.successMessage = "Pokemon añadido exitosamente";
        this.errorMessage = "";
        console.log("El pokemon se encontró", this.pokemon);
      },
      (error) => {
        this.errorMessage = "Error al añadir el pokemon";
        this.successMessage = "";
        console.log("no se encontro el pokemon");
      }
    );
  }

  generarpokemon() {
    this.user_poke_info.pokemonId = Math.floor(Math.random() * 150).toString(); 
    this.user_poke_info.userPokemonId = this.id;
    console.log(this.id);
    this.findpokemonbyid(this.user_poke_info.pokemonId);

    console.log("id persona: " + this.user_poke_info.userPokemonId + " id pokemon: " + this.user_poke_info.pokemonId);
    this.pokeongrass();

  }

  findid(nombre: string|null): void {
    if (this.userinfo) {
      this.serviceUser.findUserIdByNombre(nombre).subscribe(
        userId => {
          this.id = userId.toString();
          this.generarpokemon();          
        }
      );
    }
  }

  navigateuser() {
    this.router.navigate(["/user"]);
  }

  reload() {
    this.router.navigate(["/pokemon"]);
  }

  onKeyPress(event: KeyboardEvent) {
    if (!this.pjdontmove){
    switch (event.key) {
      case 'a':
        if (this.positionX - this.stepSize >= 0) {
          this.positionX -= this.stepSize;
        }
        break;
      case 'd':
        if (this.positionX + this.stepSize <= 550) {
          this.positionX += this.stepSize;
        }
        break;
      case 'w':
        if (this.positionY - this.stepSize >= 0) {
          this.positionY -= this.stepSize;
        }
        break;
      case 's':
        if (this.positionY + this.stepSize <= 850) {
          this.positionY += this.stepSize;
        }
        break;
    }
    this.checkCollision();
  }
}

  onKeyDown(event: KeyboardEvent) {
    if (!this.pjdontmove){
    switch (event.key) {
      case 's':
        this.isMovingdown = true;
        break;
      case 'd':
        this.isMovingright = true;
        break;
      case 'a':
        this.isMovingleft = true;
        break;
      case 'w':
        this.isMovingup = true;
        break;
    }
  }
  }

  onKeyUp(event: KeyboardEvent) {
    switch (event.key) {
      case 's':
        this.isMovingdown = false;
        this.renderer.setStyle(this.pjElement.nativeElement, 'background-position', '0 0');
        break;
      case 'd':
        this.isMovingright = false;
        this.renderer.setStyle(this.pjElement.nativeElement, 'background-position', '0 65%');
        break;
      case 'a':
        this.isMovingleft = false;
        this.renderer.setStyle(this.pjElement.nativeElement, 'background-position', '0 35%');
        break;
      case 'w':
        this.isMovingup = false;
        this.renderer.setStyle(this.pjElement.nativeElement, 'background-position', '0 100%');
        break;
    }
  }

  click(){
    const backpj = document.getElementById('backpj') as HTMLDivElement;
    if (backpj) {
      backpj.classList.remove('animationpj');
      void backpj.offsetWidth; // Forzar un reflow
      backpj.classList.add('animationpj');
    }
  }

  deleteanimation(){
    const backpj = document.getElementById('backpj') as HTMLDivElement;
    backpj.classList.remove('animationpj');

  }

  checkCollision() {
    const grassElement = this.el.nativeElement.querySelector(`#${this.randomGrassId}`);
    const pjRect = this.pjElement.nativeElement.getBoundingClientRect();
    const grassRect = grassElement.getBoundingClientRect();
  
    if (
      pjRect.left < grassRect.right &&
      pjRect.right > grassRect.left &&
      pjRect.top < grassRect.bottom &&
      pjRect.bottom > grassRect.top
    ) {
      this.pjdontmove=true;

      if (this.audioPlayer) {
        this.audioPlayer.pause();
      }
      const newAudioSrc = '/assets/sonidos/batalla2.mp3'; // Cambia esto al URL correcto de tu nuevo audio
      if (this.audioPlayer) {
        this.audioPlayer.src = newAudioSrc;
        this.audioPlayer.load();
        this.audioPlayer.play();
      }
      console.log("SE ENCONTRO POKEMON 5s")
      setTimeout(() => {
        this.collisionDetected = true;

      }, 5000);
    }
  }
  
  closeCollisionOverlay() {
    this.deleteanimation();
    if (this.audioPlayer instanceof HTMLAudioElement && this.audioPlayer !== null) {
      this.audioPlayer.pause();
      this.audioPlayer.src = this.originalAudioSrc;
      this.audioPlayer.load();    
     this.audioPlayer.play();
     
    }
    
    this.collisionDetected = false;
  }

  addPokemon(): void {
    const rand=Math.floor(Math.random() * 3) + 1;
    this.user_poke_info.userPokemonId = this.id;
    console.log(rand)
    if(rand===1){
    this.serviciosPokemon.addpokemon(this.user_poke_info).subscribe(
      (response) => {
        console.log("POKEMON AÑADIDO EXITOSAMENTE");
        //EL POKEMON SE CAPTURA
        setTimeout(() => {
          this.closeCollisionOverlay();
          this.generarpokemon();
        }, 5000);
      },
    (error) => {
      console.log("ERROR AL AÑADIR EL POKEMON");
      setTimeout(() => {
        this.closeCollisionOverlay();
        this.generarpokemon();
      }, 5000);
    }
    );
  }
    //NO SE CAPTURA, NO PASA NADA
    else if(rand===2){
      console.log("EL POKEMON TE OBSERVA");
    }

    //EL POKEMON HUYE DEL COMBATE
    else if(rand===3){
      console.log("EL POKEMON HUYÓ DEL COMBATE")
      setTimeout(() => {
        this.closeCollisionOverlay();
        this.generarpokemon();
      }, 5000);
    }

  }
}
