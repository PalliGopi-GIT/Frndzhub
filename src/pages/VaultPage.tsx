import { useParams, useNavigate } from 'react-router-dom'
import { FRIENDS } from '../data/friends.ts'
import SecretVault from '../components/SecretVault.tsx'

export default function VaultPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const friend = FRIENDS.find((f) => f.id === id) || FRIENDS[0]

  return (
    <div
      style={{
        backgroundColor: friend.favColor,
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <SecretVault
        friend={friend}
        isOpen={true}
        onClose={() => navigate(`/friend/${friend.id}`)}
      />
    </div>
  )
}
