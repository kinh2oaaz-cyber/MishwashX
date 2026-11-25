/**
 * SEED CONTENT — Mishawash X
 * ---------------------------------------------------------------------------
 * This file is the single source of truth for the site's initial content.
 * Everything here is editable from /admin once the site is running.
 *
 * INTEGRITY RULES OBSERVED IN THIS FILE
 *  • No experimental result, accuracy figure, sensitivity/specificity value,
 *    clinical claim, partnership or team credential is invented.
 *  • Every statistic carries a citation to a real, named publication.
 *  • All research milestones are seeded as "planned" — nothing is presented as
 *    demonstrated until the team publishes evidence through the dashboard.
 *  • Team and document collections are intentionally empty. The public pages
 *    render designed empty states rather than placeholder people or fake PDFs.
 *  • Contact details are blank until the team supplies them.
 */

export const CONTENT_VERSION = 1

/* -------------------------------------------------------------------------- */
/*  SITE SETTINGS                                                             */
/* -------------------------------------------------------------------------- */

export const seedSettings = {
  brand: {
    name: 'Mishawash X',
    shortName: 'Mishawash X',
    mark: 'MX',
    descriptor: 'Biomedical Technology · Conrad Challenge 2026–2027',
    tagline: 'Diagnostics that reach further.',
    logoUrl: '/images/logo/mishawash-x-logo.jpg',
  },
  nav: {
    links: [
      { label: 'Home', to: '/' },
      { label: 'The Problem', to: '/problem' },
      { label: 'Innovation', to: '/innovation' },
      { label: 'Research', to: '/research' },
      { label: 'Team', to: '/team' },
      { label: 'Impact', to: '/impact' },
      { label: 'Resources', to: '/resources' },
    ],
    cta: { label: 'Collaborate', to: '/resources#contact' },
    showCta: true,
  },
  announcement: {
    enabled: true,
    text: 'Protirodh BioKit is a concept-stage research programme — not a validated or approved medical device.',
    linkLabel: 'Read our research status',
    linkTo: '/research',
  },
  footer: {
    statement:
      'Mishawash X is an independent student innovation team developing Protirodh BioKit, a CRISPR-Cas12a-based diagnostic platform concept, for the Conrad Challenge 2026–2027.',
    columns: [
      {
        title: 'Programme',
        links: [
          { label: 'The Problem', to: '/problem' },
          { label: 'Our Innovation', to: '/innovation' },
          { label: 'Research & Development', to: '/research' },
          { label: 'Impact & Vision', to: '/impact' },
        ],
      },
      {
        title: 'Organisation',
        links: [
          { label: 'Our Team', to: '/team' },
          { label: 'Resources', to: '/resources' },
          { label: 'Contact', to: '/resources#contact' },
        ],
      },
    ],
    disclaimer:
      'Concept-stage research. Protirodh BioKit has not been clinically validated, approved by any regulatory authority, or made commercially available. All scientific illustrations on this site are conceptual unless explicitly labelled otherwise.',
    credits: 'Mishawash X · Conrad Challenge 2026–2027',
  },
  contact: {
    email: 'mishawashx2024@gmail.com',
    secondaryEmail: '',
    phone: '+8801990005228',
    location: 'Dhaka, Bangladesh',
    hours: 'Available for research collaborations',
    inquiryNote:
      'We welcome questions from researchers, clinicians, educators and potential collaborators. Please include your affiliation and the nature of your enquiry.',
    responseTime: 'We aim to respond to research enquiries within five working days.',
  },
  socials: [
    { label: 'Facebook', url: 'https://www.facebook.com/mishawash-x', icon: 'facebook' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/company/mishawash-x', icon: 'linkedin' },
  ],
  seo: {
    title: 'Mishawash X — Protirodh BioKit | CRISPR-Based Diagnostics',
    description:
      'Mishawash X is developing Protirodh BioKit, a portable CRISPR-Cas12a-based diagnostic platform concept exploring more accessible approaches to cancer screening. Conrad Challenge 2026–2027.',
    keywords:
      'Mishawash X, Protirodh BioKit, CRISPR-Cas12a, cancer screening, point-of-care diagnostics, Conrad Challenge',
  },
}

/* -------------------------------------------------------------------------- */
/*  PAGE REGISTRY                                                             */
/* -------------------------------------------------------------------------- */

export const seedPages = [
  {
    slug: 'home',
    title: 'Home',
    navLabel: 'Home',
    seoTitle: 'Mishawash X — Redefining Access to Cancer Diagnostics',
    seoDescription:
      'Protirodh BioKit: a portable CRISPR-Cas12a-based diagnostic platform concept designed to explore more accessible approaches to cancer screening.',
    status: 'published',
    sortOrder: 1,
    updatedAt: '2026-01-05T09:00:00.000Z',
  },
  {
    slug: 'problem',
    title: 'The Problem',
    navLabel: 'The Problem',
    seoTitle: 'The Access Gap in Cancer Diagnostics',
    seoDescription:
      'Why cancer screening remains out of reach for so many communities — with cited evidence on global cancer burden, diagnostic access and late-stage presentation.',
    status: 'published',
    sortOrder: 2,
    updatedAt: '2026-01-05T09:00:00.000Z',
  },
  {
    slug: 'innovation',
    title: 'Our Innovation',
    navLabel: 'Innovation',
    seoTitle: 'Protirodh BioKit — CRISPR-Cas12a Diagnostic Platform Concept',
    seoDescription:
      'The proposed architecture, molecular mechanism and diagnostic workflow behind Protirodh BioKit, with proposed and demonstrated stages clearly separated.',
    status: 'published',
    sortOrder: 3,
    updatedAt: '2026-01-05T09:00:00.000Z',
  },
  {
    slug: 'research',
    title: 'Research & Development',
    navLabel: 'Research',
    seoTitle: 'Research & Development',
    seoDescription:
      'Our methodology, development milestones, validation strategy and technical challenges — documented transparently, including what remains unproven.',
    status: 'published',
    sortOrder: 4,
    updatedAt: '2026-01-05T09:00:00.000Z',
  },
  {
    slug: 'team',
    title: 'Our Team',
    navLabel: 'Team',
    seoTitle: 'Our Team',
    seoDescription:
      'The people behind Mishawash X — mission, working principles and member profiles.',
    status: 'published',
    sortOrder: 5,
    updatedAt: '2026-01-05T09:00:00.000Z',
  },
  {
    slug: 'impact',
    title: 'Impact & Vision',
    navLabel: 'Impact',
    seoTitle: 'Impact & Vision',
    seoDescription:
      'The potential impact of accessible molecular diagnostics, our development roadmap and the principles guiding responsible innovation.',
    status: 'published',
    sortOrder: 6,
    updatedAt: '2026-01-05T09:00:00.000Z',
  },
  {
    slug: 'resources',
    title: 'Resources & Contact',
    navLabel: 'Resources',
    seoTitle: 'Resources & Contact',
    seoDescription:
      'Project documentation, technical materials and collaboration enquiries for Mishawash X and Protirodh BioKit.',
    status: 'published',
    sortOrder: 7,
    updatedAt: '2026-01-05T09:00:00.000Z',
  },
]

/* -------------------------------------------------------------------------- */
/*  SECTION HELPERS                                                           */
/* -------------------------------------------------------------------------- */

let sectionCounter = 0
const now = '2026-01-05T09:00:00.000Z'

/** Photographs supplied by the team, shown in the recognition galleries. */
const recognitionItems = [
  {
    title: 'Innovation World Cup 2026',
    context: 'National Silver Winner · International Selected',
    year: '2026',
    image: '/images/achievements/innovation-world-cup.png',
    alt: 'Innovation World Cup 2026 recognition',
  },
  {
    title: '3ZERO Leadership Challenge',
    context: '2nd place among 466 South Asian leaders',
    year: '2025',
    image: '/images/achievements/3zero-leadership.png',
    alt: '3ZERO Leadership Challenge recognition',
  },
  {
    title: 'Global Robotics & Innovation Consortium',
    context: 'International round selection',
    year: '2025',
    image: '/images/achievements/gric-international.png',
    alt: 'GRIC international round',
  },
  {
    title: 'Al Khwarizmi Science Fest',
    context: '3rd place',
    year: '2025',
    image: '/images/achievements/al-khwarizmi.png',
    alt: 'Al Khwarizmi Science Fest award',
  },
  {
    title: 'BGB Award',
    context: 'Dhaka',
    year: '2025',
    image: '/images/achievements/bgb-award.png',
    alt: 'BGB Award, Dhaka',
  },
  {
    title: 'Educational Excellence Support Scheme',
    context: '1st place · Dhaka Zilla',
    year: '2026',
    image: '/images/achievements/educational-excellence-zilla.png',
    alt: 'Educational Excellence Support Scheme, Dhaka Zilla',
  },
  {
    title: 'Educational Excellence Support Scheme',
    context: '1st place · Thana',
    year: '2026',
    image: '/images/achievements/educational-excellence-thana.png',
    alt: 'Educational Excellence Support Scheme, Thana',
  },
  {
    title: 'Project visit at BCFCC',
    context: 'Honourable Prime Minister visiting our project',
    year: '2025',
    image: '/images/achievements/pm-visit-bcfcc.png',
    alt: 'Prime Minister visiting the Mishawash X project at BCFCC',
  },
]

/** Build a published section record. */
function sec(page, key, kind, content, extra = {}) {
  sectionCounter += 1
  return {
    id: `seed-${String(sectionCounter).padStart(3, '0')}`,
    pageSlug: page,
    key,
    kind,
    sortOrder: sectionCounter,
    visible: extra.visible ?? true,
    status: 'published',
    draft: content,
    published: content,
    updatedAt: now,
  }
}

/* -------------------------------------------------------------------------- */
/*  HOME                                                                      */
/* -------------------------------------------------------------------------- */

const home = [
  sec('home', 'hero', 'hero', {
    eyebrow: 'Conrad Challenge 2026–2027 · Biomedical Technology',
    titleLines: ['Redefining Access', 'to Cancer Diagnostics.'],
    lead: 'Introducing Protirodh BioKit — a portable CRISPR-based diagnostic platform concept designed to explore more accessible approaches to cancer screening.',
    primaryCta: { label: 'Explore Our Innovation', to: '/innovation' },
    secondaryCta: { label: 'Meet Mishawash X', to: '/team' },
    statusNote:
      'Concept stage. Protirodh BioKit is a research and development proposal — not a validated or approved medical device.',
    markers: [
      { value: 'CRISPR-Cas12a', label: 'Proposed detection chemistry' },
      { value: 'Portable', label: 'Target form factor' },
      { value: 'Low-resource', label: 'Design context' },
    ],
    markersNote: 'Design intentions — not measured performance.',
  }),

  sec('home', 'statement', 'editorial', {
    label: 'The Programme',
    heading:
      'A diagnostics platform designed around the places that need it most.',
    body: 'Protirodh BioKit began with a straightforward observation: the molecular tools that make modern diagnostics powerful are increasingly well understood, yet the infrastructure required to use them remains concentrated in well-resourced laboratories. Our programme explores whether a deliberately simplified architecture — portable hardware, a single-use cartridge and a CRISPR-Cas12a recognition step — could make molecular screening more practical in settings where centralised laboratories are distant, expensive or unavailable.',
    pullQuote:
      'Ambition is not evidence. We separate what is established, what we propose, and what we have yet to prove.',
    pillars: [
      {
        title: 'Access-first engineering',
        body: 'Every design decision is evaluated against cost, power, portability and the skill level required to operate it.',
      },
      {
        title: 'Transparent science',
        body: 'Proposed mechanisms, planned experiments and demonstrated results are labelled separately and never conflated.',
      },
      {
        title: 'Responsible by default',
        body: 'We design for confirmatory testing, clinical oversight and clear limits on what a screening result can mean.',
      },
    ],
  }),

  sec('home', 'problem', 'preview', {
    label: '01 — The Problem',
    heading: 'Screening only works when people can reach it.',
    body: 'Cancer outcomes depend heavily on when disease is found. Yet diagnostic capacity — trained staff, laboratory infrastructure, reagents and reliable power — is unevenly distributed, and the communities with the least access often carry the greatest burden.',
    link: { label: 'Examine the evidence', to: '/problem' },
    stats: [
      {
        value: '≈20M',
        label: 'new cancer cases estimated worldwide in 2022',
        source: 'IARC GLOBOCAN 2022',
      },
      {
        value: '≈70%',
        label: 'of cancer deaths occur in low- and middle-income countries',
        source: 'WHO',
      },
      {
        value: '47%',
        label: 'of the global population has little or no access to diagnostics',
        source: 'Lancet Commission on Diagnostics, 2021',
      },
    ],
    statsNote:
      'Figures reproduced from the cited publications. Full citations and source links are provided on The Problem page.',
  }),

  sec('home', 'innovation', 'preview', {
    label: '02 — Our Innovation',
    heading: 'Protirodh BioKit',
    body: 'A proposed point-of-care diagnostic platform that pairs a single-use reaction cartridge with portable optical readout and CRISPR-Cas12a target recognition. The objective is a workflow that needs minimal laboratory infrastructure while preserving the specificity that molecular detection can offer.',
    link: { label: 'Explore the platform', to: '/innovation' },
    stages: [
      { step: '01', title: 'Sample in', body: 'A minimally processed sample is introduced to a single-use cartridge.' },
      { step: '02', title: 'Molecular recognition', body: 'A Cas12a ribonucleoprotein complex is programmed to recognise a target nucleic acid sequence.' },
      { step: '03', title: 'Signal generation', body: 'Collateral cleavage of a reporter construct converts recognition into a measurable optical signal.' },
      { step: '04', title: 'Readout', body: 'A portable optical module interprets the signal and returns an operator-facing result.' },
    ],
    disclaimer:
      'Conceptual architecture. No stage of this workflow has been validated as a clinical assay.',
  }),

  sec('home', 'technology', 'highlights', {
    label: '03 — Technology',
    heading: 'Four engineering decisions that define the platform.',
    body: 'Each element below is a design direction under investigation, not a finished specification. Performance targets will be published only when measured.',
    items: [
      {
        index: 'T1',
        title: 'Isothermal molecular detection',
        body: 'CRISPR-Cas12a is explored as a recognition layer that can operate without thermal cycling, reducing hardware complexity relative to amplification-and-cycling approaches.',
        tag: 'Proposed',
      },
      {
        index: 'T2',
        title: 'Single-use cartridge',
        body: 'A sealed fluidic path intended to reduce cross-contamination, simplify operation and keep consumable cost low.',
        tag: 'In design',
      },
      {
        index: 'T3',
        title: 'Portable optical readout',
        body: 'A compact fluorescence detection module designed to translate reporter cleavage into a quantitative signal without a benchtop instrument.',
        tag: 'In design',
      },
      {
        index: 'T4',
        title: 'Operator-first interface',
        body: 'Guided workflow, unambiguous result states and explicit limitations — including when a result requires confirmatory laboratory testing.',
        tag: 'Proposed',
      },
    ],
  }),

  sec('home', 'research', 'research-preview', {
    label: '04 — Research',
    heading: 'Documented as it happens.',
    body: 'Our research page tracks workstreams, milestones and validation strategy. Status labels are updated by the team and reflect the evidence we can currently show.',
    link: { label: 'View research status', to: '/research' },
    statusKey: 'researchStatus',
  }),

  sec('home', 'team', 'team-preview', {
    label: '05 — The Team',
    heading: 'A small team, a specific question.',
    body: 'Mishawash X brings together students working across molecular biology, hardware design and scientific communication. Member profiles are published through our content system and appear here as they are confirmed.',
    link: { label: 'Meet the team', to: '/team' },
  }),

  sec('home', 'impact', 'impact-preview', {
    label: '06 — Impact',
    heading: 'What accessible screening could change.',
    body: 'If a platform like Protirodh BioKit can be shown to perform reliably outside a central laboratory, the consequences are practical rather than abstract: shorter distances to a result, earlier conversations about care, and less pressure on overstretched reference laboratories.',
    link: { label: 'Read our vision', to: '/impact' },
    items: [
      { title: 'Proximity', body: 'Testing closer to where people live, reducing travel and loss to follow-up.' },
      { title: 'Throughput', body: 'Offloading routine screening from central laboratories with limited capacity.' },
      { title: 'Affordability', body: 'A consumable-led cost model intended for constrained health budgets.' },
    ],
    disclaimer:
      'These are potential outcomes of the concept, contingent on validation we have not yet completed.',
  }),

  sec('home', 'recognition', 'gallery', {
    label: '07 — Recognition',
    heading: 'Where the work has been seen.',
    body: 'Selected recognitions, festival placements and institutional visits from the team’s wider science and engineering programme. These describe Mishawash X’s activities — they are not evidence of clinical validation for Protirodh BioKit.',
    items: recognitionItems,
    disclaimer:
      'Awards and invitations relate to the team’s projects and presentations. The diagnostic concept remains unvalidated.',
  }),

  sec('home', 'cta', 'cta', {
    label: 'Collaboration',
    heading: 'We are looking for rigorous critique.',
    body: 'If you work in molecular diagnostics, clinical microbiology, global health or hardware engineering, we would value your perspective — particularly where our assumptions are weakest.',
    primaryCta: { label: 'Start a conversation', to: '/resources#contact' },
    secondaryCta: { label: 'Read the research', to: '/research' },
  }),
]

/* -------------------------------------------------------------------------- */
/*  THE PROBLEM                                                               */
/* -------------------------------------------------------------------------- */

const problem = [
  sec('problem', 'hero', 'hero-inner', {
    eyebrow: '01 — Context',
    heading: 'The distance between a test and a diagnosis.',
    lead: 'Cancer screening is one of the most consequential interventions in modern medicine — and one of the most dependent on infrastructure. Where laboratories, reagents, power and trained staff are scarce, screening quietly stops happening.',
    note: 'This page summarises published evidence. Every figure is cited; no original data is presented.',
  }),

  sec('problem', 'context', 'editorial', {
    label: 'The access gap',
    heading: 'Detection is a logistics problem as much as a biological one.',
    body: 'A screening test only produces benefit when a result reaches a clinician and a patient in time to act on it. That chain — sample collection, transport, processing, interpretation, communication and follow-up — fails at different points in different health systems. In well-resourced settings the chain is largely invisible. Elsewhere, each link is a potential point of loss.',
    pullQuote:
      'A test that cannot reach a patient is, functionally, a test that does not exist.',
    pillars: [
      {
        title: 'Late presentation',
        body: 'Where screening is unavailable, cancers are more often identified after symptoms appear — when treatment options are narrower and outcomes poorer.',
      },
      {
        title: 'Concentrated capacity',
        body: 'Molecular and histopathological capability is typically centralised in referral hospitals, creating travel distance and turnaround delay.',
      },
      {
        title: 'Fragmented follow-up',
        body: 'Results that arrive late or cannot be linked to a patient record create loss to follow-up even when testing exists.',
      },
    ],
  }),

  sec('problem', 'barriers', 'barriers', {
    label: 'Where it breaks down',
    heading: 'Five barriers that recur across low-resource settings.',
    body: 'These categories overlap in practice. A single patient journey may encounter all five.',
    items: [
      {
        index: 'B1',
        title: 'Financial',
        body: 'Out-of-pocket costs for testing, transport and lost wages suppress demand even where services exist. Screening competes with immediate household expenditure.',
      },
      {
        index: 'B2',
        title: 'Infrastructure',
        body: 'Thermal cyclers, cold chains, calibrated optics and uninterrupted power are assumed by many molecular workflows — and are frequently absent.',
      },
      {
        index: 'B3',
        title: 'Geographic',
        body: 'Referral laboratories may be hours or days away. Sample transport conditions and turnaround time both degrade the value of a result.',
      },
      {
        index: 'B4',
        title: 'Workforce',
        body: 'Trained laboratory scientists and pathologists are scarce relative to need, and their time is concentrated on urgent diagnostic work.',
      },
      {
        index: 'B5',
        title: 'Awareness & trust',
        body: 'Limited information about screening, stigma and mistrust of health systems reduce participation independently of test availability.',
      },
    ],
  }),

  sec('problem', 'statistics', 'statistics', {
    label: 'The evidence',
    heading: 'What the published data shows.',
    body: 'Each figure below is reproduced from the cited source. Where a source reports an estimate, we present it as an estimate.',
    stats: [
      {
        value: '20.0M',
        prefix: '≈',
        label: 'Estimated new cancer cases worldwide in 2022',
        detail:
          'GLOBOCAN 2022 estimated approximately 20 million new cancer cases and 9.7 million cancer deaths globally in 2022.',
        source: 'Bray F, et al. Global cancer statistics 2022. CA Cancer J Clin. 2024.',
        sourceUrl: 'https://gco.iarc.who.int/media/globocan/factsheets/populations/900-world-fact-sheet.pdf',
        year: '2024',
      },
      {
        value: '70%',
        label: 'Share of cancer deaths occurring in low- and middle-income countries',
        detail:
          'WHO reports that approximately 70% of cancer deaths occur in low- and middle-income countries.',
        source: 'World Health Organization — Cancer fact sheet',
        sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
        year: '2024',
      },
      {
        value: '47%',
        label: 'Of the global population has little or no access to diagnostics',
        detail:
          'The Lancet Commission on Diagnostics estimated that 47% of the global population has little or no access to diagnostics, with substantial gaps in primary care.',
        source: 'Fleming KA, et al. The Lancet Commission on diagnostics. The Lancet. 2021.',
        sourceUrl: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)01369-9/fulltext',
        year: '2021',
      },
      {
        value: '1 in 5',
        label: 'People develop cancer during their lifetime',
        detail:
          'WHO estimates that roughly 1 in 5 people develop cancer in their lifetime, with approximately 1 in 9 men and 1 in 12 women dying from the disease.',
        source: 'World Health Organization — Cancer fact sheet',
        sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
        year: '2024',
      },
    ],
    verificationNote:
      'These citations are maintained in the scientific references register. Source links open the original publication or fact sheet.',
  }),

  sec('problem', 'early', 'early-detection', {
    label: 'Why timing matters',
    heading: 'Stage at diagnosis shapes what treatment can do.',
    body: 'For many cancers, outcomes are substantially better when disease is identified at an earlier stage, when curative-intent treatment is more often feasible. WHO emphasises early diagnosis and organised screening as components of comprehensive cancer control. This is why a screening pathway is not a convenience feature — it is the mechanism through which survival gains are realised.',
    stages: [
      {
        stage: 'Stage I–II',
        title: 'Localised disease',
        body: 'Treatment options are typically broader and curative intent is more frequently achievable.',
        tone: 'high',
      },
      {
        stage: 'Stage III',
        title: 'Regional spread',
        body: 'Management usually requires combined modalities; outcomes become more variable.',
        tone: 'mid',
      },
      {
        stage: 'Stage IV',
        title: 'Distant disease',
        body: 'Treatment is generally palliative or disease-controlling rather than curative.',
        tone: 'low',
      },
    ],
    caveat:
      'Outcomes vary substantially by cancer type, biology, health system and individual factors. This illustration is a general principle, not a prediction for any specific cancer.',
    link: {
      label: 'WHO — Cancer fact sheet',
      to: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
    },
  }),

  sec('problem', 'implications', 'implications', {
    label: 'Design implications',
    heading: 'What this means for how we build.',
    body: 'The barriers above translate directly into engineering constraints. We treat them as requirements, not context.',
    items: [
      {
        requirement: 'Operate without a cold chain',
        rationale: 'Reagent stability at ambient temperature determines whether a test can be deployed at all.',
      },
      {
        requirement: 'Minimise power demand',
        rationale: 'Battery operation and tolerance of interrupted supply widen the range of usable sites.',
      },
      {
        requirement: 'Reduce operator steps',
        rationale: 'Fewer manual steps mean fewer opportunities for error and less reliance on specialist training.',
      },
      {
        requirement: 'Keep consumables inexpensive',
        rationale: 'Recurring cost, not instrument cost, determines whether a programme is sustainable.',
      },
      {
        requirement: 'Return an unambiguous result',
        rationale: 'A result that cannot be interpreted confidently is a safety risk, not a diagnostic.',
      },
      {
        requirement: 'Design for confirmation',
        rationale: 'Screening is not diagnosis. A positive screen must route to established confirmatory pathways.',
      },
    ],
  }),

  sec('problem', 'cta', 'cta', {
    label: 'Next',
    heading: 'See how we propose to address it.',
    body: 'Protirodh BioKit is our attempt to translate these constraints into a concrete architecture — and to be explicit about which parts remain unproven.',
    primaryCta: { label: 'Explore the platform', to: '/innovation' },
    secondaryCta: { label: 'Read the research plan', to: '/research' },
  }),
]

