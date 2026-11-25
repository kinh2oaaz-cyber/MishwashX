/**
 * Invite every published team member who has a contact email to the content
 * studio. Supabase sends each person a custom invitation email where they set
 * their own password, then they sign in with that email at the secret path.
 *
 * IMPORTANT: this sends real emails. Run it only after confirming the addresses.
 *
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... SITE_URL=https://your-domain node scripts/invite-team.mjs
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
const site = (process.env.SITE_URL || 'http://localhost:5173').replace(/\/$/, '')
const redirectTo = `${site}/#/mx-internal-3d8e1b`

if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running.')
  process.exit(1)
}

const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

function emailsFrom(links) {
  return (links || [])
    .map((l) => l?.url || '')
    .filter((u) => /^mailto:/i.test(u))
    .map((u) => u.replace(/^mailto:/i, '').split('?')[0].trim())
    .filter(Boolean)
}

async function main() {
  const { data: members, error } = await db.from('team_members').select('name, links').eq('published', true)
  if (error) throw new Error(error.message)

  const { data: users } = await db.auth.admin.listUsers({ perPage: 1000 })
  const missing = []

  for (const member of members) {
    const email = emailsFrom(member.links)[0]
    if (!email) {
      missing.push(member.name)
      continue
    }
    const existing = users.users.find((u) => u.email === email)
    if (existing) {
      console.log(`${member.name}: already has an account (${email}) — skipped`)
      continue
    }
    const { error: inviteError } = await db.auth.admin.inviteUserByEmail(email, { redirectTo })
    if (inviteError) {
      console.error(`${member.name}: invitation failed — ${inviteError.message}`)
      continue
    }
    const { data: after } = await db.auth.admin.listUsers({ perPage: 1000 })
    const invited = after.users.find((u) => u.email === email)
    if (invited) {
      const { error: roleError } = await db
        .from('profiles')
        .update({ role: 'admin', full_name: member.name })
        .eq('id', invited.id)
      if (roleError) console.error(`${member.name}: role update failed — ${roleError.message}`)
    }
    console.log(`${member.name}: invitation sent to ${email}`)
  }

  if (missing.length) {
    console.log(`\nNo email on file for: ${missing.join(', ')}. Add their email to the team record first.`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
