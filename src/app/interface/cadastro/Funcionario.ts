export interface Funcionario {
    id: string;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    cargo: string;
    dataAdmissao: Date;
    dataCriacao?: Date;
    dataAtualizacao?: Date;
  }
  
  export interface CreateFuncionarioDTO {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    cargo: string;
    dataAdmissao: Date;
  }
  
  export interface UpdateFuncionarioDTO extends Partial<CreateFuncionarioDTO> {}