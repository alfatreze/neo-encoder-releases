# NEO Compressor

NEO Compressor is a local desktop app for image compression, conversion, and batch processing. Drop images into **Zen** for a quick run, or open **Architect** to build a reusable recipe with effects, encoders, and multiple outputs. Image processing runs on your device.

## Download

Open [Releases](https://github.com/alfatreze/neo-encoder-releases/releases) for published installers and release notes. Version 0.1 targets **Windows x64** with an EXE or MSI and **Linux x64** with an AppImage or Debian package built on Ubuntu 22.04. These builds are unsigned.

## Features

- **Zen** offers drag-and-drop batching, per-format recipe defaults, Fast, Balanced, and Thorough presets, and optional compress-on-drop with safe replacement when the result is smaller and stays in the same format.
- **Architect** offers a node graph, reusable groups, typed connections, per-branch previews and tests, output selection, and export from the current draft. The last encoder determines the file format.
- **Recipes** include ImageOptim-inspired Lossless and Lossy presets for PNG, JPEG, GIF, and SVG. Save your own recipes or share them as portable `.neo.json` files.
- **Effects and geometry** include resize, upscale, crop, transparent trim, grayscale, blur, denoise, alpha preparation, palette reduction, and dithering.
- **Comparison and metadata** include source/output previews, a draggable split view, PSNR and SSIM, per-pass timing and savings, target-size tuning, and reports on metadata kept, removed, or restored.
- **Automation** is available in the development project through a CLI and a local MCP server with batch progress and cancellation. The desktop installers contain the graphical app.

## Codecs by app category

NEO has **40 encoder and optimizer nodes** across **29 output format labels**. The count includes distinct encoder variants for the same format. HDR input and several platform-specific exports are still experimental or planned. The desktop accepts static PNG, JPEG, still or animated GIF, and SVG as inputs.

### Compression

- **PNG** · Encode PNG, PNG Palette, pngquant, OxiPNG, Zopfli
- **JPEG** · MozJPEG, Lossless JPEG
- **GIF** · Encode GIF, Gifsicle
- **SVG** · SVGO
- **WebP** · WebP
- **OpenEXR** · Encode OpenEXR

### Game formats

- **TIM1** · TIM1 for Tau Alpha covers
- **DDS** · Encode DDS *(experimental)*
- **TGA** · Encode TGA
- **QOI** · Encode QOI

### Retro formats

- **PCX** · Encode PCX
- **IFF/ILBM** · Amiga ILBM

### Nintendo

- **CHR** · NES CHR, SNES CHR
- **2BPP** · Game Boy 2bpp
- **4BPP** · GBA 4bpp tiles
- **8BPP** · GBA 8bpp tiles
- **BGR555** · GBA BGR555 bitmap
- **NCGR** · DS NCGR tiles *(experimental)*
- **NCLR** · DS NCLR palette *(experimental)*
- **NSCR** · DS NSCR tilemap *(experimental)*
- **NSBTX** · DS NSBTX texture *(experimental)*
- **TPL** · GameCube / Wii TPL *(experimental)*
- **BFLIM** · 3DS BFLIM *(experimental)*

### PlayStation

- **TIM** · PS1 TIM Indexed, PS1 TIM Direct
- **GIM** · PSP GIM *(experimental)*
- **GXT** · PS Vita GXT *(experimental)*

### Analogue Pocket

- **BIN** · Pocket library image, Pocket core icon, Pocket platform image *(platform image experimental)*

### GPU textures

- **KTX2** · ETC1S, UASTC *(experimental)*
- **ASTC** · Encode ASTC *(experimental)*

## Roadmap

| Status | Work |
| --- | --- |
| Available in 0.1 | Zen and Architect, reusable recipes, ImageOptim-style presets, effects, quality and metadata comparison, and the codec library above. |
| In progress | Installer testing and signing across desktop platforms, broader validation of experimental texture exports, and codec benchmarks on representative images. |
| Next | Expand headless codec coverage, improve recipe reuse, and add more decoders. |
| Planned | Native HDR input, Tau Gallery integration, desktop MCP job integration, remote MCP, and external tool nodes. |
