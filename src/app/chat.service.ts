import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      withCredentials: true,
    });
  }

  sendMessage(userId: string | null, message: string | undefined, room: string | null): void {
    const data = { userId, message, room };
    this.socket.emit('message', data);
  }

  sendServerMessage(room: string, message: string): void {
    const data = { userId:"servidor",message,room };
    this.socket.emit('message', data);
  }

  sendAction(userId: string,action:string):void{
    const data = { userId:userId,action:action};
    this.socket.emit('enviarAccion',data);
  }

  getMessages(room: string): Observable<{ userId: string, message: string, room: string }> {
    return new Observable<{ userId: string, message: string, room: string }>(observer => {
      this.socket.on('message', (data: { userId: string, message: string, room: string }) => {
        observer.next(data);
      });

      return () => {
        this.socket.off('message');
      };
    });
  }

  getActions(room:string):Observable<{userId: string,action:string}>{
    return new Observable<{userId: string,action:string}>(observer=>{
      this.socket.on('recibirAccion',(data:{userId: string,action:string})=>{
        observer.next(data);
      })
      return () => {
        this.socket.off('recibirAccion');
      };
    });
  }

  requestLastMessages(room: string, count: number): Observable<{ userId: string, message: string, room: string }> {
    return new Observable<{ userId: string, message: string, room: string }>(observer => {
      this.socket.emit('request-last-messages', { room, count });

      this.socket.on('last-messages', (messages: { userId: string, message: string, room: string }[]) => {
        messages.forEach(message=>{
          observer.next(message);
        })
      });
    });
  }

  getRooms(): Observable<string[]> {
    return new Observable<string[]>(observer => {
      this.socket.off('rooms');

      this.socket.on('rooms', (rooms: string[]) => {
        observer.next(rooms);
      });

      return () => {
        this.socket.off('rooms');
      };
    });
  }

  joinRoom(roomId: string, userId: string): void {
    this.socket.emit('join-room', roomId, userId);
  }

  leaveRoom(): void {
    this.socket.emit('leave-room');
  }

  requestRooms(): void {
    this.socket.emit('request-rooms');
  }

  waitForOpponent(userId: string) {
    this.socket.emit('find-opponent', userId);
  }

  onFoundOpponent(callback: (data: any) => void) {
    this.socket.on('found-opponent', callback);
  }

}