/* -------------------------------------------------------------------------- */
/*  OUR INNOVATION                                                            */
/* -------------------------------------------------------------------------- */

const innovation = [
  sec('innovation', 'hero', 'hero-inner', {
    eyebrow: '02 — Our Innovation',
    heading: 'Protirodh BioKit',
    lead: 'A portable, cartridge-based diagnostic platform concept built around CRISPR-Cas12a target recognition and optical readout — designed for settings where a central laboratory is not available.',
    note: 'Conceptual architecture. Component performance has not yet been validated.',
  }),

  sec('innovation', 'overview', 'editorial', {
    label: 'Technology overview',
    heading: 'What we are proposing — and what we are not.',
    body: 'Protirodh BioKit is a proposed diagnostic platform, not a product. It combines four elements: a single-use fluidic cartridge, an isothermal CRISPR-Cas12a recognition reaction, a compact fluorescence readout module, and a processing layer that converts signal into an operator-facing result. The design goal is to preserve molecular specificity while removing the infrastructure assumptions — thermal cycling, cold storage, benchtop optics — that limit where molecular testing can happen.',
    pullQuote:
      'We are not claiming a working diagnostic. We are proposing an architecture and a plan to test it.',
    pillars: [
      {
        title: 'Established',
        body: 'CRISPR-Cas12a collateral cleavage activity, isothermal amplification strategies and fluorescence-based detection are well documented in the peer-reviewed literature.',
      },
      {
        title: 'Proposed',
        body: 'Our specific integration of cartridge, chemistry and optics — and its performance in clinical matrices — is a design hypothesis we intend to test.',
      },
      {
        title: 'Unproven',
        body: 'Analytical sensitivity, specificity, stability and clinical utility of Protirodh BioKit are unknown. No such figures are claimed anywhere on this site.',
      },
    ],
  }),

  sec('innovation', 'crispr', 'crispr', {
    label: 'Molecular mechanism',
    heading: 'How CRISPR-Cas12a converts recognition into signal.',
    body: 'Cas12a is a programmable endonuclease. When its guide RNA base-pairs with a complementary target sequence, the enzyme becomes active and begins cleaving nearby single-stranded DNA — a property often described as collateral cleavage. If those nearby strands carry a fluorophore–quencher pair, cleavage separates the pair and produces fluorescence. The amount of light is therefore coupled to target recognition.',
    conceptNote:
      'Conceptual illustration of published Cas12a behaviour. It is not a structural model of our cartridge chemistry.',
    steps: [
      {
        index: '01',
        title: 'Programmable recognition',
        body: 'A guide RNA directs the Cas12a complex to a complementary DNA target.',
      },
      {
        index: '02',
        title: 'Target binding',
        body: 'Recognition of the target activates the enzyme’s nuclease activity.',
      },
      {
        index: '03',
        title: 'Collateral cleavage',
        body: 'Activated Cas12a cleaves nearby single-stranded reporter constructs non-specifically.',
      },
      {
        index: '04',
        title: 'Optical signal',
        body: 'Cleavage separates fluorophore from quencher, increasing measurable fluorescence.',
      },
    ],
    references: [
      {
        label: 'Cas12a collateral cleavage',
        citation: 'Chen JS, et al. CRISPR-Cas12a target binding unleashes indiscriminate single-stranded DNase activity. Science. 2018.',
        url: 'https://www.science.org/doi/10.1126/science.aar6245',
      },
      {
        label: 'Review of CRISPR diagnostics',
        citation: 'Kaminski MM, Abudayyeh OO, Gootenberg JS, et al. CRISPR-based diagnostics. Nature Biomedical Engineering. 2021.',
        url: 'https://www.nature.com/articles/s41551-021-00760-7',
      },
    ],
  }),

  sec('innovation', 'workflow', 'workflow', {
    label: 'Proposed workflow',
    heading: 'Seven stages, from sample to result.',
    body: 'Each stage is labelled by its current status. A stage marked “proposed” has not been experimentally demonstrated by our team; it describes the intended design.',
    statusLegend: [
      { key: 'proposed', label: 'Proposed — design intent, not demonstrated' },
      { key: 'in-development', label: 'In development — under active work' },
      { key: 'demonstrated', label: 'Demonstrated — evidence available' },
    ],
    steps: [
      {
        index: '01',
        title: 'Sample collection',
        body: 'A minimally invasive sample is collected using standard clinical technique. Sample type selection is part of our research scope.',
        status: 'proposed',
      },
      {
        index: '02',
        title: 'Sample preparation',
        body: 'A simplified lysis and preparation step intended to release nucleic acid without a full extraction workflow.',
        status: 'proposed',
      },
      {
        index: '03',
        title: 'Target recognition',
        body: 'A Cas12a ribonucleoprotein complex programmed against a chosen target sequence is introduced to the reaction.',
        status: 'proposed',
      },
      {
        index: '04',
        title: 'Isothermal amplification',
        body: 'An isothermal amplification step, if required by the final assay design, increases target concentration before or alongside detection.',
        status: 'proposed',
      },
      {
        index: '05',
        title: 'Signal generation',
        body: 'Collateral cleavage of a fluorescent reporter converts molecular recognition into an optical signal.',
        status: 'proposed',
      },
      {
        index: '06',
        title: 'Optical detection',
        body: 'The portable optical module excites the reporter and measures emitted fluorescence over a defined interval.',
        status: 'proposed',
      },
      {
        index: '07',
        title: 'Result interpretation',
        body: 'On-device processing compares signal to threshold and returns a result that explicitly routes positives to confirmatory testing.',
        status: 'proposed',
      },
    ],
    disclaimer:
      'No stage of this workflow has been demonstrated by Mishawash X. Status labels will only change when supporting evidence is published through the research register.',
  }),

  sec('innovation', 'architecture', 'architecture', {
    label: 'System architecture',
    heading: 'Seven subsystems, one consumable path.',
    body: 'Select a subsystem to see what it does and what remains unresolved. This diagram describes intent, not a built assembly.',
    components: [
      {
        id: 'sample',
        index: 'A1',
        title: 'Sample input',
        short: 'Sample',
        body: 'The operator-facing entry point. Design priority is a low-step, low-error loading procedure compatible with basic clinical handling.',
        open: 'Sample type, volume and tolerance to matrix effects are unresolved.',
      },
      {
        id: 'cartridge',
        index: 'A2',
        title: 'Single-use cartridge',
        short: 'Cartridge',
        body: 'A sealed fluidic path that meters reagents, contains the reaction and prevents cross-contamination between runs.',
        open: 'Material compatibility, sealing and manufacturability at low cost are under investigation.',
      },
      {
        id: 'chamber',
        index: 'A3',
        title: 'Reaction chamber',
        short: 'Chamber',
        body: 'A temperature-controlled volume where lysis, amplification and Cas12a detection occur.',
        open: 'Thermal uniformity and reagent stability at ambient storage temperatures are unverified.',
      },
      {
        id: 'crispr',
        index: 'A4',
        title: 'CRISPR detection',
        short: 'Detection',
        body: 'The molecular recognition layer: Cas12a RNP plus a fluorescent reporter construct.',
        open: 'Guide design, reaction kinetics and tolerance to inhibitors in real samples remain to be characterised.',
      },
      {
        id: 'optics',
        index: 'A5',
        title: 'Optical module',
        short: 'Optics',
        body: 'Excitation source, filters and photodetector arranged to measure reporter fluorescence with sufficient signal-to-noise.',
        open: 'Detection limit, ambient-light rejection and unit-to-unit calibration are not yet established.',
      },
      {
        id: 'electronics',
        index: 'A6',
        title: 'Processing electronics',
        short: 'Electronics',
        body: 'Microcontroller, power management and firmware that drive the assay sequence and compute the result.',
        open: 'Power budget, battery endurance and firmware validation are pending.',
      },
      {
        id: 'interface',
        index: 'A7',
        title: 'Result interface',
        short: 'Interface',
        body: 'A deliberately simple display and workflow that communicates result, confidence and required next action.',
        open: 'Result states, language and escalation pathways require clinical input.',
      },
    ],
    note: 'Interactive conceptual diagram. Not an engineering drawing.',
  }),

  sec('innovation', 'hardware', 'hardware', {
    label: 'Hardware',
    heading: 'Five hardware workstreams.',
    body: 'Each workstream has a defined question and an explicit evidence gap. No hardware has been photographed for publication yet; the slots below are reserved for verified project assets.',
    assetNotice:
      'No hardware imagery has been published. Slots are reserved for verified photographs or engineering renders supplied by the team.',
    items: [
      {
        id: 'main',
        title: 'Main instrument',
        body: 'Portable reader housing the optical module, electronics and cartridge interface. Target: handheld or small benchtop footprint with battery operation.',
        specs: [
          { label: 'Status', value: 'Design phase' },
          { label: 'Evidence', value: 'None published' },
        ],
      },
      {
        id: 'cartridge',
        title: 'Cartridge design',
        body: 'Single-use consumable integrating sample input, reagent storage and reaction chamber in a sealed path.',
        specs: [
          { label: 'Status', value: 'Concept' },
          { label: 'Evidence', value: 'None published' },
        ],
      },
      {
        id: 'optics',
        title: 'Optical detection',
        body: 'Compact fluorescence path with controlled excitation and filtered emission, designed around the selected reporter chemistry.',
        specs: [
          { label: 'Status', value: 'Concept' },
          { label: 'Evidence', value: 'None published' },
        ],
      },
      {
        id: 'electronics',
        title: 'Electronic components',
        body: 'Microcontroller, analogue front end, power management and firmware for assay sequencing and signal processing.',
        specs: [
          { label: 'Status', value: 'Concept' },
          { label: 'Evidence', value: 'None published' },
        ],
      },
      {
        id: 'enclosure',
        title: 'Portable enclosure',
        body: 'Field-serviceable enclosure balancing thermal control, light isolation and resistance to dust and moisture.',
        specs: [
          { label: 'Status', value: 'Concept' },
          { label: 'Evidence', value: 'None published' },
        ],
      },
    ],
  }),

  sec('innovation', 'boundaries', 'boundaries', {
    label: 'Scope and limits',
    heading: 'What Protirodh BioKit is not.',
    body: 'Clarity about limits is part of the design. These statements are binding on how we communicate the project.',
    items: [
      'It is not a validated diagnostic assay, and no analytical performance figures have been established.',
      'It is not approved, cleared or registered by any regulatory authority in any jurisdiction.',
      'It is not commercially available, and there is no product to purchase or order.',
      'It does not replace confirmatory laboratory testing or clinical judgement.',
      'It has not been evaluated in clinical trials or against patient outcomes.',
      'Its target indication, sample type and intended use remain under definition.',
    ],
  }),

  sec('innovation', 'cta', 'cta', {
    label: 'Next',
    heading: 'Follow the engineering, not the promise.',
    body: 'Our research page documents workstreams, milestones and the evidence we can currently show — including where we are blocked.',
    primaryCta: { label: 'Research & development', to: '/research' },
    secondaryCta: { label: 'Impact & vision', to: '/impact' },
  }),
]

