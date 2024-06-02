import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../chat.service';
import { ServicepokemonsService } from '../../service-pokemons.service';
import { Movimiento } from '../../movimiento';
import { Subscription } from 'rxjs';
import { EquipoPokemon } from '../../equipo-pokemon';
import { Pokemon } from '../../pokemon';

@Component({
  selector: 'app-combate',
  templateUrl: './combate.component.html',
  styleUrls: ['./combate.component.css']
})
export class CombateComponent implements OnInit, OnDestroy {
  debilitado: boolean = false;
  psArrayUser: number[] = [];
  psArrayContra: number[] = [];
  pokeIsDown: boolean = false;
  pokeIdArrayUser: number = 0;
  pokeIdArrayContra: number = 0;
  pokeActivo: Pokemon | null = null;
  pokeContraActivo: Pokemon | null = null;
  audioPlayer: HTMLAudioElement | null = null;
  protected equipoActivo: Pokemon[] | null = [];
  protected equipoActivoContra: Pokemon[] | null = [];
  turno: number | undefined;
  idPokeActivo: number | undefined;
  serverMessage: string | undefined;
  message: string | undefined;
  messages: { userId: string; message: string; room: string; }[] = [];
  protected movimientos: Movimiento[] | undefined;
  roomId: string = '';
  userId: string | null | undefined = "";
  private messagesSubscription: Subscription | undefined;
  private lastMessagesSubscription: Subscription | undefined;
  private actionSubscription: Subscription | undefined;
  private getPokeActivos: Subscription | undefined;
  lastMessagesCount: number = 10;

  constructor(private chatService: ChatService, private servicePokemon: ServicepokemonsService) { }

  ngOnInit() {
    this.servicePokemon.findUserIdByNombre(localStorage.getItem('user')).subscribe(
      (userId) => {
        this.servicePokemon.findAllEquiposByUserId(userId).subscribe(data => {
          data.forEach(equipo => {
            this.servicePokemon.findpokemonbyid(equipo.pokemon1_id.toString()).subscribe(
              (response) => {
                // @ts-ignore
                this.equipoActivo.push(response);
                // @ts-ignore
                this.equipoActivo[0].deshabilitado = true;
                // @ts-ignore
                this.equipoActivo[0].saludActual = this.equipoActivo[0].hp;
                this.servicePokemon.findpokemonbyid(equipo.pokemon2_id.toString()).subscribe(
                  (response) => {
                    // @ts-ignore
                    this.equipoActivo.push(response);
                    // @ts-ignore
                    this.equipoActivo[1].deshabilitado = false;
                    // @ts-ignore
                    this.equipoActivo[1].saludActual = this.equipoActivo[1].hp;
                    this.servicePokemon.findpokemonbyid(equipo.pokemon3_id.toString()).subscribe(
                      (response) => {
                        // @ts-ignore
                        this.equipoActivo.push(response);
                        // @ts-ignore
                        this.equipoActivo[2].deshabilitado = false;
                        // @ts-ignore
                        this.equipoActivo[2].saludActual = this.equipoActivo[2].hp;
                        this.servicePokemon.findpokemonbyid(equipo.pokemon4_id.toString()).subscribe(
                          (response) => {
                            // @ts-ignore
                            this.equipoActivo.push(response);
                            // @ts-ignore
                            this.equipoActivo[3].deshabilitado = false;
                            // @ts-ignore
                            this.equipoActivo[3].saludActual = this.equipoActivo[3].hp;
                            this.servicePokemon.findpokemonbyid(equipo.pokemon5_id.toString()).subscribe(
                              (response) => {
                                // @ts-ignore
                                this.equipoActivo.push(response);
                                // @ts-ignore
                                this.equipoActivo[4].deshabilitado = false;
                                // @ts-ignore
                                this.equipoActivo[4].saludActual = this.equipoActivo[4].hp;
                                this.servicePokemon.findpokemonbyid(equipo.pokemon6_id.toString()).subscribe(
                                  (response) => {
                                    // @ts-ignore
                                    this.equipoActivo.push(response);
                                    // @ts-ignore
                                    this.equipoActivo[5].deshabilitado = false;
                                    // @ts-ignore
                                    this.equipoActivo[5].saludActual = this.equipoActivo[5].hp;
                                    // @ts-ignore
                                    this.idPokeActivo = this.equipoActivo[0].id;
                                    this.servicePokemon.movimientosPokemon(this.idPokeActivo).subscribe(data => {
                                      this.movimientos = data;
                                    });
                                  });
                              });
                          });
                      });
                  });
              });
          });
        });
      });
    const audioElement = document.querySelector('audio');
    if (audioElement instanceof HTMLAudioElement) {
      this.audioPlayer = audioElement;
    }
    this.addAnimations();
  }

