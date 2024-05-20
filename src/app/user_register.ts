export class register_user {

    private _nombre: string | undefined;

    private _contrasena: string | undefined;

    private _email: string | undefined;

  get nombre(): string {
    return <string>this._nombre;
  }

  set nombre(value: string) {
    this._nombre = value;
  }

  get contrasena(): string {
    return <string>this._contrasena;
  }

  set contrasena(value: string) {
    this._contrasena = value;
  }

  get email(): string {
    return <string>this._email;
  }

  set email(value: string) {
    this._email = value;
  }
}
