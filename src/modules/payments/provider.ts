import { DomainError } from '@/lib/errors';
export type PaymentStatus='CREATED'|'AUTH_PENDING'|'AUTHORIZED'|'AUTH_FAILED'|'AUTH_EXPIRED'|'CAPTURE_PENDING'|'CAPTURED'|'CAPTURE_FAILED'|'VOID_PENDING'|'VOIDED'|'VOID_FAILED'|'REFUND_PENDING'|'REFUNDED'|'REFUND_FAILED'|'REQUIRES_REVIEW';
export type PaymentOperation='AUTHORIZE'|'CAPTURE'|'VOID'|'REFUND';
export interface PaymentCapabilities {authorize:boolean;capture:boolean;void:boolean;refund:boolean;validitySeconds:number|null;}
export interface ProviderPayment {id:string;status:PaymentStatus;amountMinor:string;currency:'SAR';expiresAt:string|null;}
export interface PaymentProvider {
 readonly name:string;
 capabilities(method:string):PaymentCapabilities;
 authorize(input:{amountMinor:string;currency:'SAR';idempotencyKey:string;returnUrl:string;paymentToken:string}):Promise<ProviderPayment>;
 capture(input:{id:string;amountMinor:string;idempotencyKey:string}):Promise<ProviderPayment>;
 void(input:{id:string;idempotencyKey:string}):Promise<ProviderPayment>;
 refund(input:{id:string;amountMinor:string;idempotencyKey:string}):Promise<ProviderPayment>;
 getPayment(id:string):Promise<ProviderPayment>;
 verifyWebhook(rawBody:string,headers:Headers):Promise<{eventId:string;paymentId:string;occurredAt:string;status:PaymentStatus}>;
}
const transitions:Record<PaymentStatus,readonly PaymentStatus[]>={CREATED:['AUTH_PENDING'],AUTH_PENDING:['AUTHORIZED','AUTH_FAILED','REQUIRES_REVIEW'],AUTHORIZED:['CAPTURE_PENDING','VOID_PENDING','AUTH_EXPIRED'],AUTH_FAILED:[],AUTH_EXPIRED:[],CAPTURE_PENDING:['CAPTURED','CAPTURE_FAILED','REQUIRES_REVIEW'],CAPTURED:['REFUND_PENDING'],CAPTURE_FAILED:['REQUIRES_REVIEW'],VOID_PENDING:['VOIDED','VOID_FAILED','REQUIRES_REVIEW'],VOIDED:[],VOID_FAILED:['REQUIRES_REVIEW'],REFUND_PENDING:['REFUNDED','REFUND_FAILED','REQUIRES_REVIEW'],REFUNDED:[],REFUND_FAILED:['REQUIRES_REVIEW'],REQUIRES_REVIEW:[]};
export function assertPaymentTransition(from:PaymentStatus,to:PaymentStatus){if(from===to)return;if(!transitions[from].includes(to))throw new DomainError('INVALID_TRANSITION','تحديث مالي غير متسق؛ يلزم التحقق من مزود الدفع.',{},409);}
export function assertCapability(provider:PaymentProvider,method:string,operation:PaymentOperation){const key={AUTHORIZE:'authorize',CAPTURE:'capture',VOID:'void',REFUND:'refund'}[operation] as 'authorize'|'capture'|'void'|'refund';if(!provider.capabilities(method)[key])throw new DomainError('PAYMENT_CAPABILITY_UNSUPPORTED',undefined,{},409);}
export function operationKey(operation:PaymentOperation,authorizationId:string){return `fbs:${operation.toLowerCase()}:${authorizationId}`;}
/** No provider is selected until its contracted API and webhook signing scheme are known. */
export function getPaymentProvider():PaymentProvider{throw new DomainError('SYSTEM_DEGRADED','بوابة الدفع غير مفعّلة. لم تُنفذ أي عملية مالية.',{},503);}
