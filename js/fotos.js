/* Fotos do site: qual arquivo vai em cada lugar, o texto alternativo e os créditos.
   As fotos vêm do Unsplash e são ilustrativas: as pessoas retratadas não são membros reais da Clipse. */
(function () {
  'use strict';
  const C = window.CLIPSE;
  if (!C) return;

  C.fotos = {
    prof: { pr1: 'prof-marina.jpg', pr2: 'prof-thiago.jpg', pr3: 'prof-rafael.jpg', pr4: 'prof-bianca.jpg', pr5: 'prof-lucas.jpg', pr6: 'prof-camila.jpg' },
    hist: ['historia-juliana.jpg', 'historia-marcos2.jpg', 'historia-renata2.jpg', 'historia-diego.jpg', 'historia-aline.jpg'],
    grupo: { g1: 'grupo-corrida.jpg', g2: 'grupo-musculacao.jpg', g3: 'grupo-yoga-parque.jpg', g4: 'grupo-pedal.jpg', g5: 'caminhada-almoco.jpg', g6: 'aula-em-casa.jpg', g7: 'grupo-palco.jpg' },
    banner: { natural: 'banner-natural.jpg', programacao: 'banner-programacao.jpg', comunidade: 'grupo-caminhada.jpg', curitiba: 'curitiba-jardim-botanico.jpg', guia: 'banner-pausa.jpg' },
    mosaico: ['grupo-caminhada.jpg', 'grupo-yoga-parque.jpg', 'grupo-corrida.jpg']
  };

  C.fotoAlt = {
    'prof-marina.jpg': 'Mulher de camisa branca cozinhando numa cozinha clara',
    'prof-thiago.jpg': 'Homem de camisa azul sorrindo',
    'prof-rafael.jpg': 'Homem de camiseta amarela numa academia',
    'prof-bianca.jpg': 'Mulher de roupa esportiva sorrindo ao ar livre',
    'prof-lucas.jpg': 'Homem de óculos e camiseta listrada, com olhar calmo',
    'prof-camila.jpg': 'Mulher de jaleco claro, de braços cruzados e sorriso discreto',
    'historia-juliana.jpg': 'Mulher sorrindo, inclinada com as mãos nos joelhos, num gramado',
    'historia-marcos2.jpg': 'Pai sorrindo e segurando o bebê no colo, num campo ao pôr do sol',
    'historia-renata2.jpg': 'Duas mulheres caminhando devagar, de braços dados, num parque',
    'historia-diego.jpg': 'Homem jovem alongando o braço numa quadra ao ar livre',
    'historia-aline.jpg': 'Mulher sorrindo numa pausa à beira de um lago, num parque',
    'grupo-caminhada.jpg': 'Quatro amigos caminhando e conversando juntos num parque',
    'grupo-corrida.jpg': 'Três pessoas correm juntas numa calçada arborizada',
    'grupo-yoga-parque.jpg': 'Quatro mulheres fazendo a mesma postura de ioga num parque',
    'caminhada-almoco.jpg': 'Grupo caminhando juntos pela calçada de uma rua',
    'aula-em-casa.jpg': 'Mulher se alongando num tapete na sala, acompanhando uma aula no notebook',
    'grupo-pedal.jpg': 'Grupo de ciclistas numa ciclovia com palmeiras, à luz do fim de tarde',
    'grupo-musculacao.jpg': 'Três mulheres rindo juntas, sentadas no chão de um estúdio de treino',
    'grupo-palco.jpg': 'Dois praticantes conversando numa academia',
    'banner-natural.jpg': 'Mulher correndo em silhueta num parque, com luz dourada de fim de tarde',
    'banner-pausa.jpg': 'Duas pessoas sentadas num parque, com a luz dourada do pôr do sol entre as árvores',
    'banner-programacao.jpg': 'Grupo grande se alongando ao ar livre numa manhã de sol',
    'curitiba-jardim-botanico.jpg': 'Canteiro de flores diante da estufa do Jardim Botânico de Curitiba'
  };

  /* [arquivo, fotógrafo ou null, perfil ou null, página da foto]. Onde o fotógrafo não está confirmado, a página da foto no Unsplash mostra o crédito. */
  const U = 'https://unsplash.com/photos/';
  C.creditos = [
    ['prof-marina.jpg', 'Vitor Monthay', 'https://unsplash.com/@vitormonthay', U + 'kSx-fOlM7M8'],
    ['prof-thiago.jpg', 'Samuel Yongbo Kwon', 'https://unsplash.com/@samuelyongbo', U + 'g3XP8xuzP7U'],
    ['prof-rafael.jpg', 'Frederick Shaw', 'https://unsplash.com/@dropfastcollective', U + 'FL890gGWvzo'],
    ['prof-bianca.jpg', 'Gabriel Martin', 'https://unsplash.com/@diseniatica', U + 'hn2oWbKODUc'],
    ['prof-lucas.jpg', 'Leilani Angel', 'https://unsplash.com/@leilaniangel', U + 'K84vnnzxmTQ'],
    ['prof-camila.jpg', 'Alexander Mass', 'https://unsplash.com/@alexandermassph', U + 'tncfUH8DJ0o'],
    ['historia-juliana.jpg', 'Jahanzeb Ahsan', 'https://unsplash.com/@jahan_photobox', U + '8olR6Wktnpo'],
    ['historia-marcos2.jpg', 'Isaac Quesada', 'https://unsplash.com/@isaacquesada', U + 'u181sbSXBmk'],
    ['historia-renata2.jpg', 'Samuell Morgenstern', 'https://unsplash.com/@photos_muka', U + 'ZTRNS33veBs'],
    ['historia-diego.jpg', 'Alekon pictures', 'https://unsplash.com/@alekonpictures', U + 'rA02te1T2ik'],
    ['historia-aline.jpg', 'Laura D Vargas', 'https://unsplash.com/@laurazarateln', U + 'ItMtZ0mykSY'],
    ['grupo-caminhada.jpg', 'Vitaly Gariev', 'https://unsplash.com/@silverkblack', U + 'ymczKuCuf84'],
    ['grupo-yoga-parque.jpg', 'Vitaly Gariev', 'https://unsplash.com/@silverkblack', U + 'Va7bYm1Wkio'],
    ['grupo-corrida.jpg', null, null, U + 'Lu98ARdCHAs'],
    ['grupo-pedal.jpg', 'Juan Pablo', 'https://unsplash.com/@who0ne', U + 'dwKCeTPa7kI'],
    ['grupo-musculacao.jpg', 'bruce mars', 'https://unsplash.com/@brucemars', U + 'ZXq7xoo98b0'],
    ['grupo-palco.jpg', 'Aiden Craver', 'https://unsplash.com/@slaiden', U + 'tyxBaRMEY-E'],
    ['caminhada-almoco.jpg', null, null, U + 'Bz7-luIGp_w'],
    ['aula-em-casa.jpg', null, null, U + '7Kz3H4p_q64'],
    ['banner-natural.jpg', 'McCarthy Beckan', 'https://unsplash.com/@mccarthybeckan', U + 'a6FHROHuQ9o'],
    ['banner-pausa.jpg', 'Richard Burlton', 'https://unsplash.com/@richardworks', U + 'HRz4ZII02a8'],
    ['banner-programacao.jpg', null, null, U + 'X8wjsidf-EU'],
    ['curitiba-jardim-botanico.jpg', null, null, U + 'fwiUONJkRrM']
  ];
})();
