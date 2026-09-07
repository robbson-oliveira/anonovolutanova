# Fazer as três páginas aparecerem no preview

## Objetivo

Fazer o seletor de páginas do preview reconhecer, nesta ordem lógica:

1. `/` — wireframe atual
2. `/design-system` — catálogo do design system
3. `/lab/hero-animation` — laboratório interno de animação

## Diagnóstico confirmado

- As três páginas existem no código e o build atual gera arquivos para o design system e o laboratório.
- O projeto, porém, continua organizado como uma aplicação Next.js (`src/app` e `next dev`).
- O preview do Lovable está reconhecendo apenas a rota raiz; as páginas aninhadas do Next não estão sendo indexadas pelo seletor.
- A raiz é hoje um manipulador especial que lê o HTML do wireframe, em vez de uma página declarada no roteador esperado pelo preview.

## Implementação

- Migrar somente a camada de execução e páginas para o padrão nativo do projeto (TanStack Start/Vite), sem redesenhar o site.
- Declarar explicitamente as três rotas em `src/routes`, para que o preview consiga descobri-las.
- Manter `wireframe-v2.html` intacto e carregá-lo como conteúdo principal de `/`, preservando seus arquivos e comportamento.
- Adaptar o design system e o laboratório para remover dependências exclusivas do Next.js, mantendo os componentes, tokens CSS, imagens e animações existentes.
- Manter o laboratório fora da navegação pública; ele será acessível apenas pela URL e pelo seletor de páginas do preview.
- Ajustar os comandos de desenvolvimento e geração da versão publicável para o padrão suportado pelo Lovable, eliminando a origem dos erros de builder/dist-check.

## Validação

- Confirmar resposta e renderização de `/`, `/design-system` e `/lab/hero-animation`.
- Conferir visualmente que o wireframe permanece igual.
- Testar no laboratório o botão **Repetir**, a reprodução e o arraste da linha do tempo.
- Confirmar que as três rotas são detectáveis pelo preview e que não há erros no navegador nem na geração publicável.

## Limites

- O arquivo original do wireframe não será alterado.
- Nenhuma nova página será adicionada à navegação pública.
- O visual e o conteúdo das páginas existentes serão preservados.
