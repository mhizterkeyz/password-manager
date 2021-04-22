interface Login {
  username: string;
  password: string;
}

interface ValidationResponse<T> {
  errors: T;
  hasErrors: boolean;
}

interface ILogin {
  username: string;
  password: string;
}

interface ISignup extends ILogin {
  email: string;
}

interface IPassword {
  domain: string;
  username?: string;
}

export const validateLogin = (login: Login): ValidationResponse<ILogin> => {
  const invalidUsername = !login.username;
  const invalidPassword = !login.password;
  const hasErrors = invalidPassword || invalidUsername;

  return {
    errors: {
      username: invalidUsername ? "Provide your username or email" : "",
      password: invalidPassword ? "Proivde your password" : "",
    },
    hasErrors,
  };
};

export const validateSignup = (
  signup: ISignup
): ValidationResponse<ISignup> => {
  const invalidUsername = !signup.username;
  const invalidPassword = !signup.password;
  const invalidEmail = !signup.email;
  const hasErrors = invalidPassword || invalidUsername || invalidEmail;

  return {
    errors: {
      username: invalidUsername ? "Provide a valid username" : "",
      email: invalidEmail ? "Provide a valid email" : "",
      password: invalidPassword ? "Proivde your password" : "",
    },
    hasErrors,
  };
};

export const validatePassword = (
  password: IPassword
): ValidationResponse<IPassword> => {
  const invalidDomain = !password.domain;
  const hasErrors = invalidDomain;

  return {
    errors: {
      domain: invalidDomain ? "Provide a valid domain" : "",
      username: "",
    },
    hasErrors,
  };
};
