import { Pool } from "pg";
import { Database } from "./DataBase";
import { Agendamentos } from "../entity/Agendamentos";

export class AgendamentosRepository {
    private pool: Pool
    constructor() {
        this.pool = Database.iniciarConexao()
    }
    async listarAgendamentos(): Promise<Agendamentos[]> {
        const query = 'SELECT * FROM "GymControl".Agendamentos'
        const result = await this.pool.query(query)

        const listaAgendamentos: Agendamentos[] = []

        for (const row of result.rows) {
            const agendamento = new Agendamentos(row.id, row.id_cliente, row.id_funcionario, row.data_marcada, row.tipo)
            listaAgendamentos.push(agendamento)
        }
        return listaAgendamentos
    }
    public async buscarID(id): Promise<Agendamentos[]> {
        const query = 'SELECT * FROM "GymControl".Agendamentos where id = $1'
        const result = await this.pool.query(query, [id])

        const listaAgendamentos: Agendamentos[] = []

        for (const row of result.rows) {
            const agendamento = new Agendamentos(row.id, row.id_cliente, row.id_funcionario, row.data_marcada, row.tipo)
            listaAgendamentos.push(agendamento)
        }
        return listaAgendamentos
    }
    public async inserirAgendamento(id_cliente: Number, id_funcionario: Number, data_marcada: Date, tipo: string) {
        const query = `INSERT INTO "GymControl".Agendamentos( id_cliente, id_cliente, data_marcada, tipo)
        VALUES ( $1, $2, $3, $4);`
        await this.pool.query(query, [ id_cliente, id_funcionario, data_marcada, tipo])
    }

}