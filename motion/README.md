# Motion — vídeo de apresentação dos serviços

`apresentacao.html` é a fonte do vídeo `public/video/apresentacao.mp4`
(seção "Qual é o seu caso?" da home).

A animação é determinística: `render(t)` desenha o quadro do segundo `t`.

- **Revisar:** abra `apresentacao.html` no navegador (toca em loop) ou use
  `apresentacao.html?t=12.5` para congelar um quadro.
- **Editar:** textos das cenas em `CENAS` e `PRODUTOS`; tempos em `render(t)`.
  Cores e fontes seguem o site (navy, camelo, creme; Cinzel e Poppins).

## Gravar

1. Gerar os quadros com Chrome headless: abrir a página com `?t=0`, esperar
   `window.pronto`, e para cada quadro chamar `render(f / 30)` e tirar uma
   captura 1920×1080 (720 quadros para 24 s).
2. Codificar com ffmpeg:

```bash
# master 1080p (redes sociais, apresentações)
ffmpeg -framerate 30 -i f%04d.jpg -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart apresentacao-1080p.mp4

# versão do site, 720p e leve
ffmpeg -framerate 30 -i f%04d.jpg -vf scale=1280:-2 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -an public/video/apresentacao.mp4

# imagem parada (quadro final) para o poster
ffmpeg -ss 23 -i public/video/apresentacao.mp4 -frames:v 1 -q:v 3 public/video/apresentacao-poster.jpg
```
