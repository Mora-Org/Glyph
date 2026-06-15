# Plano de Implementação: Fase 9 — VOID Engine (AI Physical Inpainting)
Data: 2026-04-05
Versão: 1.0 (Elaborado por Antigravity)

Este plano descreve a integração do modelo **Netflix VOID** no **Glyph**.

## 1. Viabilidade Técnica
- **Modelo:** Netflix VOID (Apache 2.0).
- **Arquitetura:** CogVideoX-5b-InP (Transformer-3D + 3D-VAE).
- **Hardware Alvo:** GPUs com 12GB+ VRAM (FP16) ou 8GB (INT8).

## 2. Estratégia de "Refatoração Rust"
Para atender ao requisito de performance nativa e integração com o backend Tauri do Glyph:
1. **Exportação ONNX:** Converter os pesos do HuggingFace para formato ONNX.
2. **Runtime ORT:** Usar a crate `ort` em Rust para inferência zero-python.
3. **Rust Bridge:** Implementar o pré-processamento de tensores em Rust puro para garantir o selo de "Safe & Fast".

## 3. RoadMap de Implementação (Claude Code)
1. **v1 (Research):** Scripts de conversão de pesos PyTorch -> ONNX.
2. **v2 (Backend):** Bridge Rust/ONNX e setup do `ort` no Tauri.
3. **v3 (Canvas):** Ferramenta de seleção Quadmask no Fabric.js.
4. **v4 (Pipeline):** Integração final com FFmpeg para inpainting de cenas completas.

## 4. Critérios de Aceite
- [ ] Remoção de objeto em vídeo de 5s em menos de 1 minuto (RTX 30-series).
- [ ] Inexistência de artefatos visuais grosseiros no inpainting.
- [ ] Consistência temporal entre frames.
