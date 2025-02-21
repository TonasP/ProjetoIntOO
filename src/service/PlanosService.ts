import { Planos } from "../entity/Planos";
import { PlanosRepository } from "../repository/PlanosRepository";

export class PlanosService {
    private repo: PlanosRepository

    constructor() {
        this.repo = new PlanosRepository()
    }
    async listarPlanos(): Promise<Planos[]> {
        return await this.repo.listarPlanos()
    }
    async buscarID(id) {
        let lista: Planos[] = []
        lista = await this.repo.buscarID(id)

        if (lista.length == 0) {
            throw new Error("Plano não encontrado!");
        }
        else {
            return lista;
        }
    }
}