# Sakura Sushi - Cardapio Digital

Cardapio digital moderno para restaurante de sushi, construido com React, Vite e Tailwind CSS.

## Link publicado

Abra o cardapio por este link, com a barra final:

https://gabriellyrcarneiro.github.io/SakuraSushi/

## Funcionalidades

- Menu responsivo com visual premium.
- Busca por item, categoria, tipo ou descricao.
- Filtros por Sashimi, Nigiri, Uramaki, Hot Roll, Temaki, Combos, Promocoes, Clones e Bebidas.
- Itens com valores, quantidades, tipos e descricoes.
- Carrinho lateral com quantidade, subtotal, taxa e total.
- Link de pedido via WhatsApp com resumo preenchido automaticamente.
- Assets visuais locais para nao depender de imagens externas.

## Tecnologias

- React
- Vite
- Tailwind CSS
- Lucide React

## Como executar

```bash
cd frontend
npm install
npm run dev
```

Com a base do GitHub Pages, o dev server abre em `http://localhost:5173/SakuraSushi/`.

Build de producao:

```bash
cd frontend
npm run build
```

Preview local:

```bash
cd frontend
npm run preview
```

## Deploy

O projeto esta pronto para deploy na Vercel. Use o diretorio `frontend` como raiz do projeto.

Para GitHub Pages, gere o build com base `/SakuraSushi/`:

```bash
cd frontend
npm run build:pages
```
