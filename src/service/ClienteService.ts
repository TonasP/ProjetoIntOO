import { Cliente } from "../entity/Cliente";
import { ClienteRepository } from "../repository/ClienteRepository"
import { ServicosService } from "./ServicosService";


export class ClienteService {
  private cliente : Cliente
  private servico : ServicosService

  private repo: ClienteRepository;

  constructor() {
    this.servico = new ServicosService
    this.repo = new ClienteRepository();
  }
  async pegarIdPorCpf(cpf){
    return this.repo.pegarIdPorCpf(cpf)
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
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexNumero = /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/
    const regexCpf = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/
    const emailValido = regexEmail.test(email)
    const cpfValido = regexCpf.test(cpf)
    const numeroValido = regexNumero.test(numero_celular)
    if (!emailValido) {
      console.log("Email Invalido!")
      return
    }
    if (!cpfValido){
      console.log ("CPF não é valido!")
      return
    }
    if (!numeroValido){
      console.log ("Numero de celular inválido!")
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
    let id_funcionario = 15
      let pegarId= await this.pegarIdPorCpf(cpf)
      let id_cliente = parseInt(pegarId.id)
      let tipo_servico= "4"
      let data_servico= new Date()
      await this.servico.inserirServico(id_funcionario, id_cliente, tipo_servico, data_servico)
    
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
    if (coluna == 'plano_id'){
      
      let id_funcionario = 15
      let pegarId= await this.pegarIdPorCpf(cpf)
      let id_cliente = parseInt(pegarId.id)
      let tipo_servico= "4"
      let data_servico= new Date()
      await this.servico.inserirServico(id_funcionario, id_cliente, tipo_servico, data_servico)
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
