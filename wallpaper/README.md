# wallpaper interativo

`index.html` é o wallpaper inteiro: um arquivo só, sem dependência (a fonte é opcional). Roda em qualquer navegador e em qualquer programa que saiba mostrar uma página HTML como papel de parede.

## o que ele faz

- **hora do dia**: 7h–17h dia · 5h–7h e 17h–19h30 pôr do sol · resto noite. O sol nasce à direita, sobe e se põe à esquerda; a lua faz o mesmo à noite. A troca de tema acontece célula a célula (cerca de 3 s), sem fade.
- **mouse**: as camadas andam em passos de uma célula (parallax), as nuvens seguem o vento do lado do mouse, o cursor vira um blob amarelo com halo de pontos e o clique solta um anel de caracteres.
- **regras do estilo**: 10 fps, sem easing, sem gradiente, todo aleatório vem de `hash(coluna, linha, semente)`.

Teste no navegador: `python3 -m http.server 8765 --bind 127.0.0.1` na raiz do repositório e abra `http://127.0.0.1:8765/wallpaper/`.

Parâmetros de URL: `?tema=dia|poente|noite` · `&hora=18.5` · `&rapido=1` (1 h por segundo) · `&linhas=36` · `&fps=10` · `&parallax=1` · `&cursor=0` · `&hud=1` · `&fim=1` · `&semente=5`. A tecla **p** salva um png.

## fonte offline (opcional)

Sem internet o canvas cai em `monospace`. Para ficar idêntico, coloque `JetBrainsMono-Regular.woff2` em `wallpaper/fonts/`.

## sobre este pacote

Este diretório guarda o wallpaper de paisagem em tela cheia (`index.html`) e o pacote do Lively.

## instalar

### Windows

**Lively Wallpaper** (grátis): arraste a pasta `wallpaper/` para a janela do Lively, ou use o botão de adicionar e escolha `index.html`. `LivelyInfo.json` e `LivelyProperties.json` já estão aqui e dão os controles de tema, células, parallax, cursor e hud. Se o mouse não reagir, confira a opção de entrada de mouse do wallpaper nas configurações do Lively.

**Wallpaper Engine** (Steam, pago): editor → *Create Wallpaper* → escolha `index.html`. Em *Edit → Change project settings → Add Property* crie as chaves `tema` (combo com valores `auto`, `dia`, `poente`, `noite`), `celula` (slider 20–72), `parallax` (slider 0–3), `cursor` e `hud` (checkbox). O `index.html` já escuta `applyUserProperties`.

### Linux

Não existe um jeito único; depende do ambiente:

- **KDE Plasma 6**: o plugin *Wallpaper Engine for KDE* tem suporte parcial a wallpapers web. Interação de mouse não está documentada, então teste antes de contar com ela.
- **Sway, Hyprland e outros wlroots (e KDE)**: uma janelinha WebKitGTK presa na camada `background` com `gtk-layer-shell` mostra o `index.html` com mouse. É um script pequeno de Python, ainda não escrito aqui.
- **GNOME**: não tem layer-shell. O Hidamari lista o modo *Página web* e diz suportar GNOME Wayland, mas não documenta mouse. Ele é Flatpak e pode não enxergar a pasta do arquivo: prefira apontar para uma URL http (`http://127.0.0.1:8765/wallpaper/index.html`, com o servidor de pé antes do Hidamari abrir). O Hanabi (extensão do GNOME Shell) parece ser só vídeo.

## bateria

10 fps, o canvas nunca passa de 2560 px no lado maior e o navegador pausa o `requestAnimationFrame` quando a janela está oculta. No Lively e no Wallpaper Engine, ative a pausa quando outro app estiver em tela cheia.
