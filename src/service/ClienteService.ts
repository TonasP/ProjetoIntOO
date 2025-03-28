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
  async buscarPorCpf(cpf): Promise<Cliente[]> {
    let lista: Cliente[] = []
    lista = await this.repo.buscarPorCpf(cpf)

    if (lista.length == 0) {
      throw new Error("Cliente não encontrado!");
    }
    else {
      return lista;

    }
  }
  async verificarCpf(cpf): Promise<boolean> {
    let lista: Cliente[] = []
    lista = await this.repo.verificarCpf(cpf)
    return lista.length > 0;
    //Caso o CPF já exista no banco de dados, o metodo retorna True, caso contrario, retorna False
  }
  async inserirCliente(nome: string, cpf: string, data_nascimento: Date, plano_id: number, numero_celular: string, email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValido = regex.test(email)
    if (!emailValido) {
      console.log("Email Invalido!")
      return
      
    }
    if (await this.verificarCpf(cpf)) {
      console.log("O CPF inserido já existe no banco de dados!")
      return
    }
    if (plano_id < 1 || plano_id > 6) {
      console.log("Plano inexistente!")
      return
    }
    else{
    await this.repo.inserirCliente(nome, cpf, data_nascimento, plano_id, numero_celular, email)
    console.log("Cliente inserido com sucesso!")
  }
  }

  async atualizarInformacoes(coluna, registro, cpf) {
    const colunasPermitidas = ['nome', 'email', 'numero_celular', 'plano_id']
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
    console.log("Atualização realizada com sucesso!")
  }
  public async deletarCliente(cpf) {
    if (!await this.verificarCpf(cpf)) {
      console.log("O CPF inserido não foi encontrado!")
    }
    else{
      await this.repo.deletarCliente(cpf)
    console.log("Cliente deletado com sucesso!")
  }
  }
  
}
