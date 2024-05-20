export class Movimiento {
  private _id: number | undefined;
  private _nombre: string | undefined;
  private _danio: number | undefined;

  constructor(id: number | undefined, nombre: string | undefined, danio: number | undefined) {
    this._id = id;
    this._nombre = nombre;
    this._danio = danio;
  }

  get id(): number {
    return <number>this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get nombre(): string {
    return <string>this._nombre;
  }

  set nombre(value: string) {
    this._nombre = value;
  }

  get danio(): number {
    return <number>this._danio;
  }

  set danio(value: number) {
    this._danio = value;
  }
}
