import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Check, RotateCcw, Save } from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import { useAuth } from '../../content/AuthProvider'
import { FieldEditor } from './components/FieldEditor'
import {
  AdminButton,
  AdminCard,
  Alert,
  Modal,
  PageHead,
  StatusPill,
} from './components/AdminUI'
import { cn } from '../../lib/utils/cn'

const f = (key, label, type = 'text', extra = {}) => ({ key, label, type, ...extra })

const linkField = (key, label) =>
  f(key, label, 'group', {
    fields: [f('label', 'Label'), f('to', 'Target', 'url', { placeholder: '/resources#contact' })],
  })

const SECTIONS = [
  {
    key: 'brand',
    title: 'Brand identity',
    description: 'Name, shorthand and positioning shown in the header, footer and browser title.',
    fields: [
      f('name', 'Organisation name'),
      f('shortName', 'Short name'),
      f('mark', 'Monogram', 'text', { hint: 'Two characters, rendered inside the logo mark.' }),
      f('descriptor', 'Descriptor', 'text', { hint: 'Appears beneath the logo in the header.' }),
      f('tagline', 'Tagline'),
      f('logoUrl', 'Logo image', 'image', {
        hint: 'Optional. Leave empty to use the built-in vector mark. Never upload a third-party logo you do not own.',
      }),
    ],
  },
  {
    key: 'seo',
    title: 'Search & social defaults',
    description: 'Fallback metadata for pages that do not override these values.',
    fields: [
      f('title', 'Default title', 'text', { hint: 'Aim for 50–60 characters.' }),
      f('description', 'Default description', 'textarea', { hint: 'Aim for 140–160 characters.' }),
      f('keywords', 'Keywords', 'textarea', { hint: 'Comma-separated. Minor ranking effect; keep it accurate.' }),
    ],
  },
  {
    key: 'contact',
    title: 'Contact details',
    description: 'Shown on the Resources page and in the footer. Leave a field empty rather than inventing an address.',
    fields: [
      f('email', 'Primary email'),
      f('secondaryEmail', 'Secondary email'),
      f('phone', 'Telephone'),
      f('location', 'Location'),
      f('hours', 'Working hours'),
      f('responseTime', 'Response expectation'),
      f('inquiryNote', 'Enquiry note', 'textarea'),
    ],
  },
  {
    key: 'announcement',
    title: 'Disclosure strip',
    description: 'The thin bar at the top of the public site. Keep the concept-stage disclosure visible.',
    fields: [
      f('enabled', 'Show disclosure strip', 'boolean'),
      f('text', 'Text', 'textarea'),
      f('linkLabel', 'Link label'),
      f('linkTo', 'Link target', 'url'),
    ],
  },
  {
    key: 'nav',
    title: 'Navigation',
    description: 'Primary navigation and header call to action.',
    fields: [
      f('links', 'Navigation links', 'list', {
        itemLabel: 'link',
        fields: [f('label', 'Label'), f('to', 'Target', 'url')],
      }),
      linkField('cta', 'Header button'),
      f('showCta', 'Show header button', 'boolean'),
    ],
  },
  {
    key: 'footer',
    title: 'Footer',
    description: 'Statement, link columns and the regulatory disclaimer.',
    fields: [
      f('statement', 'Organisation statement', 'textarea'),
      f('columns', 'Footer columns', 'list', {
        itemLabel: 'column',
        fields: [
          f('title', 'Column title'),
          f('links', 'Links', 'list', {
            itemLabel: 'link',
            fields: [f('label', 'Label'), f('to', 'Target', 'url')],
          }),
        ],
      }),
      f('disclaimer', 'Disclaimer', 'textarea', {
        hint: 'Must remain accurate. Do not remove the statement that the platform is not validated.',
      }),
      f('credits', 'Credits line'),
    ],
  },
  {
    key: 'socials',
    title: 'Social profiles',
    description: 'Optional external links. Only add profiles that actually exist.',
    fields: [
      f('socials', 'Profiles', 'list', {
        itemLabel: 'profile',
        fields: [f('label', 'Label'), f('url', 'URL', 'url')],
      }),
    ],
  },
]

function clone(value) {
  return JSON.parse(JSON.stringify(value ?? {}))
}

