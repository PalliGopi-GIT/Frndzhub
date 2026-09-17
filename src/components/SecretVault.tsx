import { useState, useEffect, useCallback } from 'react'
import {
  Lock,
  Unlock,
  X,
  Delete,
  Play,
  Film,
  Image as ImageIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { type Friend, type VaultMediaItem } from '../data/friends.ts'
import { useMediaQuery } from '../hooks/useMediaQuery.ts'

interface SecretVaultProps {
  friend: Friend
  isOpen: boolean
  onClose: () => void
}

const KEYPAD_BUTTONS = [
  { digit: '1' },
  { digit: '2' },
  { digit: '3' },
  { digit: '4' },
  { digit: '5' },
  { digit: '6' },
  { digit: '7' },
  { digit: '8' },
  { digit: '9' },
  { digit: '*' },
  { digit: '0' },
  { digit: '#' },
]

// Friend-specific passcode hints
const PASSCODE_HINTS: Record<string, string> = {
  friend1: "hint- it's swamy's fav code",
  friend2: "hint- it's eshwar's fav code",
  friend3: "hint- it's darshan's fav code",
  friend4: "hint- it's jashwanth's fav code",
  friend5: "hint- it's shiva's fav code",
  friend6: "hint- it's moksha's fav code",
}

export default function SecretVault({ friend, isOpen, onClose }: SecretVaultProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'photos' | 'videos'>('all')
  const [selectedMedia, setSelectedMedia] = useState<VaultMediaItem | null>(null)
  const isMobile = useMediaQuery('(max-width: 639px)')

  // Reset states on open/close
  useEffect(() => {
    if (!isOpen) {
      setPin('')
      setErrorMessage('')
      setIsShaking(false)
      setIsSuccess(false)
      setIsUnlocked(false)
      setSelectedMedia(null)
      setActiveTab('all')
    }
  }, [isOpen])

  const handleDigitClick = useCallback(
    (digit: string) => {
      if (pin.length >= 4 || isUnlocked) return
      if (digit === '*' || digit === '#') return // Ignore * and # for PIN entry

      const newPin = pin + digit
      setPin(newPin)
      setErrorMessage('')
      setIsSuccess(false)

      if (newPin.length === 4) {
        if (newPin === friend.passcode) {
          // Correct PIN
          setIsSuccess(true)
          setTimeout(() => {
            setIsUnlocked(true)
            setPin('')
            setIsSuccess(false)
          }, 300)
        } else {
          // Incorrect PIN -> Trigger shake animation
          setTimeout(() => {
            setIsShaking(true)
            setErrorMessage('Incorrect passcode')
            setTimeout(() => {
              setPin('')
              setIsShaking(false)
            }, 600)
          }, 100)
        }
      }
    },
    [pin, isUnlocked, friend.passcode]
  )

  const handleDelete = useCallback(() => {
    if (pin.length > 0) {
      setPin((prev) => prev.slice(0, -1))
      setErrorMessage('')
      setIsSuccess(false)
    }
  }, [pin.length])

  // Keyboard navigation support for desktop users
  useEffect(() => {
    if (!isOpen || isUnlocked) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigitClick(e.key)
      } else if (e.key === 'Backspace') {
        handleDelete()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isUnlocked, handleDigitClick, handleDelete, onClose])

  if (!isOpen) return null

  // Filter media based on tab
  const mediaList = friend.vaultMedia || []
  const filteredMedia = mediaList.filter((item) => {
    if (activeTab === 'photos') return item.type === 'image'
    if (activeTab === 'videos') return item.type === 'video'
    return true
  })

  const currentMediaIndex = selectedMedia
    ? filteredMedia.findIndex((m) => m.id === selectedMedia.id)
    : -1

  const handlePrevMedia = () => {
    if (currentMediaIndex > 0) {
      setSelectedMedia(filteredMedia[currentMediaIndex - 1])
    }
  }

  const handleNextMedia = () => {
    if (currentMediaIndex < filteredMedia.length - 1) {
      setSelectedMedia(filteredMedia[currentMediaIndex + 1])
    }
  }

  // Color scheme from reference design
  const red = '#8c0001'
  const redDark = '#6e0000'
  const pink = '#ffe1e1'
  const pinkSoft = '#f6c9c9'
  const cream = '#fdf6ee'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{
        backgroundColor: 'rgba(140, 0, 1, 0.95)',
        backdropFilter: 'blur(16px)',
        fontFamily: "'Baloo 2', 'Quicksand', system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-3px); }
          20%, 80% { transform: translateX(5px); }
          30%, 50%, 70% { transform: translateX(-8px); }
          40%, 60% { transform: translateX(8px); }
        }
        .code-boxes.shake { animation: shake 0.4s ease; }
        .code-box.pop { transform: scale(1.15); }
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .key.pressed {
          transform: translateY(3px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.18);
          background: #ffcccc;
        }
        .polaroid { transform: rotate(-2.5deg); }
        @media (prefers-reduced-motion: reduce) {
          .polaroid { transform: none; }
          .code-boxes.shake { animation: none; }
          .key.pressed { transform: none; }
        }
      `}</style>

      {/* Main Layout - Split Screen */}
      <div
        className="relative w-full max-w-5xl h-[90vh] max-h-[700px] sm:max-h-[800px] rounded-3xl overflow-hidden flex"
        style={{
          backgroundColor: cream,
          boxShadow: '0 25px 50px rgba(0,0,0,0.45), 0 8px 18px rgba(0,0,0,0.3)',
        }}
      >
        {/* LEFT SIDE - Polaroid Photo */}
        {!isUnlocked && (
          <div className="hidden lg:flex-1 flex items-center justify-center p-8 relative polaroid-wrap">
            <div className="polaroid relative" style={{ width: '100%', maxWidth: 420 }}>
              {/* Photo */}
              <img
                src={friend.photo}
                alt={friend.name}
                style={{
                  display: 'block',
                  width: '100%',
                  aspectRatio: '1/1',
                  objectFit: 'cover',
                  background: '#333',
                }}
              />

              {/* Bow decoration - top right */}
              <svg className="absolute" style={{ top: '-38px', right: '-46px', width: '150px', height: 'auto', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.35))', transform: 'rotate(4deg)' }} viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#2f6fb0" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
                  <path d="M100 78 C60 30 10 30 10 60 C10 92 60 92 100 78 Z" fill="#7fbdf0"/>
                  <path d="M100 78 C140 30 190 30 190 60 C190 92 140 92 100 78 Z" fill="#a9d6ff"/>
                  <path d="M100 78 C90 100 80 130 60 150 C75 135 90 130 100 118 C110 130 125 135 140 150 C120 130 110 100 100 78 Z" fill="#7fbdf0"/>
                  <circle cx="100" cy="78" r="15" fill="#5aa0e0"/>
                </g>
              </svg>

              {/* Teddy bear decoration - bottom left */}
              <img
                className="absolute"
                style={{ left: '-46px', bottom: '-58px', width: '150px', height: '150px', objectFit: 'contain', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.4))' }}
                src="https://thumbnail.imgbin.com/25/14/15/icon-cute-teddy-bear-with-hat-and-bow-tie-jN5sQdcz_t.jpg"
                alt="Teddy bear with hat and bow tie"
              />
            </div>
          </div>
        )}

        {/* RIGHT SIDE - Passcode Panel / Vault Content */}
        <div
          className="flex-1 flex flex-col"
          style={{
            padding: isMobile ? '2rem 1.5rem' : '3rem 4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: isUnlocked ? 'flex-start' : 'center',
            minWidth: 0,
          }}
        >
          {!isUnlocked ? (
            /* ============================================================ */
            /* PASSCODE LOCK SCREEN                                         */
            /* ============================================================ */
            <div className="w-full max-w-md mx-auto" style={{ textAlign: isMobile ? 'center' : 'left' }}>
              {/* Close button */}
              <div className="mb-4" style={{ textAlign: 'right' }}>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all"
                  style={{ backgroundColor: 'rgba(140, 0, 1, 0.1)', border: '1px solid rgba(140, 0, 1, 0.2)' }}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Title */}
              <h1 className="mb-8" style={{
                color: pink,
                fontSize: isMobile ? 'clamp(28px, 6vw, 38px)' : 'clamp(28px, 3vw, 38px)',
                fontWeight: 800,
                letterSpacing: '0.5px',
                margin: 0,
              }}>
                Enter Passcode
              </h1>

              {/* Code Boxes */}
              <div
                className="code-boxes mb-6 justify-center"
                style={{
                  display: 'flex',
                  gap: '16px',
                  ...(isShaking ? { animation: 'shake 0.4s ease' } : {}),
                  ...(isSuccess ? {
                    borderColor: '#8fe3a5',
                    background: 'rgba(143, 227, 165, 0.15)'
                  } : {}),
                }}
                role="status"
                aria-live="polite"
              >
                {[0, 1, 2, 3].map((index) => {
                  const isFilled = pin.length > index
                  return (
                    <div
                      key={index}
                      className="code-box transition-all duration-120"
                      style={{
                        width: isMobile ? 52 : 64,
                        height: isMobile ? 52 : 64,
                        border: `3px solid ${isFilled || isSuccess ? pink : pinkSoft}`,
                        borderRadius: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isMobile ? 24 : 30,
                        fontWeight: 800,
                        color: cream,
                        background: isFilled || isSuccess ? 'rgba(255, 225, 225, 0.08)' : 'transparent',
                        transform: (isFilled && !isShaking) ? 'scale(1.15)' : 'scale(1)',
                      }}
                    >
                      {isFilled ? '●' : ''}
                    </div>
                  )
                })}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <p className="mb-4 text-sm font-semibold text-center" style={{ color: '#ff6b6b' }}>
                  {errorMessage}
                </p>
              )}

              {/* Keypad */}
              <div className="keypad" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: isMobile ? '16px 18px' : '22px 26px',
                maxWidth: isMobile ? '250px' : '310px',
                margin: '0 auto',
              }} role="group" aria-label="Passcode keypad">
                {KEYPAD_BUTTONS.map((btn) => {
                  const isActionKey = btn.digit === '*' || btn.digit === '#'
                  return (
                    <button
                      key={btn.digit}
                      onClick={() => isActionKey ? (btn.digit === '*' ? handleDelete() : null) : handleDigitClick(btn.digit)}
                      className="key"
                      style={{
                        width: isMobile ? 72 : 84,
                        height: isMobile ? 72 : 84,
                        borderRadius: '50%',
                        border: 'none',
                        background: isActionKey ? 'transparent' : pink,
                        color: isActionKey ? red : redDark,
                        fontSize: isActionKey ? (isMobile ? 22 : 26) : (isMobile ? 28 : 32),
                        fontWeight: 800,
                        fontFamily: 'inherit',
                        cursor: isActionKey ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isActionKey ? 'none' : '0 4px 0 rgba(0,0,0,0.18), inset 0 -3px 0 rgba(0,0,0,0.06)',
                        transition: 'transform 0.08s ease, box-shadow 0.08s ease, background 0.15s ease',
                        userSelect: 'none',
                        WebkitTapHighlightColor: 'transparent',
                        opacity: isActionKey ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActionKey) {
                          e.currentTarget.style.background = '#fff'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActionKey) {
                          e.currentTarget.style.background = pink
                        }
                      }}
                      onMouseDown={(e) => {
                        if (!isActionKey) {
                          e.currentTarget.style.transform = 'translateY(3px)'
                          e.currentTarget.style.boxShadow = '0 1px 0 rgba(0,0,0,0.18)'
                          e.currentTarget.style.background = '#ffcccc'
                        }
                      }}
                      onMouseUp={(e) => {
                        if (!isActionKey) {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 4px 0 rgba(0,0,0,0.18), inset 0 -3px 0 rgba(0,0,0,0.06)'
                          e.currentTarget.style.background = pink
                        }
                      }}
                      disabled={isActionKey}
                      aria-label={btn.digit === '*' ? 'Clear' : btn.digit === '#' ? 'Enter' : btn.digit}
                    >
                      {btn.digit === '*' ? <Delete size={isMobile ? 22 : 26} /> : btn.digit === '#' ? '⏎' : btn.digit}
                    </button>
                  )
                })}
              </div>

              {/* Hint */}
              <p className="hint mt-6" style={{
                color: pink,
                fontSize: isMobile ? 18 : 20,
                fontWeight: 700,
                opacity: 0.9,
                textAlign: 'center',
              }}>
                {PASSCODE_HINTS[friend.id] || "hint- it's their fav code"}
              </p>
            </div>
          ) : (
            /* ============================================================ */
            /* UNLOCKED GALLERY VAULT                                       */
            /* ============================================================ */
            <div className="flex-1 overflow-y-auto w-full">
              {/* Vault Header */}
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: friend.favColor }}>
                    <Unlock size={24} color="white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold m-0 flex items-center gap-2" style={{ color: '#1a1a2e' }}>
                      {friend.name}'S SECRET ARCHIVE
                      <Sparkles size={20} color="#fbbf24" />
                    </h2>
                    <p className="text-sm m-0" style={{ color: '#666' }}>
                      Vault unlocked successfully. Tap any photo or video to inspect!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsUnlocked(false); setPin('') }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(140, 0, 1, 0.1)',
                    color: red,
                    border: `1px solid ${red}33`,
                  }}
                  title="Lock Vault"
                >
                  <Lock size={16} />
                  Lock
                </button>
              </div>

              {/* Category Filter Tabs */}
              <div className="mb-6 flex items-center gap-2 bg-gray-100 p-1 rounded-xl" style={{ border: '1px solid #eee' }}>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All ({mediaList.length})
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'photos'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ImageIcon size={14} />
                  Photos
                </button>
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'videos'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Film size={14} />
                  Videos
                </button>
              </div>

              {/* Media Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMedia.map((item) => {
                  const isOriginalPhoto = item.tag === 'Original Profile'
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedMedia(item)}
                      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-102 flex flex-col"
                      style={{
                        backgroundColor: '#fff',
                        border: isOriginalPhoto
                          ? `2px solid ${friend.favColor}`
                          : '1px solid #eee',
                        boxShadow: isOriginalPhoto
                          ? `0 0 20px ${friend.favColor}44`
                          : '0 4px 20px rgba(0,0,0,0.08)',
                        borderRadius: 16,
                      }}
                    >
                      {/* Media Preview Box */}
                      <div
                        className="relative w-full h-48 sm:h-52 overflow-hidden flex items-center justify-center"
                        style={{ backgroundColor: '#f5f5f5', borderRadius: '16px 16px 0 0' }}
                      >
                        {item.type === 'video' ? (
                          <>
                            <video
                              src={item.url}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              muted
                              playsInline
                              preload="metadata"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                              <div className="w-14 h-14 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Play size={24} fill="currentColor" className="ml-1" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            style={{
                              objectFit: isOriginalPhoto ? 'contain' : 'cover',
                              backgroundColor: isOriginalPhoto ? `${friend.favColor}22` : 'transparent',
                            }}
                          />
                        )}

                        {/* Tag Pill */}
                        <span
                          className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: isOriginalPhoto
                              ? friend.favColor
                              : 'rgba(0, 0, 0, 0.65)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          {item.tag}
                        </span>

                        {/* Type Icon */}
                        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90">
                          {item.type === 'video' ? <Film size={14} /> : <ImageIcon size={14} />}
                        </div>
                      </div>

                      {/* Card Content & Caption */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-base font-bold mb-1 line-clamp-1" style={{ color: '#1a1a2e' }}>
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 italic leading-relaxed m-0 line-clamp-2" style={{ color: '#555' }}>
                            &ldquo;{item.caption}&rdquo;
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                          <span className="uppercase font-semibold tracking-wider">
                            Tap to view
                          </span>
                          <span className="font-mono text-gray-500">
                            {item.type === 'video' ? '🎬 VIDEO' : '📸 PHOTO'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LIGHTBOX */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
          }}
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col rounded-3xl overflow-hidden"
            style={{
              backgroundColor: '#11121d',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase"
                  style={{
                    backgroundColor: `${friend.favColor}33`,
                    color: friend.favColor,
                    border: `1px solid ${friend.favColor}66`,
                  }}
                >
                  {selectedMedia.tag}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white m-0 line-clamp-1">
                  {selectedMedia.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div
              className="relative flex-1 min-h-[300px] max-h-[60vh] flex items-center justify-center p-2"
              style={{ backgroundColor: '#07080e' }}
            >
              {selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[56vh] rounded-xl shadow-2xl"
                  style={{ outline: 'none' }}
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="max-w-full max-h-[56vh] object-contain rounded-xl shadow-2xl"
                />
              )}

              {currentMediaIndex > 0 && (
                <button
                  onClick={handlePrevMedia}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center cursor-pointer transition-all"
                  aria-label="Previous media"
                >
                  <ChevronLeft size={22} />
                </button>
              )}
              {currentMediaIndex < filteredMedia.length - 1 && (
                <button
                  onClick={handleNextMedia}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center cursor-pointer transition-all"
                  aria-label="Next media"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            <div className="p-4 sm:p-5 bg-white/5 border-t border-white/10">
              <p className="text-xs sm:text-sm text-white/90 italic leading-relaxed m-0">
                &ldquo;{selectedMedia.caption}&rdquo;
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-xs text-white/50">
                <span>{friend.name}'S VAULT ARCHIVE</span>
                <span>
                  {currentMediaIndex + 1} of {filteredMedia.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}