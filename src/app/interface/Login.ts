export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  tipo: string;
  empresaId: number;
  modulosLiberados: string[];
}