import { Pool } from "pg";
import { Pagamentos } from "../entity/Pagamentos";
import { PagamentosRepository } from "../repository/PagamentosRepository";
import { Database } from "../repository/DataBase";
import { PagamentosDTO } from "../entity/PagamentosDTO";
import { InadimplentesDTO } from "../entity/InadimplentesDTO";

export class PagamentosService {
    
    private repo: PagamentosRepository
    constructor() {
        this.repo = new PagamentosRepository()
    }

    async listarPagamentos(): Promise<PagamentosDTO[]> {
        return await this.repo.listarPagamentos()
    }
    async verificarId(id): Promise<boolean> {
        let lista = await this.repo.buscarPorCpf(id)
        return lista.length > 0;
        //Caso o ID exista no banco de dados, o metodo retorna True, caso contrario, retorna False
    }
    async buscarPorCpf(id): Promise<PagamentosDTO[]> {
        let lista = await this.repo.buscarPorCpf(id)
        if (lista.length == 0) {
            console.log("Pagamento não encontrado")
            return []
        }
        else {
            return lista
        }
    }
    async verificarCpf(cpf): Promise<boolean> {
                let lista: Pagamentos[] = []
                lista = await this.repo.verificarCpf(cpf)
                return lista.length > 0;
                //Caso o CPF já exista no banco de dados, o metodo retorna True, caso contrario, retorna False
            }
        public async listarRegistros(cpf): Promise<Pagamentos[]> {
                    return await this.repo.listarRegistros(cpf)
                }    

  
    async inserirPagamento(id_servico: Number, valor_total: Number, forma_pagamento: String) {
        await this.repo.inserirPagamento(id_servico, valor_total, forma_pagamento)
    }
    public async atualizarAgendamentoPorID(id: number, coluna: string, novoValor: string) {
        const colunasPermitidas = ['forma_pagamento', 'valor_total'];
        
        if (!colunasPermitidas.includes(coluna)) {
            console.log("Coluna inválida! Atualização cancelada."); 
            return;
        }
    
        await this.repo.atualizarAgendamentoPorID(id, coluna, novoValor);
    }
    async atualizarInformacoes(coluna, registro, id) {
        const colunasPermitidas = ['valor_total', 'forma_pagamento']
        if (!colunasPermitidas.includes(coluna)) {
            console.log("Coluna não permitida!")
            return
        }
        if (!await this.verificarId(id)) {
            console.log("Cpf não encontrado!")
            return
        }
        if (!registro) {
            console.log("Registros nulos não são permitidos")
            return
        }
        await this.repo.atualizarInformacoes(coluna, registro, id)
        console.log("Atualização realiza com sucesso!")
    }
    public async deletarPagamentoPorID(id: number, cpf: string) {
        const pagamentos = await this.listarRegistros(cpf);


        if (pagamentos.length === 0) {
            console.log("Nenhum Pagamento encontrado para este CPF.");
            return;
        }


        const idsPermitidos = await Promise.all(pagamentos.map(async a => await a.pegarId()));


        if (!idsPermitidos.includes(id)) {
            console.log("O ID inserido não é compatível com os exibidos!");
            return;
        }
        await this.repo.deletarPagamentoPorID(id);

    }

    public async deletarAgendamento(cpf: string, id: number): Promise<void> {
        if (!await this.verificarCpf(cpf)) {
            console.log("CPF inexistente!");
            return;
        }

        let pagamento = await this.listarRegistros(cpf);

        if (pagamento.length === 0) {
            console.log("Nenhum Pagamento encontrado para este CPF.");
            return;
        }


        const  pagamentos = pagamento.find(async a => await a.pegarId() === id);

        if (!pagamentos) {
            console.log("ID inválido! Operação cancelada.");
            return;
        }
        else {
            await this.repo.deletarPagamentoPorID(id);
            console.log(`Pagamento ID ${id} deletado com sucesso!`)
        }
    }

    public async visualizarInadimplentes():Promise<InadimplentesDTO[]>{
        return await this.repo.visualizarInadimplentes()

    }



} 
