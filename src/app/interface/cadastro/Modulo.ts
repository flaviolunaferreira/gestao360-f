export interface Modulo {
  id: number;
  nome: string;
  percentualCusto: number;
}

export interface CreateModuloDTO {
  nome: string;
  percentualCusto: number;
}

export interface UpdateModuloDTO extends Partial<CreateModuloDTO> {}
