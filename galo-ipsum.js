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

// Função para gerar uma sentença
function generateSentence(knowledgeBase) {
  const grito = randomPick(knowledgeBase.gritos_de_guerra.items);
  const lenda = randomPick(knowledgeBase.legendas.items);
  const acao = randomPick(knowledgeBase.acoes_do_mascote.items);
  const pontuacao = randomPick(PONTUACOES);

  return `${grito} ${lenda} ${acao}${pontuacao}`;
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

  for (let i = 0; i < numSentences; i++) {
    sentences.push(generateSentence(knowledgeBase));
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
