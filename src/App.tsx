import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { FRIENDS, type Friend } from './data/friends.ts'
import { useMediaQuery } from './hooks/useMediaQuery.ts'
import './index.css'

type Direction = 'next' | 'prev'

const COUNT = FRIENDS.length

function getRoles(activeIndex: number, direction: Direction) {
  if (direction === 'next') {
    return {
      center: activeIndex,
      left: (activeIndex + COUNT - 1) % COUNT,
      right: (activeIndex + 1) % COUNT,
      back: (activeIndex + 2) % COUNT,
    }
  }
  return {
    center: activeIndex,
    left: (activeIndex + 1) % COUNT,
    right: (activeIndex + COUNT - 1) % COUNT,
    back: (activeIndex + 2) % COUNT,
  }
}

function CarouselItem({
  friend,
  role,
  isMobile,
}: {
  friend: Friend
  role: 'center' | 'left' | 'right' | 'back'
  isMobile: boolean
}) {
  let style: React.CSSProperties
  if (role === 'center') {
    style = {
      transform: `translateX(-50%) scale(${isMobile ? 1.3 : 1.7})`,
      filter: 'none',
      opacity: 1,
      zIndex: 20,
      left: '50%',
      height: isMobile ? '60%' : '92%',
      bottom: isMobile ? '22%' : 0,
    }
  } else if (role === 'left') {
    style = {
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(1px)',
      opacity: 0.9,
      zIndex: 10,
      left: isMobile ? '15%' : '28%',
      height: isMobile ? '18%' : '30%',
      bottom: isMobile ? '30%' : '10%',
    }
  } else if (role === 'right') {
    style = {
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(1px)',
      opacity: 0.9,
      zIndex: 10,
      left: isMobile ? '85%' : '72%',
      height: isMobile ? '18%' : '30%',
      bottom: isMobile ? '30%' : '10%',
    }
  } else {
    style = {
      transform: 'translateX(-50%) scale(0.95)',
      filter: 'blur(3px)',
      opacity: 0.7,
      zIndex: 5,
      left: '50%',
      height: isMobile ? '14%' : '24%',
      bottom: isMobile ? '30%' : '10%',
    }
  }

  // Determine scaling / size per friend so character photos cover the background name consistently
  const isLargeCoverFriend =
    friend.id === 'friend1' || friend.id === 'friend2' || friend.id === 'friend4' || friend.id === 'friend5'

  // Moksha's photo is a tight headshot / close-up face cutout, so we scale it down and center it nicely
  const isMoksha = friend.id === 'friend6'

  return (
    <div
      className="absolute"
      style={{
        ...style,
        ...(role === 'center' && !isLargeCoverFriend && !isMoksha
          ? {
              height: isMobile ? '68%' : '98%',
              transform: `translateX(-50%) scale(${isMobile ? 1.45 : 1.9})`,
            }
          : {}),
        ...(role === 'center' && isMoksha
          ? {
              height: isMobile ? '54%' : '78%',
              bottom: isMobile ? '24%' : '6%',
              transform: `translateX(-50%) scale(${isMobile ? 1.22 : 1.48})`,
            }
          : {}),
        aspectRatio: '0.6 / 1',
        transition:
          'transform 450ms cubic-bezier(0.25,0.46,0.45,0.94), filter 450ms cubic-bezier(0.25,0.46,0.45,0.94), opacity 450ms cubic-bezier(0.25,0.46,0.45,0.94), left 450ms cubic-bezier(0.25,0.46,0.45,0.94), height 450ms cubic-bezier(0.25,0.46,0.45,0.94), bottom 450ms cubic-bezier(0.25,0.46,0.45,0.94)',
        willChange: 'transform, filter, opacity, left, height, bottom',
      }}
    >
      <img
        src={friend.photo}
        alt={friend.name}
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'bottom center',
        }}
      />
    </div>
  )
}

