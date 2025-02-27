import { Pool } from "pg";
import { Pagamentos } from "../entity/Pagamentos";
import { PagamentosRepository } from "../repository/PagamentosRepository";
import { Database } from "../repository/DataBase";

export class PagamentosService{
    private repo: PagamentosRepository
    constructor(){
        this.repo= new PagamentosRepository()
    }
    
    async listarPagamentos(): Promise<Pagamentos[]>{
        return await this.repo.listarPagamentos()
    }  
    
    async buscarID(id): Promise<Pagamentos[]>{
        let lista : Pagamentos[]= []
        lista = await this.repo.buscarID(id)
        if (lista.length == 0 ){
            throw new Error ("Pagamento não encontrado!")
        }
        else{
            return lista
        }
    }
    async inserirPagamento(id_servico: Number, valor_total: Number, forma_pagamento: String){
        await this.repo.inserirPagamento(id_servico, valor_total, forma_pagamento)
    }
} 
