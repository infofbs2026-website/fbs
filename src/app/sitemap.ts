import type { MetadataRoute } from 'next';
export default function sitemap():MetadataRoute.Sitemap{const base=process.env.NEXT_PUBLIC_SITE_URL;if(!base)return [];return ['','/auctions','/plates','/sell-your-plate','/about','/how-it-works','/faq','/contact'].map(path=>({url:`${base}${path}`,changeFrequency:'weekly',priority:path?0.7:1}));}
