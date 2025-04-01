import { Pool } from "pg";
import { Database } from "./DataBase";
import { Cliente } from "../entity/Cliente";
import { ClienteDTO } from "../entity/ClienteDTO";

export class ClienteRepository {

    private pool: Pool;

    constructor() {
        this.pool = Database.iniciarConexao();
    }
    public async pegarIdPorCpf(cpf) {
        const query = `SELECT id FROM "GymControl".clientes where cpf = $1`
        const result = await this.pool.query(query, [cpf])

        return result.rows[0]
    }

    async listarClientes(): Promise<ClienteDTO[]> {

        const query = `select clientes.id, clientes.nome, clientes.cpf, clientes.data_nascimento, planos.nome as plano, clientes.numero_celular, clientes.email from "GymControl".clientes
                        join "GymControl".planos on clientes.plano_id = planos.id`
        const result = await this.pool.query(query);

        return result.rows.map(row => ({
           id: row.id,
           nome: row.nome,
           cpf : row.cpf,
           data_nascimento : row.data_nascimento,
           plano : row.plano,
           numero_celular: row.numero_celular,
           email : row.email


        }));
    
    }
    public async buscarPorCpf(cpf: number): Promise<Cliente[]> {
        const query = 'SELECT * FROM "GymControl".clientes where cpf = $1 ';
        const result = await this.pool.query(query, [cpf]);

        const listaClientes: Cliente[] = [];

        for (const row of result.rows) {
            const cliente = new Cliente(row.id, row.nome, row.email, row.cpf, row.data_nascimento, row.plano_id, row.numero_celular);
            listaClientes.push(cliente);
        }
        return listaClientes;
    }
    public async verificarCpf(cpf): Promise<Cliente[]> {
        const query = 'SELECT * FROM "GymControl".clientes where cpf = $1 ';
        const result = await this.pool.query(query, [cpf]);

        const listaClientes: Cliente[] = [];

        for (const row of result.rows) {
            const cliente = new Cliente(row.id, row.nome, row.cpf, row.data_nascimento, row.plano_id, row.numero_celular, row.email);
            listaClientes.push(cliente);
        }
        return listaClientes;
    }
    public async inserirCliente(nome: string, cpf: string, data_nascimento: Date, plano_id: number, numero_celular: string, email: string) {
        const query = `INSERT INTO "GymControl".clientes(
             nome, cpf, data_nascimento, plano_id, numero_celular, email)
                VALUES ($1, $2, $3, $4, $5, $6);`
        await this.pool.query(query, [nome, cpf, data_nascimento, plano_id, numero_celular, email])
    }

    public async atualizarInformacoes(coluna, registro, cpf) {
        const query = `update "GymControl".clientes set ${coluna} =$1  where cpf = $2`
        const result = await this.pool.query(query, [registro, cpf])

    }
    public async deletarCliente(cpf) {
        const query = `delete  from "GymControl".clientes where cpf = $1`
        await this.pool.query(query, [cpf])

    }

}