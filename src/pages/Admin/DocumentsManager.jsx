import { useState } from 'react'
import { FileText, FlaskConical } from 'lucide-react'
import { CollectionManager } from './components/CollectionManager'
import { PageHead } from './components/AdminUI'
import { cn } from '../../lib/utils/cn'

const TABS = [
  {
    key: 'documents',
    label: 'Public documents',
    icon: FileText,
    description: 'Files offered in the Resources library — briefs, one-pagers and press material.',
  },
  {
    key: 'researchDocuments',
    label: 'Research documents',
    icon: FlaskConical,
    description: 'Technical artefacts linked from Research & Development — protocols, design notes and reports.',
  },
]

export function AdminDocuments() {
  const [tab, setTab] = useState('documents')
  const active = TABS.find((t) => t.key === tab)

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[0.76rem] font-medium transition-colors',
              tab === item.key
                ? 'border-navy-900 bg-navy-900 text-white'
                : 'border-[#e2e9f0] bg-white text-ink-soft hover:border-[#c8d8e6]',
            )}
          >
            <item.icon className="h-3.5 w-3.5" strokeWidth={1.8} />
            {item.label}
          </button>
        ))}
      </div>

      <CollectionManager
        key={tab}
        collection={tab}
        eyebrow="Library"
        title={active.label}
        description={active.description}
        notice="Upload the PDF in Media first, then paste its URL here and set the file size and type. Never publish a download link that does not resolve to a real file."
        emptyTitle="No documents published"
        emptyBody="The public library shows a designed empty state until a real file is approved for release. Do not add a placeholder download link."
        addLabel="Add document"
      />
    </>
  )
}