  ngOnDestroy() {
    this.cleanupSubscriptions();
    this.chatService.leaveRoom();
  }

  sendMessage() {
    if (this.message && this.userId && this.roomId) {
      this.chatService.sendMessage(localStorage.getItem('user'), this.message, this.roomId);
      this.message = '';
    }
  }

  sendActionAndServerMessage(message: string, danio: number) {
    if (this.userId && this.roomId) {
      // @ts-ignore
      let botones = document.querySelectorAll('.botones') as HTMLButtonElement[];
      botones.forEach(element => element.disabled = true)
      // @ts-ignore
      let pokeBotones = document.querySelectorAll('.pokeBoton') as HTMLButtonElement[];
      pokeBotones.forEach(element => element.disabled = true)
      if(message === "cambio"){
        // @ts-ignore
        this.chatService.sendAction(this.userId, message, danio, this.roomId, 9999); 
      }else{
        // @ts-ignore
        this.chatService.sendAction(this.userId, message, danio, this.roomId, this.pokeActivo.vel); 
      }      
    }
  }

  waitForOpponent() {
    this.userId = localStorage.getItem('user');
    // @ts-ignore
    this.chatService.waitForOpponent(this.userId);
    this.chatService.onFoundOpponent((data: any) => {
      this.joinRoom(data.roomId);
    });
  }

