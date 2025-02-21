export class Pagamentos {
    private id: number
    private id_servico: number
    private valor_total: number
    private forma_pagamento: string

    constructor(id: number, id_servico: number, valor_total: number, forma_pagamento: string) {
        this.id = id;
        this.id_servico = id_servico;
        this.valor_total = valor_total;
        this.forma_pagamento = forma_pagamento;
    }
}