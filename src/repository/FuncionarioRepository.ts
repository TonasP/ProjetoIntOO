import { Funcionario } from "../entity/Funcionario";
import { Database } from "./DataBase";
import { Pool } from "pg";
export class FuncionarioRepository {
    private pool: Pool
    constructor() {
        this.pool = Database.iniciarConexao();
    }
    async listarFuncionarios(): Promise<Funcionario[]> {
        const query = 'SELECT * FROM "GymControl".funcionarios '
        const result = await this.pool.query(query)

        const listaFuncionarios: Funcionario[] = []

        for (const row of result.rows) {
            const funcionario = new Funcionario(row.id, row.nome, row.cpf, row.data_nascimento, row.funcao, row.numero_celular, row.email)
            listaFuncionarios.push(funcionario)
        }
        return listaFuncionarios

    }
    async buscarPorCpf(cpf: string): Promise<Funcionario[]> {
        const query = 'SELECT * FROM "GymControl".funcionarios where cpf = $1'
        const result = await this.pool.query(query, [cpf])

        const listaFuncionarios: Funcionario[] = []

        for (const row of result.rows) {
            const funcionario = new Funcionario(row.id, row.nome, row.cpf, row.data_nascimento, row.funcao, row.numero_celular, row.email)
            listaFuncionarios.push(funcionario)
        }
        return listaFuncionarios
    }
    public async verificarCpf(cpf): Promise<Funcionario[]> {
        const query = 'SELECT * FROM "GymControl".funcionarios where cpf = $1 ';
        const result = await this.pool.query(query, [cpf]);

        const listaClientes: Funcionario[] = [];

        for (const row of result.rows) {
            const funcionario = new Funcionario(row.id, row.nome, row.cpf, row.data_nascimento, row.funcao, row.numero_celular, row.email);
            listaClientes.push(funcionario);
        }
        return listaClientes;
    }

    public async atualizarInformacoes(coluna, registro, cpf) {
        const query = `update "GymControl".funcionarios set ${coluna} =$1  where cpf = $2`
        const result = await this.pool.query(query, [registro, cpf])
    }
    async inserirFuncionario(nome: string, cpf: string, data_nascimento: Date, funcao: string, numero_celular: string, email: string) {
        const query = `INSERT INTO "GymControl".funcionarios
        (nome, cpf, data_nascimento, funcao, numero_celular, email)
	    VALUES ($1, $2, $3, $4, $5, $6)`
        await this.pool.query(query, [nome, cpf, data_nascimento, funcao, numero_celular, email])
    }
    public async deletarFuncionario(cpf) {
        const query = `delete  from "GymControl".funcionario where cpf = $1`
        const result = await this.pool.query(query, [cpf])
    }
}