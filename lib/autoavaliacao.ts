/**
 * Autoavaliação inicial de privacidade para clínicas.
 *
 * Perguntas escritas em linguagem de recepção, não de norma. Cada uma aponta
 * para o controle da ABNT NBR ISO/IEC 27701:2019 que a inspirou (seções 6 e
 * 7, visão do controlador) e para o artigo da LGPD correspondente — `ref`
 * aparece no relatório enviado ao encarregado, não para o visitante. O texto
 * da norma não é reproduzido aqui (direito autoral da ABNT/ISO).
 *
 * O visitante vê só o nível, a nota por área e quantas lacunas existem —
 * nunca o que fazer para resolver (isso é o diagnóstico pago, etapa 3). As
 * respostas detalhadas, com `ref` e `prioridade`, vão só no relatório do
 * lead enviado ao encarregado.
 */

export type Resposta = 'sim' | 'parcial' | 'nao' | 'naosei'

export const OPCOES: { valor: Resposta; rotulo: string; pontos: number }[] = [
  { valor: 'sim', rotulo: 'Sim', pontos: 2 },
  { valor: 'parcial', rotulo: 'Em parte', pontos: 1 },
  { valor: 'nao', rotulo: 'Não', pontos: 0 },
  { valor: 'naosei', rotulo: 'Não sei', pontos: 0 },
]

export type Pergunta = {
  id: string
  texto: string
  ajuda: string
  /** controle ISO 27701 · artigo LGPD — só no relatório interno */
  ref: string
  /** 3 = exigência direta da lei ou risco alto — usado na triagem do lead */
  prioridade: 1 | 2 | 3
}

export type Area = { id: string; nome: string; descricao: string; perguntas: Pergunta[] }

