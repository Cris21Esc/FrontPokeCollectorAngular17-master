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
  pokeActivo: Pokemon | null = null;
  pokeContraActivo: Pokemon | null = null;
  audioPlayer: HTMLAudioElement | null = null;
  equipoActivo: Pokemon[] | null = [];
  turno: number | undefined;
  idPokeActivo: number | undefined;
  serverMessage: string | undefined;
  message: string | undefined;
  messages: { userId: string; message: string; room: string; }[] = [];
  protected movimientos: Movimiento[] | undefined;
  roomId: string = '';
  userId: string | null = localStorage.getItem("user");
  private messagesSubscription: Subscription | undefined;
  private lastMessagesSubscription: Subscription | undefined;
  private actionSubscription: Subscription | undefined;
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
                this.servicePokemon.findpokemonbyid(equipo.pokemon2_id.toString()).subscribe(
                  (response) => {
                    // @ts-ignore
                    this.equipoActivo.push(response);
                    this.servicePokemon.findpokemonbyid(equipo.pokemon3_id.toString()).subscribe(
                      (response) => {
                        // @ts-ignore
                        this.equipoActivo.push(response);
                        this.servicePokemon.findpokemonbyid(equipo.pokemon4_id.toString()).subscribe(
                          (response) => {
                            // @ts-ignore
                            this.equipoActivo.push(response);
                            this.servicePokemon.findpokemonbyid(equipo.pokemon5_id.toString()).subscribe(
                              (response) => {
                                // @ts-ignore
                                this.equipoActivo.push(response);
                                this.servicePokemon.findpokemonbyid(equipo.pokemon6_id.toString()).subscribe(
                                  (response) => {
                                    // @ts-ignore
                                    this.equipoActivo.push(response);
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

  sendActionAndServerMessage(message: string,danio:number) {
    if (this.userId && this.roomId) {
      // @ts-ignore
      let botones = document.querySelectorAll('.botones') as HTMLButtonElement[];
      botones.forEach(element => element.disabled = true)
      // @ts-ignore
      this.chatService.sendAction(this.userId, message, danio ,this.roomId, this.pokeActivo.vel);
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

    setTimeout(() => {
      this.addAnimations2();
    }, 750);

    this.cleanupSubscriptions();
    // @ts-ignore
    this.pokeActivo = this.equipoActivo[0];
    if (this.userId) {
      this.chatService.joinRoom(room, this.userId);
      this.roomId = room;

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

      this.actionSubscription = this.chatService.getActions(room).subscribe((data: { userId: string, user1: string, user2: string, action1: string,danioAction1:number,action2: string,danioAction2:number}) => {
        const pokeActivoUser = document.querySelector('.pokeActivoUser') as HTMLDivElement;
        const pokeActivoContra = document.querySelector('.pokeActivoContra') as HTMLDivElement;
        if (data.user1 === this.userId) {
          setTimeout(() => {
            this.executeActions(data.action1);
            if (pokeActivoContra) {
              this.restartAnimation(pokeActivoContra, "hitPoke 0.75s linear");
            }
            setTimeout(()=>{
              this.actualizarBarraContra(data.danioAction1);
            },750);
          }, 1000);
          setTimeout(() => {
            this.restartAnimation(pokeActivoUser, "hitPoke 0.75s linear");
            setTimeout(()=>{
              this.actualizarBarraUser(data.danioAction2);
            },750);
            // @ts-ignore
            let botones = document.querySelectorAll('.botones') as HTMLButtonElement[];
            botones.forEach(element => element.disabled = false);
          }, 3500);
        } else {
          setTimeout(() => {
            if (pokeActivoContra) {
              this.restartAnimation(pokeActivoUser, "hitPoke 0.75s linear");
            }
            setTimeout(()=>{
              this.actualizarBarraUser(data.danioAction1);
            },750);
          }, 1000);

          setTimeout(() => {
            this.executeActions(data.action2);
            if (pokeActivoUser) {
              this.restartAnimation(pokeActivoContra, "hitPoke 0.75s linear");
            }
            setTimeout(()=>{
              this.actualizarBarraContra(data.danioAction2);
            },750);
            // @ts-ignore
            let botones = document.querySelectorAll('.botones') as HTMLButtonElement[];
            botones.forEach(element => element.disabled = false);
          }, 3500);
        }
      });
    }
  }
  /* A implementar mañana*/

  actualizarBarraUser(danio:number){
    console.log(danio);
  }

  actualizarBarraContra(danio:number){
    console.log(danio);
  }

  restartAnimation(element: HTMLElement, animation: string) {
    element.style.animation = 'none';
    element.offsetHeight; // trigger reflow
    element.style.animation = animation;
  }

  executeActions(action: string) {
    this.serverMessage = `${this.userId} ha utilizado ${action}`;
    this.chatService.sendServerMessage(this.roomId, this.serverMessage);
    setTimeout(() => {

    }, 500);
  }

  addAnimations() {
    const spriteUser = document.querySelector('.spriteUser') as HTMLDivElement;
    const vs = document.querySelector('.vs') as HTMLDivElement;
    const spriteContra = document.querySelector('.spriteContra') as HTMLDivElement;
    const pjContra = document.querySelector('.pjContra') as HTMLDivElement;
    const pokeActivoUser = document.querySelector('.pokeActivoUser') as HTMLDivElement;
    const pokeActivoContra = document.querySelector('.pokeActivoContra') as HTMLDivElement;
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
      const htmlFlash = flash as HTMLElement; // Casting a HTMLElement
      htmlFlash.style.animation = 'none';
      htmlFlash.offsetHeight;
      const durations = ['0.65s', '0.35s', '0.75s', '1s', '1.25s', '0.75s'];
      htmlFlash.style.animation = `moveFlashes ${durations[index]} linear infinite`;
    });
  }



  addAnimations2() {
    const fondoCombate = document.querySelector('.fondoCombate') as HTMLDivElement;
    const pjUser = document.querySelector('.pjUser') as HTMLDivElement;
    const vs = document.querySelector('.vs') as HTMLDivElement;
    const spriteContra = document.querySelector('.spriteContra') as HTMLDivElement;
    const pjContra = document.querySelector('.pjContra') as HTMLDivElement;
    if (fondoCombate) {
      fondoCombate.style.animation = 'fadeIntoCombat 4s linear';
      setTimeout(() => {
        fondoCombate.style.display = "none";
        this.addAnimations3();
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

  addAnimations3() {
    const pjUser = document.querySelector('.personajeUser') as HTMLDivElement;
    const pjContra = document.querySelector('.personajeContra') as HTMLDivElement;
    const pokeActivoUser = document.querySelector('.pokeActivoUser') as HTMLDivElement;
    const pokeActivoContra = document.querySelector('.pokeActivoContra') as HTMLDivElement;
    setTimeout(() => {
      if (pokeActivoUser) {
        setTimeout(() => {
          pokeActivoUser.style.opacity = "100%";
          // @ts-ignore
          pokeActivoUser.style.backgroundImage = 'url("/assets/OnBattle/back/' + this.pokeActivo.id + '.png")';
          pokeActivoUser.style.animation = "moverPokeIn 0.5s ease-out"
          setTimeout(() => {
            pokeActivoUser.style.backgroundSize = "100% 100%"
          }, 495);
          // @ts-ignore
          let divBotones = document.getElementById('divBotones') as HTMLDivElement;
          divBotones.style.opacity = "100%"
          // @ts-ignore
          let botones = document.querySelectorAll('.botones') as HTMLButtonElement[];
          botones.forEach(element => element.disabled = false)
        }, 2250);
      }
      if (pokeActivoContra) {
        setTimeout(() => {
          pokeActivoContra.style.opacity = "100%";
          // @ts-ignore
          pokeActivoContra.style.backgroundImage = 'url("/assets/OnBattle/front/' + this.pokeActivo.id + '.png")';
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
        }, 5500);
      }
      if (pjContra) {
        pjContra.style.animation = 'moverPjContraOut 6s linear';
        setTimeout(() => {
          pjContra.style.left = "1000px";
        }, 5500);
      }
    }, 3000);
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
