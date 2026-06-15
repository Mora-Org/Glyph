# Plano de Implementação: Fase 6 - Refinamento Visual da Timeline (v2a)
Data: 2026-04-02
Versão: 1.0 (Elaborado por Antigravity)

Este plano detalha o "Visual Polish" da timeline do Glyph, focando em respiro (padding), contraste e hierarquia visual, conforme aprovado pelo César. O objetivo é elevar a estética para o padrão "Premium" da Mora.

---

## 1. Alterações de Layout (CSS & Tailwind)

### 1.1. Dimensões Globais
- **Timeline Bar**: Aumentar a altura total do container de ~48px para **72-80px**.
- **Scene Cards**: Aumentar a largura mínima de `w-36` para algo mais proporcional à nova altura, se necessário (ex: `w-40`).

### 1.2. Padding e Respiro
- **SceneItem**: Alterar `px-4 py-2.5` para `px-5 py-3.5`.
- **Gaps**: Garantir que o gap entre o nome da cena e os metadados seja de pelo menos `4px`.

---

## 2. Cores e Contraste

### 2.1. Tipografia
- **Nome da Cena**: Manter `white` ou `#F5F5F5`.
- **Metadados (5s · 0 elem.)**: Trocar `text-white/30` por uma opacidade maior (`text-white/50`) ou cor fixa `#999` para garantir legibilidade.
- **Transições**: O texto "CUT" ou "PRETO" deve subir de `text-[8px]` para `text-[11px]` e usar cor `#AAA`.

### 2.2. Estado Ativo (Active Scene)
- **Border**: Em vez de `border-white` sólido, usar algo mais sutil como `border-white/40` com um leve `box-shadow` (glow) para destacar sem "gritar".
- **Background**: Considerar um gradiente linear muito sutil no fundo do card ativo.

---

## 3. Componentes Específicos

### 3.1. TransitionBadge
- Aumentar o container da transition para ser mais clicável.
- Melhorar o contraste dos labels internos.

### 3.2. Botões de Ação (+Cena, +Pausa)
- Agrupar visualmente em um bloco que pareça uma "Toolbar" integrada, separada das cenas por um divisor (`border-l`).
- Garantir que tenham o mesmo padding interno redefinido (`px-5 py-3`).

---

## 4. Arquivos Alvo

- `src/components/timeline/SceneList.tsx`
- `src/components/timeline/TransitionBadge.tsx`
- `src/index.css` (para utilitários glass)

---

## Critérios de Aceite (QA / TestSprite)
- [ ] A timeline deve manter o scroll horizontal funcional.
- [ ] O menu de "Pausa" deve continuar abrindo acima dos botões sem ser cortado.
- [ ] O contraste do texto de duração deve passar no teste visual (legível em brilho médio).
- [ ] Nenhum texto de cena deve encostar nas bordas do card (padding visível).
