import { Servicos } from "../entity/Servicos";
import { Pool } from "pg";
import { Database } from "./DataBase";
import { ServicosDTO } from "../entity/ServicosDTO";

export class ServicosRepository {
    private pool: Pool
    constructor() {
        this.pool = Database.iniciarConexao()
    }
    async listarServicos(): Promise<ServicosDTO[]> {
        const query = `SELECT servicos.id, clientes.nome as cliente, funcionarios.nome as funcionario, servicos.tipo_servico, servicos.data_servico from "GymControl".servicos 
                        join "GymControl".clientes 
                        on clientes.id = servicos.id_cliente
                        join "GymControl".funcionarios
                        on funcionarios.id = servicos.id_funcionario`
        const result = await this.pool.query(query)

        return result.rows.map(row => ({
            id: row.id,
            cliente : row.cliente,
            funcionario: row.funcionario,
            tipo_servico: row.tipo_servico,
            data_servico: row.data_servico

        }));
    }
    public async listarRegistros(cpf): Promise<Servicos[]> {
            const query = `SELECT servicos.id, clientes.nome as cliente, funcionarios.nome as funcionario, servicos.tipo_servico, servicos.data_servico from "GymControl".servicos 
                            join "GymControl".clientes 
                            on clientes.id = servicos.id_cliente
                            join "GymControl".funcionarios
                            on funcionarios.id = servicos.id_funcionario where clientes.cpf = $1`
    
            const result = await this.pool.query(query, [cpf])
            const listaAgendamentos: Servicos[] = []
    
            for (const row of result.rows) {
                const agendamento = new Servicos(row.id, row.cliente, row.funcionario, row.data_marcada, row.tipo)
                listaAgendamentos.push(agendamento)
            }
            return listaAgendamentos
    
        }

    public async buscarID(id): Promise<ServicosDTO[]> {
        const query = `SELECT servicos.id, clientes.nome as cliente, funcionarios.nome as funcionario, servicos.tipo_servico, servicos.data_servico from "GymControl".servicos 
                        join "GymControl".clientes 
                        on clientes.id = servicos.id_cliente
                        join "GymControl".funcionarios
                        on funcionarios.id = servicos.id_funcionario where servicos.id = $1`
        const result = await this.pool.query(query, [id])

       
        return result.rows.map(row => ({
            id: row.id,
            cliente : row.cliente,
            funcionario: row.funcionario,
            tipo_servico: row.tipo_servico,
            data_servico: row.data_servico

        }));
    }
    public async verificarCpf(cpf): Promise<Servicos[]> {
            const query = `SELECT servicos.id, clientes.nome as cliente, funcionarios.nome as funcionario, servicos.tipo_servico, servicos.data_servico from "GymControl".servicos 
                        join "GymControl".clientes 
                        on clientes.id = servicos.id_cliente
                        join "GymControl".funcionarios
                        on funcionarios.id = servicos.id_funcionario where cpf = $1`
        const result = await this.pool.query(query, [cpf])

        const listaServicos: Servicos[] = []

        for (const row of result.rows) {
            const servico = new Servicos(row.id, row.funcionario, row.cliente, row.tipo_servico, row.data_servico)
            listaServicos.push(servico)
        }
        return listaServicos
        }
    public async inserirServico(id_funcionario: Number, id_cliente: Number, tipo_servico: string, data_servico: Date) {
        const query = `INSERT INTO "GymControl".servicos( id_funcionario, id_cliente, tipo_servico, data_servico)
	VALUES ( $1, $2, $3, $4);`
        await this.pool.query(query, [id_funcionario, id_cliente, tipo_servico, data_servico])
    }
    public async atualizarServicoPorID(id: number, coluna: string, novoValor: string) {
        const query = `UPDATE "GymControl".servicos SET ${coluna} = $1 WHERE id = $2`;
        await this.pool.query(query, [novoValor, id]);
    }
    public async atualizarInformacoes(coluna, registro, id) {
        const query = `update "GymControl".servicos set ${coluna} =$1  where id = $2`
        const result = await this.pool.query(query, [registro, id])
    }
    public async deletarServicoPorID(id: number): Promise<void> {
        const query = `DELETE FROM "GymControl".servicos WHERE id = $1`;
        await this.pool.query(query, [id]);
    }

    public async deletarServico(id){
        const query = `delete from "GymControl".servicos where id = $1`
        const result = await this.pool.query(query, [id])
    }

}