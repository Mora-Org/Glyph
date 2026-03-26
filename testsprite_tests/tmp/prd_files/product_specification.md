# Product Specification Document (PSD): PEG — Gerador de Ensaios Visuais

## 1. Executive Summary
PEG is an open-source desktop application designed for high-aesthetic visual essays and motion design. Unlike linear video editors, PEG focuses on **granular typography control (lettering)**, dynamic scene composition, and hardware-optimized rendering using FFmpeg and Tauri.

## 2. System Architecture
- **Desktop Wrapper:** Tauri (Rust) for native performance and security.
- **Frontend UI:** Next.js (Static Export) / React.
- **Graphic Engine:** Fabric.js or Konva.js (2D Canvas) for drag-and-drop and element manipulation.
- **Render Engine:** FFmpeg (Native execution via Tauri sidecar/commands).
- **State Management:** JSON-based scene serialization for project persistence.

## 3. Core Features

### 3.1. Scene & Timeline Engine
- **Sequential Structure:** Projects consist of a list of `Scene` objects.
- **Element-level Timelines:** Every asset (image, text, GIF) has its own entrance/exit time within a scene duration.
- **Active Pauses:** Configurable "filler" blocks (static noise, VHS artifacts, solid colors).

### 3.2. Advanced Typography (The "Killer" Feature)
- **Character-level Manipulation:** Break strings into individual characters with independent X/Y, font, size, and color.
- **Clipping Masks:** Real-time video-in-text rendering using Canvas compositing.
- **Aesthetic Presets:** "Anxiety tremor," "Neon flicker," and "Comic lettering" animations.

### 3.3. Asset Management
- **Local-First:** Direct file system access via Tauri (no internal uploads).
- **Categorization:** native support for `.ttf/.otf` (fonts), `.jpg/.png` (images), `.mp4/.mov` (videos), and `.gif`.

### 3.4. Export & Hardware Optimization
- **Hardware-Aware Rendering:** Auto-selection of GPU drivers (NVENC/AMF) or CPU Multithreading.
- **Consistency:** FFmpeg-backed exports to ensure cross-platform (Win/Linux) parity for `.mp4` and `.mov`.

## 4. User Journey
1. **Import:** User points PEG to a local folder of assets.
2. **Compose:** User drags assets onto the Canvas, adjusts character spacing/overlap for "lettering" style.
3. **Sequencing:** User arranges scenes and sets individual element durations.
4. **Preview:** Real-time CSS-based filters and Canvas rendering.
5. **Render:** One-click export using optimized hardware settings.

## 5. Non-Functional Requirements
- **Performance:** App must be lightweight (< 100MB install size).
- **UX:** Highly responsive UI for real-time visual feedback.
- **Extensibility:** Support for custom FFmpeg filter strings.
