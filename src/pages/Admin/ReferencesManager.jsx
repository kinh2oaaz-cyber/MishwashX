import { CollectionManager } from './components/CollectionManager'

export function AdminReferences() {
  return (
    <CollectionManager
      collection="references"
      eyebrow="Content"
      title="Scientific references"
      description="Sources cited on the Problem page and linked throughout the site. Every published statistic must map to one of these entries."
      notice="Add real, verifiable publications only. Include a working URL or DOI so a reader can check the source. Never cite a paper that does not support the claim."
      emptyTitle="No references yet"
      emptyBody="Add a journal article, WHO report or similar source. References are hidden from the public list until published."
      addLabel="Add reference"
    />
  )
}
