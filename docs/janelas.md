# Janelas: referência de design

As janelas de Mac clássico flutuando sobre um fundo de células são uma extensão da identidade para papéis de parede. Este guia junta o que funcionou, para reaproveitar em qualquer projeto no estilo. Tudo aqui vale junto com as regras do [README](../README.md): quatro receitas de célula, 10 fps, sem gradiente, hash em vez de `Math.random()`.

<p align="center">
  <img src="janelas-desktop.png" alt="Desktop: janelas sobre fundo de pontos" width="720"><br>
  <img src="janelas-barras.png" alt="Desktop à noite com fundo de barras que reagem à música" width="720">
</p>

## 1. Moldura

Uma janela é uma moldura Mac clássico em volta de uma receita.

| parte | medida | cor |
|---|---|---|
| contorno | 1 px (1 px por unidade de DPR) | `line` `#3a3641` |
| corpo | o que sobra | `ground` `#121014` |
| barra de título | 4 células de altura | `chrome` `#5d5a62` |
| listras da barra | 1 px a cada 4 px, com `rgba(0,0,0,.35)` | sobre o `chrome` |
| quadrado vazado | 11 px, 7 px da borda esquerda, centrado na barra | contorno `ink`, miolo `ground` |
| título | mono, 1,7 célula, centrado, em uma placa `chrome` que interrompe as listras | `ink` |

Etiquetas e contadores são blocos `ink` (ou `ink-dim` para o secundário) com texto `ground`. Texto solto dentro de janela é mono, minúsculo e soa como código: `nada tocando`, `sem audio`, `> tocando`, `nivel 043`. Nome de janela é `arquivo.extensão` e diz a receita: `paisagem.js`, `meio-tom.cell`, `terminal.sh`, `espectro.sh`.

Tudo se alinha à grade: posição e tamanho da janela são **inteiros de células**. A moldura é a única coisa que usa pixels.

## 2. Tamanho da célula

Não use um tamanho fixo em px. Meça a célula pela tela:

- paisagem (desktop): altura ÷ 90 linhas; retrato (celular): largura ÷ 77 colunas;
- arredonde para múltiplo de 4 (a matriz de pontos 4×4 só fecha assim) e use no mínimo 8 px;
- resultado: 1080p dá 12 px, 1440p dá 16, 4K dá 24. Todo monitor mostra janelas do mesmo tamanho relativo.

Janelas são descritas em células (`64×34` a paisagem, `30×15` o relógio) e encolhem ou crescem com a largura útil (`(colunas − 6) ÷ 66`, entre 0,5 e 1 no desktop).

## 3. Catálogo de receitas de janela

| janela | receita | detalhe que importa |
|---|---|---|
| `paisagem.js` | cena completa em camadas (céu, nuvens, sol/lua, montanhas, água) | segue o sol e as nuvens reais; fica embaixo |
| `sol.blob` | cena só com sol/lua grande | o sol respira com o grave |
| `ondas.txt` | só água de caracteres `~-=._` | fase avança com a música |
| `terminal.sh` | etiquetas de código + cursor piscando | cursor a cada 0,5 s, em passos |
| `log.txt` | linhas `0042 pintar(sol)` rolando | linhas raras em `yellow` e `lime` |
| `blocos.cell` | ruído fbm com limiar, cor por faixa | mais blocos quando está alto |
| `meio-tom.cell` | hachura com densidade em onda | grave soma luz |
| `pontos.cell` | matriz de pontos em ondas concêntricas | anel `yellow` a cada batida |
| `chuva.sh` | colunas de caracteres caindo, cabeça `ink`, cauda `lime` → `ground` | acelera com o volume |
| `blob.js` | quatro círculos que se fundem | crescem com o grave |
| `espectro.sh` | 18 barras de 1 célula com 1 de vão; `lime` → `yellow` → `coral` por altura; topo `-` em `ink` | sem áudio: faíscas de 1 célula |
| `tocando.sh` | capa 11×11 células (6 níveis por canal), título rolando em passos de caractere, barra de progresso | capa sem gradiente: amostrada e quantizada |
| `clima.sh` | temperatura em dígitos 5×7, ícone de 8×7 células, linhas de dados | ver abaixo |
| `relogio.js` | `HH:MM` em dígitos 5×7, minutos em `yellow`, dois pontos piscando, data em etiqueta | não se mexe |

**Dígitos de bloco.** Relógio e temperatura usam uma fonte de pixels 5×7 (cada pixel é um quadrado de uma ou duas células). Número grande nunca usa a fonte mono.

**Ícones de clima** são feitos com as receitas: nuvem de blocos, sol de blob + pontos, lua de blob recortado, chuva de `|`, neve de `*`, tempestade de `/` em `yellow`, neblina de `=`.

## 4. Camadas e faixas

Três camadas de desenho: normal (0), paisagem (1) e sempre por cima (2: relógio e clima). Tocar numa janela a traz para a frente **da própria camada**; nada passa por cima do relógio. Cada janela vive numa faixa vertical da área útil (relógio e clima no alto, paisagem embaixo) e nunca encosta no topo (mínimo de 12% das linhas no retrato, 4% na paisagem) nem no fundo.

