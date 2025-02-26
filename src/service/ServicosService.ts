import { promises } from "dns";
import { Servicos } from "../entity/Servicos";
import { ServicosRepository } from "../repository/ServicosRepository";
export class ServicosService{
    private repo: ServicosRepository
    constructor(){
        this.repo= new ServicosRepository()
    }
    async listarServicos():Promise<Servicos[]>{
       return await this.repo.listarServicos()
    }
    async buscarID(id): Promise<Servicos[]>{
        let lista: Servicos[]= []
        lista = await this.repo.buscarID(id)

        if (lista.length==0){
            throw new Error("Serviço não encontrado!")
        }
        else{
            return lista
        }
        

    }
    async inserirServico(id_funcionario, id_cliente, tipo_servico, data_servico){
        await this.repo.inserirServico(id_funcionario, id_cliente, tipo_servico, data_servico)
    }
}