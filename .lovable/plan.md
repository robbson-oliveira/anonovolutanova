# Corrigir definitivamente a troca de fonte no Design System

## Objetivo

Garantir que `/design-system` e `/design-system/lacunas` nunca exibam uma fonte provisória antes de mostrar Manrope e Yellowtail.

## Diagnóstico confirmado

- Os arquivos das fontes estão locais e válidos.
- As declarações de fonte aparecem duplicadas: uma vez no HTML inicial e outra na folha geral de estilos.
- O estilo crítico é inserido depois do conteúdo automático do cabeçalho, que já inclui a folha geral da página.
- Manrope 500 e Yellowtail não estão na lista de pré-carregamento, embora sejam usadas pelo catálogo.
- Os nomes usados pelos tokens de tipografia só são definidos na folha geral; portanto, o primeiro desenho da página ainda pode depender da ordem em que os estilos terminam de carregar.

## Correção

1. Consolidar no HTML inicial as declarações indispensáveis de Manrope e Yellowtail, incluindo os nomes usados pelos tokens do Design System.
2. Colocar esse estilo crítico antes das demais folhas de estilo da página.
3. Pré-carregar todos os pesos realmente usados no catálogo: Manrope 400, 500, 600 e 700, além de Yellowtail 400.
4. Eliminar a duplicação que permite ordens diferentes de aplicação, mantendo uma única fonte de verdade para o carregamento inicial.
5. Bloquear somente a pintura do conteúdo do Design System enquanto as fontes locais ainda não estiverem prontas, caso o navegador esteja com cache vazio ou conexão lenta. Assim, a página pode levar um instante a aparecer, mas nunca aparece com a fonte errada.

## Validação

- Abrir `/design-system` e `/design-system/lacunas` várias vezes com cache vazio e rede reduzida.
- Registrar o primeiro quadro e o quadro final para confirmar que não existe troca de fonte.
- Conferir Manrope nos pesos 400, 500, 600 e 700 e Yellowtail nos exemplos manuscritos.
- Confirmar que as demais páginas continuam abrindo normalmente e sem mensagens de erro.