/* -------------------------------------------------------------------------- */
/*  RESEARCH & DEVELOPMENT                                                    */
/* -------------------------------------------------------------------------- */

const research = [
  sec('research', 'hero', 'hero-inner', {
    eyebrow: '03 — Research & Development',
    heading: 'A record of work, including what remains open.',
    lead: 'This section documents our methodology, current workstreams and the validation strategy we intend to follow. Nothing here should be read as a completed result unless it is explicitly labelled as such.',
    note: 'Status labels are maintained by the team through the research register. Absence of evidence is stated plainly.',
  }),

  sec('research', 'method', 'editorial', {
    label: 'Methodology',
    heading: 'How we work.',
    body: 'Our approach is deliberately incremental. Each workstream begins with a defined question, a stated success criterion and a documented method. Negative and inconclusive outcomes are recorded alongside positive ones, because a research record that only contains successes is not a research record.',
    pullQuote:
      'We publish the plan before the result, so that the result can be judged against it.',
    pillars: [
      {
        title: 'Pre-specified criteria',
        body: 'Success and failure thresholds are written down before an experiment is run, not after the data is seen.',
      },
      {
        title: 'Evidence-linked status',
        body: 'A milestone is only marked completed or validated when the supporting evidence is attached to it.',
      },
      {
        title: 'Reproducibility',
        body: 'Methods are documented at a level of detail that would allow an independent group to repeat them.',
      },
    ],
  }),

  sec('research', 'timeline', 'timeline', {
    label: 'Development timeline',
    heading: 'Milestones and current status.',
    body: 'Milestones are ordered chronologically. Each carries a status label that reflects the evidence currently attached to it.',
    emptyNote:
      'No milestone has been marked completed or validated. All entries below describe planned work.',
  }),

  sec('research', 'workstreams', 'workstreams', {
    label: 'Workstreams',
    heading: 'Four parallel lines of investigation.',
    body: 'Each workstream has a lead question and an honest statement of where it currently stands.',
    items: [
      {
        index: 'W1',
        title: 'Assay & molecular biology',
        question: 'Can a Cas12a recognition reaction be made robust enough for minimally processed samples?',
        status: 'Planned',
        body: 'Guide design, reporter selection and reaction conditions. Inhibitor tolerance in real matrices is the principal unknown.',
      },
      {
        index: 'W2',
        title: 'Cartridge & fluidics',
        question: 'Can reagent handling be reduced to a single operator step without compromising the reaction?',
        status: 'Concept',
        body: 'Fluidic architecture, material compatibility and sealing strategy. Manufacturability at low cost constrains every option.',
      },
      {
        index: 'W3',
        title: 'Optics & instrumentation',
        question: 'Can a low-cost optical path achieve adequate signal-to-noise in uncontrolled lighting?',
        status: 'Concept',
        body: 'Excitation and emission filtering, detector selection and ambient-light rejection. Detection limit is not yet characterised.',
      },
      {
        index: 'W4',
        title: 'Human factors & deployment',
        question: 'Can a non-specialist operator run the test and interpret the result safely?',
        status: 'Planned',
        body: 'Workflow design, error modes and result communication. Requires clinical and field input we have not yet gathered.',
      },
    ],
  }),

  sec('research', 'validation', 'validation', {
    label: 'Validation strategy',
    heading: 'The sequence we intend to follow.',
    body: 'Validation is staged. Each stage answers a narrower question than the one after it, and no stage may be skipped on the basis of a promising earlier result.',
    stages: [
      {
        index: 'V1',
        title: 'Analytical feasibility',
        body: 'Demonstrate target-dependent signal in controlled buffer conditions.',
        gate: 'Gate: reproducible signal above background across independent runs.',
      },
      {
        index: 'V2',
        title: 'Analytical performance',
        body: 'Characterise limit of detection, linear range and cross-reactivity against near-neighbour sequences.',
        gate: 'Gate: pre-specified performance criteria met and independently repeated.',
      },
      {
        index: 'V3',
        title: 'Matrix tolerance',
        body: 'Evaluate performance in clinically relevant sample matrices and with common interfering substances.',
        gate: 'Gate: performance retained within stated tolerance in matrix.',
      },
      {
        index: 'V4',
        title: 'Clinical evaluation',
        body: 'Compare against an established reference method in a properly designed study with appropriate governance.',
        gate: 'Gate: ethics approval, protocol registration and independent oversight.',
      },
    ],
    disclaimer:
      'We are at pre-feasibility. No stage of this sequence has been completed, and we do not report sensitivity or specificity values.',
  }),

  sec('research', 'challenges', 'challenges', {
    label: 'Open problems',
    heading: 'Where this could fail.',
    body: 'An honest engineering record names its most likely failure modes. These are ours.',
    items: [
      {
        title: 'Reagent stability',
        body: 'Cas12a and RNA guides may not tolerate ambient storage, which would reintroduce a cold-chain requirement and undermine the access case.',
      },
      {
        title: 'Matrix inhibition',
        body: 'Clinical samples contain inhibitors that can suppress isothermal amplification and Cas12a activity unpredictably.',
      },
      {
        title: 'False positives',
        body: 'Carryover contamination and non-specific collateral activity can produce signal without true target presence.',
      },
      {
        title: 'Optical sensitivity',
        body: 'A low-cost optical path may not resolve signal at clinically relevant target concentrations.',
      },
      {
        title: 'Target selection',
        body: 'Choosing a biomarker that is both specific and actionable for a defined population is a scientific and clinical question, not an engineering one.',
      },
      {
        title: 'Regulatory pathway',
        body: 'Any eventual diagnostic would require a regulatory strategy far beyond the scope of a student programme.',
      },
    ],
  }),

  sec('research', 'documents', 'documents', {
    label: 'Documentation',
    heading: 'Research materials.',
    body: 'Approved technical documents are published here as they are released. Nothing is listed until a file exists.',
    emptyNote:
      'No research documents have been released yet. Materials will appear here once approved for publication.',
  }),

  sec('research', 'cta', 'cta', {
    label: 'Next',
    heading: 'Understand the intended impact.',
    body: 'Our impact page sets out what accessible molecular screening could change — and the conditions under which those outcomes would be credible.',
    primaryCta: { label: 'Impact & vision', to: '/impact' },
    secondaryCta: { label: 'Contact the team', to: '/resources#contact' },
  }),
]

