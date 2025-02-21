import { Servicos } from "../entity/Servicos";
import { Pool } from "pg";
import { Database } from "./DataBase";

export class ServicosRepository {
    private pool: Pool
    constructor() {
        this.pool = Database.iniciarConexao()
    }
    async listarServicos(): Promise<Servicos[]> {
        const query = 'SELECT * FROM "GymControl".servicos'
        const result = await this.pool.query(query)

        const listaServicos: Servicos[] = []

        for (const row of result.rows) {
            const servico = new Servicos(row.id, row.id_funcionario, row.id_cliente, row.tipo_servico, row.data_servico)
            listaServicos.push(servico)
        }
        return listaServicos
    }
    public async buscarID(id): Promise<Servicos[]> {
        const query = 'SELECT * FROM "GymControl".servicos where id = $1'
        const result = await this.pool.query(query, [id])

        const listaServicos: Servicos[] = []

        for (const row of result.rows) {
            const servico = new Servicos(row.id, row.id_funcionario, row.id_cliente, row.tipo_servico, row.data_servico)
            listaServicos.push(servico)
        }
        return listaServicos
    }
    public async inserirServico(id_funcionario: Number, id_cliente: Number, tipo_servico: string, data_servico: Date) {
        const query = `INSERT INTO "GymControl".servicos( id_funcionario, id_cliente, tipo_servico, data_servico)
	VALUES ( $1, $2, $3, $4);`
        await this.pool.query(query, [id_funcionario, id_cliente, tipo_servico, data_servico])
    }

}