  joinRoom(room: string) {
    const newAudioSrc = '/assets/sonidos/combate.mp3';
    if (this.audioPlayer) {
      this.audioPlayer.src = newAudioSrc;
      this.audioPlayer.load();
      this.audioPlayer.play();
    }
    // @ts-ignore
    this.pokeActivo = this.equipoActivo[0];
    this.cleanupSubscriptions();
    if (this.userId) {
      this.chatService.joinRoom(room, this.userId);
      this.roomId = room;
      console.log(this.equipoActivo)
      // @ts-ignore
      this.chatService.setPokeActivos(this.roomId, this.userId, this.pokeActivo.id, this.equipoActivo);
      this.getPokeActivos = this.chatService.getPokeActivos().subscribe((data: { user1: string, pokeUser1: number, equipoActivo1: Object[], user2: string, pokeUser2: number, equipoActivo2: Object[] }) => {
        if (data.user1 === localStorage.getItem('user')) {
          // @ts-ignore
          this.equipoActivoContra = data.equipoActivo2;
        } else {
          // @ts-ignore
          this.equipoActivoContra = data.equipoActivo1;
        }
        let arrayBotones = document.querySelectorAll('.pokeBoton') as NodeListOf<HTMLButtonElement>;

        for (let index = 0; index < Array.from(arrayBotones).length; index++) {
          // @ts-ignore
          Array.from(arrayBotones)[index].disabled = this.equipoActivo[index].deshabilitado;
          Array.from(arrayBotones)[index].value = (this.pokeIdArrayUser++).toString();
          Array.from(arrayBotones)[index].addEventListener('click', () => {
            this.sendActionAndServerMessage('cambio', parseInt(Array.from(arrayBotones)[index].value))
          })
          
        }
        // @ts-ignore
        this.pokeContraActivo = this.equipoActivoContra[0];
        // @ts-ignore
        this.pokeContraActivo.saludActual = this.pokeContraActivo.hp;

        setTimeout(() => {
          this.addAnimations2(data.user1, data.pokeUser1, data.user2, data.pokeUser2);
        }, 750);
      });

      this.lastMessagesSubscription = this.chatService.requestLastMessages(room, this.lastMessagesCount).subscribe((data: { userId: string; message: string; room: string; }) => {
        if (data.room === this.roomId) {
          this.messages.push(data);
        }
      });

      this.messagesSubscription = this.chatService.getMessages(room).subscribe((data: { userId: string; message: string; room: string; }) => {
        if (data.room === this.roomId) {
          this.messages.push(data);
        }
      });

      window.addEventListener('resize', () => {
        // @ts-ignore
        this.animarBarra(this.pokeActivo.saludActual, this.pokeActivo.hp, ".psUser", 0); // 0 ms para una actualización instantánea
        // @ts-ignore
        this.animarBarra(this.pokeContraActivo.saludActual, this.pokeContraActivo.hp, ".psContra", 0); // 0 ms para una actualización instantánea
      });

      this.actionSubscription = this.chatService.getActions().subscribe((data: { userId: string, user1: string, user2: string, action1: string, danioAction1: number, action2: string, danioAction2: number }) => {
        const pokeActivoUser = document.querySelector('.pokeActivoUser') as HTMLDivElement;
        const pokeActivoContra = document.querySelector('.pokeActivoContra') as HTMLDivElement;
        console.log(data);
        if(data.user1 === this.userId){
          this.executeActions(data.action1);
          if(data.action1.includes("esperar")){
            // @ts-ignore
            let botones = document.querySelectorAll('.botones') as HTMLButtonElement[];
            botones.forEach(element => element.disabled = true);
            // @ts-ignore
            let arrayBotones = document.querySelectorAll('.pokeBoton') as NodeListOf<HTMLButtonElement>;
            for (let index = 0; index < Array.from(arrayBotones).length; index++) {
              // @ts-ignore
              Array.from(arrayBotones)[index].disabled = this.equipoActivo[index].deshabilitado;
            }
          }else{
            if(data.action1.includes("cambio")){
              setTimeout(()=>{
                // @ts-ignore
                this.pokeActivo.deshabilitado = false;
                this.restartAnimation(pokeActivoUser, "moverPokeOut 0.5s linear");
                // @ts-ignore
                this.pokeActivo = this.equipoActivo[data.danioAction1];
                // @ts-ignore
                this.animarBarra(this.pokeActivo.saludActual,this.pokeActivo.hp,".psUser",0);
                setTimeout(()=>{
                  pokeActivoUser.style.backgroundSize = "100% 0";
                  this.lanzarPokeballUser();
                  setTimeout(()=>{
                    // @ts-ignore
                    pokeActivoUser.style.backgroundImage = 'url("/assets/OnBattle/back/' + this.equipoActivo[data.danioAction1].id + '.png")';
                    this.restartAnimation(pokeActivoUser, "moverPokeIn 0.5s linear");                  
                    setTimeout(()=>{
                       // @ts-ignore
                       this.pokeActivo.deshabilitado = true;
                      pokeActivoUser.style.backgroundSize = "100% 100%";                    
                    },500);
                  },1250);
                },500)
              },1000);
              setTimeout(() => {
                if(data.action2.includes("cambio")){
                  this.executeActions(data.action2);
                  setTimeout(()=>{
                    this.restartAnimation(pokeActivoContra, "moverPokeOut 0.5s linear");
                    setTimeout(()=>{
                      pokeActivoContra.style.backgroundSize = "100% 0";
                      // @ts-ignore
                      this.pokeContraActivo = this.equipoActivoContra[data.danioAction2];
                      // @ts-ignore
                      this.animarBarra(this.pokeContraActivo.saludActual,this.pokeContraActivo.hp,".psContra",0);
                      this.lanzarPokeballContra();
                      setTimeout(()=>{
                        // @ts-ignore
                        pokeActivoContra.style.backgroundImage = 'url("/assets/OnBattle/front/' + this.equipoActivoContra[data.danioAction1].id + '.png")';
                        this.restartAnimation(pokeActivoContra, "moverPokeIn 0.5s linear");                      
                        setTimeout(()=>{
                          pokeActivoContra.style.backgroundSize = "100% 100%";
                          // @ts-ignore
                          let botones = document.querySelectorAll('.botones') as HTMLButtonElement[];
                          botones.forEach(element => element.disabled = false);
                          // @ts-ignore
                          let pokeBotones = document.querySelectorAll('.pokeBoton') as HTMLButtonElement[];
                          for (let index = 0; index < pokeBotones.length; index++) {
                            // @ts-ignore
                            pokeBotones[index].disabled = this.equipoActivo[index].deshabilitado;
                          }
                        },500);
                      },1250);
                    },500)
                  },1000);
                }else{
                  this.executeActions(data.action2);
                  if (pokeActivoUser) {
                    this.restartAnimation(pokeActivoUser, "hitPoke 0.75s linear");
                  }
                  setTimeout(() => {                
                    this.actualizarBarraUser(data.danioAction2);
                  }, 750);
                  // @ts-ignore
                  let botones = document.querySelectorAll('.botones') as HTMLButtonElement[];
                  botones.forEach(element => element.disabled = false);
                  // @ts-ignore
                  let pokeBotones = document.querySelectorAll('.pokeBoton') as HTMLButtonElement[];
                  for (let index = 0; index < pokeBotones.length; index++) {
                    // @ts-ignore
                    pokeBotones[index].disabled = this.equipoActivo[index].deshabilitado;
                  }
                }              
              }, 3250);
            }else{
              setTimeout(() => {
                this.executeActions(data.action1);
                // @ts-ignore
                if (pokeActivoContra && this.pokeContraActivo.saludActual>0) {
                  this.executeActions(data.action1);
                  this.restartAnimation(pokeActivoContra, "hitPoke 0.75s linear");
                  setTimeout(() => {
                    this.actualizarBarraContra(data.danioAction1);
                  }, 750);
                  setTimeout(()=>{
                    // @ts-ignore                
                    if(this.pokeContraActivo.saludActual<=0){
                      this.executeActions("debilitado"); /* accion al usuario contrario */
                      // @ts-ignore  
                      this.chatService.setPokeIsDown(this.roomId,this.userId);
                      this.debilitado = true;
                    }
                  },3250);
                }              
              }, 1000);    
              if(this.debilitado === false){
                setTimeout(() => {
                  this.restartAnimation(pokeActivoUser, "hitPoke 0.75s linear");
                  setTimeout(() => {
                    this.actualizarBarraUser(data.danioAction2);
                  }, 750);
                  // @ts-ignore
                  let botones = document.querySelectorAll('.botones') as HTMLButtonElement[];
                  botones.forEach(element => element.disabled = false);
                  // @ts-ignore
                  let pokeBotones = document.querySelectorAll('.pokeBoton') as HTMLButtonElement[];
                  for (let index = 0; index < pokeBotones.length; index++) {
                    // @ts-ignore
                    pokeBotones[index].disabled = this.equipoActivo[index].deshabilitado;
                  }
                }, 3250);
              }                    
            }        
          }
          
        }else{                        /*jugador 2 */
          this.executeActions(data.action1);
          if(data.action1.includes("cambio")){
            setTimeout(()=>{
              this.restartAnimation(pokeActivoContra, "moverPokeOut 0.5s linear");
              // @ts-ignore
              this.pokeContraActivo = this.equipoActivoContra[data.danioAction1];
              // @ts-ignore
              this.animarBarra(this.pokeContraActivo.saludActual,this.pokeContraActivo.hp,".psContra",0);
              setTimeout(()=>{
                pokeActivoContra.style.backgroundSize = "100% 0";
                this.lanzarPokeballContra();
                setTimeout(()=>{
                  // @ts-ignore
                  pokeActivoContra.style.backgroundImage = 'url("/assets/OnBattle/front/' + this.equipoActivoContra[data.danioAction1].id + '.png")';
                  this.restartAnimation(pokeActivoContra, "moverPokeIn 0.5s linear");                  
                  setTimeout(()=>{
                    pokeActivoContra.style.backgroundSize = "100% 100%";                    
                  },500);
                },1250);
              },500)
            },1000);
            setTimeout(() => {
              if(data.action2.includes("cambio")){
                this.executeActions(data.action2);
                setTimeout(()=>{
                  this.restartAnimation(pokeActivoUser, "moverPokeOut 0.5s linear");
                  setTimeout(()=>{
                    pokeActivoUser.style.backgroundSize = "100% 0";
                    // @ts-ignore
                    this.pokeActivo.deshabilitado = false;
                    // @ts-ignore
                    this.pokeActivo = this.equipoActivo[data.danioAction2];
                    // @ts-ignore
                    this.animarBarra(this.pokeActivo.saludActual,this.pokeActivo.hp,".psUser",0);
                    this.lanzarPokeballUser();
                    setTimeout(()=>{
                      // @ts-ignore
                      pokeActivoUser.style.backgroundImage = 'url("/assets/OnBattle/back/' + this.equipoActivo[data.danioAction1].id + '.png")';
                      this.restartAnimation(pokeActivoUser, "moverPokeIn 0.5s linear");                      
                      setTimeout(()=>{
                        // @ts-ignore
                        this.pokeActivo.deshabilitado = true;
                        pokeActivoUser.style.backgroundSize = "100% 100%";
                        // @ts-ignore
                        let botones = document.querySelectorAll('.botones') as HTMLButtonElement[];
                        botones.forEach(element => element.disabled = false);
                        // @ts-ignore
                        let pokeBotones = document.querySelectorAll('.pokeBoton') as HTMLButtonElement[];
                        for (let index = 0; index < pokeBotones.length; index++) {
                          // @ts-ignore
                          pokeBotones[index].disabled = this.equipoActivo[index].deshabilitado;
                        }
                      },500);
                    },1250);
                  },500)
                },1000);
              }else{
                this.executeActions(data.action2);
                if (this.pokeContraActivo) {
                  this.restartAnimation(pokeActivoContra, "hitPoke 0.75s linear");
                }
                setTimeout(() => {                
                  this.actualizarBarraContra(data.danioAction2);
                }, 750);
                // @ts-ignore
                let botones = document.querySelectorAll('.botones') as HTMLButtonElement[];
                botones.forEach(element => element.disabled = false);
                // @ts-ignore
                let pokeBotones = document.querySelectorAll('.pokeBoton') as HTMLButtonElement[];
                for (let index = 0; index < pokeBotones.length; index++) {
                  // @ts-ignore
                  pokeBotones[index].disabled = this.equipoActivo[index].deshabilitado;
                }
              }              
            }, 3250);
          }else{
            setTimeout(()=>{
              this.executeActions(data.action1);
              if (pokeActivoUser) {
                this.restartAnimation(pokeActivoUser, "hitPoke 0.75s linear");
              }
              setTimeout(() => {                
                this.actualizarBarraUser(data.danioAction1);
              }, 750);
              // @ts-ignore
              let botones = document.querySelectorAll('.botones') as HTMLButtonElement[];
              botones.forEach(element => element.disabled = false);
              // @ts-ignore
              let pokeBotones = document.querySelectorAll('.pokeBoton') as HTMLButtonElement[];
              for (let index = 0; index < pokeBotones.length; index++) {
                // @ts-ignore
                pokeBotones[index].disabled = this.equipoActivo[index].deshabilitado;
              }
            },1000);            
            setTimeout(()=>{
              this.executeActions(data.action2);
                if (this.pokeContraActivo) {
                  this.restartAnimation(pokeActivoContra, "hitPoke 0.75s linear");
                }
                setTimeout(() => {                
                  this.actualizarBarraContra(data.danioAction2);
                }, 750);
                // @ts-ignore
                let botones = document.querySelectorAll('.botones') as HTMLButtonElement[];
                botones.forEach(element => element.disabled = false);
                // @ts-ignore
                let pokeBotones = document.querySelectorAll('.pokeBoton') as HTMLButtonElement[];
                for (let index = 0; index < pokeBotones.length; index++) {
                  // @ts-ignore
                  pokeBotones[index].disabled = this.equipoActivo[index].deshabilitado;
                }
            },3250);
          }
        }
      });
    }    
  }

