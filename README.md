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
do `canvas`, que lida com carregamento e manipulação de imagens.
<br/><br/>
Utilizando o objeto `ImageData`, é possível manipular os dados de uma imagem como um vetor que armazena os valores `R, G, B, A` de cada pixel.
Todas as funções de transformação são aplicadas percorrendo o vetor de pixels da imagem.
<br/> <br/>
Aplicar transformações em imagens (principalmente nas grandes) é um processo caro. Para evitar o congelamento da UI,
o processamento pesado foi movido para um WebWorker, que executa em uma thread separada.

## Instalação e execução
O runtime `bun` precisa estar instalado (https://bun.sh). 
<br/><br/>
Clone este repositório e abra o terminal na raiz do projeto.
```bash
bun install
```
```bash
bun run dev
```
Acesse o endereço http://localhost:5173 no navegador.

## Guia de uso
Ao acessar a URL do aplicativo no navegador, um canvas vazio será criado, aguardando a seleção de uma imagem para maniuplar.
