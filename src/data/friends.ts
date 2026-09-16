export interface Friend {
  id: string
  name: string
  photo: string
  favColor: string
  panelColor: string
  bio: string
  instagram: string
  instagramUrl?: string
  favIplTeam: string
  iplLogo?: string
  role: string
  catchphrase: string
  insideJoke: string
  guiltyPleasure: string
  superpower: string
  mood: string
  rivalScore: number
  bestMemory: string
  secretTalent: string
}

export const FRIENDS: Friend[] = [
  {
    id: 'friend1',
    name: 'SWAMY',
    photo: '/friend-photos/Friend1.png',
    favColor: '#F4845F',
    panelColor: '#F79B7F',
    bio: 'The leader of the pack. Always has a plan, always ready to execute it.',
    instagram: 'vachuswamy',
    instagramUrl: 'https://www.instagram.com/vachuswamy?stkn=cHRzc3FzNnM3OHNk',
    favIplTeam: 'RCB',
    iplLogo: '/ipl-logos/RCBLOGO.png',
    role: 'The Leader',
    catchphrase: 'Chill bro, it\'s fine',
    insideJoke: 'The WhatsApp call incident',
    guiltyPleasure: 'Binge-watching anime at 3 AM',
    superpower: 'Finding food anywhere',
    mood: '🔥 Chaotic',
    rivalScore: 85,
    bestMemory: 'The hostel raid of 2023',
    secretTalent: 'Can solve a Rubik\'s cube in 40 seconds',
  },
  {
    id: 'friend2',
    name: 'ESHWAR',
    photo: '/friend-photos/Friend2.png',
    favColor: '#6BBF7A',
    panelColor: '#85CC92',
    bio: 'The calm one. Keeps everyone grounded when things get wild.',
    instagram: 'eshwar_026',
    instagramUrl: 'https://www.instagram.com/eshwar_026?stkn=MXEzOWc3Zjc4am9mdA==',
    favIplTeam: 'RCB',
    iplLogo: '/ipl-logos/RCBLOGO.png',
    role: 'The Anchor',
    catchphrase: 'Let me think about it',
    insideJoke: 'The accidental karaoke night',
    guiltyPleasure: 'Reading self-help books at 2 AM',
    superpower: 'Always knows the right answer in exams',
    mood: '🌊 Calm',
    rivalScore: 72,
    bestMemory: 'The accidental karaoke night',
    secretTalent: 'Can recite movie quotes from memory',
  },
  {
    id: 'friend3',
    name: 'DARSHAN',
    photo: '/friend-photos/Friend3.png',
    favColor: '#E8DCC8',
    panelColor: '#E8DCC8',
    bio: 'The jokester. Never lets the room go quiet for more than 5 seconds.',
    instagram: 'gopi.pandu18',
    instagramUrl: 'https://www.instagram.com/gopi.pandu18?stkn=bW91bTVkd3RsMGs1',
    favIplTeam: 'RCB',
    iplLogo: '/ipl-logos/RCBLOGO.png',
    role: 'The Jokester',
    catchphrase: 'Did I do that?',
    insideJoke: 'The great pizza debate of 2022',
    guiltyPleasure: 'Watching cooking shows',
    superpower: 'Can make anyone laugh on command',
    mood: '😂 Always laughing',
    rivalScore: 60,
    bestMemory: 'The great pizza debate of 2022',
    secretTalent: 'Perfect mimic of 5 different accents',
  },
  {
    id: 'friend4',
    name: 'JASHWANTH',
    photo: '/friend-photos/Friend4.png',
    favColor: '#6EB5FF',
    panelColor: '#8DC4FF',
    bio: 'The tech wizard. If it has a screen, he probably built it.',
    instagram: 'jashwanth___reddy____',
    instagramUrl: 'https://www.instagram.com/jashwanth___reddy____?stkn=MXJqY241M3ppMGJwYQ==',
    favIplTeam: 'SRH',
    iplLogo: '/ipl-logos/SRHLOGO.png',
    role: 'The Tech Wizard',
    catchphrase: 'It\'s just a small bug, trust me',
    insideJoke: 'The 48-hour coding marathon',
    guiltyPleasure: 'Playing chess against himself',
    superpower: 'Can debug anything without reading the code',
    mood: '💻 Focused',
    rivalScore: 90,
    bestMemory: 'The 48-hour coding marathon',
    secretTalent: 'Can type 120 words per minute blindfolded',
  },
  {
    id: 'friend5',
    name: 'SHIVA',
    photo: '/friend-photos/Friend5.png',
    favColor: '#E882B4',
    panelColor: '#ED9DC4',
    bio: 'The wildcard. You never know what he\'s going to do next, and that\'s the best part.',
    instagram: 'shiva__3529',
    instagramUrl: 'https://www.instagram.com/shiva__3529?stkn=MXU1MGxhd3V6Z2dibg==',
    favIplTeam: 'SRH',
    iplLogo: '/ipl-logos/SRHLOGO.png',
    role: 'The Wildcard',
    catchphrase: 'Hold my drink',
    insideJoke: 'The midnight adventure',
    guiltyPleasure: 'Collecting weird fridge magnets',
    superpower: 'Can find the best street food in any city',
    mood: '⚡ Unpredictable',
    rivalScore: 78,
    bestMemory: 'The midnight adventure',
    secretTalent: 'Can juggle 5 balls while riding a unicycle',
  },
  {
    id: 'friend6',
    name: 'MOKSHA',
    photo: '/friend-photos/Friend6.png',
    favColor: '#7A5CFA',
    panelColor: '#9C81FF',
    bio: 'The strategist. Always three steps ahead and plotting the next big move.',
    instagram: 'sreemokshagna.18',
    instagramUrl: 'https://www.instagram.com/sreemokshagna.18?stkn=MTB4ZmM1b2NwYjRlcQ==',
    favIplTeam: 'SRH',
    iplLogo: '/ipl-logos/SRHLOGO.png',
    role: 'The Strategist',
    catchphrase: 'Trust the process',
    insideJoke: 'The 2 AM plan that actually worked',
    guiltyPleasure: 'Solving chess puzzles between meetings',
    superpower: 'Can predict what you\'ll say next',
    mood: '🧠 Calculating',
    rivalScore: 88,
    bestMemory: 'The 2 AM plan that actually worked',
    secretTalent: 'Can read backwards upside down',
  },
]