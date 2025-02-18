import { Cliente } from "../entity/Cliente";
import { ClienteRepository } from "../repository/ClienteRepository"
 
 
export class ClienteService{
 
  private repo : ClienteRepository;
 
  constructor(){
    this.repo = new ClienteRepository();
  }
 
  async listarClientes():Promise<Cliente[]>{
    console.table(this.repo.listarClientes())  
    return await this.repo.listarClientes()
  }  
}