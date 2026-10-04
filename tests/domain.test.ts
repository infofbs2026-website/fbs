import { describe,it,expect } from 'vitest';
import { minorMoney,parseSar,formatSar,percentageMoney } from '@/lib/money';
import { assertTransition } from '@/modules/auctions/state-machine';
import { assertPaymentTransition,operationKey } from '@/modules/payments/provider';
import { eventAction } from '@/modules/realtime/types';
describe('Money and state safety',()=>{
 it('uses exact halalas and rejects floats/exponents',()=>{expect(parseSar('100.01')).toBe(10001n);expect(()=>minorMoney(0.1)).toThrow();expect(()=>parseSar('1e3')).toThrow();expect(()=>parseSar('1.001')).toThrow();expect(percentageMoney(101n,100,'up')).toBe(2n);expect(formatSar(12345n,'en-US')).toContain('123.45');});
 it('rejects lifecycle shortcuts and terminal-state regressions',()=>{expect(()=>assertTransition('DRAFT','LIVE')).toThrow();expect(()=>assertTransition('COMPLETED','LIVE')).toThrow();expect(()=>assertTransition('LIVE','PAUSED')).not.toThrow();expect(()=>assertPaymentTransition('VOIDED','CAPTURED')).toThrow();expect(()=>assertPaymentTransition('CAPTURED','AUTHORIZED')).toThrow();expect(()=>assertPaymentTransition('AUTHORIZED','CAPTURE_PENDING')).not.toThrow();});
 it('keeps financial operation keys stable across retries',()=>{expect(operationKey('CAPTURE','id')).toBe(operationKey('CAPTURE','id'));expect(operationKey('CAPTURE','id')).not.toBe(operationKey('VOID','id'));});
 it('requests reconciliation for missed or reversed sequences',()=>{expect(eventAction({sequence:5,version:5},{sequence:7,version:7})).toBe('RESYNC');expect(eventAction({sequence:5,version:5},{sequence:4,version:4})).toBe('IGNORE');expect(eventAction({sequence:5,version:5},{sequence:6,version:6})).toBe('APPLY');});
});
