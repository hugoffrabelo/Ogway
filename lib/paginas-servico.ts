/**
 * Páginas de serviço com intenção de busca local (app/servicos/[slug]).
 *
 * Cada página mira uma busca que hoje não tem dono em Porto Alegre:
 * concorrentes locais têm no máximo uma página genérica ("DPO terceirizado
 * Porto Alegre"), e os de saúde não citam a cidade. Texto original, sem
 * repetir a home — o Google penaliza páginas quase iguais.
 *
 * Atendimento só online (sem visita presencial) — texto de `ATENDIMENTO`.
 * Voz da Ogway sempre na 1ª pessoa do plural.
 */

export type Secao = { titulo: string; paragrafos?: string[]; lista?: string[] }
export type PaginaServico = {
  slug: string
  /** <title> — palavra-chave no começo, até ~60 caracteres */
  titulo: string
  /** meta description — até ~155 caracteres, com a cidade e um verbo */
  descricao: string
  h1: string
  intro: string
  servicoSchema: string
  secoes: Secao[]
  faq: { p: string; r: string }[]
  /** valor do campo "O que você procura" no formulário de contato */
  interesse: string
}

export const ATENDIMENTO =
  'Atendimento online para clínicas de Porto Alegre, da região metropolitana e de todo o Brasil.'

