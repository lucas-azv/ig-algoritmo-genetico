// Constantes do sistema
const NUM_PROFESSORES = 10;
const NUM_MATERIAS = 25;
const NUM_INDIVIDUOS = 50;
const NUM_PERIODOS = 5;
const DIAS_SEMANA = 5;
const HORARIOS_DIA = 4;

// Variáveis globais
let individuos = [];
let professores = [];
let materias = [];
let notas = [];
let conflitosPorIndividuo = [];

// Elementos do DOM
const btnGerar = document.getElementById('gerarMatriz');
const btnAvaliar = document.getElementById('avaliarIndividuos');
const btnOrdenar = document.getElementById('ordenarIndividuos');

// Event Listeners
btnGerar.addEventListener('click', gerarMatriz);
btnAvaliar.addEventListener('click', avaliacao);
btnOrdenar.addEventListener('click', ordenacao);

// Funções de formatação (permanecem as mesmas)
function formatarCodigoProfessor(num) {
    return `P${num.toString().padStart(2, '0')}`;
}

function formatarCodigoMateria(num) {
    return `M${num.toString().padStart(2, '0')}`;
}

// Inicialização dos dados (permanece a mesma)
function inicializarDados() {
    professores = Array.from({length: NUM_PROFESSORES}, (_, i) => formatarCodigoProfessor(i + 1));
    materias = Array.from({length: NUM_MATERIAS}, (_, i) => formatarCodigoMateria(i + 1));
}

// Geração da população inicial (permanece a mesma)
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
                
                const codigo = `${professor}-${materia}`;
                proposta.push(codigo);
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
    btnAvaliar.disabled = false;
    btnOrdenar.disabled = false;
}

// Função de exibição da matriz (atualizada para incluir ordenação)
function exibirMatriz() {
    const container = document.getElementById('matrizContainer');
    container.innerHTML = '';
    
    const table = document.createElement('table');
    table.className = 'matrix-table';
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const thIndice = document.createElement('th');
    thIndice.textContent = 'Ind.';
    headerRow.appendChild(thIndice);
    
    for (let i = 0; i < individuos[0].length; i++) {
        const th = document.createElement('th');
        th.textContent = `H${i + 1}`;
        const periodo = Math.floor(i / 20) + 1;
        th.classList.add(`periodo-${periodo}`);
        headerRow.appendChild(th);
    }
    
    const thAvaliacao = document.createElement('th');
    thAvaliacao.textContent = 'Conflitos';
    thAvaliacao.style.backgroundColor = '#2c3e50';
    headerRow.appendChild(thAvaliacao);
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    
    for (let i = 0; i < individuos.length; i++) {
        const row = document.createElement('tr');
        
        const tdIndice = document.createElement('td');
        tdIndice.textContent = i + 1;
        tdIndice.style.fontWeight = 'bold';
        tdIndice.style.backgroundColor = '#f1f1f1';
        row.appendChild(tdIndice);
        
        for (let j = 0; j < individuos[i].length; j++) {
            const td = document.createElement('td');
            td.textContent = individuos[i][j];
            const periodo = Math.floor(j / 20) + 1;
            td.classList.add(`periodo-${periodo}`);
            row.appendChild(td);
        }
        
        const tdAvaliacao = document.createElement('td');
        tdAvaliacao.className = 'avaliacao-cell';
        tdAvaliacao.textContent = conflitosPorIndividuo[i] || '-';
        
        if (conflitosPorIndividuo[i] !== undefined) {
            if (conflitosPorIndividuo[i] === 0) {
                tdAvaliacao.classList.add('avaliacao-0');
            } else if (conflitosPorIndividuo[i] <= 5) {
                tdAvaliacao.classList.add('avaliacao-1');
            } else {
                tdAvaliacao.classList.add('avaliacao-2');
            }
        }
        
        row.appendChild(tdAvaliacao);
        tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    container.appendChild(table);
    
    // Legenda permanece a mesma
    const legend = document.createElement('div');
    legend.className = 'info-panel';
    legend.innerHTML = `
        <p><strong>Legenda:</strong></p>
        <div style="display: flex; gap: 15px; margin-top: 10px;">
            <div><span style="display: inline-block; width: 15px; height: 15px; background: #e6f7ff;"></span> Período 1 (H1-H20)</div>
            <div><span style="display: inline-block; width: 15px; height: 15px; background: #fff2e6;"></span> Período 2 (H21-H40)</div>
            <div><span style="display: inline-block; width: 15px; height: 15px; background: #f0ffe6;"></span> Período 3 (H41-H60)</div>
            <div><span style="display: inline-block; width: 15px; height: 15px; background: #f9e6ff;"></span> Período 4 (H61-H80)</div>
            <div><span style="display: inline-block; width: 15px; height: 15px; background: #ffffe6;"></span> Período 5 (H81-H100)</div>
        </div>
        <p style="margin-top: 15px;"><strong>Legenda de Conflitos:</strong></p>
        <div style="display: flex; gap: 15px; margin-top: 5px;">
            <div><span style="display: inline-block; width: 15px; height: 15px; background: #d4edda;"></span> 0 conflitos</div>
            <div><span style="display: inline-block; width: 15px; height: 15px; background: #fff3cd;"></span> 1-5 conflitos</div>
            <div><span style="display: inline-block; width: 15px; height: 15px; background: #f8d7da;"></span> 6+ conflitos</div>
        </div>
    `;
    container.appendChild(legend);
}

// Função de avaliação atualizada
function avaliacao() {
    conflitosPorIndividuo = new Array(NUM_INDIVIDUOS).fill(0);
    notas = new Array(NUM_INDIVIDUOS).fill(0);
    
    for (let i = 0; i < NUM_INDIVIDUOS; i++) {
        let totalConflitos = 0;
        
        // 1. Conflitos de professor no mesmo horário
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
        
        // 2. Matérias repetidas no mesmo dia
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

// Função de ordenação otimizada
function ordenacao() {
    // Criar array de índices para ordenação
    const indices = Array.from({length: NUM_INDIVIDUOS}, (_, i) => i);
    
    // Ordenar os índices com base nos conflitos
    indices.sort((a, b) => conflitosPorIndividuo[a] - conflitosPorIndividuo[b]);
    
    // Reordenar os arrays principais
    const novosIndividuos = [];
    const novosConflitos = [];
    const novasNotas = [];
    
    for (let i = 0; i < NUM_INDIVIDUOS; i++) {
        novosIndividuos.push(individuos[indices[i]]);
        novosConflitos.push(conflitosPorIndividuo[indices[i]]);
        novasNotas.push(notas[indices[i]]);
    }
    
    // Atualizar os arrays globais
    individuos = novosIndividuos;
    conflitosPorIndividuo = novosConflitos;
    notas = novasNotas;
    
    // Atualizar a exibição
    exibirMatriz();
}