import { NextResponse } from 'next/server';
import { createSessionClient } from '@/lib/supabase/server';
export async function GET(request:Request){const url=new URL(request.url);const code=url.searchParams.get('code');const client=await createSessionClient();if(code&&client){const {error}=await client.auth.exchangeCodeForSession(code);if(!error)return NextResponse.redirect(new URL(url.searchParams.get('next')==='/reset-password'?'/reset-password':'/account',url.origin));}return NextResponse.redirect(new URL('/login?error=verification',url.origin));}
