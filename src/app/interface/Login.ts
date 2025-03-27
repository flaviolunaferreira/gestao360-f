interface LoginRequest {
    email: string;
    password: string;
  }
  
  interface LoginResponse {
    token: string;
    email: string;
    tipo: string;
    empresaId: number | null;
    modulosLiberados: string[];
  }