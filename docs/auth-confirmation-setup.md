# Email confirmation for FBS

Hosted Supabase authentication settings are separate from `supabase/config.toml`, which configures local development. For the production Supabase project used by FBS:

1. Keep email confirmation enabled in Authentication → Providers → Email.
2. In Authentication → Email Templates → Confirm signup, use subject `رمز تفعيل حسابك | FBS` and the contents of `supabase/templates/confirmation.html`. The `{{ .Token }}` variable is required; do not substitute `{{ .ConfirmationURL }}`. This template is also used when a confirmation is resent.
3. In Authentication → URL Configuration, set the Site URL to `https://fbsplates.com` and add `https://fbsplates.com/auth/callback` to the redirect allowlist without removing any other required entries.
4. Ensure the configured email delivery provider is appropriate for production. A custom sender/domain requires an independently verified domain and SMTP setup; do not change delivery credentials merely to edit the template.
5. Test a new sign-up and an unconfirmed account's resend flow against the deployed site with an email address you control. Check that the code from the latest message can be entered and that the account session is created. Previously sent links may still contain the old redirect, so request a fresh message.

Password recovery uses a separate existing mailer and is not changed by the signup confirmation template.
