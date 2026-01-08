#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Hino do Galo em CAIXA ALTA
const HINO_GALO = `NÓS SOMOS DO CLUBE ATLÉTICO MINEIRO
JOGAMOS COM MUITA RAÇA E AMOR
VIBRAMOS COM ALEGRIA NAS VITÓRIAS
CLUBE ATLÉTICO MINEIRO
GALO FORTE VINGADOR

VENCER, VENCER, VENCER
ESTE É O NOSSO IDEAL
HONRAMOS O NOME DE MINAS
NO CENÁRIO ESPORTIVO MUNDIAL

LUTAR, LUTAR, LUTAR
PELOS GRAMADOS DO MUNDO PRA VENCER
CLUBE ATLÉTICO MINEIRO
UMA VEZ ATÉ MORRER

NÓS SOMOS CAMPEÕES DO GELO
O NOSSO TIME É IMORTAL
NÓS SOMOS CAMPEÕES DOS CAMPEÕES
SOMOS O ORGULHO DO ESPORTE NACIONAL

LUTAR, LUTAR, LUTAR
COM TODA NOSSA RAÇA PRA VENCER
CLUBE ATLÉTICO MINEIRO
UMA VEZ ATÉ MORRER
CLUBE ATLÉTICO MINEIRO
UMA VEZ ATÉ MORRER

NÓS SOMOS CAMPEÕES DO GELO
O NOSSO TIME É IMORTAL
NÓS SOMOS CAMPEÕES DOS CAMPEÕES
SOMOS O ORGULHO DO ESPORTE NACIONAL

LUTAR, LUTAR, LUTAR
COM TODA NOSSA RAÇA PRA VENCER
CLUBE ATLÉTICO MINEIRO
UMA VEZ ATÉ MORRER
CLUBE ATLÉTICO MINEIRO
UMA VEZ ATÉ MORRER`;

// Pontuações possíveis
const PONTUACOES = ['!', '.', '...', '!!'];

const VERBOS_ACAO = [
  'vai',
  'resolve',
  'parte para',
  'corre para',
  'chega para',
  'dispara para'
];

const SENTENCE_TEMPLATES = [
  {
    build: (d) => `${d.grito} ${d.lenda} ${d.acao} ${localComArtigo(d.local)}${d.pont}`
  },
  {
    build: (d) =>
      `${capitalize(localComArtigo(d.local))}, ${d.lenda} ${d.acao} e a Massa responde: "${d.grito}"${d.pont}`
  },
  {
    build: (d) =>
      `Quando ${d.lenda} ${d.acao}, ${d.grito} ecoa ${localComArtigo(d.local)}${d.pont}`
  },
  {
    build: (d) => `${d.lenda} ${d.acao} - ${d.grito}${d.pont}`
  },
  {
    build: (d) =>
      `Entre um canto e outro, "${d.meme}". ${d.lenda} ${d.acao} ${localComArtigo(d.local)}${d.pont}`,
    requiresMeme: true
  },
  {
    build: (d) =>
      `${capitalize(localComArtigo(d.local))} a Massa puxa o coro: ${d.grito}. ${d.lenda} ${d.acao}${d.pont}`
  }
];

// Função para ler e parsear o knowledge base
function loadKnowledgeBase() {
  const knowledgeBasePath = path.join(__dirname, '../galo_knowledge_base.json');
  const data = fs.readFileSync(knowledgeBasePath, 'utf8');
  return JSON.parse(data);
}

// Função para selecionar item aleatório de um array
function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function pickDifferent(array, lastValue) {
  if (!array || array.length === 0) return '';
  if (!lastValue || array.length === 1) return randomPick(array);

  let pick = randomPick(array);
  let tries = 0;
  while (pick === lastValue && tries < 5) {
    pick = randomPick(array);
    tries += 1;
  }

  return pick;
}

function stripTrailingPunctuation(text) {
  if (!text) return '';
  return text.replace(/[.!?]+$/, '');
}

function formatAction(action) {
  if (!action) return '';
  return action.replace(/_/g, ' ');
}

function formatLendaName(name) {
  if (!name) return '';
  return name.replace(/([a-zà-ÿ])([A-ZÁ-Ý])/g, '$1 $2');
}

function buildActionPhrase(action) {
  const actionText = formatAction(action);
  if (!actionText) return '';

  if (actionText.endsWith('ando') || actionText.endsWith('endo') || actionText.endsWith('indo')) {
    return `tá ${actionText}`;
  }

  return `${randomPick(VERBOS_ACAO)} ${actionText}`;
}