export function AdminSettings() {
  const { settings, updateSettings, resetContent, saving, mode } = useContent()
  const { isOwner } = useAuth()
  const [form, setForm] = useState(() => clone(settings))
  const [resetOpen, setResetOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(clone(settings))
  }, [settings])

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(settings ?? {}),
    [form, settings],
  )

  function patchSection(sectionKey, fieldKey, value) {
    setForm((prev) => ({
      ...prev,
      [sectionKey]:
        fieldKey === null
          ? value
          : { ...(prev[sectionKey] || {}), [fieldKey]: value },
    }))
    setMessage('')
  }

  async function save() {
    setError('')
    try {
      await updateSettings(form)
      setMessage('Settings saved.')
    } catch (err) {
      setError(err.message || 'Unable to save settings.')
    }
  }

  async function doReset() {
    try {
      await resetContent()
      setResetOpen(false)
      setMessage('Starter content restored.')
    } catch (err) {
      setError(err.message || 'Unable to reset content.')
    }
  }

  return (
    <>
      <PageHead
        eyebrow="Workspace"
        title="Site settings"
        description="Global identity, contact details and navigation. Changes here apply across every page."
        actions={
          <>
            {dirty ? <StatusPill tone="amber">Unsaved changes</StatusPill> : null}
            <AdminButton variant="primary" icon={Save} onClick={save} disabled={!dirty} loading={saving}>
              Save changes
            </AdminButton>
          </>
        }
      />

      {message ? (
        <Alert tone="success" className="mb-5">
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5" /> {message}
          </span>
        </Alert>
      ) : null}

      {error ? (
        <Alert tone="error" className="mb-5">
          {error}
        </Alert>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_18rem] xl:items-start">
        <div className="space-y-5">
          {SECTIONS.map((section) => (
            <AdminCard key={section.key} title={section.title} description={section.description}>
              <div className="grid gap-1 sm:grid-cols-2 sm:[&>*]:col-span-1">
                {section.fields.map((field) => (
                  <div
                    key={field.key}
                    className={cn(
                      field.type === 'textarea' ||
                        field.type === 'list' ||
                        field.type === 'richtext' ||
                        field.type === 'image' ||
                        field.type === 'boolean'
                        ? 'sm:col-span-2'
                        : '',
                    )}
                  >
                    <FieldEditor
                      field={field}
                      value={(form?.[section.key] || {})[field.key]}
                      onChange={(next) => patchSection(section.key, field.key, next)}
                    />
                  </div>
                ))}
              </div>
            </AdminCard>
          ))}
        </div>

        <div className="space-y-5 xl:sticky xl:top-24">
          <AdminCard title="Publishing">
            <p className="text-[0.76rem] leading-relaxed text-ink-muted">
              Settings save immediately and affect the public site. There is no separate draft for
              global settings, so check wording carefully before saving.
            </p>
            <AdminButton
              variant="primary"
              icon={Save}
              className="mt-4 w-full"
              onClick={save}
              disabled={!dirty}
              loading={saving}
            >
              {dirty ? 'Save changes' : 'No changes to save'}
            </AdminButton>
            {dirty ? (
              <button
                type="button"
                onClick={() => setForm(clone(settings))}
                className="mt-2 w-full text-[0.72rem] text-ink-muted hover:text-ink"
              >
                Discard unsaved edits
              </button>
            ) : null}
          </AdminCard>

          <AdminCard title="Integrity checklist">
            <ul className="space-y-2 text-[0.74rem] leading-relaxed text-ink-muted">
              <li>• Contact fields must be real and monitored.</li>
              <li>• The disclosure strip should stay enabled until validation.</li>
              <li>• Never add a social profile that does not exist.</li>
              <li>• Footer disclaimer wording must stay factually accurate.</li>
            </ul>
          </AdminCard>

          {mode === 'local' && isOwner ? (
            <AdminCard title="Danger zone">
              <p className="text-[0.74rem] leading-relaxed text-ink-muted">
                Restore the reviewed starter content in this browser. Any local edits and uploaded
                media will be removed.
              </p>
              <AdminButton
                variant="danger"
                icon={RotateCcw}
                className="mt-4 w-full"
                onClick={() => setResetOpen(true)}
              >
                Reset local content
              </AdminButton>
            </AdminCard>
          ) : null}
        </div>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset local content?"
        description="This affects only this browser."
        footer={
          <>
            <AdminButton onClick={() => setResetOpen(false)}>Cancel</AdminButton>
            <AdminButton variant="danger" onClick={doReset}>
              Reset everything
            </AdminButton>
          </>
        }
      >
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/[0.06] p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <p className="text-[0.8rem] leading-relaxed text-amber-900/85">
            All local page edits, collection records and uploaded media will be deleted and the
            starter content restored. This cannot be undone.
          </p>
        </div>
      </Modal>
    </>
  )
}
