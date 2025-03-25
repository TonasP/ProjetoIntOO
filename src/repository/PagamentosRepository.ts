import { Pool } from "pg";
import { Database } from "./DataBase";
import { Pagamentos } from "../entity/Pagamentos";
import { PagamentosDTO } from "../entity/PagamentosDTO";
import { InadimplentesDTO } from "../entity/InadimplentesDTO";

export class PagamentosRepository {
    private pool: Pool
    constructor() {
        this.pool = Database.iniciarConexao()
    }
    async listarPagamentos(): Promise<PagamentosDTO[]> {
        const query = `SELECT servicos.id as id, clientes.nome as cliente, clientes.id as id_cliente, pagamentos.valor_total as valor, servicos.tipo_servico as tipo_servico, pagamentos.forma_pagamento as forma_pagamento  FROM "GymControl".pagamentos
                        join "GymControl".servicos
                        on servicos.id = pagamentos.id_servico
                        join "GymControl".clientes
                        on clientes.id = servicos.id_cliente`
        const result = await this.pool.query(query)

        return result.rows.map(row => ({
            id: row.id,
            cliente: row.cliente,
            id_cliente: row.id_cliente,
            valor: row.valor,
            tipo_servico: row.tipo_servico,
            forma_pagamento: row.forma_pagamento,

        }));
    }

    public async buscarPorCpf(cpf): Promise<PagamentosDTO[]> {
        const query = `SELECT servicos.id as id, clientes.nome as cliente, clientes.id as id_cliente, pagamentos.valor_total as valor, servicos.tipo_servico as tipo_servico, pagamentos.forma_pagamento as forma_pagamento  FROM "GymControl".pagamentos
                        join "GymControl".servicos
                        on servicos.id = pagamentos.id_servico
                        join "GymControl".clientes
                        on clientes.id = servicos.id_cliente
                        where clientes.cpf = $1`
        const result = await this.pool.query(query[cpf])

        return result.rows.map(row => ({
            id: row.id,
            cliente: row.cliente,
            id_cliente: row.id_cliente,
            valor: row.valor,
            tipo_servico: row.tipo_servico,
            forma_pagamento: row.forma_pagamento,

        }));
    }
    public async listarRegistros(cpf): Promise<Pagamentos[]> {
        const query = `SELECT servicos.id as id, clientes.nome as cliente, clientes.id as id_cliente, pagamentos.valor_total as valor, pagamentos.forma_pagamento as forma_pagamento FROM "GymControl".pagamentos
                    join "GymControl".servicos
                    on servicos.id = pagamentos.id_servico
                    join "GymControl".clientes
                    on clientes.id = servicos.id_cliente
                    where clientes.cpf = $1`

        const result = await this.pool.query(query, [cpf])
        const listaPagamentos: Pagamentos[] = []

        for (const row of result.rows) {
            const pagamentos = new Pagamentos(row.id, row.id_servico, row.valor_total, row.forma_pagamento)
            listaPagamentos.push(pagamentos)
        }
        return listaPagamentos

    }
    public async verificarCpf(cpf): Promise<Pagamentos[]> {
        const query = `SELECT servicos.id as id, clientes.nome as cliente, clientes.id as id_cliente, pagamentos.valor_total as valor, pagamentos.forma_pagamento as forma_pagamento FROM "GymControl".pagamentos
                    join "GymControl".servicos
                    on servicos.id = pagamentos.id_servico
                    join "GymControl".clientes
                    on clientes.id = servicos.id_cliente
                    where clientes.cpf = $1`

        const result = await this.pool.query(query, [cpf])
        const listaPagamentos: Pagamentos[] = []

        for (const row of result.rows) {
            const pagamentos = new Pagamentos(row.id, row.id_servico, row.valor_total, row.forma_pagamento)
            listaPagamentos.push(pagamentos)
        }
        return listaPagamentos

    }


    public async inserirPagamento(id_servico: Number, valor_total: Number, forma_pagamento: String) {
        const query = `INSERT INTO "GymControl".pagamentos(
	 id_servico, valor_total, forma_pagamento)
	VALUES ( $1, $2, $3);`
        await this.pool.query(query, [id_servico, valor_total, forma_pagamento])
    }
    public async atualizarAgendamentoPorID(id: number, coluna: string, novoValor: string) {
        const query = `UPDATE "GymControl".pagamentos SET ${coluna} = $1 WHERE id = $2`;
        await this.pool.query(query, [novoValor, id]);
    }
    public async atualizarInformacoes(coluna, registro, id) {
        const query = `update "GymControl".pagamentos set ${coluna} =$1  where id = $2`
        const result = await this.pool.query(query, [registro, id])
    }
    public async deletarPagamentoPorID(id: number): Promise<void> {
        const query = `DELETE FROM "GymControl".servicos WHERE id = $1`;
        await this.pool.query(query, [id]);
    }
    public async deletarPagamento(cpf) {
        const query = `delete from "GymControl".pagamentos where cpf = $1`
        const result = await this.pool.query(query, [cpf])
    }

    public async visualizarInadimplentes(): Promise<InadimplentesDTO[]>{
        const query = 'SELECT servicos.id as id, clientes.nome as cliente, clientes.id as id_cliente, servicos.tipo_servico as tipo_servico FROM "GymControl".clientes JOIN "GymControl".servicos ON clientes.id = servicos.id_cliente LEFT JOIN "GymControl".pagamentos ON servicos.id = pagamentos.id_servico WHERE pagamentos.id_servico IS NULL;'
        const result = await this.pool.query(query)
        return result.rows.map(row => ({
            id: row.id,
            cliente: row.cliente,
            id_cliente: row.id_cliente,
            tipo_servico: row.tipo_servico,
           

        }));
    }

}