import { Funcionario } from "../entity/Funcionario";
import { FuncionarioRepository } from "../repository/FuncionarioRepository";
import { ServicosService } from "./ServicosService";

export class FuncionarioService {
    private servico: ServicosService;
    private repo: FuncionarioRepository;

    constructor(servico: ServicosService) {
        this.servico = servico;  
        this.repo = new FuncionarioRepository();
    }

    async listarFuncionario(): Promise<Funcionario[]> {
        return await this.repo.listarFuncionarios()
    }
    public async pegarSituacaoEmpregado(id: number): Promise<boolean> {
        const funcionario = await this.repo.pegarSituacaoEmpregado(id);
    
        if (!funcionario) {
            console.log("Erro: Funcionário não encontrado.");
            return false;
        }
    
        return await funcionario.pegarSituacao() !== 'Inativo';
    }
    
    async verificarCpf(cpf): Promise<boolean> {
        let lista: Funcionario[] = []
        lista = await this.repo.verificarCpf(cpf)
        return lista.length > 0;
        //Caso o CPF já exista no banco de dados, o metodo retorna True, caso contrario, retorna False
    }

    async buscarPorCpf(cpf: string): Promise<Funcionario[] | void > {
        let lista: Funcionario[] = []
        lista = await this.repo.buscarPorCpf(cpf)

        if (lista.length == 0) {
            console.log("Funcionário não encontrado!");
            return
        }
        else {
            return lista;
        }
    }
    async buscarPorId(id: number): Promise<Funcionario[]| void> {
        let lista: Funcionario[] = []
        lista = await this.repo.buscarPorId(id)

        if (lista.length == 0) {
            console.log("Funcionário não encontrado!");
            return
        }
        else {
            return lista;
        }
    }
    async inserirFuncionario(nome: string, cpf: string, data_nascimento: Date, funcao: string, numero_celular: string, email: string) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexNumero = /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/
        const regexCpf = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/
        const emailValido = regexEmail.test(email)
        const cpfValido = regexCpf.test(cpf)
        const numeroValido = regexNumero.test(numero_celular)
        let hoje = new Date
        let calcularIdadeAno = hoje.getFullYear() - data_nascimento.getFullYear()
        let converterFuncaoOpcao= parseInt(funcao)
        let indiceFuncoes= converterFuncaoOpcao - 1
        if (indiceFuncoes <1 || indiceFuncoes >4 ){
            console.log("Função invalida!")
            return
        }
        let funcoes = ['Gerente', 'Recepcionista', 'Nutricionista', 'Instrutor']
        let funcaoEscolhida = funcoes[indiceFuncoes]
        if (!emailValido) {
            console.log("Email Invalido!")
            return
        }
        if (calcularIdadeAno <16){
            console.log("Não contratamos menores de 16 anos!")
            return
        }
        if (!cpfValido) {
            console.log("CPF não é valido!")
            return
        }
        if (!numeroValido) {
            console.log("Numero de celular inválido!")
            return
        }
        if (await this.verificarCpf(cpf)) {
            console.log("O CPF inserido já existe no banco de dados!")
            return
        }
       
        await this.repo.inserirFuncionario(nome, cpf, data_nascimento, funcaoEscolhida, numero_celular, email)
        console.log("Funcionário inserido com sucesso!")
    }
    public async atualizarSituacaoEmpregado(situacao, id){
        let servicosRealizados = await this.servico.listarServicosFuncionario(id)
        let situacaoPossibilidade = ['Ativo', 'Inativo']
        let converter = parseInt(situacao)
        let converterIndice = converter-1
        let selecionarPossibilidade = situacaoPossibilidade[converterIndice]
        if (converterIndice <0 || converterIndice > 1) {
            console.log("Situação selecionada não existe!")
            return
        }
        if (!this.buscarPorId(id)){
            console.log("Id selecionado não existente!")
            return    
        }
        if (selecionarPossibilidade == 'Inativo' && servicosRealizados.length <= 0){
            console.log("O Funcionário não havia realizado nenhum serviço até o momento, então seu registro será deletado!")
            await this.deletarFuncionario(id)
            return
        }
        await this.repo.alterarSituacaoEmpregado(selecionarPossibilidade, id)
        console.log("Situação empregatícia alterada com sucesso!")
        
    }
    async atualizarInformacoes(coluna, registro, cpf) {
        const colunasPermitidas = ['nome', 'email', 'numero_celular', 'funcao', 'cpf']
        console.log(`Estas são as informações permitidas: ${colunasPermitidas}`)
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
        console.log("Atualização realiza com sucesso!")
    }
    public async deletarFuncionario(id) {
        if (!await this.buscarPorId(id)) {
            console.log("O CPF inserido não foi encontrado!")
        }
        await this.repo.deletarFuncionario(id)
        console.log("Funcionário deletado com sucesso!")
    }



}   