  addAnimations() {
    const spriteUser = document.querySelector('.spriteUser') as HTMLDivElement;
    const vs = document.querySelector('.vs') as HTMLDivElement;
    const spriteContra = document.querySelector('.spriteContra') as HTMLDivElement;
    const pjContra = document.querySelector('.pjContra') as HTMLDivElement;
    const pokeActivoUser = document.querySelector('.pokeActivoUser') as HTMLDivElement;
    const pokeActivoContra = document.querySelector('.pokeActivoContra') as HTMLDivElement;
    const pokeballUser = document.querySelector('.user') as HTMLDivElement;
    const pokeballContra = document.querySelector('.contra') as HTMLDivElement;
    if (pokeballUser) {
      pokeballUser.style.left = "-50px";
    }
    if (pokeballContra) {
      pokeballContra.style.left = "50px";
    }
    if (pokeActivoUser) {
      pokeActivoUser.style.opacity = "0";
    }
    if (pokeActivoContra) {
      pokeActivoContra.style.opacity = "0";
    }
    if (spriteUser) {
      spriteUser.style.width = '175%';
    }
    if (vs) {
      vs.style.left = '10000px';
    }
    if (spriteContra) {
      spriteContra.style.right = '10000px';
    }
    if (pjContra) {
      pjContra.style.left = '10000px';
    }
    const flashes = document.querySelectorAll('.flash1, .flash2, .flash3, .flash4, .flash5, .flash6');
    flashes.forEach((flash, index) => {
      const htmlFlash = flash as HTMLElement;
      htmlFlash.style.animation = 'none';
      htmlFlash.offsetHeight;
      const durations = ['0.65s', '0.35s', '0.75s', '1s', '1.25s', '0.75s'];
      htmlFlash.style.animation = `moveFlashes ${durations[index]} linear infinite`;
    });
  }



