export interface Cartao {
    id: string;
    numero: string;
    bandeira: string;
    tipo: 'CREDITO' | 'DEBITO';
    dataValidade: Date;
    titular: string;
    dataCriacao?: Date;
    dataAtualizacao?: Date;
  }
  
  export interface CreateCartaoDTO {
    numero: string;
    bandeira: string;
    tipo: 'CREDITO' | 'DEBITO';
    dataValidade: Date;
    titular: string;
  }
  
  export interface UpdateCartaoDTO extends Partial<CreateCartaoDTO> {}