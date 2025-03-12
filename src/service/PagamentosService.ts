import { Pool } from "pg";
import { Pagamentos } from "../entity/Pagamentos";
import { PagamentosRepository } from "../repository/PagamentosRepository";
import { Database } from "../repository/DataBase";

export class PagamentosService {
    private repo: PagamentosRepository
    constructor() {
        this.repo = new PagamentosRepository()
    }

    async listarPagamentos(): Promise<Pagamentos[]> {
        return await this.repo.listarPagamentos()
    }
    async verificarId(id): Promise<boolean> {
        let lista: Pagamentos[] = []
        lista = await this.repo.buscarID(id)
        return lista.length > 0;
        //Caso o ID exista no banco de dados, o metodo retorna True, caso contrario, retorna False
    }
    async buscarID(id): Promise<Pagamentos[]> {
        let lista: Pagamentos[] = []
        lista = await this.repo.buscarID(id)
        if (lista.length == 0) {
            throw new Error("Pagamento não encontrado!")
        }
        else {
            return lista
        }
    }
    async inserirPagamento(id_servico: Number, valor_total: Number, forma_pagamento: String) {
        await this.repo.inserirPagamento(id_servico, valor_total, forma_pagamento)
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
    public async deletarPagamento(id) {
        if (!await this.verificarId(id)) {
            console.log("O ID inserido não foi encontrado!")
        }
        await this.repo.deletarPagamento(id)
        console.log("Cliente deletado com sucesso!")
    }


} 
