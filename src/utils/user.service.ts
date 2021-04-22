import { API_URL } from "./config";
import { HttpRequester } from "./http-requester";

interface Login {
  username: string;
  password: string;
}
interface Signup {
  username: string;
  email: string;
  password: string;
}
interface User {
  id: string;
  username: string;
  token: string;
  tokenExpires: Date;
  createdAt: Date;
  updatedAt: Date;
  email: string;
}

export class UserService extends HttpRequester {
  constructor() {
    super(`${API_URL}/users`);
  }

  setAuthHeader(token: string) {
    this.setHeaders({ authorization: `Bearer ${token}` });
  }

  private persistUser(user: User) {
    localStorage["loggedUser"] = JSON.stringify(user);
  }

  async login(login: Login): Promise<User> {
    const { data: user } = await this.post<User>("/login", login);
    this.persistUser(user as User);

    return user as User;
  }

  async signup(signup: Signup): Promise<User> {
    const { data: user } = await this.post<User>("/signup", signup);
    this.persistUser(user as User);

    return user as User;
  }

  recoverAuth(): User {
    const user = JSON.parse(localStorage.loggedUser);

    return user;
  }
}
