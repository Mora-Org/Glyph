# Bug Fixes — PEG
Registro de bugs encontrados e como foram resolvidos.

## Bug: Loop infinito "getSnapshot should be cached" ao abrir projeto antigo (F5)
- **Data:** 2026-06-15 | **Status:** ✅ Resolvido
- **Detectado por:** Boss (runtime, ao revisar a F5 com um projeto salvo antes do campo `audioTracks` existir)
- **Descrição:** `AudioTrackArea.tsx` selecionava as trilhas com `useProjectStore((s) => s.project?.audioTracks ?? [])`. Quando `audioTracks` vem `undefined` (projeto persistido por um schema antigo, anterior ao multi-track de áudio), o `?? []` cria um **array novo a cada chamada**. O `useSyncExternalStore` do Zustand compara o retorno do `getSnapshot` por referência → vê "mudança" sempre → re-render em loop infinito (`AudioTrackLabels` em `SceneList` → `Editor`). Além do loop, qualquer ação de áudio (`addAudioTrack` faz `[...s.project.audioTracks]`) quebraria com `audioTracks` undefined.
- **Resolução (dupla):**
  1. **Referência estável no seletor** — constante de módulo `EMPTY_TRACKS: AudioTrack[] = []` usada como fallback nos dois seletores (`AudioTrackLabels` e `AudioTrackLanes`). `getSnapshot` passa a retornar sempre a mesma referência → sem loop.
  2. **Cura no rehydrate** — `merge` no `persist` do `projectStore` faz backfill de `timeline`, `audioTracks` e `currentTime` ausentes ao carregar do localStorage. Projetos antigos passam a ter `audioTracks: []` em memória, então as ações da store e o `ExportModal` deixam de quebrar.
- **Verificação:** Playwright semeando um projeto sem `audioTracks` no localStorage → **0 warnings de loop, 0 erros**, e `+ VO` adiciona trilha sem crash (prova que o merge curou o projeto em memória).
- **Aprendizado:** Seletor de store **nunca** deve retornar literal novo (`?? []`, `.map`, `{...}`) sem memoização — `useSyncExternalStore` entra em loop. Use referência estável (constante de módulo) ou `useShallow`. E todo campo novo de schema persistido precisa de backfill no `merge`/`migrate`, senão projetos antigos quebram silenciosamente.

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
