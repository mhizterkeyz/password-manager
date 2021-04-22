import moment from "moment";

import { generateStrongPassword } from ".";
import { HttpError } from "./errors";

interface RequestObject {
  body?: any;
  headers?: Headers;
  user?: Users;
}

interface ResponseObject {
  status: number;
  json: () => Promise<{ message: string; data: any; meta: any }>;
  text: () => Promise<string>;
}

interface Users {
  id: string;
  username: string;
  token: string;
  tokenExpires: Date;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  email: string;
}
interface Password {
  id: string;
  user: string;
  username?: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  domain: string;
  isDeleted: boolean;
}
interface DB {
  users: Users[];
  passwords: Password[];
}
type NextMiddleWare = (err?: HttpError) => void;
type RouteHandler = (req: RequestObject) => Promise<ResponseObject>;
type MiddleWare = (req: RequestObject, next: NextMiddleWare) => void;
type Predicate<T> = (value: T, index: number, array: T[]) => boolean;

const gimmeDB = (): DB => {
  let users = localStorage["users"];
  let passwords = localStorage["passwords"];

  const db = {
    users: (users && JSON.parse(users)) || [],
    passwords: (passwords && JSON.parse(passwords)) || [],
  };
  return db;
};
const writeUser = (users: Users[]) => {
  localStorage["users"] = JSON.stringify(users);
};
const writePassword = (passwords: Password[]) => {
  localStorage["passwords"] = JSON.stringify(passwords);
};
const authenticate: MiddleWare = (req, next) => {
  if (!req.headers) return next(new HttpError("No authorization headers", 400));
  const { headers } = req;
  if (!headers.get("authorization"))
    return next(new HttpError("No authorization headers", 400));
  const [, token] = headers.get("authorization")?.split(" ") as string[];
  const user = userService.findOne((value) => value.token === token);
  if (!user) return next(new HttpError("Invalid authorization token", 401));
  if (moment().isAfter(user.tokenExpires))
    return next(new HttpError("Authorization token expired", 401));
  req.user = user;
};

const userService = {
  findOne(predicate: Predicate<Users>) {
    const { users } = gimmeDB();
    const user = users.find(predicate);
    return user;
  },
  create(user: Users) {
    const { users } = gimmeDB();
    user.createdAt = moment().toDate();
    user.updatedAt = moment().toDate();
    user.token = generateStrongPassword();
    user.id = generateStrongPassword();
    user.tokenExpires = moment().add(10, "minutes").toDate();

    writeUser([user, ...users]);
    return user;
  },
  loginUser(user: Users) {
    const { users } = gimmeDB();
    const userIndex = users.findIndex((value) => value.id === user.id);
    users.splice(userIndex, 1);
    user.updatedAt = moment().toDate();
    user.token = generateStrongPassword();
    user.tokenExpires = moment().add(10, "minutes").toDate();

    writeUser([user, ...users]);
    return user;
  },
};
const passwordService = {
  create(password: Password) {
    const { passwords } = gimmeDB();
    password.id = generateStrongPassword();
    password.updatedAt = moment().toDate();
    password.createdAt = moment().toDate();
    password.isDeleted = false;

    writePassword([password, ...passwords]);
    return password;
  },
  find(predicate: Predicate<Password>) {
    const { passwords } = gimmeDB();
    return passwords.filter(predicate);
  },
  updateMultiple(updates: any[]) {
    const { passwords } = gimmeDB();
    const updated: Password[] = [];
    updates.forEach((update) => {
      const index = passwords.findIndex((value) => value.id === update.id);
      console.log("index is ", index);
      if (index === undefined) return;
      let [password] = passwords.splice(index, 1);
      delete update.id;
      password = { ...password, ...update, updatedAt: moment().toDate() };
      writePassword([password, ...passwords]);
      updated.push(password);
    });

    console.log(updated);

    return updated;
  },
  deleteMultiple(updates: any[]) {
    return this.updateMultiple(
      updates.map((update) => ({ id: update.id, isDeleted: true }))
    );
  },
};

const middleWares: Record<string, MiddleWare[]> = {
  "GET /passwords": [authenticate],
  "POST /passwords": [authenticate],
  "PUT /passwords": [authenticate],
  "DELETE /passwords": [authenticate],
};

const routes: Record<string, RouteHandler> = {
  "POST /users/login"(req) {
    const login = req.body as { username: string; password: string };
    const user = userService.findOne((value) => {
      return (
        (value.username === login.username || value.email === login.username) &&
        value.password === login.password
      );
    });
    if (!user) return respondify(401, "Invalid username or password");

    return respondify(200, "Login successful", userService.loginUser(user));
  },

  "POST /users/signup"(req) {
    const user = req.body as Users;
    const existingUsername = userService.findOne((value) => {
      return value.username === user.username;
    });
    if (existingUsername) return respondify(400, "Username already taken");
    const existingEmail = userService.findOne((value) => {
      return value.email === user.email;
    });
    if (existingEmail) return respondify(400, "Email already taken");

    const created = userService.create(user);
    return respondify(201, "Account created", created);
  },

  "POST /passwords"(req) {
    const password = req.body as Password;
    password.user = req?.user?.id as string;
    const created = passwordService.create(password);

    return respondify(201, "Password record created", created);
  },

  "GET /passwords"(req) {
    const user = req.user as Users;
    const passwords = passwordService
      .find((value) => value.user === user.id && !value.isDeleted)
      .sort((a, b) => (moment(a.createdAt).isAfter(b.createdAt) ? -1 : 1));

    return respondify(200, "Your passwords", passwords);
  },

  "PUT /passwords"(req) {
    const updates = req.body;
    console.log("updates", updates);
    const updated = passwordService.updateMultiple(updates);

    return respondify(200, "Passwords updated", updated);
  },

  "DELETE /passwords"(req) {
    const updates = req.body;
    const updated = passwordService.deleteMultiple(updates);

    return respondify(200, "Passwords deleted", updated);
  },
};

const respondify = (
  status: number,
  message: string,
  data?: any,
  meta?: any
): Promise<ResponseObject> => {
  return Promise.resolve({
    status,
    json() {
      return Promise.resolve({ message, data, meta });
    },
    text() {
      return Promise.resolve(JSON.stringify({ message, data, meta }));
    },
  });
};

const notFound = (..._args: any[]) => {
  return respondify(404, "Undefined route");
};

export const mockServer = {
  async fetch(url: string, options?: RequestInit) {
    let method = "GET";
    let req: RequestObject = {};
    if (options && options.method) {
      method = options.method;
    }
    if (options && options.headers) {
      req.headers = options.headers as Headers;
    }
    if (options && options.body) {
      req.body = JSON.parse(options.body as string);
    }
    const route = `${method} ${url}`;
    const middlewares = middleWares[route];
    if (middlewares) {
      let err: HttpError;
      const next = (error?: HttpError) => {
        if (error) {
          err = error;
        }
      };
      for (let i = 0; i < middlewares.length; i++) {
        const middleware = middlewares[i];
        middleware(req, next);
        // @ts-ignore
        if (err) {
          return respondify(err.status, err.message);
        }
      }
    }
    const handler = routes[route] || notFound;
    return handler(req);
  },
};
