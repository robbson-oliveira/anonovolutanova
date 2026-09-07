# Levantamento: o que falta no Design System

Criar uma nova página de auditoria que lista, de forma organizada, tudo que aparece na home (wireframe) e nas seções do site mas **não** está documentado no catálogo atual do Design System.

## O que foi verificado

O catálogo atual (`/design-system`) documenta 8 eixos: Tipografia, Cores & Superfícies, Componentes, Layout & Espaçamento, Elevação & Sombras, Movimento, Ícones e Assets.

Em "Componentes" só existem hoje: Button, Badge, Card, Tabs, Accordion, EditionSelector — mais Reveal, Counter e Marquee dentro de Movimento.

## Lacunas confirmadas (irão para a nova página)

Peças que existem no código/na home e não têm ficha no catálogo:

1. **Barra fixa do topo (TopBar)** — faixa escura de 36px com esteira de avisos, ícones alternados (caixa/asterisco) e botão de fechar. Existe como seção, mas o catálogo só mostra a esteira isolada, sem o comportamento fixo, o dispensar e a altura reservada.
2. **Cabeçalho do site (SiteHeader)** — logo, navegação, botão de conta e CTA; sem ficha e sem estado mobile documentado.
3. **Rodapé (SiteFooter)** — textura, ornamento e blocos de links.
4. **Carousel** — usado nos depoimentos, exportado pelo DS, ausente do catálogo.
5. **BookCover** e **BookStage / card de preço flutuante** — peça central do hero, com animação de leque, sem documentação.
6. **Container, Section, Heading, Text, Eyebrow** — primitivos estruturais exportados pelo DS e nunca exibidos.
7. **Cards em suas variações reais** — hoje só há uma amostra genérica de elevação. Faltam: card de data litúrgica com ícone, card de depoimento (avatar + estrelas), card de conteúdo da seção Sobre (terracota), card de preço.
8. **Bloco de FAQ** — o Accordion aparece cru; falta a variação real usada na home (`variant="cards"`, numerado, primeiro item aberto).
9. **Bloco de estatísticas** — números grandes com Counter e legenda.
10. **Bloco de citação** — tipografia manuscrita em destaque.
11. **Bloco de persona / checklist** — lista com ícone de check.
12. **Bloco de oferta** — superfície sage, selos, preço, parcelamento e lista de benefícios.
13. **Bloco de fechamento (Closing)** — superfície escura com selos e CTA.
14. **Selos/Badges em contexto** — os tons existem, mas não há exemplo de uso real (selo sobre foto, selo sobre fundo escuro).

## A nova página

Rota nova: `/design-system/lacunas`, ligada por um link discreto no topo do catálogo (não entra na navegação pública do site).

Conteúdo, no mesmo visual do catálogo:
- Resumo no topo com a contagem de itens pendentes.
- Itens agrupados em: **Estrutura de página**, **Componentes**, **Blocos de conteúdo**, **Estados e variações**.
- Cada item traz: nome, onde aparece na home, o que falta documentar e prioridade (alta / média / baixa).
- Nenhuma alteração no wireframe, nos tokens ou nos componentes existentes — a página é só o levantamento.

## Notas técnicas

- Novo arquivo de rota `src/routes/design-system.lacunas.tsx` + página em `src/app/design-system/lacunas/page.tsx`, reaproveitando os utilitários visuais já usados no catálogo (Container, Section, Heading, Text, Eyebrow, Card).
- Dados da auditoria em um array tipado no topo do arquivo, fácil de atualizar conforme os itens forem sendo documentados.
- `head()` próprio com título e descrição específicos.
