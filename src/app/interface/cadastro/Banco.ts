export interface Banco {
    id: string;
    nome: string;
    codigoISPB: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface CreateBancoDTO {
    id: string;
    nome: string;
    codigoISPB: string;
  }
  
  export interface UpdateBancoDTO extends Partial<CreateBancoDTO> {}