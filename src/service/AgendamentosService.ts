
import { Agendamentos } from "../entity/Agendamentos";
import { AgendamentosRepository } from "../repository/AgendamentosRepository";

export class AgendamentosService {
    private repo: AgendamentosRepository

    constructor() {
        this.repo = new AgendamentosRepository
    }
    async listarAgendamentos(): Promise<Agendamentos[]>{
        return await this.repo.listarAgendamentos()
    }

    async buscarPorID(id:number): Promise<Agendamentos[]>{
        let lista: Agendamentos[]= []
        lista = await this.repo.buscarID(id)
        
        if (lista.length == 0){
            throw new Error ("Agendamento não encontrado!")
        }
        else {
            return lista
        }
    }
    
    public async inserirAgendamento(id_cliente: Number, id_funcionario: Number, data_marcada: Date ,tipo: string){
        await this.repo.inserirAgendamento(id_cliente, id_funcionario, data_marcada, tipo)
    }
}