import { Pool } from "pg";
import { Database } from "./DataBase";
import { Pagamentos } from "../entity/Pagamentos";

export class PagamentosRepository {
    private pool: Pool
    constructor() {
        this.pool = Database.iniciarConexao()
    }
    async listarPagamentos(): Promise<Pagamentos[]> {
        const query = 'SELECT * FROM "GymControl".pagamentos'
        const result = await this.pool.query(query)

        const listaPagamentos: Pagamentos[] = []

        for (const row of result.rows) {
            const pagamento = new Pagamentos(row.id, row.id_servico, row.valor_total, row.forma_pagamento)
            listaPagamentos.push(pagamento)
        }
        return listaPagamentos
    }
    
    public async buscarID(id): Promise<Pagamentos[]> {
        const query = 'SELECT * FROM "GymControl".pagamentos where id = $1'
        const result = await this.pool.query(query, [id])

        const listaServicos: Pagamentos[] = []

        for (const row of result.rows) {
            const servico = new Pagamentos(row.id, row.id_servico, row.valor_total, row.forma_pagamento)
            listaServicos.push(servico)
        }
        return listaServicos
    }
    public async inserirPagamento(id_servico: Number, valor_total: Number, forma_pagamento: String) {
        const query = `INSERT INTO "GymControl".pagamentos(
	 id_servico, valor_total, forma_pagamento)
	VALUES ( $1, $2, $3);`
        await this.pool.query(query, [id_servico, valor_total, forma_pagamento])
    }
    public async atualizarInformacoes(coluna, registro, id) {
        const query = `update "GymControl".pagamentos set ${coluna} =$1  where id = $2`
        const result = await this.pool.query(query, [registro, id])
    }
    public async deletarPagamento(id){
        const query = `delete from "GymControl".pagamentos where id = $1`
        const result = await this.pool.query(query, [id])
    }
    
}