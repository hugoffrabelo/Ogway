export function About() {
  return (
    <section
      id="quem-cuida"
      className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32"
      aria-labelledby="about-title"
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-8 flex items-center gap-3 text-sm tracking-[0.2em] text-muted-foreground uppercase">
          <span className="h-px w-8 bg-accent" />
          Quem cuida
        </p>
        <blockquote>
          <p
            id="about-title"
            className="font-serif text-2xl leading-snug font-medium text-balance text-primary sm:text-3xl lg:text-4xl lg:leading-snug"
          >
            &ldquo;Trabalho com proteção de dados como quem dá um conselho de
            confiança: com calma, sem alarde e pensando no longo prazo. Minha
            função é tirar esse peso das suas costas para que a clínica siga
            cuidando de gente.&rdquo;
          </p>
        </blockquote>
        <footer className="mt-10 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-serif text-lg font-semibold text-primary-foreground">
            O
          </div>
          <div>
            <p className="font-medium text-primary">Encarregado responsável</p>
            <p className="text-sm text-muted-foreground">
              Ogway · Proteção de dados para a saúde
            </p>
          </div>
        </footer>
      </div>
    </section>
  )
}
