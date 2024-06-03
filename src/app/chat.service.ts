import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Pokemon } from './pokemon';

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

  sendAction(userId: string,action:string,danio:number,room:string,pokeActivoVel:number):void{
    const data = { userId:userId,action:action,danio:danio,room:room,vel:pokeActivoVel};
    this.socket.emit('recibirAccion',data);
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

  getActions():Observable<{userId: string,user1:string,user2:string,action1:string,danioAction1:number,action2:string,danioAction2:number}>{
    return new Observable<{userId: string,user1:string,user2:string,action1:string,danioAction1:number,action2:string,danioAction2:number}>(observer=>{
      this.socket.on('enviarAccion',(data:{userId: string,user1:string,user2:string,action1:string,danioAction1:number,action2:string,danioAction2:number})=>{
        observer.next(data);
      })
      return () => {
        this.socket.off('enviarAccion');
      };
    });
  }

  setPokeActivos(roomId:string,userId:string,pokeActivoId:number,equipoActivo:Pokemon[]){
    const data = { roomId:roomId,userId:userId,pokeActivoId:pokeActivoId,equipoActivo:equipoActivo};
    console.log(data);
    this.socket.emit('setPokeActivo',data);
  }
  setPokeIsDown(roomId:string,userId:string){
    console.log("envio derrotado");
    const data = { userId:userId,action:"esperar",danio:0,room:roomId,vel:-1};
    this.socket.emit("recibirAccion",data)
  }

  getPokeActivos():Observable<{ user1: string, pokeUser1: number, equipoActivo1:Object[],user2: string, pokeUser2: number,equipoActivo2:Object[] }>{
    return new Observable<{ user1: string, pokeUser1: number, equipoActivo1:Object[],user2: string, pokeUser2: number,equipoActivo2:Object[] }>(observer=>{
      this.socket.on("getPokesActivos",(data:{ user1: string, pokeUser1: number, equipoActivo1:Object[],user2: string, pokeUser2: number,equipoActivo2:Object[] })=>{
        observer.next(data);
      });
      return () => {
        this.socket.off('getPokesActivos');
      };
    })
  }

  getPokeIsDown():Observable<{pokeDown:boolean}>{
    return new Observable<{pokeDown:boolean}>(observer=>{
      this.socket.on("getPokeIsDown",(data)=>{
        observer.next(data);
      })
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
