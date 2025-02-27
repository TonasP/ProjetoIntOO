import { Cliente } from "../entity/Cliente";
import { ClienteRepository } from "../repository/ClienteRepository"


export class ClienteService {

  private repo: ClienteRepository;

  constructor() {
    this.repo = new ClienteRepository();
  }

  async listarClientes(): Promise<Cliente[]> {
    return await this.repo.listarClientes()
  }
  async buscarID(id): Promise<Cliente[]> {
    let lista: Cliente[] = []
    lista = await this.repo.buscarID(id)

    if (lista.length == 0) {
      throw new Error("Cliente não encontrado!");
    }
    else {
      return lista;

    }
  }
  async verificarCpf(cpf): Promise<Cliente[]> {
    let lista: Cliente[] = []
    lista = await this.repo.verificarCpf(cpf)

    if (lista.length == 0) {
      throw new Error("Cliente Inexistente!")
    }
    else{
      return lista;
    }
  }
  async inserirCliente(nome: string, cpf: string, data_nascimento: Date, plano_id: number, numero_celular: string, email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValido = regex.test(email)
    if (!emailValido) {
      throw new Error("Email Invalido zé!!!!!!!!!!")
    }
    await this.repo.inserirCliente(nome, cpf, data_nascimento, plano_id, numero_celular, email)
  }

  async atualizarInformacoes(coluna, registro, cpf) {
    const colunasPermitidas = ['nome', 'email', 'numero_celular', 'plano_id']
    if (!colunasPermitidas.includes(coluna)) {
      console.log("Coluna não permitida!")
      return
    }



  }
}
