# CHRONOS (Desafio full stack EMA)
Este repositório foi criado para o desafio de desenvolvedor Full Stack da EMA. 

## O que a aplicação faz?
O Chronos é uma aplicação que consiste ser uma plataforma simples para gerenciamento de eventos, contando com duas formas de visualização: 
- Calendário 📆 
- Lista cronológica 📄

## Detalhes técnicos
> Linguagem:

[![My Skills](https://skillicons.dev/icons?i=ts)](https://skillicons.dev)

> Backend:

[![My Skills](https://skillicons.dev/icons?i=mysql,nestjs)](https://skillicons.dev)

> Frontend:

[![My Skills](https://skillicons.dev/icons?i=vite)](https://skillicons.dev)
 <img src="https://raw.githubusercontent.com/heroui-inc/heroui/main/apps/docs/public/isotipo.png" alt="HeroUI logo" width="50" height="50"> 

> Gerenciador de pacotes: 

[![My Skills](https://skillicons.dev/icons?i=pnpm)](https://skillicons.dev)

##  Instalação do projeto (windows)

1. Clone o projeto e rode:
```bash
cd ./desafio-fullstack-ema
````
2. Recomendação: instalar o pnpm via npm:
```bash
npm install -g pnpm@latest-10
 ```

3. Para instalar as dependências e rodar o frontend:
```bash
cd ./chronos
pnpm install
pnpm run dev
```
4. Para instalar as dependências e rodar o backend:
```bash
cd ./nest-api
pnpm install

pnpm run start 
//ou
pnpm run start:dev
```

## IMPORTANTE:
Não esqueça de renomear o arquivo ```.env.example``` para ```.env ``` e preencher as variaveis locais para o banco de dados.

Exemplo de preenchimento backend:
```bash
DB_HOST=nome do host
DB_PORT=sua porta
DB_USERNAME=user do banco
DB_PASSWORD=sua senha local
DB_DATABASE=nome do banco
DB_TIMEZONE=timezone (-03:00)
```

Preenchimento do frontend:
```bash
VITE_NEST_API_URL:localhost:3000
VITE_NEST_WEBSOCKET_URL:ws/localhost:3000/events/data
```

## O projeto também conta com API Automation test montados com Jest:

Rode no backend:
```bash
pnpm test 
```

## Requisitos não obrigatórios tentados:
- Testes unitários e API Automation 
- Responsividade 

A API também tem sua documentação disponível acessando a rota ```/api ```
