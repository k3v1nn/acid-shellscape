# Acid Shellscape para Wallpaper Engine

Wallpaper web com 12 janelas de Mac clássico com receitas de célula. A paisagem usa o nascer e o pôr do sol, a nebulosidade e a chuva reais da cidade escolhida (Open-Meteo, sem chave).

`index.html` é uma cópia de `../janelas.html`. Edite o original e rode `./sync.sh` para copiar.

## usar

1. Abra o Wallpaper Engine → **Create Wallpaper** e arraste `index.html` (ou a pasta inteira) para a janela.
2. Se o `project.json` desta pasta for aceito, os controles já aparecem: tema, tamanho da célula, parallax e cidade. Ele foi escrito a partir do que se sabe do formato, sem testar no programa. Se o editor reclamar, use o caminho garantido pela documentação: **Edit → Change project settings → Add Property** e crie estas chaves (só letras e números):
   - `tema`: combo com valores `auto`, `dia`, `poente`, `noite`
   - `celula`: slider de 6 a 24, padrão 12
   - `parallax`: slider de 0 a 3, padrão 1
   - `cidade`: texto, padrão `Itiúba`
3. O `index.html` já escuta `applyUserProperties`.

## notas

- Em monitor de 1080p a célula padrão é 12 px. Em 4K suba o slider para 20 ou mais.
- O mouse move as camadas em passos de uma célula e o clique solta um anel; isso só vale se o Wallpaper Engine repassar o mouse à página, o que depende da sua configuração.
- O clima precisa de internet. Sem rede, a janela mostra "buscando o clima..." e a paisagem usa nascer 5h30 e pôr 17h30.
- Fonte: sem internet o canvas cai em `monospace`. Para ficar idêntico, coloque `JetBrainsMono-Regular.woff2` em `fonts/`.
- Parâmetros de URL úteis para testar no navegador: `?tema=poente&fim=1&rapido=1&cidade=Salvador`.
