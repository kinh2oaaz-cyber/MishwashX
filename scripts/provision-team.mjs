/**
 * Create or update one Supabase auth account per team member using the
 * credentials recorded in security.txt at the project root. No emails are
 * sent by this script — hand each member their own password securely.
 *
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/provision-team.mjs
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running.')
  process.exit(1)
}

const text = readFileSync(new URL('../security.txt', import.meta.url), 'utf8')
const section = text.split('TEAM MEMBER ACCOUNTS')[1]?.split('EMERGENCY FALLBACK ACCOUNTS')[0]
if (!section) throw new Error('Could not find the team account section in security.txt')

const emails = [...section.matchAll(/Email\s+\.+\s+(\S+@\S+)/g)].map((m) => m[1])
const passwords = [...section.matchAll(/Password\s+\.+\s+(\S+)/g)].map((m) => m[1])
if (emails.length !== passwords.length) {
  throw new Error(`Found ${emails.length} emails and ${passwords.length} passwords in security.txt`)
}

const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

async function main() {
  const { data: listed, error } = await db.auth.admin.listUsers({ perPage: 1000 })
  if (error) throw new Error(error.message)

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i]
    const password = passwords[i]
    const existing = listed.users.find((u) => u.email === email)
    let id

    if (existing) {
      id = existing.id
      const { error: updateError } = await db.auth.admin.updateUserById(id, {
        password,
        email_confirm: true,
      })
      if (updateError) throw new Error(`${email}: ${updateError.message}`)
    } else {
      const { data, error: createError } = await db.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })
      if (createError) throw new Error(`${email}: ${createError.message}`)
      id = data.user.id
    }

    const { error: roleError } = await db
      .from('profiles')
      .upsert({ id, full_name: email.split('@')[0], role: 'admin' }, { onConflict: 'id' })
    if (roleError) throw new Error(`${email} profile: ${roleError.message}`)
    console.log(`${existing ? 'Updated' : 'Created'} ${email}`)
  }
  console.log('Team accounts are ready.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
