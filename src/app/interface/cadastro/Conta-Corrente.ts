export interface ContaCorrenteRequestDTO {
    numero: string;
    dataAbertura: string;
    bancoId: number;
    tipoConta: string;
    agencia: string;
    titular: string;
    cpfCnpjTitular: string;
    saldo: number;
    limite: number;
}

export interface ContaCorrenteResponseDTO {
    numero: string;
    dataAbertura: string;
    dataUltimoLancamento?: string;
    bancoNome: string;
    tipoConta: string;
    agencia: string;
    titular: string;
    cpfCnpjTitular: string;
    saldo: number;
    limite: number;
    createdBy: string;
    createdAt: string;
}

  export interface UpdateContaCorrenteDTO extends Partial<ContaCorrenteRequestDTO> {}