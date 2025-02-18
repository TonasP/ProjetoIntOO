import { Funcionario } from "../entity/Funcionario";
import { FuncionarioRepository } from "../repository/FuncionarioRepository";

export class FuncionarioService {
    private repo: FuncionarioRepository

    constructor() {
        this.repo = new FuncionarioRepository()
    }

    async listarFuncionario(): Promise<Funcionario[]> {
        return await this.repo.listarFuncionarios()
    }

    async buscarPorID(id: number): Promise<Funcionario[]> {
        let lista: Funcionario[] = []
        lista = await this.repo.buscarPorID(id)

        if (lista.length == 0) {
            throw new Error("Funcionário não encontrado!");
        }
        else {
            return lista;
        }
    }
    async inserirFuncionario(nome: string, cpf: string, data_nascimento: Date, funcao: string, numero_celular: string, email:string){
        const regex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValido= regex.test(email)
        if (!emailValido){
            throw new Error("Email Invalido zé!!!!!!!!!!")
        }
        await this.repo.inserirFuncionario(nome, cpf, data_nascimento, funcao, numero_celular, email)
    }
 
}   