# Bioimpedância AI

Uma aplicação web moderna para interpretação de exames de bioimpedância usando Inteligência Artificial.

## Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Shadcn/ui** & **Tailwind CSS**
- **OpenRouter API** (Google Gemini)

## Funcionalidades

- Upload de exames em PDF ou Imagem (JPG, PNG, HEIC)
- Extração automática de dados (Peso, IMC, Gordura, Músculos, etc.)
- Análise técnica e explicação amigável para o paciente
- Comparação com médias populacionais
- Histórico de evolução
- Privacidade total (dados não persistidos)

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env.local` na raiz do projeto com sua chave da OpenRouter:
   ```env
   OPENROUTER_API_KEY=sua_chave_aqui
   ```
4. Rode o projeto:
   ```bash
   npm run dev
   ```

## Prompt do Sistema

O sistema utiliza um prompt especializado para garantir a extração precisa dos dados e a geração de análises úteis e empáticas.

---
Desenvolvido por Gabriel Vaz
