# Prompt — Pesquisa de Afiliadas no Instagram

**Usar com:** Claude + extensão Claude-in-Chrome ativa, Chrome com Instagram logado.

---

Você tem acesso ao meu Chrome com Instagram logado. Preciso que você pesquise 27 perfis de afiliadas da Agenda Ano Novo, Luta Nova (@anonovolutanova) e salve tudo em arquivo — não jogue nada no chat para economizar tokens.

**OBJETIVO:** entender quem são essas mulheres para construir personas de público mais precisas. São personas validadas — compraram, acreditaram o suficiente para revender, e têm seguidores parecidos com elas.

**REGRA CRÍTICA:** não escreva nada no chat além de progresso mínimo ("pesquisando 1/27…"). Todo o conteúdo — dados brutos e análise final — vai direto para o arquivo de saída.

---

## Lista de perfis

1. @catequistasporvocacao
2. @susanablancomarques
3. @nathaliajunqueiira
4. @kemilygabriela_
5. @aninhafortunato
6. @thayane.rodriguess
7. @drajessicajunqueira
8. @harttenmusic
9. @julianapoiares
10. @henrique.cal
11. @waleska__montenegro
12. @caserluiza
13. @elamenescal
14. @luana.m
15. @taynara.negrao
16. @nycollepaiva
17. @dravanessawink
18. @carolinacoutinhoc
19. @arianesantiagoprofe
20. @liviasimon_fisioterapeuta
21. @carlaccal
22. @dani.carvalhov
23. @danielsousaweb
24. @biancaquevedopsi
25. @thaisgois
26. @drapaulaserman
27. @Sebo.faroldasletras

---

## O que extrair de cada perfil

Navegue em `https://www.instagram.com/[handle]/`. Use **get_page_text** (não read_page — é muito mais leve). Não abre posts individuais.

Para cada perfil, registre em formato de seção markdown:

```
## @handle

- **Nome:** (como aparece no perfil)
- **Bio:** (texto exato)
- **Seguidores:** (número)
- **Posts:** (quantidade)
- **Nicho:** (ex: saúde, catequese, música, educação, lifestyle, psicologia...)
- **Localização:** (se aparecer; caso contrário: não informada)
- **Religiosidade explícita:** Sim / Não
- **Tom:** pessoal · profissional · educativo · devocional · misto
- **Observação:** (uma linha com o que for relevante para entender o público da agenda)
```

---

## Arquivo de saída

Salve em: `F:\Websites\agenda2027\outputs\afiliadas-pesquisa.md`

Estrutura do arquivo:

```markdown
# Pesquisa de Afiliadas — Agenda Ano Novo, Luta Nova
Data: [data de hoje]
Total pesquisado: 27 perfis

---

## Dados por perfil

[seções de cada @handle aqui]

---

## Análise agregada

### Nichos/profissões dominantes
[lista com contagens]

### Religiosidade explícita
X de 27 (XX%) têm referência explícita a fé católica na bio ou posts visíveis.

### Profissionais de saúde, educação ou área de cuidado
X de 27 (XX%)

---

## 4 Personas do público da Agenda Ano Novo, Luta Nova

(baseadas exclusivamente nos 27 perfis pesquisados, não em suposições)

### Persona 1 — [Nome fictício]
- **Idade estimada:**
- **Profissão:**
- **Rotina típica:**
- **Relação com a fé:**
- **Dor principal que a agenda resolve:**
- **Como descobriria a agenda:**

[repetir para personas 2, 3 e 4]
```
