import { Planos } from "../entity/Planos";
import { PlanosRepository } from "../repository/PlanosRepository";

export class PlanosService {
    private repo: PlanosRepository

    constructor() {
        this.repo = new PlanosRepository()
    }
    async listarPlanos(): Promise<Planos[]> {
        return await this.repo.listarPlanos()
    }
    async verificarId(id): Promise<boolean> {
        let lista: Planos[] = []
        lista = await this.repo.buscarID(id)
        return lista.length > 0;
        //Caso o ID exista no banco de dados, o metodo retorna True, caso contrario, retorna False
    }
    async buscarID(id) {
        let lista: Planos[] = []
        lista = await this.repo.buscarID(id)

        if (lista.length == 0) {
            throw new Error("Plano não encontrado!");
        }
        else {
            return lista;
        }
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
    public async deletarPlano(id) {
        if (!await this.verificarId(id)) {
            console.log("O ID inserido não foi encontrado!")
        }
        await this.repo.deletarPagamento(id)
        console.log("Cliente deletado com sucesso!")
    }
}