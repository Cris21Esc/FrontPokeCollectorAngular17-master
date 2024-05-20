export class EquipoPokemon {
  private _id: number | undefined;
  private _user_id: number | undefined;
  private _nombre: string | undefined;
  private _pokemon1_id: number | undefined;
  private _pokemon2_id: number | undefined;
  private _pokemon3_id: number | undefined;
  private _pokemon4_id: number | undefined;
  private _pokemon5_id: number | undefined;
  private _pokemon6_id: number | undefined;

  get id(): number {
    return <number>this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get user_id(): number {
    return <number>this._user_id;
  }

  set user_id(value: number) {
    this._user_id = value;
  }

  get nombre(): string {
    return <string>this._nombre;
  }

  set nombre(value: string) {
    this._nombre = value;
  }

  get pokemon1_id(): number {
    return <number>this._pokemon1_id;
  }

  set pokemon1_id(value: number) {
    this._pokemon1_id = value;
  }

  get pokemon2_id(): number {
    return <number>this._pokemon2_id;
  }

  set pokemon2_id(value: number) {
    this._pokemon2_id = value;
  }

  get pokemon3_id(): number {
    return <number>this._pokemon3_id;
  }

  set pokemon3_id(value: number) {
    this._pokemon3_id = value;
  }

  get pokemon4_id(): number {
    return <number>this._pokemon4_id;
  }

  set pokemon4_id(value: number) {
    this._pokemon4_id = value;
  }

  get pokemon5_id(): number {
    return <number>this._pokemon5_id;
  }

  set pokemon5_id(value: number) {
    this._pokemon5_id = value;
  }

  get pokemon6_id(): number {
    return <number>this._pokemon6_id;
  }

  set pokemon6_id(value: number) {
    this._pokemon6_id = value;
  }
}
