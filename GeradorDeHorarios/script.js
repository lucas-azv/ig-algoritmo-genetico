const NUM_PROFESSORES = 10;
const NUM_MATERIAS = 25;
const NUM_INDIVIDUOS = 50;
const NUM_PERIODOS = 5;
const DIAS_SEMANA = 5;
const HORARIOS_DIA = 4;

let individuos = [];
let professores = [];
let materias = [];

document.getElementById('gerarMatriz').addEventListener('click', gerarMatriz);

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
}

function exibirMatriz() {
    const container = document.getElementById('matrizContainer');
    container.innerHTML = '';
    
    const table = document.createElement('table');
    table.className = 'matrix-table';
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const thEmpty = document.createElement('th');
    headerRow.appendChild(thEmpty);
    
    for (let i = 0; i < individuos[0].length; i++) {
        const th = document.createElement('th');
        th.textContent = `H${i + 1}`;
        
        const periodo = Math.floor(i / 20) + 1;
        th.classList.add(`periodo-${periodo}`);
        headerRow.appendChild(th);
    }
    
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
        
        tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    container.appendChild(table);
    
    const legend = document.createElement('div');
    legend.className = 'info-panel';
    legend.innerHTML = `
        <p><strong>Legenda de Períodos:</strong></p>
        <div style="display: flex; gap: 15px; margin-top: 10px;">
            <div><span style="display: inline-block; width: 15px; height: 15px; background: #e6f7ff;"></span> Período 1 (H1-H20)</div>
            <div><span style="display: inline-block; width: 15px; height: 15px; background: #fff2e6;"></span> Período 2 (H21-H40)</div>
            <div><span style="display: inline-block; width: 15px; height: 15px; background: #f0ffe6;"></span> Período 3 (H41-H60)</div>
            <div><span style="display: inline-block; width: 15px; height: 15px; background: #f9e6ff;"></span> Período 4 (H61-H80)</div>
            <div><span style="display: inline-block; width: 15px; height: 15px; background: #ffffe6;"></span> Período 5 (H81-H100)</div>
        </div>
    `;
    container.appendChild(legend);
}