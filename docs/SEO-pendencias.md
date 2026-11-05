# SEO — o que falta depois do código

O SEO técnico e o conteúdo já estão no site (metadados, sitemap, robots,
schema.org, páginas de serviço locais). O que está abaixo depende de ações
fora do código ou do domínio próprio. Ordem = impacto esperado.

## 1. Domínio próprio (bloqueia o resto)

- [ ] Comprar o domínio (ex.: `ogway.com.br` no Registro.br).
- [ ] GitHub → Settings → Pages → Custom domain; criar o registro DNS
      (CNAME para `hugoffrabelo.github.io` ou A/AAAA dos IPs do GitHub Pages)
      e ativar "Enforce HTTPS".
- [ ] Tirar o basePath `/Ogway`: em `.github/workflows/pages.yml` remover
      `NEXT_PUBLIC_BASE_PATH: /Ogway` e, em `next.config.mjs`, o
      `basePath`/`assetPrefix` do bloco `isGhPages`.
- [ ] Enquanto o site estiver em `hugoffrabelo.github.io/Ogway`, o Google
      ignora o `robots.txt` gerado (ele só lê o da raiz do domínio). O
      sitemap ainda pode ser enviado manualmente no Search Console.
- [ ] Definir a variável `SITE_URL` (Actions → Variables) com
      `https://ogway.com.br` — já está ligada a `NEXT_PUBLIC_SITE_URL` no
      workflow. Canonical, sitemap, Open Graph e schema seguem sozinhos.

## 2. Google

- [ ] **Google Search Console**: verificar o domínio (registro TXT no DNS) e
      enviar `https://SEU-DOMINIO/sitemap.xml`. Repetir no Bing Webmaster Tools.
- [ ] **Perfil da Empresa no Google** (antigo Google Meu Negócio): é o maior
      fator para aparecer no mapa e no "pacote local" de buscas como
      "DPO Porto Alegre". Configurar como empresa de **área de atendimento**
      (Porto Alegre e região), sem endereço público; categoria principal
      próxima de "Consultor"; cadastrar os 4 serviços com os mesmos nomes do
      site; link para o site; fotos.
- [ ] **Avaliações**: pedir a cada cliente atendido uma avaliação no Perfil
      da Empresa. Concorrentes locais quase não têm.

## 3. Dados consistentes (NAP)

- [ ] Nome, cidade, e-mail e telefone/WhatsApp **idênticos** no site, no
      Perfil da Empresa, no LinkedIn e em diretórios.
- [ ] Decidir se o site mostra telefone/WhatsApp (hoje não mostra; ajuda em
      busca local e conversão).
- [ ] Preencher `CONTACT_EMAIL` e `CONTACT_ENDPOINT` (Actions → Variables):
      sem eles o formulário não envia e o schema sai sem e-mail.

## 4. Autoridade (E-E-A-T)

- [ ] Foto profissional na seção "Quem cuida" (hoje é um "H").
- [ ] Certificações e formação na mesma seção (ex.: certificações em
      privacidade/LGPD, pós-graduação), com link para o LinkedIn.
- [ ] Links de outros sites para o seu: associações e conselhos de saúde do
      RS (sindicatos médicos, CRO-RS, CRP-RS, associações de clínicas),
      artigos como convidado, palestras, diretórios de fornecedores (ex.:
      oHub), parceiros contábeis que atendem clínicas.

## 5. Conteúdo (próximas páginas)

Pesquisa feita no google.com.br em 04/11/2026 (navegador do Hugo, logado,
então os resultados podem ter alguma personalização). Sem volume de buscas:
para isso, usar o Planejador de Palavras-chave do Google Ads.

| Busca | Quem domina hoje | Chance para a Ogway |
| --- | --- | --- |
| lgpd clínicas porto alegre | Só instituições (HCPA, Divina Providência, CREMERS, prefeitura). **Nenhum prestador.** | Muito alta |
| consultoria lgpd porto alegre | CDL POA, Deep Security, TWHub, RTS; visão geral por IA cita os três primeiros; painel "LGPD Líder" com 1 avaliação | Média, depende do Perfil da Empresa e de avaliações |
| adequação lgpd porto alegre | Prefeitura, RTS, CDL POA, b2bfy (lista "10 melhores"), Deep Security | Média |
| dpo / encarregado de dados porto alegre | Prefeitura e notícias sobre o DPO municipal; Infosec (RS) | Alta para "DPO para clínicas" |
| dpo terceirizado porto alegre | Anúncios: DPO Expert e Somaxi; orgânico nacional (Infosec, Infolock, Rastek, Tripla) | Média |
| advogado lgpd porto alegre | Só escritórios de advocacia | Baixa e fora do perfil: não disputar |
| lgpd para psicólogos / dentistas / consultório médico | Conselhos (CFP, CRP, CFO, CFM), blogs de software e Migalhas; nada local | Alta com página local por especialidade |
| clínica precisa de dpo | Blogs nacionais; tem visão geral por IA | Alta: a resposta da Ogway é diferenciada (alto risco) |
| prontuário eletrônico lgpd | Migalhas, softwares médicos | Média |
| política de privacidade para clínica | Políticas de hospitais e JusBrasil | Média |
| mapeamento de dados lgpd porto alegre | Prefeitura, RTS, Privacy Tools | Média |

**Referência a superar:** Deep Security (`deepsecurity.com.br/lgpd/porto-alegre/`)
tem página de cidade com título "Consultoria LGPD em Porto Alegre (RS)", FAQ e
schema completo (empresa, endereço, coordenadas, horário). As páginas da
Ogway já têm título, FAQ e schema equivalentes; faltam endereço, horário e
avaliações, que vêm do Perfil da Empresa.

Próximas páginas, em ordem:

- [ ] `/lgpd-para-psicologos-porto-alegre`, `/lgpd-para-dentistas-porto-alegre`,
      `/lgpd-clinicas-medicas-porto-alegre`: rotina de cada especialidade
      (prontuário psicológico, imagens odontológicas, laudos).
- [ ] Guia "Clínica precisa de DPO?" com a posição do alto risco
      (Res. CD/ANPD nº 2/2022, art. 4º); boa chance de entrar na visão
      geral por IA, porque a resposta é clara e citável.
- [ ] Guias "Prontuário eletrônico e LGPD", "WhatsApp na clínica e LGPD",
      "Vazamento de dados na clínica: o que fazer".
- [ ] Pedir inclusão em listas como a da b2bfy ("10 melhores empresas de
      adequação à LGPD") e no diretório de soluções da CDL POA, se fizer sentido.
- [ ] Um texto novo por mês já coloca o site à frente dos concorrentes locais.

**Visão geral por IA:** para ser citado, cada página deve responder à
pergunta logo no primeiro parágrafo, com frases curtas e dados verificáveis
(artigo de lei, resolução), além do FAQ marcado em schema, que já existe.

## 6. Medição

- [ ] O Vercel Analytics atual **não funciona no GitHub Pages**. Trocar por
      uma ferramenta compatível (ex.: Plausible, Umami ou GA4 com banner de
      consentimento) e atualizar o aviso de privacidade.

## 7. Confirmar no texto

- [ ] Atendimento presencial em Porto Alegre e região
      (`lib/paginas-servico.ts`, constante `ATENDIMENTO`).
- [ ] Prazo de retenção de 12 meses no aviso de privacidade
      (`app/privacidade/page.tsx`).