/* -------------------------------------------------------------------------- */
/*  TEAM                                                                      */
/* -------------------------------------------------------------------------- */

const team = [
  sec('team', 'hero', 'hero-inner', {
    eyebrow: '04 — Our Team',
    heading: 'Mishawash X',
    lead: 'An independent student innovation team working at the intersection of molecular biology, hardware design and global health. We are competing in the Conrad Challenge 2026–2027 with Protirodh BioKit.',
    note: 'Member profiles are published as they are confirmed. We do not publish invented biographies or credentials.',
  }),

  sec('team', 'mission', 'mission', {
    label: 'Mission & vision',
    heading: 'Why this team exists.',
    mission:
      'To investigate whether molecular diagnostics can be made practical outside the laboratory — and to document that investigation honestly enough that others can build on it.',
    vision:
      'A future in which the distance between a person and a reliable diagnostic result is measured in minutes rather than in journeys.',
    values: [
      { title: 'Evidence over narrative', body: 'We would rather report an inconclusive result than a flattering one.' },
      { title: 'Constraint-driven design', body: 'Cost, power and skill requirements are treated as first-class specifications.' },
      { title: 'Open to correction', body: 'External critique is a design input, not a threat.' },
      { title: 'Clinical humility', body: 'Screening is not diagnosis, and no result replaces a clinician.' },
    ],
  }),

  sec('team', 'members', 'members', {
    label: 'The team',
    heading: 'People behind the programme.',
    body: 'Profiles include role, responsibilities and technical contribution. Photographs and links appear only when supplied by the member.',
    emptyTitle: 'Team profiles are being finalised.',
    emptyBody:
      'Member profiles, roles and biographies are published through our content system. They will appear here as soon as they are confirmed — we do not publish placeholder names or invented credentials.',
    emptyAction: { label: 'Enquire about the team', to: '/resources#contact' },
  }),

  sec('team', 'principles', 'principles', {
    label: 'How we work',
    heading: 'Operating principles.',
    items: [
      { index: 'P1', title: 'One question at a time', body: 'Each sprint addresses a single defined uncertainty with a written success criterion.' },
      { index: 'P2', title: 'Document before you present', body: 'Work enters a deck or a page only after it is recorded in the research register.' },
      { index: 'P3', title: 'Separate roles, shared review', body: 'Every technical claim is reviewed by a member who did not produce it.' },
      { index: 'P4', title: 'Name the gap', body: 'Every section of this site is required to state what it does not yet know.' },
    ],
  }),

  sec('team', 'cta', 'cta', {
    label: 'Collaboration',
    heading: 'Work with us.',
    body: 'We are seeking mentorship in assay design, optical engineering and clinical translation — and we welcome scrutiny from anyone with relevant expertise.',
    primaryCta: { label: 'Get in touch', to: '/resources#contact' },
    secondaryCta: { label: 'See our research', to: '/research' },
  }),
]

