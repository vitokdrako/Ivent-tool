import React, { useState, useRef, useEffect } from 'react';
import Moveable from 'react-moveable';

const MoodboardCanvas = ({ board, onClose, onSave }) => {
  const [elements, setElements] = useState(board.canvasLayout?.elements || []);
  const [selectedId, setSelectedId] = useState(null);
  const [background, setBackground] = useState(board.canvasLayout?.background || '#ffffff');
  const [textMode, setTextMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef(null);

  // Initialize elements from board items if not loaded
  useEffect(() => {
    if (elements.length === 0 && board.items && board.items.length > 0) {
      // Don't auto-add, keep carousel for manual drag
    }
  }, []);

  const handleAddItem = (item) => {
    const newElement = {
      id: `item-${Date.now()}`,
      type: 'product',
      productId: item.product_id,
      productName: item.product?.name,
      imageUrl: item.product?.image_url,
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      rotation: 0,
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const handleAddText = () => {
    const newElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'Текст тут',
      x: 150,
      y: 150,
      width: 200,
      height: 50,
      fontSize: 24,
      color: '#333333',
      fontWeight: 'normal',
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
    setTextMode(false);
  };

  const handleDragElement = (id, translate) => {
    setElements(
      elements.map((el) =>
        el.id === id ? { ...el, x: el.x + translate[0], y: el.y + translate[1] } : el
      )
    );
  };

  const handleResizeElement = (id, width, height) => {
    setElements(
      elements.map((el) =>
        el.id === id ? { ...el, width, height } : el
      )
    );
  };

  const handleRotateElement = (id, rotation) => {
    setElements(
      elements.map((el) =>
        el.id === id ? { ...el, rotation } : el
      )
    );
  };

  const handleDeleteElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
    setSelectedId(null);
  };

  const handleUpdateText = (id, content) => {
    setElements(
      elements.map((el) =>
        el.id === id ? { ...el, content } : el
      )
    );
  };

  const handleSaveCanvas = async () => {
    const canvasLayout = {
      elements,
      background,
      zoom,
      updatedAt: new Date().toISOString(),
    };
    
    await onSave(canvasLayout);
  };

  const selectedElement = elements.find((el) => el.id === selectedId);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
      {/* Header */}
      <div className="fd-header flex items-center justify-between" style={{padding: '16px 32px', background: '#fff', borderBottom: '1px solid #e3e3e3'}}>
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="fd-btn fd-btn-secondary">
            ← Назад
          </button>
          <h2 className="font-bold" style={{fontSize: '18px', color: '#333'}}>
            📋 {board.board_name} - Візуальний мудборд
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="fd-btn fd-btn-secondary">
            −
          </button>
          <span style={{fontSize: '12px', color: '#666', minWidth: '50px', textAlign: 'center'}}>
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="fd-btn fd-btn-secondary">
            +
          </button>
          <button onClick={handleSaveCanvas} className="fd-btn fd-btn-black">
            💾 Зберегти
          </button>
        </div>
      </div>

      {/* Main Content - Canvas + Right Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side - Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div style={{background: '#fff', borderBottom: '1px solid #e3e3e3', padding: '12px 32px'}}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="fd-label">🎨 Фон:</span>
                <input
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="fd-input"
                  style={{width: '60px', height: '32px', padding: '2px'}}
                />
                <button
                  onClick={() => setBackground('#ffffff')}
                  className="fd-btn fd-btn-small"
                  style={{background: '#fff', border: '1px solid #ddd'}}
                >
                  Білий
                </button>
                <button
                  onClick={() => setBackground('#f5f5dc')}
                  className="fd-btn fd-btn-small"
                  style={{background: '#f5f5dc', border: '1px solid #ddd'}}
                >
                  Бежевий
                </button>
              </div>

              <div className="w-px h-6" style={{background: '#e3e3e3'}}></div>

              <button onClick={handleAddText} className="fd-btn fd-btn-secondary">
                📝 Додати текст
              </button>

              {selectedId && (
                <>
                  <div className="w-px h-6" style={{background: '#e3e3e3'}}></div>
                  <button
                    onClick={() => handleDeleteElement(selectedId)}
                    className="fd-btn fd-btn-small"
                    style={{color: '#c62828', border: '1px solid #c62828'}}
                  >
                    🗑️ Видалити
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto" style={{background: '#e8e8e8', padding: '40px'}}>
        <div
          ref={canvasRef}
          className="relative mx-auto"
          style={{
            width: '1200px',
            height: '800px',
            background: background,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedId(null);
            }
          }}
        >
          {/* Empty state */}
          {elements.length === 0 && (
            <div className="fd-empty" style={{paddingTop: '200px'}}>
              <div className="fd-empty-icon">🎨</div>
              <div className="fd-empty-title">Перетягніть товари сюди</div>
              <div className="fd-empty-text">
                Клацніть на товар вгорі щоб додати його на canvas.<br/>
                Використовуйте кнопку "Додати текст" для підписів.
              </div>
            </div>
          )}

          {/* Render elements */}
          {elements.map((element) => (
            <div
              key={element.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(element.id);
              }}
              style={{
                position: 'absolute',
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                transform: `rotate(${element.rotation || 0}deg)`,
                cursor: 'move',
                border: selectedId === element.id ? '2px solid #2196F3' : '2px solid transparent',
              }}
            >
              {element.type === 'product' ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: element.imageUrl
                      ? `url(https://www.farforrent.com.ua/${element.imageUrl.replace(/^static\//, '')})`
                      : 'linear-gradient(135deg, #f0f0f0, #e4e4e4)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
              ) : (
                <div
                  contentEditable={selectedId === element.id}
                  suppressContentEditableWarning
                  onBlur={(e) => handleUpdateText(element.id, e.target.textContent)}
                  style={{
                    width: '100%',
                    height: '100%',
                    fontSize: element.fontSize || 24,
                    color: element.color || '#333',
                    fontWeight: element.fontWeight || 'normal',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    outline: 'none',
                    background: 'transparent',
                  }}
                >
                  {element.content}
                </div>
              )}
            </div>
          ))}

          {/* Moveable for selected element */}
          {selectedId && selectedElement && (
            <Moveable
              target={document.querySelector(`[style*="left: ${selectedElement.x}px"]`)}
              draggable={true}
              resizable={true}
              rotatable={true}
              onDrag={({ target, transform, translate }) => {
                handleDragElement(selectedId, translate);
                target.style.transform = transform;
              }}
              onResize={({ target, width, height, delta }) => {
                handleResizeElement(selectedId, width, height);
                target.style.width = `${width}px`;
                target.style.height = `${height}px`;
              }}
              onRotate={({ target, transform, rotation }) => {
                handleRotateElement(selectedId, rotation);
                target.style.transform = transform;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodboardCanvas;
