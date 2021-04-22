import { PasswordService } from "./password.service";
import { UserService } from "./user.service";

class API {
  users = new UserService();
  passwords = new PasswordService();

  setAuthHeader(token: string) {
    this.users.setAuthHeader(token);
    this.passwords.setAuthHeader(token);
  }
}

export const $api = new API();
