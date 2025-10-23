import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_TITLE = '性压抑指数计算器 - 专业性心理健康评估工具 | SRI Calculator';

export default function RouteTitle() {
  const location = useLocation();

  useEffect(() => {
    const { pathname, search } = location;
    const params = new URLSearchParams(search);
    let title = BASE_TITLE;

    if (pathname === '/assessment') {
      const type = params.get('type') || 'quick';
      title = (type === 'full' ? '完整测评' : '快速测评') + ' - 性压抑指数计算器 | SRI Calculator';
    } else if (pathname === '/results') {
      title = '测评结果 - 性压抑指数计算器 | SRI Calculator';
    } else if (pathname === '/guide') {
      title = '使用指南 - 性压抑指数计算器 | SRI Calculator';
    } else if (pathname === '/science') {
      title = '科学依据 - 性压抑指数计算器 | SRI Calculator';
    } else if (pathname === '/history') {
      title = '历史记录 - 性压抑指数计算器 | SRI Calculator';
    }

    document.title = title;
    const metaTitle = document.querySelector('meta[name="title"]');
    if (metaTitle) metaTitle.setAttribute('content', title);
  }, [location]);

  return null;
}
