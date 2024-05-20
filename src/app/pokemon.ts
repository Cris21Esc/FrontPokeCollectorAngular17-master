export class Pokemon {

  private _id: number | undefined;

  private _num_pokedex: string | undefined;

  private _nombre: string | undefined;

  private _tipo: string | undefined;

  private _rareza: string | undefined;

  private _caught: boolean | undefined;

  private _hp: number | undefined;

  private _atk: number | undefined;

  private _atk_esp: number | undefined;

  private _def: number | undefined;

  private _def_esp: number | undefined;

  get id(): number {
    return <number>this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get num_pokedex(): string {
    return <string>this._num_pokedex;
  }

  set num_pokedex(value: string) {
    this._num_pokedex = value;
  }

  get nombre(): string {
    return <string>this._nombre;
  }

  set nombre(value: string) {
    this._nombre = value;
  }

  get tipo(): string {
    return <string>this._tipo;
  }

  set tipo(value: string) {
    this._tipo = value;
  }

  get rareza(): string {
    return <string>this._rareza;
  }

  set rareza(value: string) {
    this._rareza = value;
  }

  get caught(): boolean {
    return <boolean>this._caught;
  }

  set caught(value: boolean) {
    this._caught = value;
  }

  get hp(): number {
    return <number>this._hp;
  }

  set hp(value: number) {
    this._hp = value;
  }

  get atk(): number {
    return <number>this._atk;
  }

  set atk(value: number) {
    this._atk = value;
  }

  get atk_esp(): number {
    return <number>this._atk_esp;
  }

  set atk_esp(value: number) {
    this._atk_esp = value;
  }

  get def(): number {
    return <number>this._def;
  }

  set def(value: number) {
    this._def = value;
  }

  get def_esp(): number {
    return <number>this._def_esp;
  }

  set def_esp(value: number) {
    this._def_esp = value;
  }

  get vel(): number {
    return <number>this._vel;
  }

  set vel(value: number) {
    this._vel = value;
  }

  private _vel: number | undefined;
}