## 5. Movimento

- 10 fps, sempre. O que não é frame é hash do frame.
- Janelas flutuam devagar (0,15 a 0,55 célula por segundo), batem nas bordas e voltam; abrem e fecham por **dithering de hash** (`hash(c, r, seed) < q`), nunca por fade; ficam abertas 16 a 42 s e reabrem noutro lugar.
- Parallax: no máximo **uma célula por frame**, cada janela com sua profundidade.
- Troca de tema (dia → poente → noite): dithering por célula em 3,2 s, com os mesmos limiares da abertura.
- Tocar: anel de caracteres (`@%#*+=-:.`) que se abre em 16 frames, e a janela tocada inverte a velocidade.

## 6. Dados reais viram cena

A paisagem não é um tema fixo: ela lê o mundo (Open-Meteo, sem chave).

- Dia é entre `nascer + 1,5 h` e `pôr − 0,5 h`; poente vai de `nascer − 0,5 h` a `pôr + 2 h`; o resto é noite.
- O corpo (sol ou lua) percorre um arco entre `nascer − 0,5` e `pôr + 2`.
- Nuvens: o limiar do ruído sobe e desce com a cobertura (`(0,5 − cobertura) × 0,3`; neblina −0,1).
- Chuva: sobreposição de `|` por nível (garoa 1, chuva 2, trovoada 3) sobre o céu da paisagem.
- Sem rede: nascer 5h30, pôr 17h30, sem chuva. O clima nunca bloqueia o desenho.

## 7. Música

Cada janela pode reagir ao áudio, mas só mexe em **raio, densidade, fase ou velocidade**. Nunca muda a estrutura da receita.

- Espectro: 64 valores (esquerda e direita em média) → 32 bandas, `pow(v, 0,7)`; subida imediata, descida `×0,78`; picos caem 0,08 por frame.
- Batida: grave acima de `1,25 ×` a média móvel (`+0,05`), mínimo de 220 ms entre batidas.
- Sem áudio ou volume zero, as janelas ficam exatamente como sem a função. Teste com música de mentira antes (`&audio=demo` no wallpaper web).
- Metade da música é meta: título, artista e progresso com **tempo extrapolado** entre as atualizações do sistema.

## 8. Fundos (desktop)

Atrás das janelas, nunca competindo com elas. A parte parada é pintada uma vez num canvas fora da tela; por quadro só se desenha o que se mexe.

| fundo | o que é |
|---|---|
| `pontos` | um ponto por célula em `ground` + 30% de `ink-dim`; faíscas `+` e `.` por hash |
| `xadrez` | células alternadas 3,5% mais claras; faíscas em blocos de acento a 16%; uma linha varrendo |
| `grade` | linhas de `line` a cada 8 células, cruzes nas interseções |
| `barras` | `pontos` + colunas de espectro nascendo de baixo (16–32% de acento, topo em `yellow`) |
| `preto` | só `ground` (`#000` para OLED) |

Regra: fundo nunca passa de uns 30% do brilho de uma janela, e as faíscas crescem com o volume (0,6% das células em silêncio, até 2,6% no máximo).

## 9. Interação (desktop)

- Arrastar pela barra de título; a janela **encaixa na grade** (posição em inteiros de células) e fica onde foi solta. Clique duplo na barra a faz flutuar de novo. O quadrado vazado fecha (ela reabre noutro lugar).
- A janela largada fica sempre dentro da tela, ao contrário do fluxo normal, que respeita as faixas.
- Cursor: `grab` sobre barra de título, `grabbing` arrastando.

## 10. Várias telas

- Um papel por monitor: a célula automática resolve resoluções diferentes. Dois monitores iguais sorteiam arranjos iguais; uma `semente` por monitor resolve.
- Papel esticado por 2 ou 3 monitores (proporção acima de 2,4): um conjunto de janelas por tela, cada janela presa à sua tela.

## 11. Cores dentro das janelas

Os tokens de interface valem como em qualquer projeto. Dentro dos wallpapers, quando o texto está sobre canvas e não sobre CSS, usamos os acentos mais saturados abaixo (já estão em `tokens/`):

| uso | token | valor |
|---|---|---|
| lilás de bloco e meio-tom, em fundo escuro | `lilac-ui` | `#b79cf2` |
| azul de chuva e halo da noite | `blue-ui` | `#6f8fd0` |
| texto secundário sobre canvas | `ink-dim` | `#9a97a1` (os wallpapers usam `#8d8a93`, ligeiramente mais escuro) |

Um acento domina por janela; no máximo cinco na tela.

## 12. O que evitar

- Fade, easing, blur, sombra, gradiente (o "gradiente" é sempre bandas de células).
- Tamanhos em px para conteúdo; só moldura e quadrado vazado usam px.
- Aleatório por frame: tudo é `hash(coluna, linha, semente)`.
- Texto de interface em maiúsculas ou em frases longas. Prefira `sem audio` a "Nenhum áudio detectado".
- Reagir à música alterando estrutura, ou deixando o fundo chamar mais atenção que a janela.
