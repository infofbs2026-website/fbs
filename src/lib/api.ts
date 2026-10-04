import { NextResponse } from 'next/server';
import { z } from 'zod';
import { DomainError,errorContract } from './errors';
import { siteOrigin } from './env';
export function success(data:unknown,status=200){return NextResponse.json({data},{status,headers:{'Cache-Control':'private, no-store'}});}
export function failure(error:unknown){const requestId=crypto.randomUUID();const result=errorContract(error instanceof z.ZodError?new DomainError('INVALID_INPUT'):error,requestId);return NextResponse.json(result.body,{status:result.status,headers:{'Cache-Control':'private, no-store','X-Request-Id':requestId}});}
export function assertOrigin(request:Request){const origin=request.headers.get('origin');const expected=siteOrigin();if(!expected||origin!==expected)throw new DomainError('FORBIDDEN','مصدر الطلب غير مسموح.',{},403);}
export async function readJson(request:Request){if(!request.headers.get('content-type')?.startsWith('application/json'))throw new DomainError('INVALID_INPUT');const text=await request.text();if(text.length>32768)throw new DomainError('INVALID_INPUT');try{return JSON.parse(text) as unknown;}catch{throw new DomainError('INVALID_INPUT');}}
