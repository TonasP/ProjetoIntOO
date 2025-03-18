import { Pool } from "pg";
import { Database } from "./DataBase";
import { Agendamentos } from "../entity/Agendamentos";

export class AgendamentosRepository {
    private pool: Pool
    constructor() {
        this.pool = Database.iniciarConexao()
    }
    async listarAgendamentos(): Promise<Agendamentos[]> {
        const query = 'select agendamentos.id, clientes.nome as cliente, funcionarios.nome as funcionario, agendamentos.data_marcada, agendamentos.tipo from "GymControl".agendamentos join "GymControl".clientes  on agendamentos.cliente_id = clientes.id join  "GymControl".funcionarios on funcionarios.id = agendamentos.id_funcionario'
        const result = await this.pool.query(query)

        const listaAgendamentos: Agendamentos[] = []

        for (const row of result.rows) {
            const agendamento = new Agendamentos(row.id, row.cliente, row.funcionario, row.data_marcada, row.tipo)
            listaAgendamentos.push(agendamento)
        }
        return listaAgendamentos
    }
    public async verificarCpf(cpf): Promise<Agendamentos[]>{
        const query = `SELECT agendamentos.id, clientes.nome FROM "GymControl".agendamentos
                       join "GymControl".clientes
                       on agendamentos.cliente_id = clientes.id
                       where clientes.cpf = $1`
        const result = await this.pool.query(query,[cpf])
        const listaAgendamentos: Agendamentos[] = []

        for (const row of result.rows) {
            const agendamento = new Agendamentos(row.id, row.id_cliente, row.id_funcionario, row.data_marcada, row.tipo)
            listaAgendamentos.push(agendamento)
        }
        return listaAgendamentos

    }
    public async buscarPorCpf(cpf): Promise<Agendamentos[]> {
        const query = 'SELECT * FROM "GymControl".Agendamentos where cpf = $1'
        const result = await this.pool.query(query, [cpf])

        const listaAgendamentos: Agendamentos[] = []

        for (const row of result.rows) {
            const agendamento = new Agendamentos(row.id, row.id_cliente, row.id_funcionario, row.data_marcada, row.tipo)
            listaAgendamentos.push(agendamento)
        }
        return listaAgendamentos
    }
    public async inserirAgendamento(id_cliente: Number, id_funcionario: Number, data_marcada: Date, tipo: string) {
        const query = `INSERT INTO "GymControl".Agendamentos( cliente_id, id_funcionario, data_marcada, tipo)
        VALUES ( $1, $2, $3, $4);`
        await this.pool.query(query, [ id_cliente, id_funcionario, data_marcada, tipo])
    }
    public async atualizarInformacoes(coluna, registro, cpf){
        const query = `update "GymControl".agendamentos set ${coluna} =$1  where cpf = $2`
        const result = await this.pool.query(query, [registro, cpf])
    }
    public async deletarAgendamento(cpf: string){
        const query = `delete from "GymControl".agendamentos where cliente_id in (select id from "GymControl".clientes where cpf = $1 )
`
         await this.pool.query(query, [cpf])                    
    }
}