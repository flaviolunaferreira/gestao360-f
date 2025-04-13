export interface Fornecedor {
    id: string;
    razaoSocial: string;
    cnpj: string;
    email: string;
    telefone: string;
    endereco: string;
    dataCriacao?: Date;
    dataAtualizacao?: Date;
  }
  
  export interface CreateFornecedorDTO {
    razaoSocial: string;
    cnpj: string;
    email: string;
    telefone: string;
    endereco: string;
  }
  
  export interface UpdateFornecedorDTO extends Partial<CreateFornecedorDTO> {}