function GrainOverlay() {
  const svgDataUri = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E`
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 50,
        opacity: 0.4,
        backgroundImage: `url(${svgDataUri})`,
        backgroundSize: '200px 200px',
        backgroundRepeat: 'repeat',
      }}
    />
  )
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const isMobile = useMediaQuery('(max-width: 639px)')
  const shouldReduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const navigate = useNavigate()

  const activeFriend = FRIENDS[activeIndex]
  const roles = getRoles(activeIndex, 'next')

  // Preload all friend photos
  useEffect(() => {
    FRIENDS.forEach((f) => {
      const img = new Image()
      img.src = f.photo
    })
  }, [])

  const handleNavigate = useCallback(
    (direction: Direction) => {
      if (isAnimating) return
      setIsAnimating(true)
      if (direction === 'next') {
        setActiveIndex((prev) => (prev + 1) % COUNT)
      } else {
        setActiveIndex((prev) => (prev + COUNT - 1) % COUNT)
      }
      setTimeout(() => setIsAnimating(false), shouldReduceMotion ? 0 : 450)
    },
    [isAnimating, shouldReduceMotion],
  )

  return (
    <div
      style={{
        backgroundColor: activeFriend.favColor,
        transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <GrainOverlay />

        {/* Giant background name text */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            zIndex: 2,
            top: '18%',
            fontFamily: "'Anton', sans-serif",
            fontSize:
              activeFriend.id === 'friend4' || activeFriend.id === 'friend6'
                ? 'clamp(70px, 14vw, 240px)'
                : activeFriend.id === 'friend2' || activeFriend.id === 'friend3'
                  ? 'clamp(75px, 18vw, 290px)'
                  : 'clamp(90px, 28vw, 380px)',
            fontWeight: 900,
            color: 'white',
            opacity: 1,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
          }}
        >
          {activeFriend.name.toUpperCase()}
        </div>

        {/* Brand label */}
        <div
          className="absolute top-6 left-4 sm:left-8"
          style={{ zIndex: 60 }}
        >
          <span className="text-xs font-semibold uppercase" style={{ color: 'white', opacity: 0.9, letterSpacing: '0.18em' }}>
            FRNDZHUB
          </span>
        </div>

        {/* Carousel */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {FRIENDS.map((friend, i) => {
            let role: 'center' | 'left' | 'right' | 'back'
            if (i === roles.center) role = 'center'
            else if (i === roles.left) role = 'left'
            else if (i === roles.right) role = 'right'
            else role = 'back'
            return (
              <CarouselItem
                key={friend.id}
                friend={friend}
                role={role}
                isMobile={isMobile}
              />
            )
          })}
        </div>

        {/* Bottom-left text + nav buttons */}
        <div
          className="absolute"
          style={{
            bottom: isMobile ? '1.5rem' : '5rem',
            left: isMobile ? '1rem' : '6rem',
            zIndex: 60,
            maxWidth: 320,
          }}
        >
          <p className="font-bold uppercase tracking-widest mb-2 sm:mb-3" style={{ fontSize: isMobile ? '1rem' : '1.375rem', color: 'white', opacity: 0.95, letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
            {activeFriend.name}
          </p>
          <span
            className="inline-block px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              marginBottom: isMobile ? '0.75rem' : '1rem',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              marginRight: '0.5rem',
            }}
          >
            {activeFriend.role}
          </span>
          <p className="text-sm text-white/80 mb-4 sm:mb-5 break-all" style={{ fontSize: isMobile ? '0.8rem' : '0.875rem', opacity: 0.9, lineHeight: 1.5 }}>
            "{activeFriend.catchphrase}"
          </p>
          <p className="hidden sm:block text-xs text-white/60 mb-4 sm:mb-5" style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
            — {activeFriend.bestMemory.slice(0, 80)}…
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleNavigate('prev')}
              disabled={isAnimating}
              className="flex items-center justify-center rounded-full border-2 border-white bg-transparent transition-all duration-150 hover:scale-108 hover:bg-white/12 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ width: isMobile ? 48 : 64, height: isMobile ? 48 : 64 }}
              aria-label="Previous friend"
            >
              <ArrowLeft size={26} strokeWidth={2.25} color="white" />
            </button>
            <button
              onClick={() => handleNavigate('next')}
              disabled={isAnimating}
              className="flex items-center justify-center rounded-full border-2 border-white bg-transparent transition-all duration-150 hover:scale-108 hover:bg-white/12 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ width: isMobile ? 48 : 64, height: isMobile ? 48 : 64 }}
              aria-label="Next friend"
            >
              <ArrowRight size={26} strokeWidth={2.25} color="white" />
            </button>
          </div>
        </div>

        {/* Discover It link — navigates to friend detail page */}
        <button
          onClick={() => navigate(`/friend/${activeFriend.id}`)}
          className="absolute flex items-center gap-2 transition-opacity duration-200 hover:opacity-100 bg-transparent border-none cursor-pointer p-0"
          style={{
            bottom: isMobile ? '1.5rem' : '5rem',
            right: isMobile ? '1rem' : '2.5rem',
            zIndex: 60,
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(20px, 4vw, 56px)',
            fontWeight: 400,
            color: 'white',
            opacity: 0.95,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          DISCOVER IT
          <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} color="white" />
        </button>
      </div>
    </div>
  )
}
