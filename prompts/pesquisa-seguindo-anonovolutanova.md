# Prompt — Quem @anonovolutanova está seguindo

**Usar com:** Claude + extensão Claude-in-Chrome ativa, Chrome com Instagram logado.
**Modelo recomendado:** Haiku 4.5 para coleta; Opus para análise final se necessário.

---

Você tem acesso ao meu Chrome com Instagram logado. Preciso que você:

1. Acesse `https://www.instagram.com/anonovolutanova/`
2. Abra a lista de "Seguindo" do perfil
3. Anote todos os handles que aparecerem
4. Pesquise cada um desses perfis

**REGRA CRÍTICA:** não escreva nada no chat além de progresso mínimo ("✓ X/total @handle"). Todo o conteúdo vai direto para o arquivo de saída. Use sempre `get_page_text` — nunca `read_page`.

---

## Passo 1 — Extrair a lista de seguindo

- Navegue em `https://www.instagram.com/anonovolutanova/`
- Clique em "Seguindo" para abrir o modal
- Role a lista até o fim para carregar todos os perfis
- Anote todos os @handles visíveis

## Passo 2 — Pesquisar cada perfil

Para cada @handle da lista, navegue em `https://www.instagram.com/[handle]/` e use `get_page_text`. Registre:

```
## @handle

- Nome:
- Bio:
- Seguidores:
- Nicho:
- Localização:
- Religiosidade explícita: Sim/Não
- Tom: pessoal · profissional · educativo · devocional · misto
- Obs: (relevância para entender o universo da marca)
```

---

## Arquivo de saída

Salve em: `F:\Websites\agenda2027\outputs\seguindo-anonovolutanova.md`

Estrutura:

```markdown
# Quem @anonovolutanova segue — Pesquisa de perfis
Data: [hoje]
Total de contas seguidas: [número]
Total pesquisado: [número]

## Lista completa de handles seguidos
[lista simples de @handles]

## Dados por perfil
[seções de cada @handle]

## Análise agregada
- Total seguido: X contas
- Nichos dominantes: [lista com contagens]
- Religiosidade explícita: X/total (XX%)
- Clusters identificados: [grupos temáticos que a marca orbita]
- Perfis que também aparecem na lista de afiliadas: [interseção]

## Insights estratégicos
- O que a marca consome/monitora que não aparece no conteúdo público?
- Quais nichos ela orbita mas ainda não explora no feed?
- Oportunidades de collab não óbvias a partir do que ela segue?
```