  addAnimations2(user1: string, pokeActivo1: number, user2: string, pokeActivo2: number) {
    const fondoCombate = document.querySelector('.fondoCombate') as HTMLDivElement;
    const pjUser = document.querySelector('.pjUser') as HTMLDivElement;
    const vs = document.querySelector('.vs') as HTMLDivElement;
    const spriteContra = document.querySelector('.spriteContra') as HTMLDivElement;
    const pjContra = document.querySelector('.pjContra') as HTMLDivElement;
    if (fondoCombate) {
      fondoCombate.style.animation = 'fadeIntoCombat 4s linear';
      setTimeout(() => {
        fondoCombate.style.display = "none";
        this.addAnimations3(user1, pokeActivo1, user2, pokeActivo2);
      }, 4000);
    }
    if (pjUser) {
      pjUser.style.animation = 'moverPjUser 0.2s linear';
      setTimeout(() => {
        pjUser.style.left = "-90%";
      }, 200);
    }
    if (vs) {
      vs.style.animation = 'enterVs 0.2s linear';
      setTimeout(() => {
        vs.style.left = "-15%";
      }, 200);
    }
    if (spriteContra) {
      spriteContra.style.animation = 'enterSpriteContra 0.2s linear';
      setTimeout(() => {
        spriteContra.style.right = "-42%";
      }, 200);
    }
    if (pjContra) {
      pjContra.style.animation = 'enterPjContra 0.2s linear';
      setTimeout(() => {
        pjContra.style.left = "75%";
      }, 200);
    }
  }

