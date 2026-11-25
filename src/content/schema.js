/**
 * SECTION SCHEMA — drives the visual editor in /admin.
 * ---------------------------------------------------------------------------
 * Every editable region of every public page is described here as a list of
 * fields. The admin renders forms from this schema, so a non-programmer can
 * edit copy, images, links and repeatable lists without touching React code.
 *
 * Field types
 *   text        single-line string
 *   textarea    multi-line plain text
 *   richtext    sanitised HTML (paragraphs, lists, links, emphasis)
 *   url         link target or absolute URL
 *   image       media library picker (returns a URL)
 *   boolean     toggle
 *   select      fixed options
 *   number      numeric input
 *   group       nested object with its own `fields`
 *   list        repeatable array of objects with its own `fields`
 */

const f = (key, label, type = 'text', extra = {}) => ({ key, label, type, ...extra })

const link = (key, label) =>
  f(key, label, 'group', {
    fields: [f('label', 'Button label'), f('to', 'Link target', 'url', { placeholder: '/innovation' })],
  })

const stringList = (key, label) => f(key, label, 'list', {
  itemLabel: 'item',
  simple: true,
  fields: [f('value', 'Text', 'textarea')],
})

/* -------------------------------------------------------------------------- */
/*  PAGE META                                                                 */
/* -------------------------------------------------------------------------- */

export const PAGE_META_FIELDS = [
  f('title', 'Page title', 'text', { hint: 'Shown in the admin and used as a fallback heading.' }),
  f('navLabel', 'Navigation label', 'text'),
  f('seoTitle', 'SEO title', 'text', { hint: 'Aim for 50–60 characters.' }),
  f('seoDescription', 'SEO description', 'textarea', { hint: 'Aim for 140–160 characters.' }),
  f('status', 'Publication status', 'select', {
    options: [
      { value: 'published', label: 'Published' },
      { value: 'draft', label: 'Draft — hidden from the public site' },
    ],
  }),
]

/* -------------------------------------------------------------------------- */
/*  SECTION DEFINITIONS                                                       */
/* -------------------------------------------------------------------------- */

