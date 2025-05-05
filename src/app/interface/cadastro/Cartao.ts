export interface Cartao {
  numeroCartao: string;
  dataVencimento: string;
  limite: number;
  saldo: number;
  diaVencimento: number;
  tipoCartao: 'CREDITO' | 'DEBITO' | 'CRE_DEB';
  contaCorrenteNumero: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCartaoDTO {
  numeroCartao: string;
  dataVencimento: string;
  limite: number;
  saldo: number;
  diaVencimento: number;
  tipoCartao: 'CREDITO' | 'DEBITO' | 'CRE_DEB';
  contaCorrenteNumero: string;
}

export interface UpdateCartaoDTO {
  numeroCartao: string;
  dataVencimento: string;
  limite: number;
  saldo: number;
  diaVencimento: number;
  tipoCartao: 'CREDITO' | 'DEBITO' | 'CRE_DEB';
  contaCorrenteNumero: string;
}