  addAnimations3(user1: string, pokeActivo1: number, user2: string, pokeActivo2: number) {
    const pjUser = document.querySelector('.personajeUser') as HTMLDivElement;
    const pjContra = document.querySelector('.personajeContra') as HTMLDivElement;
    const pokeActivoUser = document.querySelector('.pokeActivoUser') as HTMLDivElement;
    const pokeActivoContra = document.querySelector('.pokeActivoContra') as HTMLDivElement;
    let pokeUsu = 0;
    let pokeContra = 0;
    if (user1 === localStorage.getItem('user')) {
      pokeUsu = pokeActivo1;
      pokeContra = pokeActivo2;
    } else {
      pokeUsu = pokeActivo2;
      pokeContra = pokeActivo1;
    }
    setTimeout(() => {
      if (pokeActivoUser) {
        setTimeout(() => {
          pokeActivoUser.style.opacity = "100%";
          // @ts-ignore
          pokeActivoUser.style.backgroundImage = 'url("/assets/OnBattle/back/' + pokeUsu + '.png")';
          pokeActivoUser.style.animation = "moverPokeIn 0.5s ease-out"
          setTimeout(() => {
            pokeActivoUser.style.backgroundSize = "100% 100%"
          }, 495);
          // @ts-ignore
          let divBotones = document.getElementsByClassName('divBotones') as HTMLCollectionOf<HTMLDivElement>;
          Array.from(divBotones).forEach(div => {
            div.style.opacity = "100%";
          });
          // @ts-ignore
          let botones = document.querySelectorAll('.botones') as HTMLButtonElement[];
          botones.forEach(element => element.disabled = false);
        }, 2250);
      }
      if (pokeActivoContra) {
        setTimeout(() => {
          pokeActivoContra.style.opacity = "100%";
          // @ts-ignore
          pokeActivoContra.style.backgroundImage = 'url("/assets/OnBattle/front/' + pokeContra + '.png")';
          pokeActivoContra.style.animation = "moverPokeIn 0.5s ease-out"
          setTimeout(() => {
            pokeActivoContra.style.backgroundSize = "100% 100%"
          }, 495);
        }, 2250);
      }
      if (pjUser) {
        pjUser.style.animation = 'moverPjUserOut 6s linear';
        setTimeout(() => {
          pjUser.style.right = "1000px";
        }, 5500); setTimeout(() => {
          this.lanzarPokeballs();
        }, 1000);
      }
      if (pjContra) {
        pjContra.style.animation = 'moverPjContraOut 6s linear';
        setTimeout(() => {
          pjContra.style.left = "1000px";
        }, 5500);
        setTimeout(() => {
          this.lanzarPokeballs();
        }, 1000);
      }
    }, 3000);
  }

