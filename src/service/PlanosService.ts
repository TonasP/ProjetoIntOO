import { Planos } from "../entity/Planos";
import { PlanosRepository } from "../repository/PlanosRepository";

export class PlanosService{
    private repo : PlanosRepository

    constructor (){
        this.repo= new PlanosRepository()
    }
    async listarPlanos():Promise<Planos[]>{
        return await this.repo.listarPlanos()
    }
}   