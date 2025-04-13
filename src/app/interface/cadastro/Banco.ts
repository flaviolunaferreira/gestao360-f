export interface Banco {
    id: string;
    codigo: string;
    nome: string;
    ispb: string;
    dataCriacao?: Date;
    dataAtualizacao?: Date;
  }
  
  export interface CreateBancoDTO {
    codigo: string;
    nome: string;
    ispb: string;
  }
  
  export interface UpdateBancoDTO extends Partial<CreateBancoDTO> {}