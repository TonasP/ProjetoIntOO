import { Pool } from "pg";
import { Database } from "./DataBase";
import { Cliente } from "../entity/Cliente";

export class ClienteRepository {

    private pool: Pool;

    constructor() {
        this.pool = Database.iniciarConexao();
    }

    async listarClientes(): Promise<Cliente[]> {

        const query = 'SELECT * FROM "GymControl".clientes ORDER BY id ASC '
        const result = await this.pool.query(query);

        const listaClientes: Cliente[] = [];

        for (const row of result.rows) {
            const cliente = new Cliente(row.id, row.nome, row.cpf, row.data_nascimento, row.plano_id, row.numero_celular, row.email)
            listaClientes.push(cliente);
        }
        return listaClientes;
    }
    public async buscarID(id: number): Promise<Cliente[]> {
        const query = 'SELECT * FROM "GymControl".clientes where id = $1 ';
        const result = await this.pool.query(query, [id]);

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

}