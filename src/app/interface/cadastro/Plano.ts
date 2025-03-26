import { Modulo } from "./Modulo";

export interface Plano {
  id: number;
  nome: string;
  precoBasePorLoja: number;
  gratuito: boolean;
  tempoDuracaoEmMeses?: number | null;
  modulos: Modulo[];
}

export interface CreatePlanoDTO {
  nome: string;
  precoBasePorLoja: number;
  gratuito: boolean;
  tempoDuracaoEmMeses?: number | null;
  modulosIds: number[];
}

export interface UpdatePlanoDTO extends Partial<CreatePlanoDTO> {}
