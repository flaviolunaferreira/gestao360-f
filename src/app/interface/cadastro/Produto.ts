export interface Produto {
    id: string;
    nome: string;
    codigo: string;
    preco: number;
    estoque: number;
    descricao?: string;
    dataCriacao?: Date;
    dataAtualizacao?: Date;
  }
  
  export interface CreateProdutoDTO {
    nome: string;
    codigo: string;
    preco: number;
    estoque: number;
    descricao?: string;
  }
  
  export interface UpdateProdutoDTO extends Partial<CreateProdutoDTO> {}