import { API_URL } from "./config";
import { HttpRequester } from "./http-requester";

interface Password {
  id: string;
  user: string;
  username?: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  domain: string;
}

export class PasswordService extends HttpRequester {
  constructor() {
    super(`${API_URL}/passwords`);
  }

  setAuthHeader(token: string) {
    this.setHeaders({ authorization: `Bearer ${token}` });
  }

  async getPasswords(): Promise<Password[]> {
    const { data: passwords } = await this.get<Password[]>("");

    return passwords as Password[];
  }

  async createPassword(password: {
    username?: string;
    password: string;
    domain: string;
  }): Promise<Password> {
    const { data } = await this.post<Password>("", password);

    return data as Password;
  }

  async updatePassword(password: {
    id?: string;
    username?: string;
    password: string;
    domain: string;
  }): Promise<Password> {
    const { data } = await this.put<Password[]>("", [password]);
    const [pwd] = data as Password[];

    return pwd;
  }

  async deletePassword(password: { id?: string }): Promise<Password> {
    const { data } = await this.delete<Password[]>("", [password]);
    const [pwd] = data as Password[];

    return pwd;
  }
}
