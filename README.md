# Fotoxop

Editor de imagens simplificado, com transformações geométricas e de intensidade.

## Transformações geométricas
- Rotação (em torno do centro, com escala para preenchimento)
- Recorte/Crop (com escala)
- Translação (em progresso...)

## Transformações de intensidade
- Inversa
- Gamma
- Modulação de contraste
- Brilho
- Logarítimica
- Curva de intensidade (com interpolação Catmull-Rom)

## Arquitetura
Embora o ecossistema JS não tenha tantas ferramentas como o Python para manipulação de imagens, ainda é possível aproveitar a API
do `canvas`, que lida com carregamento e manipulação de imagens.<br/>
<br/>
Utilizando o objeto `ImageData`, é possível manipular os dados de uma imagem como um vetor que armazena os valores `R, G, B, A` de cada pixel.
Todas as funções de transformação são aplicadas percorrendo o vetor de pixels da imagem.
<br/> <br/>
Aplicar transformações em imagens (principalmente nas grandes) é um processo caro. Para evitar o congelamento da UI,
o processamento pesado foi movido para um WebWorker, que executa em uma thread separada.

## Instalação e execução
O runtime `bun` precisa estar instalado (https://bun.sh). <br/>
<br/>
Clone este repositório e abra o terminal na raiz do projeto.
```bash
bun install
```
```bash
bun run dev
```
Acesse o endereço http://localhost:5173 no navegador.

## Guia de uso
Ao acessar a URL do aplicativo no navegador, um canvas vazio será criado, aguardando a seleção de uma imagem para maniuplar.<br/>
Após selecionar uma imagem, o menu lateral exibirá as possíveis transformações e ações complementares (baixar ou excluir imagem e mudança de tema do app).<br/>
<br/>

<figure>
  <img title="Home" alt="Tela inicial" src="/docs/home.png"/>
  <caption>Tela inical</caption>
</figure>

<br/>
<br/>

> Importante: Algumas transformações não podem ser desfeitas!
<br/>
Transformações de intensidade, com exceção da curva de intensidade, possuem um input para os parâmetros (se existirem), com um botão de aplicação direta.<br/>
Transformações geométricas e a curva de intensidade possuem uma interface com mais interações, que permitem uma melhor configuração antes da aplicação.<br/>
<br/>

#### Recorte
<div>
  Permite recortar a imagem utilizando os pontos delimitadores.<br/>
<figure>
  <img title="Recorte" alt="Interface de recorte" src="/docs/crop.png"/>
  <caption>Interface de recorte</caption>
</figure>

<figure>
  <img title="Recorte (pós aplicação)" alt="Interface de recorte" src="/docs/crop_after.png"/>
  <caption>Image pós recorte</caption>
</figure>
</div>

#### Rotação
<div>
  Permite recortar a imagem utilizando os pontos delimitadores.<br/>
<figure>
  <img title="Recorte" alt="Interface de recorte" src="/docs/rotate.png"/>
  <caption>Interface de recorte</caption>
</figure>

<figure>
  <img title="Recorte (pós aplicação)" alt="Interface de recorte" src="/docs/rotate_during.png"/>
  <caption>Image pós recorte</caption>
</figure>

<figure>
  <img title="Recorte (pós aplicação)" alt="Interface de recorte" src="/docs/rotate_after.png"/>
  <caption>Image pós recorte</caption>
</figure>
</div>

#### Inversa
<div>
  Permite recortar a imagem utilizando os pontos delimitadores.<br/>
<figure>
  <img title="Recorte" alt="Interface de recorte" src="/docs/inverse.png"/>
  <caption>Interface de recorte</caption>
</figure>

</div>

#### Curva de intensidade
<div>
  Permite recortar a imagem utilizando os pontos delimitadores.<br/>
<figure>
  <img title="Recorte" alt="Interface de recorte" src="/docs/tone.png"/>
  <caption>Interface de recorte</caption>
</figure>

<figure>
  <img title="Recorte (pós aplicação)" alt="Interface de recorte" src="/docs/tone_after.png"/>
  <caption>Image pós recorte</caption>
</figure>
</div>