  actualizarBarraUser(danio: number): void {
    // @ts-ignore
    let danioCalculated = Math.floor(0.01 * 85 * ((((0.2 * 50 + 1) * danio * this.pokeActivo.atk) / (25 * this.pokeActivo.def)) + 2));
    console.log(danioCalculated + "daño a usuario")
    // @ts-ignore
    this.pokeActivo.saludActual = Math.max(0, this.pokeActivo.saludActual - danioCalculated);
    // @ts-ignore
    console.log(this.pokeActivo.saludActual);
    // @ts-ignore
    this.animarBarra(this.pokeActivo.saludActual, this.pokeActivo.hp, ".psUser", 2000);
  }

  actualizarBarraContra(danio: number): void {
    // @ts-ignore
    let danioCalculated = Math.floor(0.01 * 85 * ((((0.2 * 50 + 1) * danio * this.pokeContraActivo.atk) / (25 * this.pokeContraActivo.def)) + 2));
    console.log(danioCalculated + "daño a enemigo")
    // @ts-ignore
    this.pokeContraActivo.saludActual = Math.max(0, this.pokeContraActivo.saludActual - danioCalculated);
    // @ts-ignore
    console.log(this.pokeContraActivo.saludActual);
    // @ts-ignore
    this.animarBarra(this.pokeContraActivo.saludActual, this.pokeContraActivo.hp, ".psContra", 2000);
  }

