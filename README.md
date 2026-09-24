# Tutum

Surge-se a desconfiança quanto a segurança de arquivos proveninentes de fontes desconheidas da internet. Por isto, tal aplicação tem como objetivo avalia-los e e cataloga-los em pastas de acordo com a confiabilidades. Álem de fornerce uma interface web para a visualização do arquivos, junto a sua analise e atributos

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

## 🚀 Tecnologias

- **Linguagem / Framework:** Bun.js / NextJS / React / TypeScript
- **Banco de Dados:** PostgreSQL / Drizzle ORM
- **Infraestrutura:** Docker / Docker Compose

## 📋 Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- [Git](https://git-scm.com)
- [Bun.js](https://bun.com/) (versão 1.3+)
- [Docker](https://www.docker.com/) (opcional, para rodar o banco localmente)

## 🔧 Instalação e Configuração

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/MiguelTheodoro/locatarius](https://github.com/MiguelTheodoro/locatarius.git)
   cd locatararius

2. **Configure as Variáveis de Ambiente**
    Copie o arquivo .env.example para .env e preencha com as credenciais necessárias.
    ```bash
    cd api
    

3. **Instale as Dependências:**

    ```bash
    cd api
    bun install
    cd ..
    cd web
    bun install

3. **Suba o container:**

    ```bash
    docker compose up -d


4. **Envie as migrações ao banco de dados**

    ```bash
    bun run db:migrate


5. **Para Executar**

    ```
    cd api
    bun run src/start #backend
    cd web
    bun run dev #frontend