/* -------------------------------------------------------------------------- */
/*  IMPACT                                                                    */
/* -------------------------------------------------------------------------- */

const impact = [
  sec('impact', 'hero', 'hero-inner', {
    eyebrow: '05 — Impact & Vision',
    heading: 'What changes if access changes.',
    lead: 'The value of a diagnostic platform is not in its components. It is in whether a result reaches a person in time to matter. This page sets out the outcomes we are aiming for — and the conditions under which they would be credible.',
    note: 'All impact statements describe potential, contingent on validation that has not yet occurred.',
  }),

  sec('impact', 'potential', 'impact-areas', {
    label: 'Potential impact',
    heading: 'Four areas of potential benefit.',
    body: 'Each area depends on a chain of assumptions. We state the assumption alongside the outcome.',
    areas: [
      {
        index: 'I1',
        title: 'Accessibility',
        body: 'Testing closer to the point of care reduces the distance between sample collection and result.',
        assumption: 'Assumes performance is retained outside a controlled laboratory environment.',
      },
      {
        index: 'I2',
        title: 'Affordability',
        body: 'A consumable-led model with a low-cost reader could lower the per-test cost of molecular screening.',
        assumption: 'Assumes manufacturing cost targets are achievable at low volume.',
      },
      {
        index: 'I3',
        title: 'Health-system capacity',
        body: 'Offloading routine screening could free scarce laboratory capacity for confirmatory and complex testing.',
        assumption: 'Assumes adequate specificity to avoid generating unmanageable confirmatory demand.',
      },
      {
        index: 'I4',
        title: 'Earlier conversations',
        body: 'A faster result can shorten the interval between screening and clinical follow-up.',
        assumption: 'Assumes a functioning referral pathway exists to receive the result.',
      },
    ],
    disclaimer:
      'No impact has been measured. These are design intentions derived from published evidence about diagnostic access.',
  }),

  sec('impact', 'access', 'access-model', {
    label: 'Access model',
    heading: 'Designing for the last mile.',
    body: 'A device that works only in a well-equipped clinic has not solved the access problem. Our design brief therefore treats the following as constraints rather than aspirations.',
    metrics: [
      { label: 'Power', target: 'Battery operation', note: 'Tolerance of interrupted supply' },
      { label: 'Skill', target: 'Minimal training', note: 'Guided, low-step workflow' },
      { label: 'Storage', target: 'Ambient reagents', note: 'No cold chain dependency' },
      { label: 'Cost', target: 'Low consumable cost', note: 'Recurring, not capital, spend' },
    ],
    caveat: 'Targets, not achieved specifications.',
  }),

  sec('impact', 'roadmap', 'roadmap', {
    label: 'Development roadmap',
    heading: 'From concept to credible evidence.',
    body: 'A staged path with decision gates. Each phase must produce evidence before the next begins.',
    phases: [
      {
        phase: 'Phase 01',
        title: 'Concept & feasibility',
        period: 'Current',
        status: 'active',
        body: 'Define intended use, select target and sample type, specify architecture, establish collaboration and mentorship.',
        gate: 'Exit: documented design specification and research plan.',
      },
      {
        phase: 'Phase 02',
        title: 'Bench prototype',
        period: 'Next',
        status: 'next',
        body: 'Build a functional bench assembly of cartridge and optical path. Demonstrate target-dependent signal in buffer.',
        gate: 'Exit: reproducible signal, independent repetition.',
      },
      {
        phase: 'Phase 03',
        title: 'Analytical characterisation',
        period: 'Planned',
        status: 'future',
        body: 'Characterise detection limit, dynamic range, cross-reactivity and matrix tolerance against pre-specified criteria.',
        gate: 'Exit: analytical performance documented and reviewed.',
      },
      {
        phase: 'Phase 04',
        title: 'Clinical evaluation',
        period: 'Long term',
        status: 'future',
        body: 'A governed comparison against a reference method, with ethics approval and independent oversight.',
        gate: 'Exit: peer-reviewed evidence and a regulatory strategy.',
      },
    ],
    disclaimer:
      'Roadmap phases are intentions. Timelines depend on resources, mentorship and access to laboratory facilities.',
  }),

  sec('impact', 'partnerships', 'partnerships', {
    label: 'Collaboration',
    heading: 'Partnerships and mentorship.',
    body: 'We have no institutional partnerships to announce. We are actively seeking academic mentorship and laboratory guidance, and we will list confirmed relationships here only once they are agreed in writing.',
    emptyNote: 'No partnerships are currently listed.',
    interests: [
      'Assay design and Cas12a reaction optimisation',
      'Low-cost optical instrumentation',
      'Clinical microbiology and diagnostic pathway design',
      'Global health implementation and health economics',
      'Regulatory strategy for in-vitro diagnostics',
    ],
    cta: { label: 'Discuss collaboration', to: '/resources#contact' },
  }),

  sec('impact', 'responsible', 'responsible', {
    label: 'Responsible innovation',
    heading: 'Commitments we hold ourselves to.',
    body: 'Diagnostics carry consequences beyond their technical performance. These commitments govern how we design, describe and deploy our work.',
    items: [
      {
        title: 'No overstatement',
        body: 'We will not describe a concept as a product, a plan as a result, or an intention as a capability.',
      },
      {
        title: 'Screening is not diagnosis',
        body: 'Any future result pathway must route positives to confirmatory testing and clinical care.',
      },
      {
        title: 'Privacy by design',
        body: 'A portable diagnostic generates sensitive data. Data minimisation and local storage are design requirements.',
      },
      {
        title: 'Equity of access',
        body: 'A technology that only reaches well-resourced settings has failed its own premise.',
      },
      {
        title: 'Open documentation',
        body: 'Methods and limitations are published so that others can critique and reproduce them.',
      },
    ],
  }),

  sec('impact', 'recognition', 'gallery', {
    label: 'Recognition',
    heading: 'Evidence of the team’s work.',
    body: 'A record of the competitions, science festivals and institutional engagements Mishawash X has taken part in. These are team achievements — not clinical validation of Protirodh BioKit.',
    items: recognitionItems,
    disclaimer:
      'Photographs are supplied by the team and describe participation and recognition, not diagnostic performance.',
  }),

  sec('impact', 'cta', 'cta', {
    label: 'Next',
    heading: 'Review the evidence behind the vision.',
    body: 'The problem page sets out the published data that motivates this programme, with full citations.',
    primaryCta: { label: 'The problem', to: '/problem' },
    secondaryCta: { label: 'Resources', to: '/resources' },
  }),
]

