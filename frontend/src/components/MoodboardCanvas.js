import React, { useState, useRef, useEffect } from 'react';
import Moveable from 'react-moveable';

const MoodboardCanvas = ({ board, onClose, onSave }) => {
  const [elements, setElements] = useState(board.canvasLayout?.elements || []);
  const [selectedId, setSelectedId] = useState(null);
  const [background, setBackground] = useState(board.canvasLayout?.background || '#ffffff');
  const [textMode, setTextMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showColorPicker, setShowColorPicker] = useState(false);
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
            {board.board_name} - Візуальний мудборд
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
            Зберегти
          </button>
        </div>
      </div>

      {/* Main Content - Left Tools + Canvas + Right Products */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar - Tools */}
        <div style={{
          width: '240px',
          background: '#fff',
          borderRight: '1px solid #e3e3e3',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Tools Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #f0f0f0',
            background: '#fafafa'
          }}>
            <h3 className="font-bold" style={{fontSize: '14px', color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
              Інструменти
            </h3>
          </div>

          {/* Tools List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px'
          }}>
            {/* Background Color */}
            <div style={{marginBottom: '20px'}}>
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="fd-btn fd-btn-secondary"
                style={{width: '100%', justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}
              >
                <span>Фон canvas</span>
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: background,
                  border: '2px solid #ddd',
                  borderRadius: '4px'
                }}></div>
              </button>
              
              {showColorPicker && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: '#f9f9f9',
                  borderRadius: '4px',
                  border: '1px solid #e8e8e8'
                }}>
                  <input
                    type="color"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    style={{width: '100%', height: '40px', border: 'none', cursor: 'pointer'}}
                  />
                  <div style={{display: 'flex', gap: '8px', marginTop: '12px'}}>
                    <button
                      onClick={() => setBackground('#ffffff')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#ffffff',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      Білий
                    </button>
                    <button
                      onClick={() => setBackground('#f5f5dc')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#f5f5dc',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      Бежевий
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{height: '1px', background: '#e8e8e8', margin: '16px 0'}}></div>

            {/* Add Text */}
            <button
              onClick={handleAddText}
              className="fd-btn fd-btn-secondary"
              style={{width: '100%', marginBottom: '12px'}}
            >
              Додати текст
            </button>

            {/* Delete Element */}
            {selectedId && (
              <>
                <div style={{height: '1px', background: '#e8e8e8', margin: '16px 0'}}></div>
                <button
                  onClick={() => handleDeleteElement(selectedId)}
                  className="fd-btn fd-btn-small"
                  style={{color: '#c62828', border: '1px solid #c62828', width: '100%'}}
                >
                  Видалити елемент
                </button>
              </>
            )}
          </div>
        </div>

        {/* Center - Canvas Area */}
        <div className="flex-1 flex flex-col">
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
            <div className="fd-empty" style={{paddingTop: '200px', textAlign: 'center'}}>
              <div style={{fontSize: '18px', fontWeight: '600', color: '#999', marginBottom: '12px'}}>
                Почніть створювати мудборд
              </div>
              <div className="fd-empty-text" style={{fontSize: '14px', color: '#999', lineHeight: '1.6'}}>
                Клацніть на товар у правій панелі щоб додати його на canvas<br/>
                Використовуйте інструменти зліва для налаштування
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

        {/* Right Sidebar - Products List */}
        <div style={{
          width: '340px',
          background: '#fff',
          borderLeft: '1px solid #e3e3e3',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Sidebar Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #f0f0f0',
            background: '#fafafa'
          }}>
            <h3 className="font-bold mb-1" style={{fontSize: '14px', color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
              Товари мудборду
            </h3>
            <p className="fd-label">
              Клацніть на товар щоб додати на canvas
            </p>
          </div>

          {/* Products List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px'
          }}>
            {board.items && board.items.length > 0 ? (
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                {board.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleAddItem(item)}
                    className="fd-card cursor-pointer hover:shadow-lg"
                    style={{
                      padding: '8px',
                      background: '#fff',
                      border: '1px solid #e8e8e8',
                      borderRadius: '4px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        paddingBottom: '100%',
                        position: 'relative',
                        background: item.product?.image_url
                          ? `url(https://www.farforrent.com.ua/${item.product.image_url.replace(/^static\//, '')})`
                          : 'linear-gradient(135deg, #f0f0f0, #e4e4e4)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '3px',
                        marginBottom: '6px',
                      }}
                    />
                    <p style={{
                      fontSize: '11px',
                      color: '#666',
                      lineHeight: '1.3',
                      height: '30px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {item.product?.name}
                    </p>
                    <div style={{
                      fontSize: '10px',
                      color: '#999',
                      marginTop: '4px'
                    }}>
                      Кількість: {item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="fd-empty" style={{paddingTop: '100px', textAlign: 'center'}}>
                <div style={{fontSize: '14px', fontWeight: '600', color: '#999', marginBottom: '8px'}}>
                  Немає товарів
                </div>
                <div className="fd-empty-text" style={{fontSize: '12px', color: '#999'}}>
                  Додайте товари до мудборду<br/>на головній сторінці
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MoodboardCanvas;
