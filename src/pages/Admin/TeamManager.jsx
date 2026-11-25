import { CollectionManager } from './components/CollectionManager'

export function AdminTeam() {
  return (
    <CollectionManager
      collection="team"
      eyebrow="Content"
      title="Team"
      description="Profiles shown on the Team page and homepage. Add only real team members who have confirmed their own details."
      notice="Use full, accurate names and roles. Never create placeholder people — the public page shows a designed empty state until at least one profile is published."
      emptyTitle="No team profiles yet"
      emptyBody="Add a member with their confirmed name, role and contribution. Profiles stay private until you publish them."
      addLabel="Add team member"
    />
  )
}
