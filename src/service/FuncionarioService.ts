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
    async verificarCpf(cpf): Promise<boolean> {
        let lista: Funcionario[] = []
        lista = await this.repo.verificarCpf(cpf)
        return lista.length > 0;
        //Caso o CPF já exista no banco de dados, o metodo retorna True, caso contrario, retorna False
    }

    async buscarPorCpf(cpf: string): Promise<Funcionario[]> {
        let lista: Funcionario[] = []
        lista = await this.repo.buscarPorCpf(cpf)

        if (lista.length == 0) {
            throw new Error("Funcionário não encontrado!");
        }
        else {
            return lista;
        }
    }
    async inserirFuncionario(nome: string, cpf: string, data_nascimento: Date, funcao: string, numero_celular: string, email: string) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValido = regex.test(email)
        if (!emailValido) {
            throw new Error("Email Invalido zé!!!!!!!!!!")
        }
        if (await this.verificarCpf(cpf)) {
            console.log("O CPF inserido já existe no banco de dados!")
            return
        }
        if (!funcao) {
            console.log("Função Inexistente")
            return
        }
        await this.repo.inserirFuncionario(nome, cpf, data_nascimento, funcao, numero_celular, email)
        console.log("Funcionário inserido com sucesso!")
    }
    async atualizarInformacoes(coluna, registro, cpf) {
        const colunasPermitidas = ['nome', 'email', 'numero_celular', 'funcao', 'cpf']
        console.log(`Estas são as informações permitidas: ${colunasPermitidas}`)
        if (!colunasPermitidas.includes(coluna)) {
            console.log("Coluna não permitida!")
            return
        }
        if (!await this.verificarCpf(cpf)) {
            console.log("Cpf não encontrado!")
            return
        }
        if (!registro) {
            console.log("Registros nulos não são permitidos")
            return
        }
        await this.repo.atualizarInformacoes(coluna, registro, cpf)
        console.log("Atualização realiza com sucesso!")
    }
    public async deletarFuncionario(cpf) {
        if (!await this.verificarCpf(cpf)) {
            console.log("O CPF inserido não foi encontrado!")
        }
        await this.repo.deletarFuncionario(cpf)
        console.log("Funcionário deletado com sucesso!")
    }



}   