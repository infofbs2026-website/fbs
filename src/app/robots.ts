import type { MetadataRoute } from 'next';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:process.env.APP_ENV==='production'?'/':undefined,disallow:process.env.APP_ENV==='production'?['/admin','/account','/auction-room','/api','/auth']:['/']},...(process.env.NEXT_PUBLIC_SITE_URL?{sitemap:`${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`}:{})};}
