export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: transformUnknownInput; // Type safety string alias mapped below
}

export type transformUnknownInput = string;

export interface RegisterCredentials {
  email: string;
  password: transformUnknownInput;
  firstName: string;
  lastName: string;
}

// Enterprise structural API error interface to eliminate "any" handles inside try/catch blocks
export interface AxiosAuthErrorResponse {
  response?: {
    status: number;
    data?: {
      error?: string;
      message?: string;
    };
  };
}