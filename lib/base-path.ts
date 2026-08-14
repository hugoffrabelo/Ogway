// Só é definido durante o build estático pro GitHub Pages (ver
// .github/workflows/pages.yml, que passa NEXT_PUBLIC_BASE_PATH) — nos
// demais builds fica vazio, igual a como o resto do site já roda (raiz do
// domínio). Necessário porque `url(/arquivo.jpg)` em `style` não passa
// pelo pipeline de assets do Next.js, então o basePath não é aplicado
// automaticamente como acontece com <Image>/<Link>.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
