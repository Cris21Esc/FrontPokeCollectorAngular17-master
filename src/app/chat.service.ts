import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor() {
    // Inicializamos el socket con la URL del servidor
    this.socket = io('http://localhost:3000', {
      withCredentials: true, // Habilitamos las credenciales CORS si es necesario
    });
  }

  sendMessage(message: string | undefined, user: string | null): void {
    const data = { user, message }; // Creamos un objeto con las propiedades user y message
    this.socket.emit('new-message', data); // Enviamos el objeto directamente
  }

  sendServerMessage(message: string, user: string | null): void{
    const data = { user, message }; // Creamos un objeto con las propiedades user y message
    this.socket.emit('new-message', data)
  }

  getMessages(): Observable<{ user: string, message: string }> {
    return new Observable<{ user: string, message: string }>(observer => {
      this.socket.on('new-message', (data: { user: string, message: string }) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
