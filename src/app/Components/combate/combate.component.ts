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
