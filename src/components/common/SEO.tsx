import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
}

export function SEO({
  title = '性压抑指数计算器 - 专业性心理健康评估工具 | SRI Calculator',
  description = '基于SIS/SES、Mosher性内疚、KISS-9等国际认可量表的专业性心理评估工具。提供快测版(8-15分钟)和完整版(25-40分钟)，100%本地数据处理，保护隐私安全。科学了解性心理特征，促进性健康发展。',
  keywords = '性压抑指数,SRI计算器,性心理评估,性健康测试,SIS/SES量表,性内疚测试,性羞耻评估,心理健康,性教育,亲密关系',
  ogTitle,
  ogDescription,
  ogImage = 'https://xyy.gta4.bio/favicon.svg',
  canonicalUrl = 'https://xyy.gta4.bio/',
  noindex = false,
}: SEOProps) {
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="zh_CN" />
      <meta property="og:site_name" content="性压抑指数计算器" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={finalOgTitle} />
      <meta property="twitter:description" content={finalOgDescription} />
      <meta property="twitter:image" content={ogImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Alternate Languages */}
      <link rel="alternate" hrefLang="zh-CN" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </Helmet>
  );
}

