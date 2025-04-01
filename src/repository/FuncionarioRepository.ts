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
            const funcionario = new Funcionario(row.id, row.nome, row.cpf, row.data_nascimento, row.funcao, row.numero_celular, row.email, row.situacao_empregado)
            listaFuncionarios.push(funcionario)
        }
        return listaFuncionarios

    }

    async buscarPorCpf(cpf: string): Promise<Funcionario[]> {
        const query = 'SELECT * FROM "GymControl".funcionarios where cpf = $1'
        const result = await this.pool.query(query, [cpf])

        const listaFuncionarios: Funcionario[] = []

        for (const row of result.rows) {
            const funcionario = new Funcionario(row.id, row.nome, row.cpf, row.data_nascimento, row.funcao, row.numero_celular, row.email, row.situacao_empregado)
            listaFuncionarios.push(funcionario)
        }
        return listaFuncionarios
    }
    async buscarPorId(id: number): Promise<Funcionario[]> {
        const query = 'SELECT * FROM "GymControl".funcionarios where id = $1'
        const result = await this.pool.query(query, [id])

        const listaFuncionarios: Funcionario[] = []

        for (const row of result.rows) {
            const funcionario = new Funcionario(row.id, row.nome, row.cpf, row.data_nascimento, row.funcao, row.numero_celular, row.email, row.situacao_empregado)
            listaFuncionarios.push(funcionario)
        }
        return listaFuncionarios
    }
    public async pegarSituacaoEmpregado(id: number): Promise<Funcionario | null> {
        const query = `SELECT * FROM "GymControl".funcionarios WHERE id = $1`;
        const result = await this.pool.query(query, [id]);
    
        const row = result.rows[0];
        return new Funcionario(row.id, row.nome, row.cpf, row.data_nascimento, row.funcao, row.numero_celular, row.email, row.situacao_empregado);
    }
    
    public async verificarCpf(cpf): Promise<Funcionario[]> {
        const query = 'SELECT * FROM "GymControl".funcionarios where cpf = $1 ';
        const result = await this.pool.query(query, [cpf]);

        const listaClientes: Funcionario[] = [];

        for (const row of result.rows) {
            const funcionario = new Funcionario(row.id, row.nome, row.cpf, row.data_nascimento, row.funcao, row.numero_celular, row.email, row.situacao_empregado)            
            listaClientes.push(funcionario);
        }
        return listaClientes;
    }
    public async alterarSituacaoEmpregado(situacao: string ,id: number){
        const query = `update  "GymControl".funcionarios
        set situacao_empregado  = $1 where id = $2`
        const result = await this.pool.query(query,[situacao,id])
    }

    public async atualizarInformacoes(coluna, registro, cpf) {
        const query = `update "GymControl".funcionarios set ${coluna} =$1  where cpf = $2`
        const result = await this.pool.query(query, [registro, cpf])
    }
    async inserirFuncionario(nome: string, cpf: string, data_nascimento: Date, funcao: string, numero_celular: string, email: string) {
        const query = `INSERT INTO "GymControl".funcionarios
        (nome, cpf, data_nascimento, funcao, numero_celular, email, situacao_empregado)
	    VALUES ($1, $2, $3, $4, $5, $6, 'Ativo')`
        await this.pool.query(query, [nome, cpf, data_nascimento, funcao, numero_celular, email])
    }
    public async deletarFuncionario(id) {
        const query = `delete  from "GymControl".funcionarios where id= $1`
        const result = await this.pool.query(query, [id])
    }
}