export const AREAS: Area[] = [
  {
    id: 'governanca',
    nome: 'Quem responde pela privacidade',
    descricao: 'Regras escritas e pessoas com papel definido.',
    perguntas: [
      {
        id: 'encarregado',
        texto: 'A clínica tem um encarregado (DPO) nomeado e o contato dele está publicado para os pacientes?',
        ajuda: 'Pode ser alguém da equipe ou um serviço externo. O contato costuma ficar no site e na recepção.',
        ref: 'ISO 27701 6.3.1.1 · LGPD art. 41',
        prioridade: 3,
      },
      {
        id: 'politica-interna',
        texto: 'Existe uma política interna de proteção de dados, aprovada pela direção e conhecida pela equipe?',
        ajuda: 'Um documento que diz como a clínica trata dados de pacientes e funcionários.',
        ref: 'ISO 27701 6.2.1.1 · LGPD art. 50',
        prioridade: 2,
      },
      {
        id: 'responsabilidades',
        texto: 'Está claro quem decide sobre os dados em cada área (recepção, clínico, financeiro, marketing)?',
        ajuda: 'Por exemplo: quem autoriza dar acesso ao sistema, quem responde se um paciente pede seus dados.',
        ref: 'ISO 27701 6.3.1.1 · LGPD art. 50',
        prioridade: 1,
      },
    ],
  },
  {
    id: 'dados',
    nome: 'Conhecimento dos dados',
    descricao: 'Saber o que coleta, para quê e com qual base legal.',
    perguntas: [
      {
        id: 'inventario',
        texto: 'A clínica tem uma lista de quais dados coleta, onde guarda e para que usa cada um?',
        ajuda: 'Inclui ficha de cadastro, prontuário, exames, agenda, WhatsApp, planilhas e notas fiscais.',
        ref: 'ISO 27701 7.2.1 · LGPD art. 6º, I',
        prioridade: 3,
      },
      {
        id: 'base-legal',
        texto: 'Para cada uso de dados está definida a base legal (por que a lei permite aquele uso)?',
        ajuda: 'Ex.: tutela da saúde para o atendimento, obrigação legal para o prontuário, consentimento para marketing.',
        ref: 'ISO 27701 7.2.2 · LGPD arts. 7º e 11',
        prioridade: 3,
      },
      {
        id: 'ropa',
        texto: 'Existe um registro das operações de tratamento (ROPA) e ele foi atualizado no último ano?',
        ajuda: 'É o documento que a ANPD pode pedir para ver. Planilha bem feita já serve.',
        ref: 'ISO 27701 7.2.8 · LGPD art. 37',
        prioridade: 3,
      },
      {
        id: 'ripd',
        texto: 'A clínica já avaliou os riscos aos pacientes e tem um relatório de impacto (RIPD) para os tratamentos mais sensíveis?',
        ajuda: 'Dado de saúde é sensível. O RIPD documenta os riscos e o que a clínica faz para reduzi-los.',
        ref: 'ISO 27701 7.2.5 · LGPD arts. 5º, XVII e 38',
        prioridade: 2,
      },
    ],
  },
  {
    id: 'pacientes',
    nome: 'Transparência com o paciente',
    descricao: 'Informar e atender os direitos de quem é atendido.',
    perguntas: [
      {
        id: 'aviso',
        texto: 'Os pacientes recebem ou encontram com facilidade um aviso de privacidade (no site, na recepção ou no cadastro)?',
        ajuda: 'Explica quais dados a clínica usa, para quê, com quem compartilha e como o paciente exerce seus direitos.',
        ref: 'ISO 27701 7.3.2 e 7.3.3 · LGPD art. 9º',
        prioridade: 3,
      },
      {
        id: 'direitos',
        texto: 'Se um paciente pedir cópia, correção ou exclusão dos seus dados, a clínica sabe como e em quanto tempo responder?',
        ajuda: 'Inclui confirmar a identidade de quem pede e registrar o pedido e a resposta.',
        ref: 'ISO 27701 7.3.6, 7.3.8 e 7.3.9 · LGPD arts. 18 e 19',
        prioridade: 3,
      },
      {
        id: 'consentimento',
        texto: 'Quando a clínica usa consentimento (fotos de antes e depois, marketing, pesquisa), ele é registrado e pode ser retirado?',
        ajuda: 'Consentimento vale só se for específico, registrado e tão fácil de retirar quanto de dar.',
        ref: 'ISO 27701 7.2.3, 7.2.4 e 7.3.4 · LGPD art. 8º',
        prioridade: 2,
      },
    ],
  },
  {
    id: 'ciclo',
    nome: 'Coleta mínima e descarte',
    descricao: 'Pegar só o necessário e guardar pelo tempo certo.',
    perguntas: [
      {
        id: 'minimizacao',
        texto: 'Os formulários e fichas pedem só os dados de que a clínica realmente precisa?',
        ajuda: 'Ex.: pedir CPF ou religião sem necessidade aumenta risco sem trazer benefício.',
        ref: 'ISO 27701 7.4.1 e 7.4.4 · LGPD art. 6º, III',
        prioridade: 1,
      },
      {
        id: 'retencao',
        texto: 'Está definido por quanto tempo cada tipo de dado é guardado e como é descartado com segurança?',
        ajuda: 'O prontuário tem prazo mínimo de guarda em lei; outros dados (currículos, orçamentos) não precisam ficar para sempre.',
        ref: 'ISO 27701 7.4.7 e 7.4.8 · LGPD arts. 15 e 16',
        prioridade: 2,
      },
      {
        id: 'copias',
        texto: 'Cópias soltas (fotos de documentos no celular, exames no WhatsApp, planilhas em pen drive) são controladas?',
        ajuda: 'É onde a maioria dos vazamentos em clínicas começa.',
        ref: 'ISO 27701 7.4.6 e 7.4.9 · LGPD art. 46',
        prioridade: 2,
      },
    ],
  },
  {
    id: 'terceiros',
    nome: 'Fornecedores e compartilhamento',
    descricao: 'Quem mais toca nos dados e em que condições.',
    perguntas: [
      {
        id: 'contratos',
        texto: 'Os contratos com fornecedores que acessam dados (sistema de prontuário, laboratório, contabilidade, TI) têm cláusulas de proteção de dados?',
        ajuda: 'O fornecedor é operador: só pode usar os dados conforme as instruções da clínica.',
        ref: 'ISO 27701 7.2.6 · LGPD arts. 39 e 42',
        prioridade: 3,
      },
      {
        id: 'compartilhamento',
        texto: 'A clínica sabe com quem compartilha dados de pacientes (convênios, laboratórios, outros profissionais) e registra isso?',
        ajuda: 'Compartilhar dado de saúde para obter vantagem econômica tem restrições específicas na LGPD.',
        ref: 'ISO 27701 7.5.3 e 7.5.4 · LGPD art. 11, §4º',
        prioridade: 2,
      },
      {
        id: 'exterior',
        texto: 'A clínica sabe se algum sistema guarda dados fora do Brasil (nuvem, e-mail, agenda online)?',
        ajuda: 'Muitos sistemas usam servidores no exterior. Isso é transferência internacional e tem regras próprias.',
        ref: 'ISO 27701 7.5.1 e 7.5.2 · LGPD art. 33',
        prioridade: 1,
      },
    ],
  },
  {
    id: 'seguranca',
    nome: 'Segurança e incidentes',
    descricao: 'Proteger os dados e saber agir quando algo dá errado.',
    perguntas: [
      {
        id: 'acesso',
        texto: 'Cada pessoa usa login próprio nos sistemas e só vê o que precisa para a sua função?',
        ajuda: 'Senha compartilhada na recepção impede saber quem acessou o quê.',
        ref: 'ISO 27701 6.6.2.1 e 6.6.2.2 · LGPD art. 46',
        prioridade: 3,
      },
      {
        id: 'backup',
        texto: 'Há cópia de segurança dos dados e alguém já testou se ela realmente restaura?',
        ajuda: 'Backup que nunca foi testado costuma falhar justamente quando é preciso.',
        ref: 'ISO 27701 6.9.3.1 · LGPD art. 46',
        prioridade: 2,
      },
      {
        id: 'treinamento',
        texto: 'A equipe recebeu orientação sobre proteção de dados nos últimos 12 meses?',
        ajuda: 'Golpes por WhatsApp e e-mail miram a recepção primeiro.',
        ref: 'ISO 27701 6.4.2.2 · LGPD art. 50, §2º',
        prioridade: 2,
      },
      {
        id: 'incidentes',
        texto: 'Se houver um vazamento, a clínica sabe quem avisar, o que fazer e em que prazo comunicar a ANPD e os pacientes?',
        ajuda: 'A comunicação tem prazo definido em resolução da ANPD quando há risco relevante aos titulares.',
        ref: 'ISO 27701 6.13.1 · LGPD art. 48 · Res. CD/ANPD nº 15/2024',
        prioridade: 3,
      },
    ],
  },
]

