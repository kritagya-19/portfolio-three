import React from 'react'

export const TechIcons = {
  NextJs: (props) => (
    <svg viewBox="0 0 180 180" fill="none" {...props}>
      <circle cx="90" cy="90" r="88" stroke="#3A3A3A" strokeWidth="6" />
      <path
        d="M149.5 155.5L78.6 63.5V116.5H64.5V47.5H79.5L140.5 127.5C143.7 123.3 146.4 118.8 148.6 114V47.5H162.6V139C158.7 145 154.3 150.5 149.5 155.5Z"
        fill="#F4E7CD"
      />
      <path
        d="M116.5 63.5V85.5L127.5 100V63.5H116.5Z"
        fill="#FDC3A1"
      />
    </svg>
  ),

  NodeJs: (props) => (
    <svg viewBox="0 0 256 289" fill="none" {...props}>
      <path
        d="M128 0L249 70V210L128 280L7 210V70L128 0Z"
        fill="#68A063"
      />
      <path
        d="M100 100V180H120V140C120 125 135 125 145 125V105C135 105 125 110 120 118V100H100Z"
        fill="#1A1A1A"
      />
    </svg>
  ),

  ExpressJs: (props) => (
    <svg viewBox="0 0 256 160" fill="currentColor" {...props}>
      <text
        x="128"
        y="120"
        fontSize="120"
        fontFamily="sans-serif"
        fontWeight="800"
        fill="#F4E7CD"
        textAnchor="middle"
        letterSpacing="-3"
      >
        ex
      </text>
    </svg>
  ),

  ReactIcon: (props) => (
    <svg viewBox="-11.5 -10.23174 23 20.46348" fill="none" stroke="currentColor" {...props}>
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  ),

  TypeScript: (props) => (
    <svg viewBox="0 0 256 256" fill="none" {...props}>
      <rect width="256" height="256" rx="36" fill="#3178C6" />
      <path
        d="M135 175V110H100V95H185V110H150V175H135Z"
        fill="#F9F9F9"
      />
      <path
        d="M190 162C195 166 202 168 210 168C222 168 228 162 228 154C228 136 195 136 195 115C195 102 205 93 222 93C231 93 238 95 244 99L238 111C233 108 228 106 222 106C212 106 208 110 208 116C208 132 242 132 242 153C242 167 230 178 210 178C198 178 190 174 184 169L190 162Z"
        fill="#F9F9F9"
      />
    </svg>
  ),

  Tailwind: (props) => (
    <svg viewBox="0 0 256 154" fill="currentColor" {...props}>
      <path
        d="M128 0C90 0 64 25 51 77C72 51 92 45 112 58C124 65 133 74 143 85C159 102 178 122 218 122C256 122 282 96 294 45C274 70 254 77 234 64C222 56 213 47 203 36C187 20 168 0 128 0ZM38 77C0 77 -26 102 -38 154C-18 128 2 122 22 134C34 142 43 151 53 162C69 178 88 198 128 198C166 198 192 173 205 122C184 147 164 154 144 141C132 133 123 124 113 113C97 97 78 77 38 77Z"
        fill="#38BDF8"
        transform="translate(10, -10)"
      />
    </svg>
  ),

  PostgreSQL: (props) => (
    <svg viewBox="0 0 256 264" fill="currentColor" {...props}>
      <path
        d="M128 0C70 0 35 30 30 80C26 115 38 140 50 170C65 210 95 245 128 264C161 245 191 210 206 170C218 140 230 115 226 80C221 30 186 0 128 0Z"
        fill="#336791"
      />
      <circle cx="100" cy="85" r="10" fill="#F4E7CD" />
      <circle cx="156" cy="85" r="10" fill="#F4E7CD" />
      <path
        d="M110 130C110 160 146 160 146 130"
        stroke="#F4E7CD"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  ),

  GSAP: (props) => (
    <svg viewBox="0 0 200 120" fill="currentColor" {...props}>
      <text
        x="100"
        y="90"
        fontSize="76"
        fontFamily="sans-serif"
        fontWeight="900"
        fill="#0AE448"
        textAnchor="middle"
        letterSpacing="-1"
      >
        GSAP
      </text>
    </svg>
  ),

  ThreeJs: (props) => (
    <svg viewBox="0 0 200 200" fill="currentColor" {...props}>
      <polygon points="100,20 180,160 20,160" fill="none" stroke="#F4E7CD" strokeWidth="12" />
      <polygon points="100,60 150,145 50,145" fill="#F4E7CD" opacity="0.3" />
      <polygon points="100,90 125,135 75,135" fill="#F4E7CD" />
    </svg>
  ),

  MongoDB: (props) => (
    <svg viewBox="0 0 256 512" fill="currentColor" {...props}>
      <path
        d="M128 0C124 1 12 172 12 284C12 376 74 463 124 508L128 512L132 508C182 463 244 376 244 284C244 172 132 1 128 0Z"
        fill="#47A248"
      />
      <path d="M128 0V512C126 510 108 493 94 476C54 427 34 358 34 284C34 185 116 35 128 0Z" fill="#3FA037" />
    </svg>
  ),

  Git: (props) => (
    <svg viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path
        d="M246 114L142 10C136 4 127 0 119 0C110 0 102 4 96 10L10 96C-3 110 -3 131 10 144L114 246C120 252 128 256 137 256C145 256 154 252 160 246L246 160C259 147 259 127 246 114Z"
        fill="#F05032"
      />
      <circle cx="100" cy="90" r="20" fill="#1A1A1A" />
      <circle cx="160" cy="115" r="20" fill="#1A1A1A" />
      <circle cx="100" cy="170" r="20" fill="#1A1A1A" />
      <path d="M100 90V170M100 130L160 115" stroke="#1A1A1A" strokeWidth="12" strokeLinecap="round" />
    </svg>
  ),

  Docker: (props) => (
    <svg viewBox="0 0 256 200" fill="currentColor" {...props}>
      <path
        d="M30 135C30 125 40 115 65 115H195C215 115 235 130 235 155C235 185 195 200 130 200C60 200 30 170 30 135Z"
        fill="#2496ED"
      />
      <rect x="65" y="75" width="22" height="22" fill="#2496ED" rx="3" />
      <rect x="95" y="75" width="22" height="22" fill="#2496ED" rx="3" />
      <rect x="125" y="75" width="22" height="22" fill="#2496ED" rx="3" />
      <rect x="95" y="45" width="22" height="22" fill="#2496ED" rx="3" />
      <rect x="125" y="45" width="22" height="22" fill="#2496ED" rx="3" />
      <circle cx="218" cy="140" r="4" fill="#1A1A1A" />
    </svg>
  ),
}

