import {Component, OnInit} from '@angular/core';
import {ServicepokemonsService} from "../../service-pokemons.service";
import {Router} from '@angular/router';
import {ServiceusersService} from "../../service-users.service";
import {EquipoPokemon} from "../../equipo-pokemon";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']

})
export class UserComponent implements OnInit {

  token: string | null = null;
  toggle: boolean = false;
  userInfo: any;

  caughtPokemons: string[] = [];

  iduser: number | undefined;

  username: string | null = "";

  stringid: string = "";
  mensajeBack: string = "";
  equipoCrear: number | undefined;
  numEquipos: number = 1;
  equiposBack: EquipoPokemon[] = [];
  equipos: number = 1;
  pokesInEquipo: number = 0;
  pokesArray: number[] = [];
  private maxPokes: number = 6;
  slotIds: string[] = ["t1", "t2", "t3", "t4", "t5", "t6"];

  constructor(private servicepokemons: ServicepokemonsService, private router: Router, private serviceUser: ServiceusersService) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.userInfo = this.servicepokemons.getUserInfo();
    this.username = localStorage.getItem('user');
    this.showpokes(this.username)
    this.servicepokemons.findUserIdByNombre(localStorage.getItem('user')).subscribe(
      (userId) => {
        this.iduser = userId;
        this.servicepokemons.findAllEquiposByUserId(userId).subscribe(data => {
          console.log(data);
          if (data.length >= 1) {
            data.forEach(equipo => {
              this.equiposBack.push(equipo);
              this.equiposBack.forEach(equipo => {
                this.addPokeToEquipo(equipo.pokemon1_id.toString());
                this.addPokeToEquipo(equipo.pokemon2_id.toString());
                this.addPokeToEquipo(equipo.pokemon3_id.toString());
                this.addPokeToEquipo(equipo.pokemon4_id.toString());
                this.addPokeToEquipo(equipo.pokemon5_id.toString());
                this.addPokeToEquipo(equipo.pokemon6_id.toString());
                // @ts-ignore
                document.getElementById('nomEquipo').value = equipo.nombre;
              });
            });
            // @ts-ignore
            document.getElementById('crearEquipoButton').disabled = true;
          } else {
            // @ts-ignore
            document.getElementById('crearEquipoButton').disabled = false;
          }
        });
      });
  }

  showpokes(nombre: string | null) {
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

  navigatepokemon() {
    this.router.navigate(["/pokemon"]);
  }

  deletepokemon(idpokemondelete: string) {
    this.servicepokemons.findUserIdByNombre(this.userInfo.nombreUsuario).subscribe(
      (userId) => {
        this.iduser = userId;
        this.stringid = this.iduser.toString();
        this.serviceUser.deletepokemon(idpokemondelete, this.stringid).subscribe(
          () => {
            this.showpokes(this.username);
          }
        );
      })
  }

  addPokeToEquipo(poke: string) {
    if (this.pokesInEquipo < this.maxPokes) {
      this.pokesInEquipo++;
      this.addElementToNullPosition(poke)

      // Encontrar el primer slot disponible
      for (let i = 0; i < this.maxPokes; i++) {
        let slotId = this.slotIds[i];
        let slotImg = document.querySelector(`#${slotId} .pokemon-image-container img`) as HTMLImageElement;
        if (slotImg && slotImg.src.includes("huebo.png")) {
          // Cambiar la fuente de la imagen del Pokémon
          slotImg.src = `/assets/OnBattle/${poke}.gif`;

          // Agregar un event listener para eliminar la imagen
          slotImg.addEventListener("click", () => {
            if (this.toggle) {
              this.remove(slotImg);
            }
          });

          let slotDiv = document.querySelector(`#${slotId} #pokemonPlaceholder`) as HTMLDivElement;
          this.servicepokemons.findpokemonbyid(poke).subscribe(
            (response) => {
              slotDiv.innerHTML = response.nombre;
              slotImg.id = response.id;
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

    equipo.user_id = this.iduser;
    // @ts-ignore
    equipo.nombre = document.getElementById('nombreEquipoPokemon').value;
    equipo.pokemon1_id = this.pokesArray[0];
    equipo.pokemon2_id = this.pokesArray[1];
    equipo.pokemon3_id = this.pokesArray[2];
    equipo.pokemon4_id = this.pokesArray[3];
    equipo.pokemon5_id = this.pokesArray[4];
    equipo.pokemon6_id = this.pokesArray[5];
    console.log(equipo);
    this.serviceUser.guardarTeam(equipo).subscribe((message) => {
      console.log(message.message);
    });
    this.toggle = false;
  }

  crearEquipo() {
    this.toggle = true;
    // @ts-ignore
    document.getElementById("crearEquipoDiv").classList.remove("d-none");
    this.equipoCrear = this.numEquipos;
  }

  remove(img: HTMLImageElement) {
    img.src = "/assets/objetos/huebo.png";
    // @ts-ignore
    let idPoke = img.parentElement.parentElement.id;
    this.pokesArray[this.slotIds.indexOf(idPoke)] = -2;
    // @ts-ignore
    let slotDiv = img.parentElement.parentElement.querySelector('#pokemonPlaceholder');
    // @ts-ignore
    slotDiv.innerHTML = "???";
    this.pokesInEquipo--;
  }

  modificarEquipo() {
    this.toggle = true;
  }

  addElementToNullPosition(element: string) {
    // Encuentra la primera posición que sea null
    let nullIndex = this.pokesArray.indexOf(-2);

    if (nullIndex !== -1) {
      // Si se encontró una posición null, añade el elemento allí
      this.pokesArray[nullIndex] = parseInt(element);
    } else {
      // Si no hay posiciones null, añade el elemento al final del array
      this.pokesArray.push(parseInt(element));
    }
  }

}
