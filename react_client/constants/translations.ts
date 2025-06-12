type Translations = {
  login: {
    emailPlaceholder: string;
    passwordPlaceholder: string;
    loginButton: string;
    registerText: string;
    registerLink: string;
    errorMessages: {
      emptyFields: string;
    };
  };
};

export const translations: Record<"NL" | "EN", Translations> = {
  NL: {
    login: {
      emailPlaceholder: "voorbeeld@hr.nl",
      passwordPlaceholder: "********",
      loginButton: "Inloggen",
      registerText: "Nog geen account? ",
      passwordLabel: "WACHTWOORD",
      registerLink: "Registreren",
      errorMessages: {
        emptyFields: "Vul beide velden in!",
      },
    },
  },
  EN: {
    login: {
      emailPlaceholder: "example@hr.nl",
      passwordPlaceholder: "********",
      loginButton: "Login",
      registerText: "No account yet? ",
      passwordLabel: "PASSWORD",
      registerLink: "Register",
      errorMessages: {
        emptyFields: "Please fill in both fields!",
      },
    },
  },
};
