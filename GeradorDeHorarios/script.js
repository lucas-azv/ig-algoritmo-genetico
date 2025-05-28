// Constantes e variáveis globais
const NUM_PROFESSORES = 10;
const NUM_MATERIAS = 25;
const NUM_INDIVIDUOS = 50;
const NUM_PERIODOS = 5;
const DIAS_SEMANA = 5;
const HORARIOS_DIA = 4;

let individuos = [];
let professores = [];
let materias = [];
let notas = [];
let conflitosPorIndividuo = [];

// Utilitários
function formatarCodigoProfessor(num) {
    return `P${num.toString().padStart(2, '0')}`;
}

function formatarCodigoMateria(num) {
    return `M${num.toString().padStart(2, '0')}`;
}

function inicializarDados() {
    professores = Array.from({length: NUM_PROFESSORES}, (_, i) => formatarCodigoProfessor(i + 1));
    materias = Array.from({length: NUM_MATERIAS}, (_, i) => formatarCodigoMateria(i + 1));
}

function gerarPropostaHorario() {
    const proposta = [];
    for (let p = 0; p < NUM_PERIODOS; p++) {
        const materiaInicial = p * 5;
        const materiasPeriodo = materias.slice(materiaInicial, materiaInicial + 5);
        for (let d = 0; d < DIAS_SEMANA; d++) {
            for (let h = 0; h < HORARIOS_DIA; h++) {
                const materiaIndex = (d * HORARIOS_DIA + h) % materiasPeriodo.length;
                const materia = materiasPeriodo[materiaIndex];
                const professor = professores[Math.floor(Math.random() * NUM_PROFESSORES)];
                proposta.push(`${professor}-${materia}`);
            }
        }
    }
    return proposta;
}

function gerarMatriz() {
    inicializarDados();
    individuos = [];
    for (let i = 0; i < NUM_INDIVIDUOS; i++) {
        individuos.push(gerarPropostaHorario());
    }
    exibirMatriz();
    document.getElementById('avaliarIndividuos').disabled = false;
    document.getElementById('ordenarIndividuos').disabled = false;
    document.getElementById('executarAG').disabled = false;


}

function avaliacao() {
    conflitosPorIndividuo = new Array(NUM_INDIVIDUOS).fill(0);
    notas = new Array(NUM_INDIVIDUOS).fill(0);
    for (let i = 0; i < NUM_INDIVIDUOS; i++) {
        let totalConflitos = 0;
        for (let h = 0; h < 20; h++) {
            const professoresNoHorario = new Set();
            for (let p = 0; p < NUM_PERIODOS; p++) {
                const posicao = p * 20 + h;
                const [professor] = individuos[i][posicao].split('-');
                if (professoresNoHorario.has(professor)) {
                    totalConflitos++;
                    notas[i] += 10;
                }
                professoresNoHorario.add(professor);
            }
        }
        for (let p = 0; p < NUM_PERIODOS; p++) {
            for (let d = 0; d < DIAS_SEMANA; d++) {
                const materiasNoDia = new Set();
                for (let h = 0; h < HORARIOS_DIA; h++) {
                    const posicao = p * 20 + d * HORARIOS_DIA + h;
                    const [, materia] = individuos[i][posicao].split('-');
                    if (materiasNoDia.has(materia)) {
                        totalConflitos++;
                        notas[i] += 5;
                    }
                    materiasNoDia.add(materia);
                }
            }
        }
        conflitosPorIndividuo[i] = totalConflitos;
    }
    exibirMatriz();
}

function ordenacao() {
    const indices = Array.from({length: NUM_INDIVIDUOS}, (_, i) => i);
    indices.sort((a, b) => conflitosPorIndividuo[a] - conflitosPorIndividuo[b]);
    individuos = indices.map(i => individuos[i]);
    conflitosPorIndividuo = indices.map(i => conflitosPorIndividuo[i]);
    notas = indices.map(i => notas[i]);
    exibirMatriz();
}

function cruzamento(pai1, pai2) {
    const pontoCorte = Math.floor(Math.random() * pai1.length);
    const filho = [...pai1.slice(0, pontoCorte), ...pai2.slice(pontoCorte)];
    return filho;
}

function mutacao(individuo) {
    const pos1 = Math.floor(Math.random() * individuo.length);
    const pos2 = Math.floor(Math.random() * individuo.length);
    const temp = individuo[pos1];
    individuo[pos1] = individuo[pos2];
    individuo[pos2] = temp;
}

function executarAG() {
    const NOVAS_GERACOES = 50;
    const status = document.getElementById('status');
    status.innerText = "Executando algoritmo genético...";
    for (let geracao = 0; geracao < NOVAS_GERACOES; geracao++) {
        const novaPopulacao = [];
        ordenacao();
        for (let i = 0; i < NUM_INDIVIDUOS / 2; i++) {
            const pai1 = individuos[Math.floor(Math.random() * (NUM_INDIVIDUOS / 4))];
            const pai2 = individuos[Math.floor(Math.random() * (NUM_INDIVIDUOS / 2))];
            const filho1 = cruzamento(pai1, pai2);
            const filho2 = cruzamento(pai2, pai1);
            if (Math.random() < 0.2) mutacao(filho1);
            if (Math.random() < 0.2) mutacao(filho2);
            novaPopulacao.push(filho1, filho2);
        }
        individuos = novaPopulacao;
        avaliacao();
    }
    ordenacao();
    exibirMelhorIndividuo();
    alert("Melhor horário encontrado após AG:");
}

function exibirMatriz() {
    const container = document.getElementById('matrizContainer');
    container.innerHTML = '';
    const table = document.createElement('table');
    const header = document.createElement('tr');
    header.innerHTML = '<th>Ind</th>' + Array.from({length: 100}, (_, i) => `<th>H${i + 1}</th>`).join('') + '<th>Conflitos</th>';
    table.appendChild(header);
    for (let i = 0; i < individuos.length; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${i + 1}</td>` + individuos[i].map(h => `<td>${h}</td>`).join('') + `<td>${conflitosPorIndividuo[i]}</td>`;
        table.appendChild(row);
    }
    container.appendChild(table);
}

function exibirMelhorIndividuo() {
    const container = document.getElementById('melhorHorarioContainer');
    container.innerHTML = '<h2>Melhor Horário (Menos Conflitos)</h2>';

    if (individuos.length === 0) {
        container.innerHTML += "<p>Nenhum indivíduo disponível.</p>";
        return;
    }

    const melhorIndividuo = individuos[0];
    const conflitosMelhor = conflitosPorIndividuo[0];

    const table = document.createElement('table');
    table.className = 'matrix-table';

    // Cabeçalho
    const header = document.createElement('tr');
    header.innerHTML = '<th>Posição</th>' + melhorIndividuo.map((_, i) => `<th>H${i + 1}</th>`).join('') + '<th>Conflitos</th>';
    table.appendChild(header);

    // Linha do melhor indivíduo
    const row = document.createElement('tr');
    row.innerHTML = `<td>Melhor</td>` + melhorIndividuo.map(h => `<td>${h}</td>`).join('') + `<td>${conflitosMelhor}</td>`;
    table.appendChild(row);

    container.appendChild(table);
}

// Inicialização dos botões quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gerarMatriz').addEventListener('click', gerarMatriz);
    document.getElementById('avaliarIndividuos').addEventListener('click', avaliacao);
    document.getElementById('ordenarIndividuos').addEventListener('click', ordenacao);
    document.getElementById('executarAG').addEventListener('click', executarAG);
    
});