/* -------------------------------------------------------------------------- */
/*  RESOURCES                                                                 */
/* -------------------------------------------------------------------------- */

const resources = [
  sec('resources', 'hero', 'hero-inner', {
    eyebrow: '06 — Resources & Contact',
    heading: 'Materials, documentation and enquiry.',
    lead: 'Approved project documents are published here as they become available. If a document is not listed, it has not been released — we do not publish placeholder downloads.',
    note: 'All downloadable files are served from our content system and are versioned.',
  }),

  sec('resources', 'documents', 'documents', {
    label: 'Document library',
    heading: 'Project documents.',
    body: 'Presentations, technical briefs and reports appear here once approved. Each entry includes its file type and size.',
    emptyNote:
      'The document library is being prepared. No files have been released yet.',
    categories: ['Presentation', 'Technical brief', 'Research report', 'Project documentation'],
  }),

  sec('resources', 'contact', 'contact', {
    label: 'Contact',
    heading: 'Start a conversation.',
    body: 'For research collaboration, mentorship, media enquiries or questions about our methodology, use the form below or the contact address once published.',
    formTitle: 'Collaboration enquiry',
    formNote:
      'Enquiries are stored securely and reviewed by the team. We do not share your details with third parties.',
    subjects: [
      'Research collaboration',
      'Mentorship',
      'Media / press',
      'Competition or judging',
      'Other',
    ],
  }),

  sec('resources', 'faq', 'faq', {
    label: 'Common questions',
    heading: 'Frequently asked.',
    items: [
      {
        q: 'Is Protirodh BioKit available to purchase or use?',
        a: 'No. It is a concept-stage research programme. There is no product, no regulatory approval and no clinical validation. Nothing on this site should be read as an offer of a diagnostic service.',
      },
      {
        q: 'Have you measured sensitivity or specificity?',
        a: 'No. We have not established analytical performance figures. We deliberately do not publish sensitivity or specificity values because none have been measured.',
      },
      {
        q: 'What stage is the research at?',
        a: 'Pre-feasibility. Our current work is design definition and research planning. The research page lists milestones and marks every one with its evidence status.',
      },
      {
        q: 'Is this affiliated with NASA or the Conrad Challenge organisers?',
        a: 'Mishawash X is an independent entrant in the Conrad Challenge 2026–2027. This site is not endorsed by, affiliated with, or produced by NASA, the Conrad Foundation or any other organisation.',
      },
      {
        q: 'Can we cite this work?',
        a: 'Please cite it as a concept-stage student research programme, not as a validated diagnostic. For specific technical questions, contact us directly.',
      },
      {
        q: 'How can researchers contribute?',
        a: 'We welcome critique and mentorship, particularly on assay design, optics and clinical translation. Use the contact form and describe your area of expertise.',
      },
    ],
  }),

  sec('resources', 'cta', 'cta', {
    label: 'Press & brand',
    heading: 'Media and brand enquiries.',
    body: 'For interviews, competition materials or permission to reproduce our conceptual illustrations, please contact the team. Illustrations may not be presented as photographs of a working device.',
    primaryCta: { label: 'Contact the team', to: '/resources#contact' },
    secondaryCta: { label: 'About the project', to: '/innovation' },
  }),
]

