export interface Loja {
    id: string;
    nome: string;
    cnpj: string;
    email: string;
    telefone: string;
    endereco: string;
    dataCriacao?: Date;
    dataAtualizacao?: Date;
  }
  
  export interface CreateLojaDTO {
    nome: string;
    cnpj: string;
    email: string;
    telefone: string;
    endereco: string;
  }
  
  export interface UpdateLojaDTO extends Partial<CreateLojaDTO> {}