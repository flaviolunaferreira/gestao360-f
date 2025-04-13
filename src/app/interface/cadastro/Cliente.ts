export interface Cliente {
    id: string;
    nome: string;
    cpfCnpj: string;
    email: string;
    telefone: string;
    endereco: string;
    dataCriacao?: Date;
    dataAtualizacao?: Date;
  }
  
  export interface CreateClienteDTO {
    nome: string;
    cpfCnpj: string;
    email: string;
    telefone: string;
    endereco: string;
  }
  
  export interface UpdateClienteDTO extends Partial<CreateClienteDTO> {}