export const TOTAL_PERGUNTAS = AREAS.reduce((n, a) => n + a.perguntas.length, 0)

export const NIVEIS = [
  { min: 0, nome: 'Inicial', texto: 'A proteção de dados ainda depende de boa vontade, não de processo. O risco está mais na falta de registro do que na má intenção.' },
  { min: 25, nome: 'Em construção', texto: 'Algumas peças existem, mas soltas. Falta conectar documentos, pessoas e rotina.' },
  { min: 50, nome: 'Estruturado', texto: 'A base está montada. O desafio agora é manter tudo atualizado e provar isso quando pedirem.' },
  { min: 75, nome: 'Avançado', texto: 'A clínica está bem posicionada. O ganho vem de revisar periodicamente e tratar as exceções.' },
]

export type Respostas = Record<string, Resposta>

const pontosDe = (r?: Resposta) => OPCOES.find((o) => o.valor === r)?.pontos ?? 0

export function calcular(respostas: Respostas) {
  const areas = AREAS.map((a) => {
    const max = a.perguntas.length * 2
    const obtidos = a.perguntas.reduce((n, p) => n + pontosDe(respostas[p.id]), 0)
    return { id: a.id, nome: a.nome, pct: Math.round((obtidos / max) * 100) }
  })
  const max = TOTAL_PERGUNTAS * 2
  const obtidos = AREAS.flatMap((a) => a.perguntas).reduce((n, p) => n + pontosDe(respostas[p.id]), 0)
  const geral = Math.round((obtidos / max) * 100)
  const nivel = [...NIVEIS].reverse().find((n) => geral >= n.min) ?? NIVEIS[0]

  // Lacunas: não/não sei antes de "em parte"; dentro disso, maior prioridade primeiro.
  const peso = (r?: Resposta) => (r === 'nao' || r === 'naosei' ? 2 : r === 'parcial' ? 1 : 0)
  const lacunas = AREAS.flatMap((a) => a.perguntas.map((p) => ({ ...p, area: a.nome, resposta: respostas[p.id] })))
    .filter((p) => peso(p.resposta) > 0)
    .sort((x, y) => peso(y.resposta) * 10 + y.prioridade - (peso(x.resposta) * 10 + x.prioridade))

  const naoSei = Object.values(respostas).filter((r) => r === 'naosei').length
  return { geral, nivel, areas, lacunas, naoSei }
}
