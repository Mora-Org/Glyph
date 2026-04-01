# Plano de Implementação: Fase 5 - Pipeline de Exportação (FFmpeg)
Data: 2026-03-31
Versão: 1.0 (Elaborado por Antigravity)

Este plano detalha a arquitetura técnica para transformar o estado do `projectStore` em um vídeo final usando FFmpeg, integrado via Tauri. Baseado na necessidade de detalhamento granular solicitado pelo Claude Code.

---

## 1. Transformação de JSON para FFmpeg (Architecture)

A exportação será processada em uma única passada complexa para garantir consistência de cor e transições, utilizando o `filter_complex` do FFmpeg.

### 1.1. Estratégia "Canvas-to-Frames" (Background)
Para garantir que o export seja 100% fiel ao preview (estilos de fonte, kerning, filtros Fabric.js):
- **Exportação de Sequência**: O frontend renderizará cada frame da cena no Canvas e exportará como uma sequência de imagens PNG em uma pasta temporária.
- **Input Principal**: O FFmpeg usará `-i frames_%04d.png -framerate 30` como track base de vídeo.

### 1.2. Mapeamento de Assets Dinâmicos (Overlays)
Vídeos e GIFs, que seriam pesados demais para exportar via frames individuals no Canvas, serão sobrepostos pelo FFmpeg:
- **Inputs Secundários**: Arquivos originais de vídeo/GIF (`-i asset.mp4`).
- **Sincronia**: Uso de `overlay` com `enable='between(t, start, end)'`.
- **Aceleração**: A sequência de imagens e os vídeos de overlay serão processados via GPU (NVENC/AMF) para a codificação final.

---

## 2. Estrutura de Builders (`src/utils/ffmpeg/`)

Para manter a separação de responsabilidades, criaremos uma estrutura de classes:

- `FFmpegArgsBuilder`: Classe principal que recebe o `Project` e coordena a geração da string final.
- `FilterGraphBuilder`: Helper para construir a cadeia de filtros (ex: `[0:v]scale=...[v0]; [v0][1:v]overlay=...[v1]`).
- `InputManager`: Garante que o mesmo arquivo de asset não seja carregado múltiplas vezes como input `-i`, usando referências de índice.

---

## 3. Comando Rust (`src-tauri/src/main.rs`) & Eventos

O backend em Rust será o responsável por spawnar o processo FFmpeg.

- **Comando**: `export_video(args: Vec<String>, total_duration: f64)`.
- **Execução**: Usará `std::process::Command` com `Stdio::piped()` para capturar o `stderr`.
- **Monitoramento de Progresso**:
    - O Rust lerá as linhas do `stderr`.
    - Procurará pelo padrão `time=HH:MM:SS.ms`.
    - Converterá esse tempo em segundos e calculará: `(current_time / total_duration) * 100`.
    - Emitirá um evento Tauri `export-progress` com o payload `{ percentage: number, status: 'rendering' }`.

---

## 4. Detecção de GPU (Hardware Acceleration)

O módulo `gpu.rs` será criado para interrogar o FFmpeg antes de iniciar a renderização:

1. **Probe**: Executa `ffmpeg -encoders` e verifica presença de:
    - `h264_nvenc` (Nvidia)
    - `h264_amf` (AMD)
    - `h264_qsv` (Intel)
2. **Fallback**: Se nenhum encoder de hardware for encontrado ou falhar no início, o sistema reverterá automaticamente para `libx264` (CPU).
3. **Seleção de Preset**: Usar presets de baixa latência/performance (`p1` a `p7` no NVENC ou `ultrafast` a `medium` no x264).

---

## 5. UI do Botão "Exportar" e Feedback

- **Componente `ExportButton`**: Localizado no header ou sidebar.
- **Modal de Exportação**:
    - Botão "Iniciar Exportação".
    - Barra de progresso circular ou linear (via `export-progress` do Tauri).
    - Status textual (ex: "Processando Cena 2/5...", "Finalizando...").
    - Ao concluir: Botão "Abrir Pasta" e "Ver Vídeo".

---

## Critérios de Aceite (QA / TestSprite)
- [ ] O comando FFmpeg gerado deve ser logado no terminal para inspeção.
- [ ] A barra de progresso deve ser fluida (não pular de 0% para 100%).
- [ ] Se o FFmpeg falhar (ex: asset faltando), a UI deve mostrar o erro retornado pelo Rust.
- [ ] O vídeo gerado deve abrir em players padrão (VLC/Windows Media Player).