const defs = [
  /* ------------------------------- HOME ---------------------------------- */
  {
    page: 'home',
    key: 'hero',
    label: 'Hero',
    fields: [
      f('eyebrow', 'Eyebrow label'),
      f('titleLines', 'Headline lines', 'list', {
        itemLabel: 'line',
        simple: true,
        hint: 'Each line renders as a separate animated line.',
        fields: [f('value', 'Line', 'text')],
      }),
      f('lead', 'Supporting paragraph', 'textarea'),
      link('primaryCta', 'Primary button'),
      link('secondaryCta', 'Secondary button'),
      f('statusNote', 'Status disclosure', 'textarea', {
        hint: 'Required. Must state that the platform is concept stage.',
      }),
      f('markers', 'Hero markers', 'list', {
        itemLabel: 'marker',
        fields: [f('value', 'Value'), f('label', 'Label')],
      }),
      f('markersNote', 'Markers disclaimer'),
    ],
  },
  {
    page: 'home',
    key: 'statement',
    label: 'Programme statement',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading', 'textarea'),
      f('body', 'Body', 'richtext'),
      f('pullQuote', 'Pull quote', 'textarea'),
      f('pillars', 'Pillars', 'list', {
        itemLabel: 'pillar',
        fields: [f('title', 'Title'), f('body', 'Body', 'textarea')],
      }),
    ],
  },
  {
    page: 'home',
    key: 'problem',
    label: 'Problem preview',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading', 'textarea'),
      f('body', 'Body', 'richtext'),
      link('link', 'Link'),
      f('stats', 'Statistics', 'list', {
        itemLabel: 'statistic',
        hint: 'Every statistic must be cited. Do not add uncited figures.',
        fields: [f('value', 'Value'), f('label', 'Description', 'textarea'), f('source', 'Source')],
      }),
      f('statsNote', 'Statistics note', 'textarea'),
    ],
  },
  {
    page: 'home',
    key: 'innovation',
    label: 'Innovation preview',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      link('link', 'Link'),
      f('stages', 'Workflow stages', 'list', {
        itemLabel: 'stage',
        fields: [f('step', 'Step number'), f('title', 'Title'), f('body', 'Body', 'textarea')],
      }),
      f('disclaimer', 'Disclaimer', 'textarea'),
    ],
  },
  {
    page: 'home',
    key: 'technology',
    label: 'Technology highlights',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading', 'textarea'),
      f('body', 'Body', 'richtext'),
      f('items', 'Highlights', 'list', {
        itemLabel: 'highlight',
        fields: [
          f('index', 'Index'),
          f('title', 'Title'),
          f('body', 'Body', 'textarea'),
          f('tag', 'Status tag'),
        ],
      }),
    ],
  },
  {
    page: 'home',
    key: 'research',
    label: 'Research preview',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      link('link', 'Link'),
    ],
  },
  {
    page: 'home',
    key: 'team',
    label: 'Team preview',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      link('link', 'Link'),
    ],
  },
  {
    page: 'home',
    key: 'impact',
    label: 'Impact preview',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      link('link', 'Link'),
      f('items', 'Impact items', 'list', {
        itemLabel: 'item',
        fields: [f('title', 'Title'), f('body', 'Body', 'textarea')],
      }),
      f('disclaimer', 'Disclaimer', 'textarea'),
    ],
  },
  {
    page: 'home',
    key: 'recognition',
    label: 'Recognition gallery',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'textarea'),
      f('items', 'Gallery items', 'list', {
        itemLabel: 'item',
        fields: [
          f('title', 'Title'),
          f('context', 'Context'),
          f('year', 'Year'),
          f('image', 'Photograph', 'image'),
          f('alt', 'Alt text'),
        ],
      }),
      f('disclaimer', 'Disclaimer', 'textarea'),
    ],
  },
  {
    page: 'home',
    key: 'cta',
    label: 'Closing CTA',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'textarea'),
      link('primaryCta', 'Primary button'),
      link('secondaryCta', 'Secondary button'),
    ],
  },

  /* ------------------------------ PROBLEM -------------------------------- */
  {
    page: 'problem',
    key: 'hero',
    label: 'Hero',
    fields: [
      f('eyebrow', 'Eyebrow'),
      f('heading', 'Heading', 'textarea'),
      f('lead', 'Lead paragraph', 'textarea'),
      f('note', 'Note', 'textarea'),
    ],
  },
  {
    page: 'problem',
    key: 'context',
    label: 'Context',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading', 'textarea'),
      f('body', 'Body', 'richtext'),
      f('pullQuote', 'Pull quote', 'textarea'),
      f('pillars', 'Points', 'list', {
        itemLabel: 'point',
        fields: [f('title', 'Title'), f('body', 'Body', 'textarea')],
      }),
    ],
  },
  {
    page: 'problem',
    key: 'barriers',
    label: 'Barriers',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('items', 'Barriers', 'list', {
        itemLabel: 'barrier',
        fields: [f('index', 'Index'), f('title', 'Title'), f('body', 'Body', 'textarea')],
      }),
    ],
  },
  {
    page: 'problem',
    key: 'statistics',
    label: 'Statistics & evidence',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('stats', 'Statistics', 'list', {
        itemLabel: 'statistic',
        hint: 'A statistic cannot be published without a source and a year.',
        fields: [
          f('value', 'Value'),
          f('prefix', 'Prefix (optional)'),
          f('label', 'Description', 'textarea'),
          f('detail', 'Detail', 'textarea'),
          f('source', 'Full citation'),
          f('sourceUrl', 'Source URL', 'url'),
          f('year', 'Publication year'),
        ],
      }),
      f('verificationNote', 'Verification note', 'textarea'),
    ],
  },
  {
    page: 'problem',
    key: 'early',
    label: 'Early detection',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading', 'textarea'),
      f('body', 'Body', 'richtext'),
      f('stages', 'Stages', 'list', {
        itemLabel: 'stage',
        fields: [
          f('stage', 'Stage label'),
          f('title', 'Title'),
          f('body', 'Body', 'textarea'),
          f('tone', 'Tone', 'select', {
            options: [
              { value: 'high', label: 'Favourable' },
              { value: 'mid', label: 'Mixed' },
              { value: 'low', label: 'Unfavourable' },
            ],
          }),
        ],
      }),
      f('caveat', 'Caveat', 'textarea'),
      link('link', 'External link'),
    ],
  },
  {
    page: 'problem',
    key: 'implications',
    label: 'Design implications',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('items', 'Requirements', 'list', {
        itemLabel: 'requirement',
        fields: [f('requirement', 'Requirement'), f('rationale', 'Rationale', 'textarea')],
      }),
    ],
  },
  {
    page: 'problem',
    key: 'cta',
    label: 'Closing CTA',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'textarea'),
      link('primaryCta', 'Primary button'),
      link('secondaryCta', 'Secondary button'),
    ],
  },

  /* ----------------------------- INNOVATION ------------------------------ */
  {
    page: 'innovation',
    key: 'hero',
    label: 'Hero',
    fields: [
      f('eyebrow', 'Eyebrow'),
      f('heading', 'Heading'),
      f('lead', 'Lead paragraph', 'textarea'),
      f('note', 'Note', 'textarea'),
    ],
  },
  {
    page: 'innovation',
    key: 'overview',
    label: 'Technology overview',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading', 'textarea'),
      f('body', 'Body', 'richtext'),
      f('pullQuote', 'Pull quote', 'textarea'),
      f('pillars', 'Established / Proposed / Unproven', 'list', {
        itemLabel: 'category',
        fields: [f('title', 'Title'), f('body', 'Body', 'textarea')],
      }),
    ],
  },
  {
    page: 'innovation',
    key: 'crispr',
    label: 'CRISPR-Cas12a mechanism',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading', 'textarea'),
      f('body', 'Body', 'richtext'),
      f('conceptNote', 'Conceptual illustration note', 'textarea'),
      f('steps', 'Mechanism steps', 'list', {
        itemLabel: 'step',
        fields: [f('index', 'Index'), f('title', 'Title'), f('body', 'Body', 'textarea')],
      }),
      f('references', 'Inline references', 'list', {
        itemLabel: 'reference',
        fields: [f('label', 'Label'), f('citation', 'Citation', 'textarea'), f('url', 'URL', 'url')],
      }),
    ],
  },
  {
    page: 'innovation',
    key: 'workflow',
    label: 'Diagnostic workflow',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('steps', 'Workflow stages', 'list', {
        itemLabel: 'stage',
        fields: [
          f('index', 'Index'),
          f('title', 'Title'),
          f('body', 'Body', 'textarea'),
          f('status', 'Status', 'select', {
            options: [
              { value: 'proposed', label: 'Proposed' },
              { value: 'in-development', label: 'In development' },
              { value: 'demonstrated', label: 'Demonstrated (evidence required)' },
            ],
          }),
        ],
      }),
      f('disclaimer', 'Disclaimer', 'textarea'),
    ],
  },
  {
    page: 'innovation',
    key: 'architecture',
    label: 'System architecture',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('components', 'Subsystems', 'list', {
        itemLabel: 'subsystem',
        fields: [
          f('index', 'Index'),
          f('title', 'Title'),
          f('short', 'Diagram label'),
          f('body', 'Description', 'textarea'),
          f('open', 'Open question', 'textarea'),
        ],
      }),
      f('note', 'Diagram note'),
    ],
  },
  {
    page: 'innovation',
    key: 'hardware',
    label: 'Hardware',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('assetNotice', 'Asset notice', 'textarea'),
      f('items', 'Hardware workstreams', 'list', {
        itemLabel: 'workstream',
        fields: [
          f('title', 'Title'),
          f('body', 'Body', 'textarea'),
          f('imageUrl', 'Image', 'image'),
          f('specs', 'Specs', 'list', {
            itemLabel: 'spec',
            fields: [f('label', 'Label'), f('value', 'Value')],
          }),
        ],
      }),
    ],
  },
  {
    page: 'innovation',
    key: 'boundaries',
    label: 'Scope and limits',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('items', 'Limitations', 'list', {
        itemLabel: 'statement',
        simple: true,
        fields: [f('value', 'Statement', 'textarea')],
      }),
    ],
  },
  {
    page: 'innovation',
    key: 'cta',
    label: 'Closing CTA',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'textarea'),
      link('primaryCta', 'Primary button'),
      link('secondaryCta', 'Secondary button'),
    ],
  },

  /* ------------------------------ RESEARCH ------------------------------- */
  {
    page: 'research',
    key: 'hero',
    label: 'Hero',
    fields: [
      f('eyebrow', 'Eyebrow'),
      f('heading', 'Heading', 'textarea'),
      f('lead', 'Lead paragraph', 'textarea'),
      f('note', 'Note', 'textarea'),
    ],
  },
  {
    page: 'research',
    key: 'method',
    label: 'Methodology',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('pullQuote', 'Pull quote', 'textarea'),
      f('pillars', 'Principles', 'list', {
        itemLabel: 'principle',
        fields: [f('title', 'Title'), f('body', 'Body', 'textarea')],
      }),
    ],
  },
  {
    page: 'research',
    key: 'timeline',
    label: 'Timeline intro',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('emptyNote', 'Note when no milestones are complete', 'textarea'),
    ],
  },
  {
    page: 'research',
    key: 'workstreams',
    label: 'Workstreams',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('items', 'Workstreams', 'list', {
        itemLabel: 'workstream',
        fields: [
          f('index', 'Index'),
          f('title', 'Title'),
          f('question', 'Lead question', 'textarea'),
          f('status', 'Status'),
          f('body', 'Body', 'textarea'),
        ],
      }),
    ],
  },
  {
    page: 'research',
    key: 'validation',
    label: 'Validation strategy',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('stages', 'Stages', 'list', {
        itemLabel: 'stage',
        fields: [f('index', 'Index'), f('title', 'Title'), f('body', 'Body', 'textarea'), f('gate', 'Decision gate', 'textarea')],
      }),
      f('disclaimer', 'Disclaimer', 'textarea'),
    ],
  },
  {
    page: 'research',
    key: 'challenges',
    label: 'Open problems',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('items', 'Challenges', 'list', {
        itemLabel: 'challenge',
        fields: [f('title', 'Title'), f('body', 'Body', 'textarea')],
      }),
    ],
  },
  {
    page: 'research',
    key: 'documents',
    label: 'Documentation',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('emptyNote', 'Empty state note', 'textarea'),
    ],
  },
  {
    page: 'research',
    key: 'cta',
    label: 'Closing CTA',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'textarea'),
      link('primaryCta', 'Primary button'),
      link('secondaryCta', 'Secondary button'),
    ],
  },

  /* -------------------------------- TEAM --------------------------------- */
  {
    page: 'team',
    key: 'hero',
    label: 'Hero',
    fields: [
      f('eyebrow', 'Eyebrow'),
      f('heading', 'Heading'),
      f('lead', 'Lead paragraph', 'textarea'),
      f('note', 'Note', 'textarea'),
      f('groupPhotoUrl', 'Team photograph', 'image', {
        hint: 'Leave empty if no photograph has been supplied. Never use stock imagery.',
      }),
      f('groupPhotoCaption', 'Photograph caption'),
    ],
  },
  {
    page: 'team',
    key: 'mission',
    label: 'Mission & vision',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('mission', 'Mission statement', 'textarea'),
      f('vision', 'Vision statement', 'textarea'),
      f('values', 'Values', 'list', {
        itemLabel: 'value',
        fields: [f('title', 'Title'), f('body', 'Body', 'textarea')],
      }),
    ],
  },
  {
    page: 'team',
    key: 'members',
    label: 'Team directory',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('emptyTitle', 'Empty state title'),
      f('emptyBody', 'Empty state body', 'textarea'),
      link('emptyAction', 'Empty state action'),
    ],
  },
  {
    page: 'team',
    key: 'principles',
    label: 'Operating principles',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('items', 'Principles', 'list', {
        itemLabel: 'principle',
        fields: [f('index', 'Index'), f('title', 'Title'), f('body', 'Body', 'textarea')],
      }),
    ],
  },
  {
    page: 'team',
    key: 'cta',
    label: 'Closing CTA',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'textarea'),
      link('primaryCta', 'Primary button'),
      link('secondaryCta', 'Secondary button'),
    ],
  },

  /* ------------------------------- IMPACT -------------------------------- */
  {
    page: 'impact',
    key: 'hero',
    label: 'Hero',
    fields: [
      f('eyebrow', 'Eyebrow'),
      f('heading', 'Heading', 'textarea'),
      f('lead', 'Lead paragraph', 'textarea'),
      f('note', 'Note', 'textarea'),
    ],
  },
  {
    page: 'impact',
    key: 'potential',
    label: 'Potential impact',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('areas', 'Impact areas', 'list', {
        itemLabel: 'area',
        fields: [
          f('index', 'Index'),
          f('title', 'Title'),
          f('body', 'Body', 'textarea'),
          f('assumption', 'Assumption', 'textarea'),
        ],
      }),
      f('disclaimer', 'Disclaimer', 'textarea'),
    ],
  },
  {
    page: 'impact',
    key: 'access',
    label: 'Access model',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('metrics', 'Design targets', 'list', {
        itemLabel: 'target',
        fields: [f('label', 'Label'), f('target', 'Target'), f('note', 'Note')],
      }),
      f('caveat', 'Caveat'),
    ],
  },
  {
    page: 'impact',
    key: 'roadmap',
    label: 'Roadmap',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('phases', 'Phases', 'list', {
        itemLabel: 'phase',
        fields: [
          f('phase', 'Phase label'),
          f('title', 'Title'),
          f('period', 'Period'),
          f('status', 'Status', 'select', {
            options: [
              { value: 'active', label: 'Current' },
              { value: 'next', label: 'Next' },
              { value: 'future', label: 'Future' },
            ],
          }),
          f('body', 'Description', 'textarea'),
          f('gate', 'Exit gate', 'textarea'),
        ],
      }),
      f('disclaimer', 'Disclaimer', 'textarea'),
    ],
  },
  {
    page: 'impact',
    key: 'partnerships',
    label: 'Partnerships',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('emptyNote', 'Empty state note'),
      f('interests', 'Areas of interest', 'list', {
        itemLabel: 'interest',
        simple: true,
        fields: [f('value', 'Interest')],
      }),
      link('cta', 'Call to action'),
    ],
  },
  {
    page: 'impact',
    key: 'responsible',
    label: 'Responsible innovation',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('items', 'Commitments', 'list', {
        itemLabel: 'commitment',
        fields: [f('title', 'Title'), f('body', 'Body', 'textarea')],
      }),
    ],
  },
  {
    page: 'impact',
    key: 'recognition',
    label: 'Recognition gallery',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'textarea'),
      f('items', 'Gallery items', 'list', {
        itemLabel: 'item',
        fields: [
          f('title', 'Title'),
          f('context', 'Context'),
          f('year', 'Year'),
          f('image', 'Photograph', 'image'),
          f('alt', 'Alt text'),
        ],
      }),
      f('disclaimer', 'Disclaimer', 'textarea'),
    ],
  },
  {
    page: 'impact',
    key: 'cta',
    label: 'Closing CTA',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'textarea'),
      link('primaryCta', 'Primary button'),
      link('secondaryCta', 'Secondary button'),
    ],
  },

  /* ------------------------------ RESOURCES ------------------------------ */
  {
    page: 'resources',
    key: 'hero',
    label: 'Hero',
    fields: [
      f('eyebrow', 'Eyebrow'),
      f('heading', 'Heading'),
      f('lead', 'Lead paragraph', 'textarea'),
      f('note', 'Note', 'textarea'),
    ],
  },
  {
    page: 'resources',
    key: 'documents',
    label: 'Document library',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('emptyNote', 'Empty state note', 'textarea'),
      stringList('categories', 'Document categories'),
    ],
  },
  {
    page: 'resources',
    key: 'contact',
    label: 'Contact',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'richtext'),
      f('formTitle', 'Form title'),
      f('formNote', 'Form note', 'textarea'),
      stringList('subjects', 'Enquiry subjects'),
    ],
  },
  {
    page: 'resources',
    key: 'faq',
    label: 'FAQ',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('items', 'Questions', 'list', {
        itemLabel: 'question',
        fields: [f('q', 'Question', 'textarea'), f('a', 'Answer', 'richtext')],
      }),
    ],
  },
  {
    page: 'resources',
    key: 'cta',
    label: 'Closing CTA',
    fields: [
      f('label', 'Section label'),
      f('heading', 'Heading'),
      f('body', 'Body', 'textarea'),
      link('primaryCta', 'Primary button'),
      link('secondaryCta', 'Secondary button'),
    ],
  },
]

