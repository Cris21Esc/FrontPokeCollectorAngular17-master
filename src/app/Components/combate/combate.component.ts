import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../chat.service';
import { ServicepokemonsService } from '../../service-pokemons.service';
import { Movimiento } from '../../movimiento';
import { Subscription } from 'rxjs';
import { EquipoPokemon } from '../../equipo-pokemon';

@Component({
  selector: 'app-combate',
  templateUrl: './combate.component.html',
  styleUrls: ['./combate.component.css']
})
export class CombateComponent implements OnInit, OnDestroy {
  audioPlayer: HTMLAudioElement | null = null;
  equiposBack: EquipoPokemon | undefined;
  turno: number | undefined;
  idPokeActivo: number | undefined;
  serverMessage: string | undefined;
  message: string | undefined;
  messages: { userId: string; message: string; room: string; }[] = [];
  protected movimientos: Movimiento[] | undefined;
  roomId: string = '';
  userId: string | null = sessionStorage.getItem("user");
  private messagesSubscription: Subscription | undefined;
  private lastMessagesSubscription: Subscription | undefined;
  lastMessagesCount: number = 10;

  constructor(private chatService: ChatService, private servicePokemon: ServicepokemonsService) { }

  ngOnInit() {
    this.idPokeActivo = 1;
    this.servicePokemon.movimientosPokemon(this.idPokeActivo).subscribe(data => {
      this.movimientos = data;
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
      this.chatService.sendMessage(sessionStorage.getItem('user'), this.message, this.roomId);
      this.message = '';
    }
  }

  sendServerMessage(message: string) {
    if (this.userId && this.roomId) {
      this.serverMessage = `${this.userId} ha utilizado ${message}`;
      this.chatService.sendServerMessage(this.roomId, this.serverMessage);
    }
  }

  waitForOpponent() {
    if (this.userId != null) {
      this.servicePokemon.findUserIdByNombre(sessionStorage.getItem('user')).subscribe(
        (userId) => {
          this.userId = userId.toString();
          this.servicePokemon.findAllEquiposByUserId(parseInt(this.userId)).subscribe(data => {
            if (data.length >= 1) {
              data.forEach(equipo => {
                this.equiposBack = equipo;
                console.log(this.equiposBack);
              });
            }
          });
          this.userId = sessionStorage.getItem('user');
          // @ts-ignore
          this.chatService.waitForOpponent(this.userId);
          this.chatService.onFoundOpponent((data: any) => {
            console.log('Combate encontrado', data);
            this.joinRoom(data.roomId);
          });
        }
      );
    }
  }

  joinRoom(room: string) {    
    const newAudioSrc = '/assets/sonidos/combate.mp3';
    if (this.audioPlayer) {
      this.audioPlayer.src = newAudioSrc;
      this.audioPlayer.load();
      this.audioPlayer.play();
    }
    setTimeout(()=>{
      this.addAnimations2();
    },750);
    this.cleanupSubscriptions();
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
      console.log(this.messages);
    }
  }

  addAnimations() {
    const spriteUser = document.querySelector('.spriteUser') as HTMLDivElement;
    const pjUser = document.querySelector('.pjUser') as HTMLDivElement;
    const vs = document.querySelector('.vs') as HTMLDivElement;
    const spriteContra = document.querySelector('.spriteContra') as HTMLDivElement;
    const pjContra = document.querySelector('.pjContra') as HTMLDivElement;
    if (spriteUser) {
      spriteUser.style.width = '175%';
    }
    if (pjUser) {
      pjUser.style.left = '40%';
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
      htmlFlash.offsetHeight; // Fuerza el reflujo
      const durations = ['0.65s', '0.35s', '0.75s', '1s', '1.25s', '0.75s'];
      htmlFlash.style.animation = `moveFlashes ${durations[index]} linear infinite`;
    });
  }
  
  

  addAnimations2() {
    const fondoCombate = document.querySelector('.fondoCombate') as HTMLDivElement;
    const spriteUser = document.querySelector('.spriteUser') as HTMLDivElement;
    const pjUser = document.querySelector('.pjUser') as HTMLDivElement;
    const vs = document.querySelector('.vs') as HTMLDivElement;
    const spriteContra = document.querySelector('.spriteContra') as HTMLDivElement;
    const pjContra = document.querySelector('.pjContra') as HTMLDivElement;
    if (fondoCombate) {
      fondoCombate.style.animation = 'fadeIntoCombat 5s linear';
      setTimeout(()=>{
        fondoCombate.style.opacity = "0%";
      },5000);
    }
    if (spriteUser) {
      spriteUser.style.animation = 'moverSpriteUser 0.2s linear';
      setTimeout(()=>{
        spriteUser.style.width = "70%";
      },200);
    }
    if (pjUser) {
      pjUser.style.animation = 'moverPjUser 0.2s linear';
      setTimeout(()=>{
        pjUser.style.left = "8%";
      },200);
    }
    if (vs) {
      vs.style.animation = 'enterVs 0.2s linear';
      setTimeout(()=>{
        vs.style.left = "42%";
      },200);
    }
    if (spriteContra) {
      spriteContra.style.animation = 'enterSpriteContra 0.2s linear';
      setTimeout(()=>{
        spriteContra.style.right = "-15%";
      },200);
    }
    if (pjContra) {
      pjContra.style.animation = 'enterPjContra 0.2s linear';
      setTimeout(()=>{
        pjContra.style.left = "65%";
      },200);
    }
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
  }
}
