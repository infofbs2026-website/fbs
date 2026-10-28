import "server-only";
import { Resend } from 'resend';

export async function sendOtpEmail({
  email,
  otp,
  type
}: {
  email: string;
  otp: string;
  type: 'signup' | 'recovery';
}): Promise<{ sent: boolean; devOtp?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const isDev = process.env.NODE_ENV !== 'production';

  if (!apiKey) {
    return { sent: false, devOtp: isDev ? otp : undefined };
  }

  try {
    const resend = new Resend(apiKey);
    const isSignup = type === 'signup';
    const subject = isSignup
      ? 'رمز تفعيل حسابك | منصة فارس بن سعود للوحات المميزة'
      : 'رمز استعادة كلمة المرور | منصة فارس بن سعود للوحات المميزة';

    const actionTitle = isSignup ? 'تفعيل حسابك في منصة FBS' : 'استعادة كلمة المرور';
    const actionText = isSignup
      ? 'شكراً لانضمامك إلى منصة فارس بن سعود للوحات المميزة. لإكمال تفعيل حسابك، يرجى إدخال رمز التحقق التالي:'
      : 'لقد تلقينا طلباً لاستعادة كلمة المرور الخاصة بحسابك في منصة فارس بن سعود. يرجى إدخال رمز التحقق التالي لتعيين كلمة مرور جديدة:';

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #050b17; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #050b17; padding: 40px 15px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 520px; background-color: #0a1428; border: 1px solid rgba(217, 184, 127, 0.4); border-radius: 20px; padding: 36px 28px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <!-- Brand Title -->
                <tr>
                  <td align="center">
                    <h2 style="margin: 0 0 6px 0; color: #d9b87f; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">
                      فارس بن سعود للوحات المميزة
                    </h2>
                    <span style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px;">FBS PLATFORM</span>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <div style="height: 1px; width: 60px; background-color: #d9b87f;"></div>
                  </td>
                </tr>

                <!-- Title & Instruction -->
                <tr>
                  <td>
                    <h3 style="margin: 0 0 12px 0; color: #ffffff; font-size: 18px; font-weight: 700;">
                      ${actionTitle}
                    </h3>
                    <p style="margin: 0 0 24px 0; color: #cbd5e1; font-size: 13px; line-height: 1.7;">
                      ${actionText}
                    </p>
                  </td>
                </tr>

                <!-- OTP Code Display Box -->
                <tr>
                  <td align="center">
                    <div style="background-color: #050b17; border: 2px dashed #d9b87f; border-radius: 14px; padding: 18px 24px; display: inline-block; margin-bottom: 24px;">
                      <span style="font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #e8c888; font-family: monospace;">
                        ${otp}
                      </span>
                    </div>
                  </td>
                </tr>

                <!-- Expiry Notice -->
                <tr>
                  <td>
                    <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.6;">
                      هذا الرمز صالح لمدة <strong style="color: #d9b87f;">15 دقيقة</strong> فقط.<br>
                      إذا لم تقم بطلب هذا الرمز، يمكنك تجاهل هذا البريد بأمان.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.08); margin-top: 24px;">
                    <p style="margin: 0; color: #64748b; font-size: 11px;">
                      © 2026 منصة فارس بن سعود للوحات المميزة. جميع الحقوق محفوظة.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const fromAddress = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const result = await resend.emails.send({
      from: `منصة FBS <${fromAddress}>`,
      to: email,
      subject,
      html
    });

    if (result.error) {
      console.error('Resend API error:', result.error);
      return { sent: false, devOtp: isDev ? otp : undefined };
    }

    return { sent: true, devOtp: isDev ? otp : undefined };
  } catch (err) {
    console.error('Failed to send email via Resend:', err);
    return { sent: false, devOtp: isDev ? otp : undefined };
  }
}
