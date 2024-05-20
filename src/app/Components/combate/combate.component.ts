import { Component, OnInit } from '@angular/core';
import { ChatService} from "../../chat.service";
import { ServicepokemonsService} from "../../service-pokemons.service";
import { Movimiento } from "../../movimiento";

@Component({
  selector: 'app-combate',
  templateUrl: './combate.component.html',
  styleUrls: ['./combate.component.css']
})
export class CombateComponent implements OnInit {

  idPokeActivo: number | undefined;
  serverMessage: string | undefined;
  message: string | undefined;
  messages: { user: string; message: string; }[] = [];
  protected movimientos: Movimiento[] | undefined;

  constructor(private chatService: ChatService, private servicePokemon:ServicepokemonsService) { }

  ngOnInit() {
    this.chatService.getMessages().subscribe((data: { user: string; message: string; }) => {
      // Agregamos un nuevo objeto con el mensaje al arreglo de mensajes
      this.messages.push({ user: data.user, message: data.message });
    });
    this.idPokeActivo = 1;
    this.servicePokemon.movimientosPokemon(this.idPokeActivo).subscribe(data=>{
      this.movimientos = data;
    });

  }

  sendMessage() {
    // Enviamos el mensaje y el nombre de usuario actual
    this.chatService.sendMessage(this.message, sessionStorage.getItem("user"));
    this.message = ''; // Limpiamos el campo de entrada después de enviar el mensaje
  }

  sendServerMessage(message: string) {
    this.serverMessage = sessionStorage.getItem("user") + " ha utilizado " + message
    this.chatService.sendServerMessage(this.serverMessage,"Servidor");
  }
}
