import type { Metadata } from 'next';
import { Catalog } from '@/components/catalog';
export const metadata: Metadata = { title: 'اللوحات المميزة' };
export default async function Plates({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){return <Catalog query={await searchParams}/>;}
