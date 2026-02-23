import React, { useRef, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';

// -------------------------------------------------
// TilesetEditor - Visualizador/seletor de tileset
// Exibe tileset importado em uma grade de tiles
// Permite selecionar tiles para pintar no mapa
// Resolucao do Mega Drive: tiles 8x8 pixels
// -------------------------------------------------

const TILE_SIZE = 8; // Tiles do Mega Drive sao 8x8 pixels

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CanvasWrapper = styled.div`
  position: relative;
  border: 1px solid #0f3460;
  border-radius: 4px;
  overflow: auto;
  max-height: 300px;
  background: #0d0d1a;

  &::-webkit-scrollbar { width: 6px; height: 6px; }
  &::-webkit-scrollbar-track { background: #0d0d1a; }
  &::-webkit-scrollbar-thumb { background: #0f3460; border-radius: 3px; }
`;

const TileCanvas = styled.canvas`
  display: block;
  image-rendering: pixelated;
  cursor: crosshair;
`;

const InfoBar = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #555;
  padding: 0 2px;

  span { color: #e94560; }
`;

const UploadArea = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 16px;
  border: 2px dashed #0f3460;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 11px;
  color: #555;
  text-align: center;

  &:hover {
    border-color: #e94560;
    color: #aaa;
  }

  input { display: none; }
  .icon { font-size: 24px; }
`;

const SelectionInfo = styled.div`
  padding: 4px 8px;
  background: rgba(233,69,96,0.1);
  border: 1px solid rgba(233,69,96,0.3);
  border-radius: 4px;
  font-size: 10px;
  color: #e94560;
`;

export interface TilesetEditorProps {
  imageUrl?: string;
  tilesPerRow?: number;
  zoom?: number;
  onTileSelect?: (tileIndex: number, tileX: number, tileY: number) => void;
  onImageLoad?: (imageUrl: string, width: number, height: number) => void;
}

const TilesetEditor: React.FC<TilesetEditorProps> = ({
  imageUrl,
  tilesPerRow,
  zoom = 2,
  onTileSelect,
  onImageLoad,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number; idx: number } | null>(null);
  const [imgDimensions, setImgDimensions] = useState({ w: 0, h: 0 });

  const tileW = TILE_SIZE * zoom;
  const tileH = TILE_SIZE * zoom;

  // Carrega a imagem quando imageUrl muda
  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.onload = () => {
      setLoadedImage(img);
      setImgDimensions({ w: img.width, h: img.height });
      if (onImageLoad) onImageLoad(imageUrl, img.width, img.height);
    };
    img.src = imageUrl;
  }, [imageUrl, onImageLoad]);

  // Desenha o tileset no canvas com grid
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImage) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tilesX = Math.floor(loadedImage.width / TILE_SIZE);
    const tilesY = Math.floor(loadedImage.height / TILE_SIZE);
    canvas.width = tilesX * tileW;
    canvas.height = tilesY * tileH;

    // Desabilita suavizacao para pixel art
    ctx.imageSmoothingEnabled = false;

    // Desenha imagem escalada
    ctx.drawImage(loadedImage, 0, 0, loadedImage.width * zoom, loadedImage.height * zoom);

    // Grid de tiles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 0.5;
    for (let tx = 0; tx <= tilesX; tx++) {
      ctx.beginPath();
      ctx.moveTo(tx * tileW, 0);
      ctx.lineTo(tx * tileW, tilesY * tileH);
      ctx.stroke();
    }
    for (let ty = 0; ty <= tilesY; ty++) {
      ctx.beginPath();
      ctx.moveTo(0, ty * tileH);
      ctx.lineTo(tilesX * tileW, ty * tileH);
      ctx.stroke();
    }

    // Destaque do tile selecionado
    if (selectedTile) {
      ctx.strokeStyle = '#e94560';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        selectedTile.x * tileW + 1,
        selectedTile.y * tileH + 1,
        tileW - 2,
        tileH - 2
      );
      ctx.fillStyle = 'rgba(233, 69, 96, 0.25)';
      ctx.fillRect(selectedTile.x * tileW, selectedTile.y * tileH, tileW, tileH);
    }
  }, [loadedImage, zoom, tileW, tileH, selectedTile]);

  useEffect(() => { draw(); }, [draw]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!loadedImage) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const tx = Math.floor((e.clientX - rect.left) / tileW);
    const ty = Math.floor((e.clientY - rect.top) / tileH);
    const tilesX = Math.floor(loadedImage.width / TILE_SIZE);
    const idx = ty * tilesX + tx;
    setSelectedTile({ x: tx, y: ty, idx });
    if (onTileSelect) onTileSelect(idx, tx, ty);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const url = evt.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setLoadedImage(img);
        setImgDimensions({ w: img.width, h: img.height });
        if (onImageLoad) onImageLoad(url, img.width, img.height);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  if (!loadedImage) {
    return (
      <Wrapper>
        <UploadArea>
          <input type="file" accept="image/png,image/bmp" onChange={handleFileUpload} />
          <span className="icon">🧩</span>
          <span>Clique para importar tileset</span>
          <span style={{ fontSize: '9px' }}>PNG ou BMP - tiles 8x8px</span>
        </UploadArea>
      </Wrapper>
    );
  }

  const tilesX = Math.floor(imgDimensions.w / TILE_SIZE);
  const tilesY = Math.floor(imgDimensions.h / TILE_SIZE);

  return (
    <Wrapper>
      <InfoBar>
        <span>Tileset: {imgDimensions.w}x{imgDimensions.h}px</span>
        <span><span>{tilesX * tilesY}</span> tiles ({tilesX}x{tilesY})</span>
      </InfoBar>
      <CanvasWrapper>
        <TileCanvas
          ref={canvasRef}
          onClick={handleCanvasClick}
        />
      </CanvasWrapper>
      {selectedTile && (
        <SelectionInfo>
          Tile #{selectedTile.idx} selecionado ({selectedTile.x},{selectedTile.y})
        </SelectionInfo>
      )}
    </Wrapper>
  );
};

export default TilesetEditor;
