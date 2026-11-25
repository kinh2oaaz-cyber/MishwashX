import { CollectionManager } from './components/CollectionManager'

export function AdminResearch() {
  return (
    <CollectionManager
      collection="milestones"
      eyebrow="Content"
      title="Research register"
      description="Milestones displayed on the homepage and Research & Development timeline. Status must reflect evidence that exists."
      notice="All milestones start as Planned. Moving one to Completed or Validated is a scientific claim — attach an evidence URL first, and keep the description factual."
      emptyTitle="No milestones recorded"
      emptyBody="Create the first milestone, starting with status “Planned”. Mark it in progress only when work has actually begun."
      addLabel="Add milestone"
    />
  )
}