export const SECTION_SCHEMA = defs.reduce((acc, def) => {
  acc[`${def.page}:${def.key}`] = def
  return acc
}, {})

export function getSectionSchema(page, key) {
  return (
    SECTION_SCHEMA[`${page}:${key}`] || {
      page,
      key,
      label: key.replace(/-/g, ' '),
      fields: [],
    }
  )
}

export const SECTION_LABELS = defs.reduce((acc, def) => {
  acc[`${def.page}:${def.key}`] = def.label
  return acc
}, {})

/** Collections editable from the admin. */
export const COLLECTIONS = {
  team: {
    label: 'Team members',
    singular: 'team member',
    fields: [
      f('name', 'Full name'),
      f('role', 'Position / role'),
      f('responsibilities', 'Responsibilities', 'textarea'),
      f('bio', 'Biography', 'richtext'),
      f('contribution', 'Technical contribution', 'textarea'),
      f('photoUrl', 'Photograph', 'image'),
      f('links', 'Links', 'list', {
        itemLabel: 'link',
        fields: [f('label', 'Label'), f('url', 'URL', 'url')],
      }),
      f('sortOrder', 'Order', 'number'),
      f('published', 'Published', 'boolean'),
    ],
    defaultItem: {
      name: '',
      role: '',
      responsibilities: '',
      bio: '',
      contribution: '',
      photoUrl: '',
      links: [],
      sortOrder: 99,
      published: false,
    },
  },
  milestones: {
    label: 'Research milestones',
    singular: 'milestone',
    fields: [
      f('title', 'Title'),
      f('description', 'Description', 'richtext'),
      f('phase', 'Phase / workstream'),
      f('status', 'Status', 'select', {
        options: [
          { value: 'planned', label: 'Planned' },
          { value: 'in-progress', label: 'In progress' },
          { value: 'completed', label: 'Completed' },
          { value: 'validated', label: 'Validated' },
        ],
        hint: 'Only mark completed or validated when supporting evidence is attached.',
      }),
      f('period', 'Period label'),
      f('date', 'Date', 'text', { hint: 'YYYY-MM-DD' }),
      f('evidenceUrl', 'Evidence URL', 'url'),
      f('evidenceLabel', 'Evidence label'),
      f('sortOrder', 'Order', 'number'),
      f('published', 'Published', 'boolean'),
    ],
    defaultItem: {
      title: '',
      description: '',
      phase: '',
      status: 'planned',
      period: '',
      date: new Date().toISOString().slice(0, 10),
      evidenceUrl: '',
      evidenceLabel: '',
      sortOrder: 99,
      published: false,
    },
  },
  references: {
    label: 'Scientific references',
    singular: 'reference',
    fields: [
      f('authors', 'Authors / organisation'),
      f('title', 'Title'),
      f('source', 'Journal / publisher'),
      f('year', 'Year'),
      f('url', 'URL', 'url'),
      f('doi', 'DOI'),
      f('note', 'Where it is used', 'textarea'),
      f('sortOrder', 'Order', 'number'),
      f('published', 'Published', 'boolean'),
    ],
    defaultItem: {
      authors: '',
      title: '',
      source: '',
      year: '',
      url: '',
      doi: '',
      note: '',
      sortOrder: 99,
      published: false,
    },
  },
  documents: {
    label: 'Public documents',
    singular: 'document',
    fields: [
      f('title', 'Title'),
      f('description', 'Description', 'textarea'),
      f('category', 'Category'),
      f('fileUrl', 'File', 'image', { hint: 'Upload a PDF or image in Media, then paste its URL.' }),
      f('fileSize', 'File size (bytes)', 'number'),
      f('fileType', 'File type'),
      f('version', 'Version'),
      f('sortOrder', 'Order', 'number'),
      f('published', 'Published', 'boolean'),
    ],
    defaultItem: {
      title: '',
      description: '',
      category: 'Technical brief',
      fileUrl: '',
      fileSize: 0,
      fileType: 'PDF',
      version: '1.0',
      sortOrder: 99,
      published: false,
    },
  },
  researchDocuments: {
    label: 'Research documents',
    singular: 'research document',
    fields: [
      f('title', 'Title'),
      f('description', 'Description', 'textarea'),
      f('category', 'Category'),
      f('fileUrl', 'File', 'image', { hint: 'Upload a PDF or image in Media, then paste its URL.' }),
      f('fileSize', 'File size (bytes)', 'number'),
      f('fileType', 'File type'),
      f('version', 'Version'),
      f('sortOrder', 'Order', 'number'),
      f('published', 'Published', 'boolean'),
    ],
    defaultItem: {
      title: '',
      description: '',
      category: 'Research report',
      fileUrl: '',
      fileSize: 0,
      fileType: 'PDF',
      version: '1.0',
      sortOrder: 99,
      published: false,
    },
  },
}
