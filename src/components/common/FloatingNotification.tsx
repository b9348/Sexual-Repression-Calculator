import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const NOTIFICATION_KEY = 'floating-notification-dismissed';

export function FloatingNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [dragState, setDragState] = useState({
    startY: 0,
    startX: 0,
    currentY: 0,
    currentX: 0,
    isDragging: false,
    dismissDirection: 'up' as 'up' | 'left' | 'right'
  });
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 检查 sessionStorage，如果已经关闭过就不显示
    const dismissed = sessionStorage.getItem(NOTIFICATION_KEY);
    if (!dismissed) {
      // 延迟一点显示，让动画更明显
      setTimeout(() => {
        setIsVisible(true);
        setIsEntering(true);
        setTimeout(() => setIsEntering(false), 600); // 匹配原动画时长
      }, 500);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissing(true);
    sessionStorage.setItem(NOTIFICATION_KEY, 'true');
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragState({
      startY: touch.clientY,
      startX: touch.clientX,
      currentY: 0,
      currentX: 0,
      isDragging: true,
      dismissDirection: 'up',
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragState.isDragging) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - dragState.startY;
    const deltaX = touch.clientX - dragState.startX;

    setDragState(prev => ({
      ...prev,
      currentY: deltaY,
      currentX: deltaX,
    }));
  };

  const handleTouchEnd = () => {
    if (!dragState.isDragging) return;

    const { currentY, currentX } = dragState;
    const absX = Math.abs(currentX);
    const absY = Math.abs(currentY);

    // 判断主要滑动方向和是否达到关闭阈值
    let shouldDismiss = false;
    let dismissDirection: 'up' | 'left' | 'right' = 'up';

    if (currentY < -80 && absY > absX) {
      shouldDismiss = true;
      dismissDirection = 'up';
    } else if (absX > 120 && absX > absY) {
      shouldDismiss = true;
      dismissDirection = currentX > 0 ? 'right' : 'left';
    }

    if (shouldDismiss) {
      setDragState(prev => ({
        ...prev,
        dismissDirection,
        isDragging: false,
      }));
      handleDismiss();
    } else {
      // 不关闭时回弹到原位
      setDragState({
        startY: 0,
        startX: 0,
        currentY: 0,
        currentX: 0,
        isDragging: false,
        dismissDirection: 'up',
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragState({
      startY: e.clientY,
      startX: e.clientX,
      currentY: 0,
      currentX: 0,
      isDragging: true,
      dismissDirection: 'up',
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragState.isDragging) return;

    const deltaY = e.clientY - dragState.startY;
    const deltaX = e.clientX - dragState.startX;

    setDragState(prev => ({
      ...prev,
      currentY: deltaY,
      currentX: deltaX,
    }));
  };

  const handleMouseUp = () => {
    if (!dragState.isDragging) return;

    const { currentY, currentX } = dragState;
    const absX = Math.abs(currentX);
    const absY = Math.abs(currentY);

    // 判断主要滑动方向和是否达到关闭阈值
    let shouldDismiss = false;
    let dismissDirection: 'up' | 'left' | 'right' = 'up';

    if (currentY < -80 && absY > absX) {
      shouldDismiss = true;
      dismissDirection = 'up';
    } else if (absX > 120 && absX > absY) {
      shouldDismiss = true;
      dismissDirection = currentX > 0 ? 'right' : 'left';
    }

    if (shouldDismiss) {
      setDragState(prev => ({
        ...prev,
        dismissDirection,
        isDragging: false,
      }));
      handleDismiss();
    } else {
      // 不关闭时回弹到原位
      setDragState({
        startY: 0,
        startX: 0,
        currentY: 0,
        currentX: 0,
        isDragging: false,
        dismissDirection: 'up',
      });
    }
  };

  useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, dragState.startY, dragState.startX]);

  if (!isVisible) return null;

  const getTransform = () => {
    if (isEntering) {
      return 'translateY(0)';
    }

    if (dragState.isDragging) {
      // 拖拽时的位置，限制只能向上和侧向
      const y = Math.min(dragState.currentY, 0);
      const x = dragState.currentX;
      return `translate(${x}px, ${y}px)`;
    }

    if (isDismissing) {
      // 根据方向决定最终位置，从当前位置继续动画
      const { dismissDirection, currentX, currentY } = dragState;
      switch (dismissDirection) {
        case 'up':
          return `translate(${currentX}px, ${currentY - 100}vh)`;
        case 'left':
          return `translate(${currentX - 150}vw, ${currentY}px)`;
        case 'right':
          return `translate(${currentX + 150}vw, ${currentY}px)`;
        default:
          return 'translate(0, 0)';
      }
    }

    return 'translate(0, 0)';
  };

  const getOpacity = () => {
    if (isEntering) return 1;

    if (dragState.isDragging) {
      const absX = Math.abs(dragState.currentX);
      const absY = Math.abs(dragState.currentY);
      const maxDrag = Math.max(absX / 120, absY / 80);
      return Math.max(0.3, 1 - maxDrag);
    }

    if (isDismissing) return 0;

    return 1;
  };

  const getTransition = () => {
    if (dragState.isDragging) return 'none';
    if (isEntering) return 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease';
    if (isDismissing) return 'transform 0.3s ease-in-out, opacity 0.3s ease';
    return 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
  };

  return (
    <div
      ref={notificationRef}
      className={`
        fixed top-0 left-0 right-0 z-50 mx-auto max-w-2xl
        ${isEntering ? 'opacity-0' : ''}
      `}
      style={{
        transform: getTransform(),
        opacity: isEntering ? 0 : getOpacity(),
        transition: getTransition(),
        touchAction: 'none',
      }}
    >
      <div className="mx-4 mt-4">
        {/* 通知卡片 */}
        <div
          className="relative rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: '#000000' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          {/* 内容区域 */}
          <div className="px-5 py-4 pr-12">
            <div className="flex flex-col gap-2 text-sm font-medium leading-relaxed">
              {/* 左半部分 - 白色文字 */}
              <div style={{ color: '#FFFFFF' }}>
                性压抑指数计算器完全免费
              </div>
              {/* 右半部分 - 黑色文字 + 橙色背景方块 */}
              <div className="inline-flex items-center gap-1">
                <span
                  className="px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: '#FF9900',
                    color: '#000000'
                  }}
                >
                  如果支付所谓链接免费但<span className="font-bold">「人工整合费用」</span>，请立即退款，以免助长违法商家嚣张气焰
                </span>
              </div>
              {/* 反馈提示 */}
              <div
                className="text-xs cursor-pointer hover:underline"
                style={{ color: '#FFFFFF' }}
                onClick={() => window.open('https://kcnyvaj540jn.feishu.cn/share/base/form/shrcnFXbyBDDBdWKbFXj8TGKXme', '_blank')}
              >
                如果此网址链接是您购买得来，轻触此区域可反馈，将会联系违法店铺下架或追诉。
              </div>
            </div>
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1.5 rounded-full transition-colors"
            style={{ color: '#FFFFFF' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="关闭通知"
          >
            <X className="w-4 h-4" />
          </button>

          {/* iOS 风格提手 */}
          <div className="flex justify-center pb-2 pt-1 cursor-grab active:cursor-grabbing">
            <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
