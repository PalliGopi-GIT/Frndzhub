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
]

export default function SecretVault({ friend, isOpen, onClose }: SecretVaultProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const [isShaking, setIsShaking] = useState(false)
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
      setIsUnlocked(false)
      setSelectedMedia(null)
      setActiveTab('all')
    }
  }, [isOpen])

  const handleDigitClick = useCallback(
    (digit: string) => {
      if (pin.length >= 4 || isUnlocked) return
      const newPin = pin + digit
      setPin(newPin)
      setErrorMessage('')

      if (newPin.length === 4) {
        if (newPin === friend.passcode) {
          // Correct PIN
          setTimeout(() => {
            setIsUnlocked(true)
            setPin('')
          }, 200)
        } else {
          // Incorrect PIN -> Trigger shake animation
          setTimeout(() => {
            setIsShaking(true)
            setErrorMessage('Incorrect password')
            setTimeout(() => {
              setPin('')
              setIsShaking(false)
            }, 700)
          }, 150)
        }
      }
    },
    [pin, isUnlocked, friend.passcode]
  )

  const handleDelete = useCallback(() => {
    if (pin.length > 0) {
      setPin((prev) => prev.slice(0, -1))
      setErrorMessage('')
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto"
      style={{
        backgroundColor: 'rgba(10, 10, 18, 0.94)',
        backdropFilter: 'blur(16px)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @keyframes pinShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-12px); }
          40%, 80% { transform: translateX(12px); }
        }
        .animate-pin-shake {
          animation: pinShake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(255,255,255,0.15); }
          50% { box-shadow: 0 0 30px ${friend.favColor}88; }
        }
        .vault-card-glow {
          animation: pulseGlow 3s infinite ease-in-out;
        }
        @keyframes keypadEnter {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        .keypad-enter {
          animation: keypadEnter 0.35s ease-out forwards;
        }
      `}</style>

      {/* Main Container */}
      <div
        className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-4xl sm:rounded-3xl flex flex-col overflow-hidden"
        style={{
          backgroundColor: '#12131F',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px ${friend.favColor}22`,
        }}
      >
        {/* Header Bar */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-white/10"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-white/20"
              style={{ backgroundColor: friend.favColor }}
            >
              <img
                src={friend.photo}
                alt={friend.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    letterSpacing: '0.05em',
                    fontSize: '1.1rem',
                    color: 'white',
                  }}
                >
                  {friend.name}&apos;S VAULT
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: isUnlocked ? 'rgba(74, 222, 128, 0.18)' : 'rgba(248, 113, 113, 0.18)',
                    color: isUnlocked ? '#4ade80' : '#f87171',
                    border: `1px solid ${isUnlocked ? '#4ade8055' : '#f8717155'}`,
                  }}
                >
                  {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
              <p className="text-xs text-white/50 m-0">
                {isUnlocked ? 'Top secret photos, funny reels & archive' : 'Enter 4-digit password to unlock'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked && (
              <button
                onClick={() => {
                  setIsUnlocked(false)
                  setPin('')
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer border border-white/15"
                title="Lock Vault"
              >
                <Lock size={14} />
                Lock
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer border border-white/15"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isUnlocked ? (
          /* ============================================================ */
          /* PASSCODE LOCK SCREEN                                         */
          /* ============================================================ */
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 min-h-[540px]">
            {/* Friend Avatar with themed circle */}
            <div className="relative mb-2">
              <div
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden p-2 flex items-center justify-center vault-card-glow"
                style={{
                  background: `linear-gradient(135deg, ${friend.favColor}, #ffffff)`,
                  padding: '4px',
                }}
              >
                <div
                  className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(26, 26, 46, 0.9)',
                    border: `3px solid ${friend.favColor}`,
                  }}
                >
                  <img
                    src={friend.photo}
                    alt={friend.name}
                    className="w-full h-full object-contain object-bottom"
                  />
                </div>
              </div>
              {/* Lock icon overlay */}
              <div
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white/10"
                style={{ backgroundColor: '#e11d48', top: 'auto' }}
              >
                <Lock size={20} color="white" />
              </div>
            </div>

            {/* Friend Name */}
            <h2
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: isMobile ? '1.9rem' : '2.5rem',
                letterSpacing: '0.05em',
                color: 'white',
                margin: '0.5rem 0 0.25rem 0',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              {friend.name}
            </h2>

            {/* PIN Indicator Dots */}
            <div
              className={`flex items-center justify-center gap-3 mb-2 ${
                isShaking ? 'animate-pin-shake' : ''
              }`}
            >
              {[0, 1, 2, 3].map((index) => {
                const isFilled = pin.length > index
                return (
                  <div
                    key={index}
                    className="transition-all duration-200"
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      backgroundColor: isFilled ? friend.favColor : 'transparent',
                      border: isFilled
                        ? `2.5px solid ${friend.favColor}`
                        : '2px solid rgba(255, 255, 255, 0.45)',
                      boxShadow: isFilled
                        ? `0 0 12px ${friend.favColor}`
                        : 'none',
                      transform: isFilled ? 'scale(1.15)' : 'scale(1)',
                    }}
                  />
                )
              })}
            </div>

            {/* Error Message */}
            <div className="h-6 mb-3 flex items-center justify-center">
              {errorMessage && (
                <span className="text-xs font-semibold text-red-400 bg-red-950/60 px-3 py-1 rounded-full border border-red-500/30">
                  {errorMessage}
                </span>
              )}
            </div>

            {/* Numeric Keypad */}
            <div className="max-w-[240px] w-full">
              <style>{`
                .keypad-grid {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  gap: 8px;
                }
                @media (min-width: 640px) {
                  .keypad-grid { gap: 12px; }
                }
              `}</style>
              <div className="keypad-grid">
                {KEYPAD_BUTTONS.map((btn) => (
                  <button
                    key={btn.digit}
                    onClick={() => handleDigitClick(btn.digit)}
                    className="keypad-enter flex items-center justify-center rounded-2xl text-white text-3xl font-bold transition-all duration-150 active:scale-92 cursor-pointer select-none"
                    style={{
                      height: isMobile ? 62 : 68,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)'
                      e.currentTarget.style.borderColor = friend.favColor
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    {btn.digit}
                  </button>
                ))}

                {/* Clear button */}
                <button
                  onClick={() => {
                    setPin('')
                    setErrorMessage('')
                  }}
                  className="keypad-enter flex items-center justify-center rounded-2xl text-sm font-semibold text-white/70 hover:text-white transition-all active:scale-92 cursor-pointer"
                  style={{
                    height: isMobile ? 62 : 68,
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  CLEAR
                </button>

                {/* Zero */}
                <button
                  onClick={() => handleDigitClick('0')}
                  className="keypad-enter flex items-center justify-center rounded-2xl text-white text-3xl font-bold transition-all duration-150 active:scale-92 cursor-pointer select-none"
                  style={{
                    height: isMobile ? 62 : 68,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)'
                    e.currentTarget.style.borderColor = friend.favColor
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                  }}
                >
                  0
                </button>

                {/* Backspace */}
                <button
                  onClick={handleDelete}
                  className="keypad-enter flex items-center justify-center rounded-2xl text-white/70 hover:text-white transition-all active:scale-92 cursor-pointer"
                  style={{
                    height: isMobile ? 62 : 68,
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                  aria-label="Delete"
                >
                  <Delete size={22} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* UNLOCKED GALLERY VAULT                                       */
          /* ============================================================ */
          <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6">
            {/* Vault Banner */}
            <div
              className="rounded-2xl p-4 sm:p-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              style={{
                background: `linear-gradient(135deg, ${friend.favColor}33, rgba(255,255,255,0.06))`,
                border: `1px solid ${friend.favColor}55`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: friend.favColor }}
                >
                  <Unlock size={20} color="white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white m-0 flex items-center gap-1.5">
                    {friend.name}&apos;S SECRET ARCHIVE
                    <Sparkles size={16} color="#fbbf24" />
                  </h3>
                  <p className="text-xs text-white/70 m-0">
                    Vault unlocked successfully. Tap any photo or video to inspect!
                  </p>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 self-stretch sm:self-auto justify-center">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  All ({mediaList.length})
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'photos'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <ImageIcon size={12} />
                  Photos
                </button>
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'videos'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Film size={12} />
                  Videos
                </button>
              </div>
            </div>

            {/* Media Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {filteredMedia.map((item) => {
                const isOriginalPhoto = item.tag === 'Original Profile'
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMedia(item)}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-102 flex flex-col"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: isOriginalPhoto
                        ? `2px solid ${friend.favColor}`
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: isOriginalPhoto
                        ? `0 0 20px ${friend.favColor}44`
                        : '0 4px 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Media Preview Box */}
                    <div
                      className="relative w-full h-48 sm:h-52 overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: '#0c0d14' }}
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
                            <div className="w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play size={20} fill="currentColor" className="ml-0.5" />
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
                        className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md"
                        style={{
                          backgroundColor: isOriginalPhoto
                            ? friend.favColor
                            : 'rgba(0, 0, 0, 0.65)',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.2)',
                        }}
                      >
                        {item.tag}
                      </span>

                      {/* Type Icon */}
                      <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90">
                        {item.type === 'video' ? <Film size={12} /> : <ImageIcon size={12} />}
                      </div>
                    </div>

                    {/* Card Content & Caption */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-white/70 italic leading-relaxed m-0 line-clamp-2">
                          &ldquo;{item.caption}&rdquo;
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/5">
                        <span className="uppercase font-semibold tracking-wider">
                          Tap to view
                        </span>
                        <span className="font-mono text-white/60">
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
                <span>{friend.name}&apos;S VAULT ARCHIVE</span>
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
