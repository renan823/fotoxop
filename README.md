# Fotoxop

FOTOXOP - App genérico de edição de imagens (Adobe não me processa)<br>
Renan Trofino Silva - 15522316
BCC - 5° semestre
Profa. Leo Sampaio Ferraz Ribeiro
[Link do repositório](https://github.com/renan823/fotoxop)

## Funcionalidades

### Transformações geométricas

-   Rotação (em torno do centro, com escala para preenchimento)
-   Recorte (crop com escala)
-   Translação (em progresso)

### Transformações de intensidade

-   Inversão de cores
-   Correção gamma
-   Modulação de contraste
-   Ajuste de brilho
-   Transformação logarítmica
-   Curva de intensidade (interpolação Catmull-Rom)

## Arquitetura

O projeto utiliza a API de `canvas` do navegador para carregamento e
manipulação de imagens.

A imagem é representada por um objeto `ImageData`, que armazena os
valores **RGBA** de cada pixel em um vetor linear. Todas as
transformações são aplicadas percorrendo esse vetor.

Como o processamento de imagens pode ser custoso, especialmente para
imagens grandes, as operações mais pesadas são executadas em um **Web
Worker**, evitando o bloqueio da interface.


## Instalação e execução

É necessário ter o runtime Bun instalado: https://bun.sh

``` bash
bun install
```

``` bash
bun run dev
```

Acesse no navegador: http://localhost:5173


## Guia de uso

Ao abrir a aplicação: 
- Um canvas vazio será exibido
- Selecione uma imagem
- O menu lateral exibirá as transformações disponíveis e ações adicionais (download, exclusão, tema)

## Tela inicial


<p align="center">
  <img src="/docs/home.png" alt="Tela inicial" />
</p>
<p align="center">
  <em>Tela inicial do aplicativo</em>
</p>


> Importante: algumas transformações não podem ser desfeitas.

Transformações de intensidade (exceto curva) possuem aplicação direta
via parâmetros.

Transformações geométricas e curva de intensidade possuem interface
interativa para configuração antes da aplicação.


## Curva de intensidade

Permite ajustar a intensidade dos pixels por meio de uma curva
interpolada.

<p align="center">
  <img src="/docs/tone.png" alt="Interface da curva de intensidade" />
</p>
<p align="center">
  <em>Interface de ajuste da curva</em>
</p>

<p align="center">
  <img src="/docs/tone_after.png" alt="Resultado da curva de intensidade" />
</p>
<p align="center">
  <em>Imagem após aplicação da curva</em>
</p>


## Recorte (Crop)

Permite selecionar uma região da imagem utilizando pontos delimitadores.


<p align="center">
  <img src="/docs/crop.png" alt="Interface de recorte" />
</p>
<p align="center">
  <em>Interface de recorte</em>
</p>
<p align="center">
  <img src="/docs/crop_after.png" alt="Resultado do recorte" />
</p>

<p align="center">
  <em>Imagem após o recorte</em>
</p>



## Rotação

Permite rotacionar a imagem em torno do centro com ajuste de escala. O frame será ajustado automaticamente.

<p align="center">
  <img src="/docs/rotate.png" alt="Interface de rotação" />
</p>
<p align="center">
  <em>Interface de rotação</em>
</p>

<p align="center">
  <img src="/docs/rotate_during.png" alt="Rotação em andamento" />
</p>
<p align="center">
  <em>Rotação em andamento</em>
</p>

<p align="center">
  <img src="/docs/rotate_after.png" alt="Resultado da rotação" />
</p>
<p align="center">
  <em>Imagem após rotação</em>
</p>


## Translação

Permite mover o frame da imagem e movê-la usando as setas do teclado. Após o movimento, a imagem será cortada na posição correta.

<p align="center">
  <img src="/docs/translate_before.png" alt="Interface da translação" />
</p>
<p align="center">
  <em>Interface da translação</em>
</p>

<p align="center">
  <img src="/docs/translate_after.png" alt="Imagem pós translação" />
</p>
<p align="center">
  <em>Imagem pós translação</em>
</p>


## Inversão de cores

Aplica a transformação inversa na imagem.

<p align="center">
  <img src="/docs/inverse.png" alt="Transformação inversa" />
</p>
<p align="center">
  <em>Resultado da inversão de cores</em>
</p>


## Transformação gamma

Aplica a transformação gamma na imagem.

<p align="center">
  <img src="/docs/gamma.png" alt="Transformação gamma" />
</p>
<p align="center">
  <em>Resultado da transformação gamma</em>
</p>


## Transformação log

Aplica a transformação log na imagem.

<p align="center">
  <img src="/docs/log.png" alt="Transformação log" />
</p>
<p align="center">
  <em>Resultado da transformação log</em>
</p>


## Transformação de contraste

Aplica a transformação de contraste.

<p align="center">
  <img src="/docs/contrast.png" alt="Transformação contraste" />
</p>
<p align="center">
  <em>Resultado da transformação contraste</em>
</p>


## Transformação de brilho

Aplica a transformação de brilho.

<p align="center">
  <img src="/docs/brightness.png" alt="Transformação brilho" />
</p>
<p align="center">
  <em>Resultado da transformação brilho</em>
</p>