export const PAGINAS: PaginaServico[] = [
  {
    slug: 'dpo-porto-alegre',
    titulo: 'DPO para clínicas em Porto Alegre | Ogway',
    descricao:
      'Encarregado de dados (DPO) terceirizado para clínicas e consultórios em Porto Alegre. Atendimento a pacientes, incidentes e LGPD em dia todo mês.',
    h1: 'DPO para clínicas em Porto Alegre',
    intro:
      'Encarregado de dados terceirizado para clínicas, consultórios e laboratórios. Assumimos o papel de DPO da sua clínica e mantemos a LGPD funcionando no dia a dia, sem você precisar montar uma equipe.',
    servicoSchema: 'Encarregado de proteção de dados (DPO) terceirizado',
    secoes: [
      {
        titulo: 'O que o encarregado faz pela clínica',
        paragrafos: [
          'O encarregado é o canal entre a clínica, os pacientes e a Autoridade Nacional de Proteção de Dados (ANPD). Na prática, é quem responde quando um paciente pede seus dados, quem coordena a resposta a um vazamento e quem orienta a equipe sobre o que pode e o que não pode ser feito com informação de saúde.',
        ],
        lista: [
          'Atender pacientes que pedem acesso, correção, cópia ou exclusão de dados',
          'Coordenar a resposta a incidentes e comunicar a ANPD e os pacientes quando exigido',
          'Manter o inventário de dados e o registro das operações (ROPA) atualizados',
          'Avaliar novos sistemas, fornecedores e campanhas antes de entrarem em uso',
          'Orientar a equipe e responder às dúvidas do dia a dia',
        ],
      },
      {
        titulo: 'Por que terceirizar o DPO',
        paragrafos: [
          'Clínica trata dado de saúde, que é dado sensível, e por isso não deve contar com a dispensa de encarregado prevista para empresas de pequeno porte. Contratar alguém só para essa função raramente faz sentido no tamanho de uma clínica. Terceirizar dá à clínica um especialista dedicado, com custo previsível e sem conflito de interesse com quem toma as decisões do negócio.',
        ],
      },
      {
        titulo: 'Como começa',
        paragrafos: [
          'Se a clínica ainda não passou por uma adequação, começamos por ela. Se já tem documentação, fazemos uma revisão do que existe e assumimos a partir daí. A nomeação é formalizada em termo próprio e o contato do encarregado passa a constar no site e na recepção.',
        ],
      },
    ],
    faq: [
      {
        p: 'O DPO precisa ser alguém de dentro da clínica?',
        r: 'Não. A LGPD permite que o encarregado seja uma pessoa ou empresa externa. O importante é ter autonomia, conhecimento e estar acessível para pacientes e para a ANPD.',
      },
      {
        p: 'Qual a diferença entre DPO e adequação à LGPD?',
        r: 'A adequação é o projeto que coloca a clínica em conformidade. O DPO é a função contínua que mantém essa conformidade depois que o projeto termina.',
      },
      {
        p: 'O encarregado responde pelas multas da clínica?',
        r: 'Não. A responsabilidade perante a ANPD é do controlador, ou seja, da clínica. O papel do encarregado é reduzir o risco de a clínica chegar a esse ponto.',
      },
    ],
    interesse: 'Encarregado contínuo',
  },
  {
    slug: 'adequacao-lgpd-clinicas',
    titulo: 'Adequação à LGPD para clínicas em Porto Alegre | Ogway',
    descricao:
      'Adequação completa à LGPD para clínicas em Porto Alegre: diagnóstico, mapeamento de dados, ROPA, RIPD, políticas, contratos e treinamento da equipe.',
    h1: 'Adequação à LGPD para clínicas em Porto Alegre',
    intro:
      'O programa de privacidade da sua clínica montado do zero, em seis etapas, até a conformidade com a LGPD virar rotina. Pensado para o dia a dia de recepção, prontuário e agenda, não para uma multinacional.',
    servicoSchema: 'Adequação à LGPD para clínicas',
    secoes: [
      {
        titulo: 'As seis etapas da adequação',
        lista: [
          'Entender a clínica: serviços, equipe, sistemas e leis do seu tipo de atendimento',
          'Organizar quem responde: responsabilidades e nomeação do encarregado',
          'Diagnosticar: avaliação contra a LGPD e as resoluções da ANPD, com nível de maturidade',
          'Mapear dados e riscos: inventário, base legal de cada uso, ROPA e, se necessário, RIPD',
          'Implementar: políticas, cláusulas de contrato, controles de segurança e treinamento',
          'Operar e melhorar: atendimento a pacientes, incidentes e revisões periódicas',
        ],
      },
      {
        titulo: 'O que a clínica recebe',
        lista: [
          'Relatório de diagnóstico e plano de ação priorizado pelo risco',
          'Inventário de dados e registro das operações de tratamento (ROPA)',
          'Relatório de impacto à proteção de dados (RIPD) para os tratamentos de alto risco',
          'Política de privacidade, aviso para pacientes e política de segurança da informação',
          'Contratos com fornecedores ajustados e termo de nomeação do encarregado',
          'Equipe treinada e plano de resposta a incidentes',
        ],
      },
      {
        titulo: 'Feito para clínicas',
        paragrafos: [
          'O roteiro é baseado na ABNT NBR ISO/IEC 27701, no NIST Privacy Framework e nos guias da ANPD, mas ajustado ao tamanho de uma clínica: o que importa é o caminho do dado da recepção ao arquivo, o prontuário, o WhatsApp da agenda e os fornecedores que acessam informação de pacientes.',
        ],
      },
    ],
    faq: [
      {
        p: 'Quanto tempo leva a adequação?',
        r: 'Depende do tamanho da clínica e do que já existe. O diagnóstico, na terceira etapa, define o plano com prazos antes de qualquer implementação começar.',
      },
      {
        p: 'Preciso parar o atendimento durante o projeto?',
        r: 'Não. As entrevistas e o mapeamento são marcados nos horários de menor movimento, e as mudanças entram aos poucos.',
      },
      {
        p: 'Depois da adequação, acabou?',
        r: 'A LGPD exige que a conformidade se mantenha. Por isso a última etapa é contínua: pode ficar com a equipe da clínica ou conosco, como encarregado.',
      },
    ],
    interesse: 'Adequação completa',
  },
  {
    slug: 'consultoria-lgpd',
    titulo: 'Consultoria LGPD em Porto Alegre para clínicas | Ogway',
    descricao:
      'Consultoria LGPD em Porto Alegre para clínicas e consultórios: site e cookies, contratos com fornecedores, sistemas e prontuário. Entrega definida desde o início.',
    h1: 'Consultoria LGPD em Porto Alegre para clínicas',
    intro:
      'Quando a clínica tem uma pendência clara, não precisa contratar o programa inteiro. A consultoria resolve uma frente específica, com entrega definida desde o início.',
    servicoSchema: 'Consultoria em LGPD',
    secoes: [
      {
        titulo: 'Site da clínica',
        lista: [
          'Aviso de privacidade publicado e coerente com o que o site realmente coleta',
          'Banner e gestão de cookies conforme o guia orientativo da ANPD',
          'Formulários de contato e agendamento pedindo só o necessário',
          'Ferramentas de análise e pixels de anúncio revisados',
        ],
      },
      {
        titulo: 'Contratos',
        lista: [
          'Cláusulas de proteção de dados com fornecedores que acessam dados de pacientes',
          'Contratos de trabalho, termos de confidencialidade e código de conduta da equipe',
          'Acordos com convênios, laboratórios e outros profissionais que recebem dados',
        ],
      },
      {
        titulo: 'Sistemas',
        lista: [
          'Avaliação do sistema de prontuário e agenda antes ou depois da contratação',
          'Perfis de acesso por função e revisão de quem ainda tem acesso',
          'Verificação de onde os dados ficam armazenados, inclusive fora do Brasil',
        ],
      },
    ],
    faq: [
      {
        p: 'Posso começar pela consultoria e depois fazer a adequação completa?',
        r: 'Pode. Tudo que for feito na consultoria é aproveitado no programa completo.',
      },
      {
        p: 'A revisão de contratos substitui um advogado?',
        r: 'A revisão cobre as cláusulas de proteção de dados. Questões contratuais de outra natureza continuam com o advogado da clínica, com quem podemos trabalhar em conjunto.',
      },
    ],
    interesse: 'Consultoria e adequação parcial',
  },
  {
    slug: 'documentos-lgpd',
    titulo: 'Documentos LGPD para clínicas: política, ROPA e RIPD | Ogway',
    descricao:
      'Política de privacidade, mapeamento de processos, ROPA, RIPD e plano de incidentes feitos sob medida para clínicas em Porto Alegre. Nada de modelo copiado.',
    h1: 'Documentos de LGPD para clínicas',
    intro:
      'Precisa só de um documento? Fazemos sob medida, a partir de como a sua clínica realmente funciona. Documento genérico baixado da internet não protege a clínica e costuma contradizer a prática.',
    servicoSchema: 'Elaboração de documentos de LGPD',
    secoes: [
      {
        titulo: 'Documentos que podemos preparar',
        lista: [
          'Política de privacidade e aviso de privacidade para pacientes',
          'Política de segurança da informação, inclusive em versão simplificada',
          'Mapeamento de processos e registro das operações de tratamento (ROPA)',
          'Relatório de impacto à proteção de dados (RIPD)',
          'Teste de balanceamento para uso de legítimo interesse',
          'Plano de resposta a incidentes de segurança',
          'Termo de nomeação do encarregado',
          'Cláusulas e aditivos de contrato',
          'Material e sessão de treinamento para a equipe',
        ],
      },
      {
        titulo: 'Por que sob medida',
        paragrafos: [
          'Um aviso de privacidade precisa dizer exatamente quais dados a clínica coleta e com quem compartilha. Um ROPA precisa refletir os processos reais. Por isso cada documento começa com uma conversa curta sobre a rotina da clínica.',
        ],
      },
    ],
    faq: [
      {
        p: 'O ROPA é obrigatório?',
        r: 'Sim. O registro das operações de tratamento é exigido pela LGPD (art. 37) e é um dos primeiros documentos que a ANPD pode pedir.',
      },
      {
        p: 'Quando a clínica precisa de um RIPD?',
        r: 'Quando o tratamento pode gerar alto risco aos titulares, o que é comum com dado de saúde. A ANPD também pode solicitá-lo.',
      },
    ],
    interesse: 'Documentos avulsos',
  },
]