/* -------------------------------------------------------------------------- */
/*  EXPORTED SECTIONS                                                         */
/* -------------------------------------------------------------------------- */

export const seedSections = [...home, ...problem, ...innovation, ...research, ...team, ...impact, ...resources]

/* -------------------------------------------------------------------------- */
/*  COLLECTIONS                                                               */
/* -------------------------------------------------------------------------- */

/**
 * TEAM — seeded with founding members and core team.
 * Add real members through /admin → Team. Never seed invented names.
 */
export const seedTeam = [
  {
    id: 'tm-001',
    name: 'K M Faisal Shahriar',
    role: 'Founder & Chief Executive Officer of Mishawash X',
    responsibilities: 'Operations, programme design, partner engagement, international representation',
    bio: 'K M Faisal Shahriar is the founder and CEO of Mishawash X and has been central to the organisation since day one. He leads operations, programme design, and partner engagement, and has been a primary face of Mishawash X in work with research institutions, competition bodies, and international partners. He pairs operational discipline with a relentless engineering mindset: ship credible systems, document everything, and let results speak louder than claims.',
    contribution: 'Founder & CEO of Mishawash X - Overall strategy, operations, partnerships, international representation',
    photoUrl: '/images/team/faisal-shahriar.png',
    links: [
      { label: 'Email', url: 'mailto:kmfaisalshahriar@gmail.com' }
    ],
    sortOrder: 1,
    published: true,
  },
  {
    id: 'tm-002',
    name: 'Md Masraful Haque Oyone',
    role: 'Co-Founder & Chief Operating Officer of Mishawash X',
    responsibilities: 'Technical operations, team coordination, academic partnerships, project management',
    bio: 'Md Masraful Haque Oyone is the co-founder and COO of Mishawash X and has been integral to the organisation\'s growth from the very beginning. He manages and distributes projects across teams, ensuring every initiative moves from concept to execution on schedule. He leads technical operations, team coordination, and academic partnerships, and has been a key representative of Mishawash X in competitions, research collaborations, and institutional engagements. He pairs sharp analytical thinking with the same engineering philosophy that defines Mishawash X: allocate resources wisely, iterate fast, validate rigorously.',
    contribution: 'Co-Founder & COO of Mishawash X - Project management, team coordination, academic partnerships, technical operations',
    photoUrl: '/images/team/masraful-haque.png',
    links: [
      { label: 'Email', url: 'mailto:rvl2023.oyone@gmail.com' }
    ],
    sortOrder: 2,
    published: true,
  },
  {
    id: 'tm-003',
    name: 'Tamim Iqbal',
    role: 'Co-Founder & Chief Technology Officer of Mishawash X',
    responsibilities: 'Core systems architecture, flight computers, propulsion models, biomedical sensor arrays, embedded firmware',
    bio: 'Tamim Iqbal is the Chief Technology Officer of Mishawash X and has been the technical backbone of the organisation since its founding. He architects the core systems behind every project, from flight computers and propulsion models to biomedical sensor arrays and embedded firmware. He translates ambitious design goals into working prototypes and holds every subsystem to the same standard: if it cannot be measured, it cannot be trusted. He pairs deep technical fluency with a builder\'s instinct that keeps Mishawash X shipping hardware that works under pressure.',
    contribution: 'Co-Founder & CTO of Mishawash X - Systems architecture, propulsion, avionics, biomedical sensors, embedded firmware',
    photoUrl: '/images/team/tamim-iqbal.png',
    links: [
      { label: 'Email', url: 'mailto:iqbaltamim40396@gmail.com' }
    ],
    sortOrder: 3,
    published: true,
  },
  {
    id: 'tm-004',
    name: 'Ahmed Mosaidul Mehran',
    role: 'Chief Financial Officer of Mishawash X',
    responsibilities: 'Financial management, budgeting, resource allocation, funding strategy, financial reporting',
    bio: 'Ahmed Mosaidul Mehran serves as the Chief Financial Officer of Mishawash X, overseeing all financial operations including budgeting, resource allocation, and funding strategy. With a background in competitive science and leadership through BNMPC Boys Scout and Science Club, he brings analytical rigor to financial planning. His achievements include multiple Science Olympiad placements (2nd and 3rd), 1st place in Extempore Speech, and participation in NDC English Carnival, Gaming Contest (Runner-up), and I4N. He has contributed to the WALL-E PROJECT and applies his competitive experience to ensure Mishawash X maintains financial discipline while pursuing ambitious aerospace and biomedical engineering goals.',
    contribution: 'CFO of Mishawash X - Financial strategy, budgeting, funding, resource allocation, financial reporting',
    photoUrl: '/images/team/ahmed-mehran.jpg',
    links: [
      { label: 'Email', url: 'mailto:mehranmosaidul@gmail.com' }
    ],
    sortOrder: 4,
    published: true,
  },
  {
    id: 'tm-005',
    name: 'Ahnaf Alam Zarif',
    role: 'Web Developer & Team Member of Mishawash X',
    responsibilities: 'Web development, IT systems, technical documentation, research support, competition preparation',
    bio: 'Ahnaf Alam Zarif is a Web Developer and Team Member of Mishawash X. He works in IT, building and maintaining the team\'s web presence and supporting the digital systems behind its projects. Alongside his development work, he is taking cybersecurity courses from Cisco Networking Academy, and he contributes to research support, technical documentation and competition preparation.',
    contribution: 'IT of Mishawash X - Web development, website and digital systems, cybersecurity training (Cisco Networking Academy), technical documentation',
    photoUrl: '/images/team/ahnaf-alam-zarif.jpg',
    links: [
      { label: 'Email', url: 'mailto:kinh2oaaz@gmail.com' },
    ],
    sortOrder: 5,
    published: true,
  },
]

