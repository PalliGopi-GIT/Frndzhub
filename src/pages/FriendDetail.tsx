import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, ExternalLink, Shield } from 'lucide-react'
import { FRIENDS, type Friend } from '../data/friends.ts'
import { useMediaQuery } from '../hooks/useMediaQuery.ts'

function InstagramIcon({ size = 18, colored = false }: { size?: number; colored?: boolean }) {
  if (colored) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFDC80" />
            <stop offset="50%" stopColor="#FD1D1D" />
            <stop offset="100%" stopColor="#833AB4" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-grad)" strokeWidth="2.2" />
        <circle cx="12" cy="12" r="4.5" stroke="url(#ig-grad)" strokeWidth="2.2" />
        <circle cx="17.5" cy="6.5" r="1" fill="#FD1D1D" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
      <circle cx={12} cy={12} r={5} />
      <circle cx={17.5} cy={6.5} r={0.5} fill="currentColor" stroke="none" />
    </svg>
  )
}

function IplTeamBadge({ friend, isMobile }: { friend: Friend; isMobile: boolean }) {
  const [imgError, setImgError] = useState(false)

  // Short initials fallback if image is loading or not yet supplied
  const teamInitials = friend.favIplTeam
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()

  return (
    <div
      className="inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl transition-transform hover:scale-102"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
      }}
    >
      {friend.iplLogo && !imgError ? (
        <div
          style={{
            width: isMobile ? 36 : 44,
            height: isMobile ? 36 : 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: 12,
            padding: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            flexShrink: 0,
          }}
        >
          <img
            src={friend.iplLogo}
            alt={`${friend.favIplTeam} logo`}
            onError={() => setImgError(true)}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: isMobile ? 36 : 44,
            height: isMobile ? 36 : 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            borderRadius: 12,
            fontWeight: 800,
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            letterSpacing: '0.05em',
            flexShrink: 0,
          }}
        >
          <Shield size={18} style={{ marginRight: 2 }} />
          {teamInitials}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontSize: isMobile ? '0.95rem' : '1.1rem',
            fontWeight: 700,
            lineHeight: 1.2,
            color: 'white',
          }}
        >
          {friend.favIplTeam}
        </span>
        <span
          style={{
            fontSize: '0.7rem',
            opacity: 0.8,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Official Fan
        </span>
      </div>
    </div>
  )
}