export const LOGOS = [
  {
    name: 'Next.js',
    Icon: TechIcons.NextJs,
    color: '#F4E7CD',
  },
  {
    name: 'React',
    Icon: TechIcons.ReactIcon,
    color: '#61DAFB',
  },
  {
    name: 'Node.js',
    Icon: TechIcons.NodeJs,
    color: '#68A063',
  },
  {
    name: 'TypeScript',
    Icon: TechIcons.TypeScript,
    color: '#3178C6',
  },
  {
    name: 'Express.js',
    Icon: TechIcons.ExpressJs,
    color: '#E8DCC2',
  },
  {
    name: 'Tailwind CSS',
    Icon: TechIcons.Tailwind,
    color: '#38BDF8',
  },
  {
    name: 'PostgreSQL',
    Icon: TechIcons.PostgreSQL,
    color: '#336791',
  },
  {
    name: 'GSAP',
    Icon: TechIcons.GSAP,
    color: '#0AE448',
  },
  {
    name: 'Three.js',
    Icon: TechIcons.ThreeJs,
    color: '#F4E7CD',
  },
  {
    name: 'MongoDB',
    Icon: TechIcons.MongoDB,
    color: '#47A248',
  },
  {
    name: 'Git',
    Icon: TechIcons.Git,
    color: '#F05032',
  },
  {
    name: 'Docker',
    Icon: TechIcons.Docker,
    color: '#2496ED',
  },
]