/**
 * MILESTONES — all seeded as "planned".
 * These describe intended workstreams only. No completion is implied.
 */
export const seedMilestones = [
  {
    id: 'ms-001',
    title: 'Design specification and intended-use definition',
    description:
      'Document the intended use, target population, sample type and explicit exclusions for Protirodh BioKit. Establish written success criteria for each downstream workstream.',
    phase: 'Concept',
    status: 'planned',
    period: 'Q1 2026',
    date: '2026-03-31',
    evidenceUrl: '',
    evidenceLabel: '',
    sortOrder: 1,
    published: true,
  },
  {
    id: 'ms-002',
    title: 'Cas12a reporter and guide design review',
    description:
      'Literature review and in-silico guide selection for the chosen target. Define reporter construct and reaction buffer conditions for bench testing.',
    phase: 'Assay',
    status: 'planned',
    period: 'Q1–Q2 2026',
    date: '2026-06-30',
    evidenceUrl: '',
    evidenceLabel: '',
    sortOrder: 2,
    published: true,
  },
  {
    id: 'ms-003',
    title: 'Cartridge fluidic architecture concept',
    description:
      'Produce a fluidic concept that reduces operator steps to a single loading action. Identify material and sealing constraints, and document manufacturability risks.',
    phase: 'Hardware',
    status: 'planned',
    period: 'Q2 2026',
    date: '2026-06-30',
    evidenceUrl: '',
    evidenceLabel: '',
    sortOrder: 3,
    published: true,
  },
  {
    id: 'ms-004',
    title: 'Optical bench characterisation plan',
    description:
      'Specify excitation and emission requirements for the chosen reporter, select candidate components, and define the measurement protocol for signal-to-noise assessment.',
    phase: 'Optics',
    status: 'planned',
    period: 'Q2–Q3 2026',
    date: '2026-09-30',
    evidenceUrl: '',
    evidenceLabel: '',
    sortOrder: 4,
    published: true,
  },
  {
    id: 'ms-005',
    title: 'Bench feasibility experiment',
    description:
      'Demonstrate target-dependent signal in controlled buffer conditions. Results, including negative and inconclusive outcomes, will be recorded in the research register before any summary is published.',
    phase: 'Assay',
    status: 'planned',
    period: 'Q3 2026',
    date: '2026-09-30',
    evidenceUrl: '',
    evidenceLabel: '',
    sortOrder: 5,
    published: true,
  },
]

/**
 * SCIENTIFIC REFERENCES — real, verifiable publications.
 * These are displayed as citations on The Problem and Innovation pages.
 */
export const seedReferences = [
  {
    id: 'ref-001',
    authors: 'Bray F, Laversanne M, Sung H, et al.',
    title: 'Global cancer statistics 2022: GLOBOCAN estimates of incidence and mortality worldwide for 36 cancers in 185 countries',
    source: 'CA: A Cancer Journal for Clinicians',
    year: '2024',
    url: 'https://gco.iarc.who.int/media/globocan/factsheets/populations/900-world-fact-sheet.pdf',
    doi: '10.3322/caac.21834',
    note: 'Source of global incidence and mortality estimates cited on The Problem page.',
    sortOrder: 1,
    published: true,
  },
  {
    id: 'ref-002',
    authors: 'World Health Organization',
    title: 'Cancer — Fact sheet',
    source: 'WHO',
    year: '2024',
    url: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
    doi: '',
    note: 'Source for the share of cancer deaths in low- and middle-income countries, and lifetime cancer risk.',
    sortOrder: 2,
    published: true,
  },
  {
    id: 'ref-003',
    authors: 'Fleming KA, Horton S, Wilson ML, et al.',
    title: 'The Lancet Commission on diagnostics: transforming access to diagnostics',
    source: 'The Lancet',
    year: '2021',
    url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)01369-9/fulltext',
    doi: '10.1016/S0140-6736(21)00673-5',
    note: 'Source for the estimate that 47% of the global population has little or no access to diagnostics.',
    sortOrder: 3,
    published: true,
  },
  {
    id: 'ref-004',
    authors: 'Chen JS, Ma E, Harrington LB, et al.',
    title: 'CRISPR-Cas12a target binding unleashes indiscriminate single-stranded DNase activity',
    source: 'Science',
    year: '2018',
    url: 'https://www.science.org/doi/10.1126/science.aar6245',
    doi: '10.1126/science.aar6245',
    note: 'Primary description of Cas12a collateral cleavage used in our conceptual mechanism illustration.',
    sortOrder: 4,
    published: true,
  },
  {
    id: 'ref-005',
    authors: 'Kaminski MM, Abudayyeh OO, Gootenberg JS, et al.',
    title: 'CRISPR-based diagnostics',
    source: 'Nature Biomedical Engineering',
    year: '2021',
    url: 'https://www.nature.com/articles/s41551-021-00760-7',
    doi: '10.1038/s41551-021-00760-7',
    note: 'Review of CRISPR diagnostic architectures, including isothermal readout strategies.',
    sortOrder: 5,
    published: true,
  },
]

/**
 * DOCUMENTS — intentionally empty. No fake PDF links.
 */
export const seedDocuments = []
export const seedResearchDocuments = []

/**
 * MEDIA — intentionally empty.
 */
export const seedMedia = []

export const seedState = {
  version: CONTENT_VERSION,
  settings: seedSettings,
  pages: seedPages,
  sections: seedSections,
  team: seedTeam,
  milestones: seedMilestones,
  references: seedReferences,
  documents: seedDocuments,
  researchDocuments: seedResearchDocuments,
  media: seedMedia,
  inquiries: [],
  updatedAt: '2026-01-05T09:00:00.000Z',
}
