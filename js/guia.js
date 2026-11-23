/* Guia digital: estrutura de leitura e palavras-chave dos cinco capítulos.
   Os títulos, tempos e resumos vêm de CLIPSE.guia (data.js). Aqui entram só o que o guia precisa a mais. */
(function () {
  'use strict';
  const C = window.CLIPSE;
  if (!C) return;

  C.paginas.splice(2, 0, { id: 'guia', nome: 'Guia digital', grupo: 'Clipse', linha: 'Cinco capítulos para ler no seu tempo' });

  C.guiaCaps = [
    { icone: 'g-intro',   chaves: ['O que é a Clipse', 'Para quem existe', 'Como usar o guia'] },
    { icone: 'g-motivos', chaves: ['Seu corpo continua seu', 'Saúde que dura décadas', 'O tempo entra na conta'] },
    { icone: 'g-riscos',  chaves: ['Coração e circulação', 'Hormônios', 'Onde buscar ajuda'] },
    { icone: 'g-rotina',  chaves: ['Treinos de 20 minutos', 'Semana cheia', 'O que priorizar'] },
    { icone: 'g-voltar',  chaves: ['Metade do que fazia', 'Duas semanas', 'Sem se comparar'] }
  ];

  /* Qual capítulo ler primeiro, segundo a fase da pessoa */
  C.guiaFases = { nova: 5, crescente: 5, cheia: 2, minguante: 4 };

  /* Um ícone para cada risco, na ordem de CLIPSE.riscos */
  C.guiaRiscos = ['g-coracao', 'g-gota', 'g-figado', 'g-perfil', 'g-pele', 'g-caixa'];
})();
