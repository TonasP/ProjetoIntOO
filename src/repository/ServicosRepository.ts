import { Servicos } from "../entity/Servicos";
import { Pool } from "pg";
import { Database } from "./DataBase";
import { ServicosDTO } from "../entity/ServicosDTO";

export class ServicosRepository {
    private pool: Pool;

    constructor() {
        this.pool = Database.iniciarConexao();
    }
    async listarTipoServico(id) {
        const query = `SELECT tipo_servico FROM "GymControl".servicos where id = $1`
        const result = await this.pool.query(query, [id])

        return result.rows[0]
    }

    async listarServicos(): Promise<ServicosDTO[]> {
        const query = `SELECT servicos.id, clientes.nome as cliente, funcionarios.nome as funcionario, servicos.tipo_servico, servicos.data_servico from "GymControl".servicos
                        join "GymControl".clientes
                        on clientes.id = servicos.id_cliente
                        join "GymControl".funcionarios
                        on funcionarios.id = servicos.id_funcionario`;
        const result = await this.pool.query(query);

        return result.rows.map(row => ({
            id: row.id,
            cliente: row.cliente,
            funcionario: row.funcionario,
            tipo_servico: row.tipo_servico,
            data_servico: row.data_servico,
        }));
    }

    public async listarServicosEspecificos(cpf): Promise<ServicosDTO[]> {
        const query = `SELECT servicos.id, clientes.nome as cliente, funcionarios.nome as funcionario, servicos.tipo_servico, servicos.data_servico from "GymControl".servicos
                        join "GymControl".clientes
                        on clientes.id = servicos.id_cliente
                        join "GymControl".funcionarios
                        on funcionarios.id = servicos.id_funcionario
                        where clientes.cpf = $1`;
        const result = await this.pool.query(query, [cpf]);

        return result.rows.map(row => ({
            id: row.id,
            cliente: row.cliente,
            funcionario: row.funcionario,
            tipo_servico: row.tipo_servico,
            data_servico: row.data_servico,
        }));
    }

    public async listarRegistros(cpf): Promise<Servicos[]> {
        const query = `SELECT servicos.id, clientes.nome as cliente, funcionarios.nome as funcionario, servicos.tipo_servico, servicos.data_servico from "GymControl".servicos
                        join "GymControl".clientes
                        on clientes.id = servicos.id_cliente
                        join "GymControl".funcionarios
                        on funcionarios.id = servicos.id_funcionario where clientes.cpf = $1`;

        const result = await this.pool.query(query, [cpf]);
        const listaAgendamentos: Servicos[] = [];

        for (const row of result.rows) {
            const agendamento = new Servicos(row.id, row.cliente, row.funcionario, row.data_servico, row.tipo_servico);
            listaAgendamentos.push(agendamento);
        }
        return listaAgendamentos;
    }
    public async listarServicosFuncionarios(id){
        const query = `SELECT servicos.id, clientes.nome as cliente, funcionarios.nome as funcionario, servicos.tipo_servico, servicos.data_servico from "GymControl".servicos
                        join "GymControl".clientes
                        on clientes.id = servicos.id_cliente
                        join "GymControl".funcionarios
                        on funcionarios.id = servicos.id_funcionario
                        where funcionarios.id = $1`;
        const result = await this.pool.query(query, [id]);

        return result.rows.map(row => ({
            id: row.id,
            cliente: row.cliente,
            funcionario: row.funcionario,
            tipo_servico: row.tipo_servico,
            data_servico: row.data_servico,
        }));
    }

    public async buscarID(id): Promise<ServicosDTO[]> {
        const query = `SELECT servicos.id, clientes.nome as cliente, funcionarios.nome as funcionario, servicos.tipo_servico, servicos.data_servico from "GymControl".servicos
                        join "GymControl".clientes
                        on clientes.id = servicos.id_cliente
                        join "GymControl".funcionarios
                        on funcionarios.id = servicos.id_funcionario where servicos.id = $1`;
        const result = await this.pool.query(query, [id]);

        return result.rows.map(row => ({
            id: row.id,
            cliente: row.cliente,
            funcionario: row.funcionario,
            tipo_servico: row.tipo_servico,
            data_servico: row.data_servico,
        }));
    }
    public async pegarPlanoCliente(id){
        const query = `select clientes.plano_id from "GymControl".servicos
                       join "GymControl".clientes on clientes.id = servicos.id_cliente where servicos.id = $1`
        const result = await this.pool.query(query,[id])
        return result.rows[0]
    }
    public async inserirServico(id_funcionario: number, id_cliente: number, tipo_servico: string, data_servico: Date) {
        const query = `INSERT INTO "GymControl".servicos(id_funcionario, id_cliente, tipo_servico, data_servico)
	VALUES ($1, $2, $3, $4);`;
        await this.pool.query(query, [id_funcionario, id_cliente, tipo_servico, data_servico]);
    }

    public async atualizarServicoPorID(id: number, coluna: string, novoValor: string) {
        const query = `UPDATE "GymControl".servicos SET ${coluna} = $1 WHERE id = $2`;
        await this.pool.query(query, [novoValor, id]);
    }

    public async atualizarInformacoes(coluna, registro, id) {
        const query = `update "GymControl".servicos set ${coluna} = $1 where id = $2`;
        await this.pool.query(query, [registro, id]);
    }

    public async deletarServicoPorID(id: number): Promise<void> {
        const query = `DELETE FROM "GymControl".servicos WHERE id = $1`;
        await this.pool.query(query, [id]);
    }
}
