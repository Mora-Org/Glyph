# Bug Fixes — PEG
Registro de bugs encontrados e como foram resolvidos.

## Bug: TC002 — Ausência de mensagem de erro ao tentar criar projeto sem nome
- **Data:** 2026-03-26 | **Status:** ✅ Resolvido
- **Detectado por:** TestSprite (TC002)
- **Descrição:** O botão "Criar Projeto" era desabilitado quando o nome estava vazio, mas não havia nenhuma mensagem de erro visível para o usuário. O agente de teste clicou no botão e não encontrou feedback visual.
- **Resolução:** Adicionado estado `touched` no `Dashboard.tsx`. Ao submeter o form ou ao sair do input com campo vazio, exibe mensagem `"O nome do projeto é obrigatório."` com `role="alert"` para acessibilidade. O botão permanece funcional (não mais disabled) — a validação agora é explícita com feedback textual.
- **Aprendizado:** Botão desabilitado silenciosamente é invisível para testes automatizados e confuso para usuários. Preferir validação explícita com mensagem de erro.

---

## Bug: TC011 — Drag & drop de cenas não detectável por agentes de teste
- **Data:** 2026-03-26 | **Status:** ✅ Resolvido
- **Detectado por:** TestSprite (TC011)
- **Descrição:** O `@dnd-kit` usa `PointerSensor` que não expõe handles visíveis. O agente de teste não encontrou nenhum elemento interativo para arrastar as cenas na `SceneList`.
- **Resolução:** Separado o `{...listeners}` do botão de clique e movido para um handle visual dedicado (3×2 pontos, `aria-label="Arrastar cena"`). Agora o drag é ativado apenas no handle, e o clique no botão da cena continua funcionando normalmente. Aplicado igualmente aos items de pausa.
- **Aprendizado:** Sempre expor handles de drag visualmente — tanto para usabilidade quanto para testabilidade. `@dnd-kit` não gera handles automaticamente.
