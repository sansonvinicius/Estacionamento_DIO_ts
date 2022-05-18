//cria uma constate para não precisar ficar escrevendo querySelector
(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    //calcula o tempo que o carro permaneceu no estacionamento
    function calcTempo(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    //função com todas as funções utilizadas para o estacionamento
    function patio() {
        //Le os dados passados que serão salvos no localStorage
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        //Salva os dados dos carros no localStorage
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        //Adiciona o veículo ao patio, inserindo uma linha na tabela
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
                <button class='delete'  data-placa = "${veiculo.placa}">
                    X
                </button>
            </td>
          `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            (_b = $('#patio')) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            //Verifica se já foi salvo e se não salva o novo veículo junto ao array com os anteriores 
            if (salva) {
                salvar([...ler(), veiculo]);
            }
        }
        //verifica se o veículo está no patio e remove, também calcula o tempo de permanência
        function remover(placa) {
            const { entrada, nome } = ler().find((veiculo) => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar`))
                return;
            //se remover o veiculo vai buscar apenas os veículos nào removidos e renderizar na página
            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        }
        //renderiza os dados dos veículos salvos na tela
        function render() {
            $("#patio").innerHTML = "";
            const patio = ler();
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }
        return { ler, adicionar, remover, salvar, render };
    }
    patio().render();
    //captura os dados de nome e placa ao clicar no botão cadastrar
    (_a = $('#cadastrar')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        var _a, _b;
        const nome = (_a = $('#nome')) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $('#placa')) === null || _b === void 0 ? void 0 : _b.value;
        //Verifica caso algum campo esteja em branco e retorna um alerta
        if (!nome || !placa) {
            alert('Os campos nome e placa são obrigatórios');
            return;
        }
        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
    });
})();
