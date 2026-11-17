/* Clipse — conteúdo do protótipo. Perfis, parceiros, histórias e valores são ilustrativos. */
window.CLIPSE = {
  /* p = posição no ciclo lunar (0 nova, .25 crescente, .5 cheia, .75 minguante) */
  fases: {
    nova:      { nome: 'Lua nova',  p: 0,    curta: 'Em pausa',       texto: 'Faz parte do ciclo, e a volta fica guardada para quando der.' },
    crescente: { nome: 'Crescente', p: 0.25, curta: 'Começando ou voltando', texto: 'Um passo pequeno já conta.' },
    cheia:     { nome: 'Lua cheia', p: 0.5,  curta: 'Ativo',          texto: 'Rotina em dia. Você treina e se cuida no seu ritmo.' },
    minguante: { nome: 'Minguante', p: 0.75, curta: 'Desacelerando',  texto: 'Menos tempo ou disposição, e você segue por perto.' }
  },
  ordemFases: ['nova', 'crescente', 'cheia', 'minguante'],

  paginas: [
    { id: 'inicio',          nome: 'Início',               grupo: 'Clipse' },
    { id: 'por-que-natural', nome: 'Por que natural',      grupo: 'Clipse',  linha: 'Motivos, aulas curtas e o guia digital' },
    { id: 'programacao',     nome: 'Programação',          grupo: 'Clipse',  linha: 'O que acontece em cada semana' },
    { id: 'profissionais',   nome: 'Profissionais',        grupo: 'Pessoas', linha: 'Nutricionista, personal e psicólogo' },
    { id: 'comunidade',      nome: 'Comunidade',           grupo: 'Pessoas', linha: 'Grupos opcionais para treinar junto' },
    { id: 'historias',       nome: 'Histórias de retorno', grupo: 'Pessoas', linha: 'Quem parou e voltou conta como foi' },
    { id: 'minha-jornada',   nome: 'Minha jornada',        grupo: 'Você',    linha: 'Seu registro em fases, sem cobrança' },
    { id: 'planos',          nome: 'Planos',               grupo: 'Você',    linha: 'Gratuito, Premium e Diamond' },
    { id: 'curitiba',        nome: 'Curitiba',             grupo: 'Cidade',  linha: 'Parques, academias e clínicas parceiras' },
    { id: 'produtos',        nome: 'Produtos',             grupo: 'Cidade',  linha: 'A vitrine da marca' },
    { id: 'seja-parceiro',   nome: 'Seja parceiro',        grupo: 'Mais',    linha: 'Para academias, profissionais e espaços' },
    { id: 'perguntas',       nome: 'Perguntas frequentes', grupo: 'Mais',    linha: 'O que a Clipse é e o que não promete' },
    { id: 'sobre',           nome: 'Sobre',                grupo: 'Mais',    linha: 'De onde vem o nome e o projeto' }
  ],

  motivos: [
    { t: 'Seu corpo continua seu', d: 'Sem ciclo e sem depender de substância para manter o que você conquistou. O resultado fica porque é você quem sustenta.' },
    { t: 'Saúde que dura décadas', d: 'Coração, fígado e hormônios trabalhando do jeito deles. Treinar natural é cuidar de quem você vai ser aos 50, 60, 70.' },
    { t: 'O tempo entra na conta', d: 'Meses e anos fazem parte do resultado. Quem aceita o prazo real para de se sentir atrasado.' },
    { t: 'Evolução que você reconhece', d: 'Ela vem devagar e vem inteira: força, disposição, sono, humor. Dá para acompanhar sem susto.' },
    { t: 'Tem gente no mesmo caminho', d: 'Ser natural também é pertencer. Aqui você encontra quem treina, pausa e volta sem atalho.' }
  ],

  riscos: [
    { t: 'Coração e circulação', d: 'Pressão alta, colesterol alterado, aumento do músculo do coração e risco maior de infarto e trombose.' },
    { t: 'Hormônios', d: 'O corpo reduz a própria produção de testosterona. Pode haver infertilidade, e em alguns casos a queda não se reverte depois de parar.' },
    { t: 'Fígado', d: 'Enzimas alteradas e lesões no fígado, principalmente com as versões em comprimido.' },
    { t: 'Cabeça', d: 'Irritabilidade, ansiedade, oscilação de humor e dependência.' },
    { t: 'Pele e corpo', d: 'Acne, queda de cabelo e estrias. Em mulheres, mudanças na voz e nos pelos que podem ser permanentes.' },
    { t: 'Procedência', d: 'Boa parte do que circula é clandestina, sem controle de dose nem de pureza.' }
  ],

  aulas: [
    { id: 'a1', t: 'O que é ser natural, afinal', min: 4, por: 'Marina Kowalski', papel: 'nutricionista', plano: 'gratuito',
      resumo: ['Natural é um caminho, e cada pessoa anda nele no próprio ritmo.', 'O que fica de fora: hormônios, anabolizantes e canetas usados por estética.', 'Por que tratamento médico não entra nessa conta.'] },
    { id: 'a2', t: 'Tempo também é resultado', min: 5, por: 'Lucas Hartmann', papel: 'psicólogo', plano: 'gratuito',
      resumo: ['De onde vem a pressa por resultado.', 'Como medir evolução em meses, não em dias.', 'Um exercício simples para ajustar a expectativa.'] },
    { id: 'a3', t: 'Hormônios: o que o antes e depois não mostra', min: 7, por: 'Helena Prado', papel: 'médica do esporte convidada', plano: 'gratuito',
      resumo: ['O que acontece no corpo durante e depois do uso.', 'Por que não existe dose segura para estética.', 'Onde buscar ajuda para parar com segurança.'] },
    { id: 'a4', t: 'Voltando depois de uma pausa', min: 5, por: 'Rafael Antunes', papel: 'personal trainer', plano: 'gratuito',
      resumo: ['Por que a volta pesa mais na cabeça do que no corpo.', 'Comece com metade do que você fazia antes.', 'Duas semanas para o corpo lembrar.'] },
    { id: 'a5', t: 'Rotina puxada: o mínimo que mantém você por perto', min: 6, por: 'Bianca Stresser', papel: 'personal trainer', plano: 'premium',
      resumo: ['Treinos de 20 minutos que funcionam.', 'Como encaixar movimento em semana cheia.', 'O que priorizar quando só dá para fazer uma coisa.'] },
    { id: 'a6', t: 'Comer bem sem dieta de revista', min: 6, por: 'Thiago Nogueira', papel: 'nutricionista', plano: 'premium',
      resumo: ['Prato do dia a dia que sustenta treino.', 'Proteína sem neurose e sem pote de suplemento obrigatório.', 'Fim de semana também faz parte do plano.'] },
    { id: 'a7', t: 'Com quem você está se comparando?', min: 5, por: 'Camila Ferraz', papel: 'psicóloga', plano: 'premium',
      resumo: ['A comparação com as redes e com o seu eu de antes.', 'Fotos antigas: memória ou cobrança?', 'Como trocar comparação por referência.'] },
    { id: 'a8', t: 'Treinar para os próximos 30 anos', min: 6, por: 'Rafael Antunes', papel: 'personal trainer', plano: 'premium',
      resumo: ['Força, mobilidade e fôlego como poupança.', 'O que muda no treino a cada década.', 'Por que constância rende mais que intensidade.'] }
  ],

  guia: [
    { t: 'Introdução', min: 3, d: 'O que é a Clipse, para quem ela existe e como usar este guia. Dá para ler na ordem ou ir direto ao capítulo que faz sentido para a sua fase.' },
    { t: 'Motivos para se manter natural', min: 6, d: 'Saúde no longo prazo, autonomia sobre o próprio corpo e um resultado que não depende de ciclo. Cada motivo vem com um exemplo do dia a dia.' },
    { t: 'O lado negativo do uso de hormônios', min: 8, d: 'O que o uso por estética faz com coração, fígado, hormônios e humor, e por que não existe dose segura para esse fim. Inclui onde procurar ajuda para parar.' },
    { t: 'Atividade física numa rotina puxada', min: 7, d: 'Como manter o corpo em movimento quando trabalho, estudo e família ocupam a semana. Treinos curtos, prioridades e o mínimo que já vale.' },
    { t: 'Como voltar depois de uma pausa, sem pesar', min: 6, d: 'Uns dias ou uns meses parados não apagam o que você construiu. Um roteiro de duas semanas para retomar sem se comparar com o ritmo de antes.' }
  ],

  semana: [
    { id: 'e1', dia: 'Segunda', hora: '7h',     t: 'Aula da semana',                  tipo: 'Aula',       onde: 'No site',                         plano: 'gratuito', d: 'Um vídeo curto novo, toda segunda.' },
    { id: 'e2', dia: 'Terça',   hora: '19h30',  t: 'Pedal aberto no Estúdio Órbita',  tipo: 'Presencial', onde: 'Batel',                           plano: 'premium',  d: 'Aula de bike em ritmo leve, com vaga para quem está voltando.' },
    { id: 'e3', dia: 'Quarta',  hora: '12h15',  t: 'Pergunte à nutri',                tipo: 'Ao vivo',    onde: 'Online, 20 minutos',              plano: 'premium',  d: 'Dúvidas de alimentação respondidas na hora do almoço.' },
    { id: 'e4', dia: 'Quinta',  hora: '6h30',   t: 'Corrida leve no Barigui',         tipo: 'Presencial', onde: 'Parque Barigui',                  plano: 'gratuito', d: 'Trote e caminhada. Ninguém fica para trás.' },
    { id: 'e5', dia: 'Sexta',   hora: '18h',    t: 'Leitura da semana',               tipo: 'Leitura',    onde: 'Guia digital',                    plano: 'gratuito', d: 'Um capítulo do guia ligado ao tema da semana.' },
    { id: 'e6', dia: 'Sábado',  hora: '8h30',   t: 'Encontro no parque',              tipo: 'Presencial', onde: 'Barigui, São Lourenço ou Botânico', plano: 'gratuito', d: 'O parque reveza a cada sábado.' },
    { id: 'e7', dia: 'Domingo', hora: 'Livre',  t: 'Check-in da semana',              tipo: 'Jornada',    onde: 'Na sua jornada',                  plano: 'gratuito', d: 'Cinco minutos para olhar a semana, sem nota.' }
  ],

  temas: [
    { t: 'Começar pequeno', d: 'O primeiro passo cabe em 20 minutos.' },
    { t: 'Comer sem culpa', d: 'Comida de verdade, sem lista de proibidos.' },
    { t: 'Rotina puxada',   d: 'O que manter quando a semana aperta.' },
    { t: 'Voltar sem pesar', d: 'Retomar do ponto em que você está hoje.' }
  ],

  mensais: [
    { id: 'm1', quando: 'Primeira quarta do mês, 20h', t: 'Aula geral com psicólogo', onde: 'Online', plano: 'premium', d: 'Comparação, cobrança e constância. Aula aberta, sem atendimento individual.' },
    { id: 'm2', quando: 'Último sábado do mês, 9h',   t: 'Encontro de volta',        onde: 'Parque Barigui', plano: 'gratuito', d: 'Para quem está saindo da Lua nova e quer companhia no primeiro treino.' },
    { id: 'm3', quando: 'Uma vez por mês, com hora marcada', t: 'Revisão com nutri e personal', onde: 'Online ou presencial', plano: 'diamond', d: 'Ajuste do plano alimentar e do treino para a fase em que você está.' }
  ],

  profissionais: [
    { id: 'pr1', nome: 'Marina Kowalski', area: 'Nutrição',   papel: 'Nutricionista',           foco: 'Comida de verdade para rotina corrida', onde: 'Batel e online',
      bio: 'Atende quem quer comer melhor sem viver de planilha. Trabalha com rotina real: marmita, restaurante por quilo, fim de semana.', como: 'Conduz o Pergunte à nutri às quartas. No Diamond, monta o plano alimentar e revisa uma vez por mês.' },
    { id: 'pr2', nome: 'Thiago Nogueira', area: 'Nutrição',   papel: 'Nutricionista esportivo', foco: 'Alimentação para treinar sem atalho', onde: 'Água Verde e online',
      bio: 'Acompanha praticantes de musculação e atletas da categoria natural. Defende suplemento só quando faz falta de verdade.', como: 'Grava aulas da trilha Premium. No Diamond, ajusta a alimentação conforme a fase da sua lua.' },
    { id: 'pr3', nome: 'Rafael Antunes',  area: 'Treino',     papel: 'Personal trainer',        foco: 'Musculação para quem está voltando', onde: 'Água Verde e online',
      bio: 'Especialista em retomada. Monta treinos curtos que respeitam o ponto em que o corpo está hoje.', como: 'Assina as aulas de retorno. No Diamond, monta o treino e muda a carga quando sua fase muda.' },
    { id: 'pr4', nome: 'Bianca Stresser', area: 'Treino',     papel: 'Personal trainer',        foco: 'Corrida do zero e treino em pouco tempo', onde: 'Parque Barigui',
      bio: 'Corre com iniciantes há anos. Acredita em alternar trote e caminhada até a corrida virar hábito.', como: 'Puxa a corrida leve de quinta. No Diamond, monta planilha de corrida sem meta de pace obrigatória.' },
    { id: 'pr5', nome: 'Lucas Hartmann',  area: 'Psicologia', papel: 'Psicólogo',               foco: 'Pressa, cobrança e constância', onde: 'Online',
      bio: 'Estuda a relação entre imediatismo e abandono de hábitos. Fala de expectativa com exemplos de academia.', como: 'Dá a aula geral mensal do Premium. As aulas são coletivas e não substituem terapia.' },
    { id: 'pr6', nome: 'Camila Ferraz',   area: 'Psicologia', papel: 'Psicóloga',               foco: 'Imagem corporal e comparação', onde: 'Online',
      bio: 'Trabalha com imagem corporal e a comparação com o próprio passado. Ajuda a olhar foto antiga sem virar cobrança.', como: 'Alterna a aula geral mensal com o Lucas. As aulas são coletivas e não substituem terapia.' }
  ],

  planos: [
    { id: 'gratuito', nome: 'Gratuito', linha: 'Para conhecer e começar.', valor: 'R$ 0', periodo: '',
      itens: ['Guia digital completo', 'Aulas introdutórias', 'Mapa de Curitiba e encontros abertos', 'Minha jornada com fase, check-in e objetivos'] },
    { id: 'premium', nome: 'Premium', linha: 'Para manter o ritmo com companhia.', valor: 'R$ 29,90', periodo: 'por mês',
      itens: ['Tudo do Gratuito', 'Todas as aulas e a programação completa', 'Comunidade e grupos', 'Jornada completa: ciclo, diário e voltas', 'Descontos nos parceiros', 'Aula geral mensal com psicólogo'] },
    { id: 'diamond', nome: 'Diamond', linha: 'Para quem quer acompanhamento de perto.', valor: 'R$ 189', periodo: 'por mês',
      itens: ['Tudo do Premium', 'Nutricionista: plano alimentar e revisão mensal', 'Personal trainer: treino montado para a sua fase', 'Canal direto com os dois profissionais', 'Prioridade nos encontros com vagas'] }
  ],

  comparativo: [
    ['Guia digital', true, true, true],
    ['Aulas introdutórias', true, true, true],
    ['Mapa e encontros abertos em Curitiba', true, true, true],
    ['Jornada: fase, check-in e objetivos', true, true, true],
    ['Todas as aulas', false, true, true],
    ['Programação completa', false, true, true],
    ['Comunidade e grupos', false, true, true],
    ['Jornada: ciclo de 28 dias, diário e voltas', false, true, true],
    ['Descontos nos parceiros', false, true, true],
    ['Aula geral mensal com psicólogo', false, true, true],
    ['Nutricionista com revisão mensal', false, false, true],
    ['Personal trainer com treino por fase', false, false, true]
  ],

  /* x,y em um mapa esquemático de 320 x 300, Centro em (160,160), norte para cima */
  locais: [
    { id: 'l1',  nome: 'Encontro no Barigui',    cat: 'parque',   bairro: 'Parque Barigui',       x: 92,  y: 142, beneficio: 'Gratuito e aberto', d: 'Caminhada e corrida leve aos sábados, 8h30. Ponto de encontro no portal da BR.' },
    { id: 'l2',  nome: 'Yoga no São Lourenço',   cat: 'parque',   bairro: 'Parque São Lourenço',  x: 166, y: 66,  beneficio: 'Gratuito e aberto', d: 'Prática ao ar livre aos domingos, 9h. Leve seu tapete.' },
    { id: 'l3',  nome: 'Caminhada do Botânico',  cat: 'parque',   bairro: 'Jardim Botânico',      x: 222, y: 176, beneficio: 'Gratuito e aberto', d: 'Volta em ritmo de conversa às quartas, 7h.' },
    { id: 'l4',  nome: 'Corre Tingui',           cat: 'corrida',  bairro: 'Parque Tingui',        x: 104, y: 84,  beneficio: 'Grupo gratuito',    d: 'Terças e quintas, 6h30. Trote e caminhada alternados.' },
    { id: 'l5',  nome: 'Pista do Bacacheri',     cat: 'corrida',  bairro: 'Parque Bacacheri',     x: 226, y: 80,  beneficio: 'Grupo gratuito',    d: 'Sábados, 7h. Feito para iniciantes e para quem está voltando.' },
    { id: 'l6',  nome: 'Barras na Praça do Japão', cat: 'parque', bairro: 'Água Verde',           x: 138, y: 192, beneficio: 'Gratuito e aberto', d: 'Treino com peso do corpo às segundas, 18h30.' },
    { id: 'l7',  nome: 'Estúdio Órbita',         cat: 'academia', bairro: 'Batel',                x: 128, y: 168, beneficio: '15% para membros Premium', d: 'Estúdio de bike indoor. Recebe o pedal aberto de terça.' },
    { id: 'l8',  nome: 'Academia Alvorada',      cat: 'academia', bairro: 'Portão',               x: 122, y: 226, beneficio: 'Matrícula isenta e avaliação inicial', d: 'Musculação com professores alinhados ao método Clipse.' },
    { id: 'l9',  nome: 'Casa Prana',             cat: 'academia', bairro: 'Juvevê',               x: 186, y: 118, beneficio: 'Primeira aula gratuita', d: 'Yoga e mobilidade em turmas pequenas.' },
    { id: 'l10', nome: 'Fisio Movimento',        cat: 'saude',    bairro: 'Cabral',               x: 196, y: 98,  beneficio: '20% na avaliação postural', d: 'Fisioterapia para quem volta de lesão ou de muito tempo parado.' },
    { id: 'l11', nome: 'Clínica Passo Certo',    cat: 'saude',    bairro: 'Alto da XV',           x: 204, y: 146, beneficio: '10% para membros Premium', d: 'Fisioterapia esportiva e medicina do esporte.' }
  ],
  categoriasLocal: { parque: 'Parques e encontros', corrida: 'Corrida', academia: 'Academias e estúdios', saude: 'Fisioterapia e clínicas' },
  bairrosMapa: [
    { t: 'Centro', x: 164, y: 163 }, { t: 'Santa Felicidade', x: 54, y: 118 }, { t: 'Bairro Alto', x: 272, y: 124 },
    { t: 'Boqueirão', x: 232, y: 256 }, { t: 'Pinheirinho', x: 136, y: 284 }
  ],

  grupos: [
    { id: 'g1', nome: 'Corrida leve Barigui',        ativ: 'Corrida',     regiao: 'Parque Barigui',  quando: 'Terça e quinta, 6h30',        ritmo: 'Leve',     gente: 42, voltando: 9,  d: 'Trote e caminhada alternados. Quem tem constância acompanha quem está voltando.' },
    { id: 'g2', nome: 'Musculação sem pressa',       ativ: 'Academia',    regiao: 'Água Verde',      quando: 'Segunda, quarta e sexta, 19h', ritmo: 'Moderado', gente: 28, voltando: 6,  d: 'Treino junto na Academia Alvorada. Cada pessoa com a sua carga.' },
    { id: 'g3', nome: 'Yoga de domingo',             ativ: 'Yoga',        regiao: 'São Lourenço',    quando: 'Domingo, 9h',                 ritmo: 'Leve',     gente: 35, voltando: 11, d: 'Prática ao ar livre e café depois, para quem quiser.' },
    { id: 'g4', nome: 'Pedal de sábado',             ativ: 'Ciclismo',    regiao: 'Centro Cívico',   quando: 'Sábado, 7h30',                ritmo: 'Moderado', gente: 19, voltando: 4,  d: 'Vinte quilômetros pela ciclovia, com parada no meio.' },
    { id: 'g5', nome: 'Caminhada do almoço',         ativ: 'Caminhada',   regiao: 'Centro',          quando: 'Segunda a sexta, 12h15',      ritmo: 'Leve',     gente: 23, voltando: 8,  d: 'Trinta minutos em volta do Passeio Público. Vai de roupa de trabalho mesmo.' },
    { id: 'g6', nome: 'Treino em casa, juntos',      ativ: 'Online',      regiao: 'Online',          quando: 'Terça e quinta, 20h',         ritmo: 'Leve',     gente: 51, voltando: 17, d: 'Chamada de vídeo com câmera opcional. Vinte e cinco minutos e pronto.' },
    { id: 'g7', nome: 'Natural no palco',            ativ: 'Fisiculturismo natural', regiao: 'Portão', quando: 'Um encontro por mês',        ritmo: 'Moderado', gente: 14, voltando: 2,  d: 'Atletas e curiosos da categoria natural trocam treino, dieta e bastidor de campeonato.' }
  ],

  historias: [
    { quem: 'Juliana, 29 anos, Água Verde', de: 'nova', para: 'cheia', pausa: 'Cinco meses parada',
      t: 'Parei de olhar a foto de 2023', d: 'Troquei de emprego e a academia sumiu da agenda. Toda vez que eu pensava em voltar, abria uma foto antiga e desistia. Voltei com dois treinos de meia hora por semana. Levou uns três meses para eu me sentir em casa de novo.' },
    { quem: 'Marcos, 34 anos, Portão', de: 'nova', para: 'minguante', pausa: 'Oito meses parado',
      t: 'Voltei empurrando um carrinho', d: 'Meu filho nasceu e eu fiquei oito meses sem treinar. A volta foi caminhando com ele no Barigui. Hoje treino menos do que antes de ser pai, e pela primeira vez isso não me incomoda.' },
    { quem: 'Renata, 41 anos, Cabral', de: 'nova', para: 'crescente', pausa: 'Um ano parada',
      t: 'O medo era maior que a lesão', d: 'Machuquei o joelho e fiquei um ano com receio de qualquer exercício. A fisioterapeuta liberou caminhada e eu entrei no grupo do almoço. Ainda estou no começo, e tudo bem estar no começo.' },
    { quem: 'Diego, 24 anos, Centro', de: 'crescente', para: 'cheia', pausa: 'Quase pegou um atalho',
      t: 'Eu ia começar um ciclo', d: 'Com seis meses de treino eu já queria o corpo de quem treina há seis anos. Estava com tudo cotado. Assisti à aula sobre hormônios, conversei com a nutri e decidi dar mais tempo. Faz um ano e meio, e eu fico feliz de ter esperado.' },
    { quem: 'Aline, 37 anos, Santa Felicidade', de: 'minguante', para: 'crescente', pausa: 'Vai e volta há anos',
      t: 'Nunca me achei fitness', d: 'Eu treino, falto muito e como mal em semana corrida. Sempre achei que isso não era para mim. Aqui ninguém me cobrou perfeição, e registrar as minhas voltas me mostrou que eu nunca parei de verdade.' }
  ],

  perguntas: [
    { p: 'O que a Clipse chama de natural?', r: 'Cuidar do corpo sem hormônios, anabolizantes ou canetas emagrecedoras usados só por estética ou desempenho. Vale para quem compete no fisiculturismo natural e para quem treina, corre ou faz yoga para se sentir bem.' },
    { p: 'Uso hormônio ou medicamento com prescrição. Posso participar?', r: 'Pode. Tratamento indicado e acompanhado por médico é cuidado com a saúde. Siga sempre a orientação de quem acompanha você.' },
    { p: 'A Clipse promete resultado?', r: 'Não. A Clipse não promete corpo, prazo nem número na balança. Ela oferece conteúdo, profissionais e companhia para você seguir no seu tempo.' },
    { p: 'Preciso treinar todo dia?', r: 'Não. Você define o ritmo. A jornada não tem sequência obrigatória de dias nem ranking.' },
    { p: 'O que acontece se eu parar?', r: 'Você muda para a Lua nova e a sua jornada continua guardada. Quando voltar, a volta fica registrada como um marco.' },
    { p: 'Como funcionam as fases da lua?', r: 'São quatro: Lua cheia para quem está ativo, Minguante para quem está desacelerando, Lua nova para quem está em pausa e Crescente para quem está começando ou voltando. Você escolhe a sua e troca quando quiser.' },
    { p: 'Sou obrigado a entrar em grupos?', r: 'Não. A comunidade é opcional. Dá para usar a Clipse só com as aulas, os profissionais e a sua própria rotina.' },
    { p: 'É só para quem faz musculação?', r: 'Não. A Clipse nasceu do fisiculturismo natural e é aberta a qualquer atividade: academia, corrida, yoga, caminhada, pedal.' },
    { p: 'Quem são os profissionais?', r: 'Nutricionistas, personal trainers e psicólogos. Os psicólogos dão aulas gerais mensais, que são coletivas e não substituem terapia.' },
    { p: 'Onde a Clipse funciona?', r: 'O piloto é em Curitiba, com parques, academias e clínicas parceiras. As aulas e parte da programação são online.' },
    { p: 'O conteúdo substitui médico, nutricionista ou psicólogo?', r: 'Não. O conteúdo é informativo. Para decisões sobre a sua saúde, procure um profissional.' },
    { p: 'Onde ficam os meus dados neste protótipo?', r: 'O login é simulado. O que você registra na jornada fica salvo só neste navegador e pode ser apagado a qualquer momento na aba Rede, em Conta.' }
  ],

  produtosExemplo: [
    { id: 'p1', nome: 'Camiseta Fases',          categoria: 'Roupas',     valor: 89.9,  descricao: 'Algodão, modelagem solta. As quatro fases nas costas.', ordem: 1 },
    { id: 'p2', nome: 'Moletom Lua Nova',        categoria: 'Roupas',     valor: 199,   descricao: 'Para os dias de pausa e para os de volta.', ordem: 2 },
    { id: 'p3', nome: 'Garrafa Lua Cheia 750 ml', categoria: 'Acessórios', valor: 69.9,  descricao: 'Inox, com tampa de rosca e alça.', ordem: 3 },
    { id: 'p4', nome: 'Boné Crescente',          categoria: 'Acessórios', valor: 79.9,  descricao: 'Aba curva, ajuste traseiro.', ordem: 4 },
    { id: 'p5', nome: 'Toalha de treino',        categoria: 'Treino',     valor: 49.9,  descricao: 'Microfibra, seca rápido, cabe na mochila.', ordem: 5 },
    { id: 'p6', nome: 'Meia cano médio, par',    categoria: 'Roupas',     valor: 34.9,  descricao: 'Reforço no calcanhar e na ponta.', ordem: 6 },
    { id: 'p7', nome: 'Ecobag Clipse',           categoria: 'Acessórios', valor: 44.9,  descricao: 'Lona crua, alça longa.', ordem: 7 }
  ],
  categoriasProduto: ['Roupas', 'Acessórios', 'Treino', 'Outros']
};
