# Melhorias de UI — Timeline e Editor
> Anotadas em 02/04/2026 com base em feedback visual do César

---

## Problemas principais identificados

### 1. Cartões de cena sem respiração
- **Problema:** texto ocupa 100% da largura do cartão, sem padding interno. Nome da cena e metadados ("5s · 0 elem.") ficam colados nas bordas.
- **Solução:** aumentar padding horizontal interno dos cartões (mínimo `12px` em cada lado). Adicionar padding vertical interno também.

### 2. Barra da timeline muito estreita/baixa
- **Problema:** a barra inferior é fina demais, os cartões ficam achatados. Difícil clicar e difícil ler.
- **Solução:** aumentar a altura da barra da timeline de ~40px para ~72–80px. Isso dá espaço para o nome da cena em tamanho legível e os metadados em uma linha abaixo com menos destaque.

### 3. Contraste fraco — texto em cinza no fundo escuro
- **Problema:** "5s · 0 elem." e outros textos em tons de cinza médio são quase ilegíveis no fundo escuro.
- **Solução:**
  - Nome da cena: `white` ou `#F5F5F5`
  - Metadados (duração, elementos): `#888` no mínimo, ou melhor `#999`
  - Cartão ativo: fundo levemente elevado (`#1C1C1C` ou com borda branca fina de `1px`)

### 4. Labels "CUT" e "PRETO" entre cenas são ilegíveis
- **Problema:** os conectores entre cenas com o tipo de transição ("CUT", "PRETO") são minúsculos e quase invisíveis.
- **Solução:** aumentar o tamanho da fonte para `10–11px`, usar cor mais visível (`#AAA`). Considerar um ícone pequeno ao lado do label.

### 5. Botões "Cena" e "Pausa" soltos no canto inferior direito
- **Problema:** os botões estão isolados sem contexto visual, parece que não pertencem à timeline.
- **Solução:**
  - Agrupar visualmente com a barra da timeline (mesmo container, separados por um divisor)
  - Aumentar padding interno dos botões (mínimo `8px 16px`)
  - Adicionar um tooltip ou label secundária que explique a ação ("+ Cena", "+ Pausa")
  - Manter ícone + texto, mas com mais espaço entre eles

### 6. Texto do botão "Exportar" e "Lettering" sem padding
- **Problema:** os botões do topo direito também parecem comprimidos.
- **Solução:** padding mínimo de `8px 20px`, garantir que o ícone e o texto tenham `6–8px` de gap.

---

## Prioridade sugerida

| Prioridade | Item |
|---|---|
| Alta | Aumentar altura da timeline bar |
| Alta | Adicionar padding interno nos cartões |
| Alta | Melhorar contraste dos textos (cinzas) |
| Média | Botões "Cena" e "Pausa" com mais respiro |
| Média | Labels de transição (CUT/PRETO) mais legíveis |
| Baixa | Botões do topo (Lettering/Exportar) |

---

## Referência visual de altura ideal

```
┌─────────────────────────────────────────────────────────────┐
│  Cena 1          CUT  Cena 2          CUT  Cena 3      │ + Cena  │
│  5s · 0 elem.         5s · 0 elem.         5s · 0 elem. │ ⏸ Pausa │
└─────────────────────────────────────────────────────────────┘
  ← cartões com padding →                               ← botões →
```