function localComArtigo(local) {
  if (!local) return '';
  const lower = local.toLowerCase();
  if (
    lower.startsWith('arena') ||
    lower.startsWith('sede') ||
    lower.startsWith('praça') ||
    lower.startsWith('serra') ||
    lower.startsWith('esplanada') ||
    lower.startsWith('pampulha')
  ) {
    return `na ${local}`;
  }
  if (lower.startsWith('arredores')) {
    return `nos ${local}`;
  }
  return `no ${local}`;
}

function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Função para gerar uma sentença
function generateSentence(knowledgeBase, state) {
  const gritos = knowledgeBase.gritos_de_guerra.items;
  const lendas = knowledgeBase.legendas.items;
  const acoes = knowledgeBase.acoes_do_mascote.items;
  const locais = knowledgeBase.locais_sagrados ? knowledgeBase.locais_sagrados.items : ['Horto'];
  const memes = knowledgeBase.memes_classicos ? knowledgeBase.memes_classicos.items : [];

  const gritoRaw = pickDifferent(gritos, state.lastGrito);
  state.lastGrito = gritoRaw;

  const useAnchorLenda = state.anchorLenda && Math.random() < 0.35;
  const lendaRaw = useAnchorLenda ? state.anchorLenda : pickDifferent(lendas, state.lastLenda);
  state.lastLenda = lendaRaw;

  const useAnchorLocal = state.anchorLocal && Math.random() < 0.35;
  const local = useAnchorLocal ? state.anchorLocal : pickDifferent(locais, state.lastLocal);
  state.lastLocal = local;

  const acaoRaw = pickDifferent(acoes, state.lastAcao);
  state.lastAcao = acaoRaw;

  const useMeme = memes && memes.length > 0 && Math.random() < 0.4;
  const meme = useMeme ? pickDifferent(memes, state.lastMeme) : '';
  state.lastMeme = meme || state.lastMeme;

  const data = {
    grito: stripTrailingPunctuation(gritoRaw),
    gritoRaw,
    lenda: formatLendaName(lendaRaw),
    acao: buildActionPhrase(acaoRaw),
    local,
    meme,
    pont: randomPick(PONTUACOES)
  };

  const availableTemplates = SENTENCE_TEMPLATES.filter((t) => !t.requiresMeme || data.meme);
  return randomPick(availableTemplates).build(data);
}

// Função para gerar um parágrafo
function generateParagraph(type, knowledgeBase) {
  const sentenceCounts = {
    short: 3,
    medium: 7,
    long: 12
  };

  const numSentences = sentenceCounts[type] || sentenceCounts.medium;
  const sentences = [];
  const state = {
    lastGrito: null,
    lastLenda: null,
    lastAcao: null,
    lastLocal: null,
    lastMeme: null,
    anchorLenda: randomPick(knowledgeBase.legendas.items),
    anchorLocal: randomPick(knowledgeBase.locais_sagrados ? knowledgeBase.locais_sagrados.items : ['Horto'])
  };

  for (let i = 0; i < numSentences; i++) {
    sentences.push(generateSentence(knowledgeBase, state));
  }

  return sentences.join(' ');
}

// Função principal
function main() {
  const args = process.argv.slice(2);

  // Validação de argumentos
  if (args.length === 0) {
    console.error('Uso: node galo-ipsum.js <paragraphs> [type]');
    console.error('Exemplo: node galo-ipsum.js 5 medium');
    console.error('Tipos válidos: short, medium, long');
    process.exit(1);
  }

  const numParagraphs = parseInt(args[0]);
  const type = args[1] || 'medium';

  if (isNaN(numParagraphs) || numParagraphs <= 0) {
    console.error('Erro: O número de parágrafos deve ser um número positivo');
    process.exit(1);
  }

  if (!['short', 'medium', 'long'].includes(type)) {
    console.error('Erro: Tipo inválido. Use: short, medium ou long');
    process.exit(1);
  }

  // Carregar knowledge base
  const knowledgeBase = loadKnowledgeBase();

  // Gerar parágrafos
  for (let i = 1; i <= numParagraphs; i++) {
    // Easter egg: a cada 10 parágrafos, inserir o hino
    if (i % 10 === 0) {
      console.log(HINO_GALO);
      console.log();
    } else {
      const paragraph = generateParagraph(type, knowledgeBase);
      console.log(paragraph);
      console.log();
    }
  }
}

// Executar
main();
