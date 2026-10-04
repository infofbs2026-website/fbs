export const errorMessages = {
  AUTH_REQUIRED: "يرجى تسجيل الدخول للمتابعة.",
  FORBIDDEN: "ليس لديك صلاحية تنفيذ هذا الإجراء.",
  ACCOUNT_SUSPENDED: "هذا الحساب موقوف.",
  PLATE_NOT_VERIFIED: "يجب اعتماد ملكية اللوحة أولاً.",
  AUCTION_NOT_FOUND: "لم يتم العثور على المزاد.",
  AUCTION_NOT_LIVE: "المزاد غير متاح للمزايدة حالياً.",
  AUCTION_PAUSED: "المزاد متوقف مؤقتاً.",
  AUCTION_ENDED: "انتهى وقت المزايدة.",
  REGISTRATION_REQUIRED: "سجّل في المزاد أولاً.",
  NOT_QUALIFIED: "لم تكتمل متطلبات المشاركة في المزاد.",
  DEPOSIT_REQUIRED: "يلزم تفويض مبلغ التأمين للمشاركة.",
  DEPOSIT_EXPIRED: "تفويض التأمين لا يغطي مدة المزاد الحالية.",
  BID_TOO_LOW: "قيمة المزايدة أقل من الحد الأدنى المطلوب.",
  STALE_BID: "تغير سعر المزاد؛ راجع السعر الجديد وأكد المزايدة.",
  DUPLICATE_BID: "تم استقبال طلب المزايدة مسبقاً.",
  IDEMPOTENCY_CONFLICT: "تم استخدام معرّف الطلب لعملية مختلفة.",
  RATE_LIMITED: "طلبات كثيرة؛ انتظر قليلاً ثم أعد المحاولة.",
  PAYMENT_FAILED: "تعذر تنفيذ عملية الدفع.",
  PAYMENT_PENDING: "عملية الدفع قيد التحقق.",
  PAYMENT_CAPABILITY_UNSUPPORTED: "وسيلة الدفع لا تدعم العملية المطلوبة.",
  INVALID_TRANSITION: "لا يمكن تنفيذ هذا الإجراء في الحالة الحالية.",
  INVALID_INPUT: "يرجى مراجعة البيانات المدخلة.",
  SYSTEM_DEGRADED: "الخدمة غير متاحة مؤقتاً. لم يتم تأكيد العملية.",
} as const;

export type ErrorCode = keyof typeof errorMessages;

export class DomainError extends Error {
  readonly name = "DomainError";
  constructor(
    readonly code: ErrorCode,
    message: string = errorMessages[code],
    readonly details: Readonly<Record<string, unknown>> = {},
    readonly status: number = 400,
  ) {
    super(message);
  }
}

export function errorContract(error: unknown, requestId: string) {
  const known = error instanceof DomainError;
  return {
    status: known ? error.status : 503,
    body: {
      error: {
        code: known ? error.code : "SYSTEM_DEGRADED",
        message: known ? error.message : errorMessages.SYSTEM_DEGRADED,
        details: known ? error.details : {},
        requestId,
      },
    },
  };
}
