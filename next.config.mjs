// GH_PAGES só é 'true' no workflow .github/workflows/pages.yml, que builda
// apenas a landing pública (app/(app) e app/login são removidos antes do
// build nesse workflow) como export estático pro GitHub Pages. O build
// normal (`pnpm build`, usado por CI/deploy do produto) nunca passa essa
// variável, então continua gerando um build de servidor normal — este
// arquivo não muda nada pra ele.
const isGhPages = process.env.GH_PAGES === 'true'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  ...(isGhPages && {
    output: 'export',
    basePath: '/Ogway',
    assetPrefix: '/Ogway/',
  }),
}

export default nextConfig