  animarBarra(saludActual: number, maxSalud: number, selector: string, animTime: number): void {
    let barra = document.querySelector(selector) as HTMLDivElement;
    if (!barra) return;
    console.log("entro");
    const duracion = animTime;
    const fps = 60;
    const interval = 1000 / fps;
    const totalSteps = duracion / interval;
    let stepCount = 0;
  
    const anchoContenedor = barra.parentElement ? barra.parentElement.offsetWidth : barra.offsetWidth;
    const porcentajeSalud = saludActual / maxSalud;
    const anchoNuevo = anchoContenedor * porcentajeSalud;
  
    const anchoInicial = barra.offsetWidth;
    const pasoAncho = (anchoInicial - anchoNuevo) / totalSteps;
  
    const animar = () => {
      if (stepCount >= totalSteps) {
        barra.style.width = `${anchoNuevo}px`;
        return;
      }
  
      let anchoActual = parseFloat(barra.style.width || barra.offsetWidth.toString());
      anchoActual -= pasoAncho;
      barra.style.width = `${anchoActual}px`;
  
      stepCount++;
      requestAnimationFrame(animar);
    };
    requestAnimationFrame(animar);
  }
     

  restartAnimation(element: HTMLElement, animation: string) {
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = animation;
  }

  executeActions(action: string) {
    if (action.includes("cambio")) {
      this.serverMessage = `${this.userId} ha cambiado a de Pokemon`;
      this.chatService.sendServerMessage(this.roomId, this.serverMessage);
    } else if (action.includes("debilitado")) {
      this.serverMessage = `${this.userId} tiene un pokemon menos`;
      this.chatService.sendServerMessage(this.roomId, this.serverMessage);
      this.chatService.setPokeIsDown(this.roomId, true);
      // @ts-ignore
      this.pokeActivo.deshabilitado = true;
    } else {
      this.serverMessage = `${this.userId} ha utilizado ${action}`;
      this.chatService.sendServerMessage(this.roomId, this.serverMessage);
    }
  }

  derrotarPoke(pokeIdArray: number) {
    // @ts-ignore
    this.equipoActivo[pokeIdArray].disabled = true;
  }

  lanzarPokeballs() {
    const pokeballUser = document.querySelector('.user') as HTMLDivElement;
    const pokeballContra = document.querySelector('.contra') as HTMLDivElement;
    pokeballUser.style.opacity = "100%";
    pokeballContra.style.opacity = "100%";
    pokeballUser.style.left = "0";
    pokeballContra.style.left = "0";
    this.restartAnimation(pokeballUser, "movePokeballUser 1.25s cubic-bezier(0.3, 0.02, 0.32, 1)");
    this.restartAnimation(pokeballContra, "movePokeballContra 1.25s cubic-bezier(0.3, 0.02, 0.32, 1)");
    setTimeout(() => {
      pokeballUser.style.opacity = "0";
      pokeballContra.style.opacity = "0";
    }, 1250);
  }
  lanzarPokeballUser() {
    const pokeballUser = document.querySelector('.user') as HTMLDivElement;
    pokeballUser.style.opacity = "100%";
    pokeballUser.style.left = "0";
    this.restartAnimation(pokeballUser, "movePokeballUser 1.25s cubic-bezier(0.3, 0.02, 0.32, 1)");
    setTimeout(() => {
      pokeballUser.style.opacity = "0";
    }, 1250);
  }
  lanzarPokeballContra() {
    const pokeballContra = document.querySelector('.contra') as HTMLDivElement;
    pokeballContra.style.opacity = "100%";
    pokeballContra.style.left = "0";
    this.restartAnimation(pokeballContra, "movePokeballContra 1.25s cubic-bezier(0.3, 0.02, 0.32, 1)");
    setTimeout(() => {
      pokeballContra.style.opacity = "0";
    }, 1250);
  }


  cleanupSubscriptions() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
      this.messagesSubscription = undefined;
    }
    if (this.lastMessagesSubscription) {
      this.lastMessagesSubscription.unsubscribe();
      this.lastMessagesSubscription = undefined;
    }
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
      this.actionSubscription = undefined;
    }
  }
}
