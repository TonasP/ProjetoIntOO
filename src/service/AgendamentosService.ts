
import { Agendamentos } from "../entity/Agendamentos";
import { AgendamentosRepository } from "../repository/AgendamentosRepository";

export class AgendamentosService {
    private repo: AgendamentosRepository

    constructor() {
        this.repo = new AgendamentosRepository
    }
    async listarAgendamentos(): Promise<Agendamentos[]> {
        return await this.repo.listarAgendamentos()
    }

    async buscarPorCpf(cpf: string): Promise<Agendamentos[]> {
        let lista: Agendamentos[] = []
        lista = await this.repo.buscarPorCpf(cpf)

        if (lista.length == 0) {
            throw new Error("Agendamento não encontrado!")
        }
        else {
            return lista
        }
    }
    async verificarCpf(cpf): Promise<boolean> {
        let lista: Agendamentos[] = []
        lista = await this.repo.verificarCpf(cpf)
        return lista.length > 0;
        //Caso o CPF já exista no banco de dados, o metodo retorna True, caso contrario, retorna False
    }
    public async inserirAgendamento(id_cliente: Number, id_funcionario: Number, data_marcada: Date, tipo: string) {
        await this.repo.inserirAgendamento(id_cliente, id_funcionario, data_marcada, tipo)
    }
    public async atualizarInformacoes(coluna, registro, cpf) {
        const colunasPermitidas = ['id_funcionario', 'data_marcada', 'tipo']
        console.log(`Estas são as informações permitidas: ${colunasPermitidas}`)
        if (!colunasPermitidas.includes(coluna)) {
            console.log("Opção não permitida!")
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
    public async listarRegistros(cpf): Promise<Agendamentos[]> {
        return await this.repo.listarRegistros(cpf)
    }
    public async deletarAgendamentoPorID(id, cpf) {
        const agendamentos = await this.listarRegistros(cpf)
        const idsPermitidos = agendamentos.map(a => a.pegarId())
        if (!idsPermitidos.includes(id)) {
            console.log("O ID inserido não é compativel com os exibidos!")
            return
        }
        else {
            await this.repo.deletarAgendamentoPorID(id)
        }

    }

    public async deletarAgendamento(cpf: string, id: number): Promise<void> {
        if (!await this.verificarCpf(cpf)) {
            console.log("CPF inexistente!");
            return;
        }

        let agendamentos = await this.listarRegistros(cpf);

        if (agendamentos.length === 0) {
            console.log("Nenhum agendamento encontrado para este CPF.");
            return;
        }


        const agendamento = agendamentos.find(async a => await a.pegarId() === id);

        if (!agendamento) {
            console.log("ID inválido! Operação cancelada.");
            return;
        }


        await this.repo.deletarAgendamentoPorID(id);
        console.log(`Agendamento ID ${id} deletado com sucesso!`);
    }


}

