import { Catalog } from '@/components/catalog';
export const metadata={title:'اللوحات المميزة'};
export default async function Plates({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){return <Catalog query={await searchParams}/>;}
