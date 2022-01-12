export type loginDetails = {
  /** The email for the user */
  email: string;
  /** The password for the user */
  password: string;
  /** Whether or not to return an ID and refresh token. Should always be true. */
  returnSecureToken: true;
};

type AuthResponse = {
  /** A Firebase Auth ID token for the newly created user. */
  idToken: string;
  /** The email for the newly created user. */
  email: string;
  /** A Firebase Auth refresh token for the newly created user. */
  refreshToken: string;
  /** The number of seconds in which the ID token expires. */
  expiresIn: string;
  /** The uid of the newly created user. */
  localId: string;
};

export type signUpResponse = AuthResponse;

export type signInResponse = AuthResponse & {
  /** Whether the email is for an existing account. */
  registered: boolean;
};

export type authErrorResponse = {
  data: {
    error: { message: string };
  };
};