export default function FriendDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 639px)')

  const friend = FRIENDS.find((f) => f.id === id)

  if (!friend) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#1a1a2e',
          fontFamily: "'Inter', sans-serif",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(40px, 10vw, 80px)', marginBottom: '1rem' }}>
          Friend Not Found
        </h1>
        <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
          Looks like this friend doesn&apos;t exist yet.
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full border-2 border-white bg-transparent transition-all duration-150 hover:scale-108 hover:bg-white/12"
          style={{ padding: '0.75rem 2rem', color: 'white', textDecoration: 'none', fontFamily: "'Inter', sans-serif", fontSize: '1rem', fontWeight: 600 }}
        >
          <ArrowLeft size={20} strokeWidth={2.25} />
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: friend.favColor,
        transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        fontFamily: "'Inter', sans-serif",
        minHeight: '100vh',
        color: 'white',
        position: 'relative',
      }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 50,
          opacity: 0.4,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, padding: isMobile ? '1.5rem 1rem' : '3rem 4rem', maxWidth: 900, margin: '0 auto' }}>
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center rounded-full border-2 border-white bg-transparent transition-all duration-150 hover:scale-108 hover:bg-white/12"
          style={{ width: isMobile ? 48 : 56, height: isMobile ? 48 : 56, marginBottom: isMobile ? '1.5rem' : '2.5rem', cursor: 'pointer' }}
          aria-label="Back to home"
        >
          <ArrowLeft size={24} strokeWidth={2.25} color="white" />
        </button>

        {/* Photo */}
        <div style={{ marginBottom: isMobile ? '1.5rem' : '2.5rem' }}>
          <img
            src={friend.photo}
            alt={friend.name}
            style={{
              width: isMobile ? 180 : 260,
              height: isMobile ? 252 : 364,
              objectFit: 'contain',
              borderRadius: 20,
            }}
          />
        </div>

        {/* Name */}
        <h1
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: isMobile ? 'clamp(48px, 12vw, 80px)' : 'clamp(56px, 10vw, 96px)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            margin: 0,
            marginBottom: isMobile ? '0.75rem' : '1rem',
          }}
        >
          {friend.name}
        </h1>

        {/* Bio */}
        <p style={{ fontSize: isMobile ? '1rem' : '1.125rem', opacity: 0.9, lineHeight: 1.6, maxWidth: 600, marginBottom: isMobile ? '2rem' : '3rem' }}>
          {friend.bio}
        </p>

        {/* Details grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '1.5rem' : '2rem', marginBottom: isMobile ? '2rem' : '3rem' }}>
          {/* Instagram */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <img src="/ipl-logos/INSTALOGO.png" alt="Instagram" style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }} />
            </div>
            <a
              href={friend.instagramUrl || `https://www.instagram.com/${friend.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl transition-all duration-200 hover:scale-103 hover:bg-white/20"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.14)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              <InstagramIcon size={20} colored={true} />
              <span style={{ fontSize: isMobile ? '0.95rem' : '1.05rem', fontWeight: 600 }}>
                @{friend.instagram}
              </span>
              <ExternalLink size={14} style={{ opacity: 0.6, marginLeft: 2 }} />
            </a>
          </div>

          {/* IPL Team */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <img src="/ipl-logos/IPLLOGO.png" alt="IPL Team" style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }} />
            </div>
            <IplTeamBadge friend={friend} isMobile={isMobile} />
          </div>

          {/* Role */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={14} style={{ opacity: 0.85 }} />
              <p className="uppercase text-xs font-bold tracking-widest" style={{ opacity: 0.75, margin: 0 }}>
                Role
              </p>
            </div>
            <p style={{ fontSize: isMobile ? '1rem' : '1.125rem', opacity: 0.95, fontWeight: 600, margin: 0 }}>
              {friend.role}
            </p>
          </div>

          {/* Superpower */}
          <div>
            <p className="uppercase text-xs font-bold tracking-widest" style={{ opacity: 0.75, marginBottom: '0.5rem' }}>
              Superpower
            </p>
            <p style={{ fontSize: isMobile ? '1rem' : '1.125rem', opacity: 0.95, margin: 0 }}>
              {friend.superpower}
            </p>
          </div>
        </div>

        {/* Gunky Pleasure */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '1.5rem' : '2rem', marginBottom: isMobile ? '2rem' : '3rem' }}>
          <div>
            <p className="uppercase text-xs font-bold tracking-widest" style={{ opacity: 0.7, marginBottom: '0.75rem' }}>Catchphrase</p>
            <p style={{ fontSize: isMobile ? '0.9rem' : '1rem', opacity: 0.9, fontStyle: 'italic', lineHeight: 1.5 }}>
              "{friend.catchphrase}"
            </p>
          </div>
          <div>
            <p className="uppercase text-xs font-bold tracking-widest" style={{ opacity: 0.7, marginBottom: '0.75rem' }}>Mood</p>
            <p style={{ fontSize: isMobile ? '0.9rem' : '1rem', opacity: 0.9 }}>{friend.mood}</p>
          </div>
        </div>

        {/* Best Memory quote */}
        <div
          style={{
            borderLeft: '3px solid rgba(255,255,255,0.4)',
            paddingLeft: isMobile ? '1rem' : '1.5rem',
            marginBottom: isMobile ? '2rem' : '3rem',
          }}
        >
          <p className="uppercase text-xs font-bold tracking-widest" style={{ opacity: 0.7, marginBottom: '0.75rem' }}>Best Memory</p>
          <p style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontStyle: 'italic', opacity: 0.95, lineHeight: 1.6, maxWidth: 600 }}>
            &ldquo;{friend.bestMemory}&rdquo;
          </p>
        </div>

        {/* Secret Talent */}
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 16,
            padding: isMobile ? '1.25rem' : '1.75rem',
            marginBottom: isMobile ? '2rem' : '3rem',
          }}
        >
          <p className="uppercase text-xs font-bold tracking-widest" style={{ opacity: 0.7, marginBottom: '0.5rem' }}>Secret Talent</p>
          <p style={{ fontSize: isMobile ? '1rem' : '1.125rem', opacity: 0.95, lineHeight: 1.5 }}>
            {friend.secretTalent}
          </p>
        </div>

        {/* Bottom padding */}
        <div style={{ height: isMobile ? '2rem' : '4rem' }} />
      </div>
    </div>
  )
}
