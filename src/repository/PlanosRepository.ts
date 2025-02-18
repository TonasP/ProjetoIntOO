
import { Planos } from "../entity/Planos";
import { Database } from "./DataBase";
import { Pool } from "pg"; 

export class PlanosRepository{
    private pool: Pool

    constructor() {
        this.pool= Database.iniciarConexao()
    }
    async listarPlanos():Promise<Planos[]>{
        const query = 'SELECT * FROM "GymControl".planos'
        const result = await this.pool.query(query)

        const listaPlanos : Planos[]= []
        for (const row of result.rows){
            const planos = new Planos(row.id, row.nome, row.valor)
            listaPlanos.push(planos)
        }
        
        return listaPlanos

    }

}


