import { Component, OnInit } from '@angular/core';
import { ServicepokemonsService} from "../../service-pokemons.service";
import { Router } from '@angular/router';
import { ServiceusersService} from "../../service-users.service";
import { EquipoPokemon} from "../../equipo-pokemon";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']

})
export class UserComponent implements OnInit {

  token: string | null = null;

  userInfo: any;

  caughtPokemons: string[] = [];

  iduser:number|undefined;

  username:string|null="";

  stringid:string="";
  mensajeBack:string="";
  equipoCrear:number|undefined;
  numEquipos:number=1;
  equiposBack:EquipoPokemon[]=[];
  equipos:number[] = [];
  pokesInEquipo: number = 0;
  pokesArray: number[] =[];
  private maxPokes: number = 6;
  slotIds: string[] = ["t1", "t2", "t3", "t4", "t5", "t6"];

  constructor(private servicepokemons:ServicepokemonsService,private router: Router,private  serviceUser:ServiceusersService) { }

  ngOnInit(): void {
    this.token = sessionStorage.getItem('token');
    this.userInfo = this.servicepokemons.getUserInfo();
    this.username=sessionStorage.getItem('user');
    this.showpokes(this.username)
    this.servicepokemons.findUserIdByNombre(sessionStorage.getItem('user')).subscribe(
      (userId)=>{
        this.iduser=userId;
        this.servicepokemons.findAllEquiposByUserId(userId).subscribe(data=>{
          console.log(data);
          data.forEach(equipo=>{
            this.equiposBack.push(equipo);
          });
        });
      });
  }
  showpokes(nombre:string|null){
      if (this.userInfo) {
        this.servicepokemons.obteneruserPokemons(nombre).subscribe(
          (data: string[]) => {
            this.caughtPokemons = data;
          },
          (error) => {
            console.log("No se pudo obtener la lista de pokemons:", error);
          }
        );
      }
    }

    navigatepokemon(){
      this.router.navigate(["/pokemon"]);
    }

  deletepokemon(idpokemondelete:string){
    this.servicepokemons.findUserIdByNombre(this.userInfo.nombreUsuario).subscribe(
      (userId)=>{
        this.iduser=userId;
        this.stringid=this.iduser.toString();
        this.serviceUser.deletepokemon(idpokemondelete,this.stringid).subscribe(
        ()=>{
          this.showpokes(this.username);
        }
      );
      })
  }

  addPokeToEquipo(poke: string, num: any) {
    if (this.pokesInEquipo < this.maxPokes) {
      this.pokesInEquipo++;
      this.pokesArray.push(parseInt(poke));
      
      // Encontrar el primer slot disponible
      for (let i = 0; i < this.maxPokes; i++) {
          let slotId = this.slotIds[i];
          let slotImg = document.querySelector(`#${slotId} .pokemon-image-container img`) as HTMLImageElement;
          if (slotImg && slotImg.src.includes("huebo.png")) {
              // Cambiar la fuente de la imagen del Pokémon
              slotImg.src = `/assets/OnBattle/${poke}.gif`;
              
              // Agregar un event listener para eliminar la imagen
              slotImg.addEventListener("click", () => {
                  this.remove(slotImg);
              });
              break;
          }
      }
  } else {
      let errorPokes = document.getElementById("errorPokes");
      if (errorPokes) {
          // Manejar el error (ej. mostrar un mensaje de error)
          errorPokes.innerText = "No puedes agregar más de 6 Pokémon al equipo.";
      }
  }
}

  guardarEquipo() {
    let equipo = new EquipoPokemon();
    equipo.user_id = <number> this.iduser;
    // @ts-ignore
    equipo.nombre = document.getElementById('nombreEquipoPokemon').value;
    equipo.pokemon1_id = this.pokesArray[0];
    equipo.pokemon2_id = this.pokesArray[1];
    equipo.pokemon3_id = this.pokesArray[2];
    equipo.pokemon4_id = this.pokesArray[3];
    equipo.pokemon5_id = this.pokesArray[4];
    equipo.pokemon6_id = this.pokesArray[5];
    console.log(equipo);
    this.serviceUser.guardarTeam(equipo).subscribe((message)=>{
      console.log(message.message);
    });
  }

  crearEquipo() {
    // @ts-ignore
    document.getElementById("crearEquipoDiv").classList.remove("d-none");
    this.equipos.push(this.numEquipos++);
    this.equipoCrear = this.numEquipos;
  }
  remove(img: HTMLImageElement) {
    img.src = "/assets/objetos/huebo.png"; 
    this.pokesInEquipo--;
}
}
