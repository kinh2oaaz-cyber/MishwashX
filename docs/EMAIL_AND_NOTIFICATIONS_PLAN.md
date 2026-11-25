# Email & notifications plan

This records the planned email behaviour. It is **not implemented yet** — the
enquiry form currently stores messages in `public.inquiries`, where an admin can
read them at the secret content-studio path.

## 1. Enquiry notifications → mishawashx2024@gmail.com

### Recommended: Supabase Edge Function + Resend

1. Create a Resend account and verify a sending domain (or use the test sender
   `onboarding@resend.dev` while developing). Get an API key.
2. Store the key as a Supabase Edge Function secret — never in the frontend:

   ```bash
   supabase secrets set RESEND_API_KEY=re_... --project-ref tlmbmoutktwahvocvjgc
   ```

3. Add `supabase/functions/notify-inquiry/index.ts`:

   ```ts
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

   const RESEND_KEY = Deno.env.get('RESEND_API_KEY')!
   const SB_URL = Deno.env.get('SUPABASE_URL')!
   const SB_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

   Deno.serve(async (req) => {
     const payload = await req.json()
     const record = payload.record // INSERT payload from the database webhook
     if (!record?.email) return new Response('ignored', { status: 200 })

     const res = await fetch('https://api.resend.com/emails', {
       method: 'POST',
       headers: {
         Authorization: `Bearer ${RESEND_KEY}`,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         from: 'Mishawash X <enquiries@your-verified-domain.org>',
         to: ['mishawashx2024@gmail.com'],
         reply_to: record.email,
         subject: `New enquiry: ${record.subject || 'Website enquiry'}`,
         html: `<h2>New enquiry</h2>
                <p><strong>From:</strong> ${record.name} &lt;${record.email}&gt;</p>
                <p><strong>Organisation:</strong> ${record.organisation || '—'}</p>
                <p><strong>Subject:</strong> ${record.subject || '—'}</p>
                <hr />
                <p>${String(record.message).replace(/\n/g, '<br>')}</p>`,
       }),
     })
     return new Response(null, { status: res.ok ? 200 : 500 })
   })
   ```

   Escape or sanitise all inserted values before building HTML in production.

4. Deploy: `supabase functions deploy notify-inquiry --project-ref tlmbmoutktwahvocvjgc`
5. Create a database webhook on `public.inquiries` for `INSERT` pointing at
   `https://tlmbmoutktwahvocvjgc.supabase.co/functions/v1/notify-inquiry`,
   with a shared secret header checked inside the function.
6. Test by submitting the contact form and checking the inbox and the
   Edge Function logs.

### Alternatives

- **SMTP**: if the project has an SMTP host configured, send with `Deno.smtp`
  or `nodemailer` from the Edge Function instead of Resend.
- **No backend**: change the submit button to a `mailto:` link addressed to
  `mishawashx2024@gmail.com`. This opens the visitor's mail client and does not
  send automatically; it is a fallback only.

## 2. Team-member credentials

- Each published team member is invited using their own email with
  `scripts/invite-team.mjs`. The invite is sent by Supabase Auth, and the member
  chooses their own password by following the link in the email.
- Sign-in happens at the secret path (`/#/mx-internal-3d8e1b`) with **email +
  password**. The old fixed passwords remain as emergency fallback accounts with
  a blank email field.
- Customise the invite email in the Supabase dashboard:
  **Authentication → Email Templates → Invite**. Suggested content:

  **Subject:** `Your Mishawash X content studio access`

  **Body:**

  ```html
  <h2>Welcome to the Mishawash X content studio</h2>
  <p>You have been invited to help maintain the Mishawash X website.</p>
  <p>Choose your own password by following this link:</p>
  <p><a href="{{ .ConfirmationURL }}">Set my password</a></p>
  <p>This link is personal to you — please do not share it.</p>
  <p>If you were not expecting this invitation, you can ignore this email.</p>
  ```

  Customise **Password recovery** in the same place with the same branding so
  "Forgot?" on the login screen sends an on-brand message.

- Set `SITE_URL` to the deployed origin when running the invite script so the
  confirmation link returns visitors to the correct site.

## 3. Security notes

- Only the public anon key is used in browser code. The service-role key is used
  only by local admin scripts and Edge Function secrets.
- RLS still controls what an invited account can read and write; their profile
  must have `role = 'admin'` or `'editor'`.
- Keep the recipient address (`mishawashx2024@gmail.com`) in the Edge Function,
  not in client-side configuration, so visitors cannot redirect notifications.
