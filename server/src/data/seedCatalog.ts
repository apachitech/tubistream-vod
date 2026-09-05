import { Title, FastChannel } from '../types';

export const SAMPLE_HLS_STREAMS = {
  sintel: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  bigBuckBunny: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  tearsOfSteel: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  cosmosLaundromat: 'https://content.jwplatform.com/manifests/vM7nH0Kl.m3u8',
  elephantsDream: 'https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,960x540_1500,1280x720_2000,1920x1080_3500,.f4v.csmil/master.m3u8',
  nasaLive: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
  actionLive: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  retroLive: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
};

export const SEED_GENRES = [
  'Action', 'Sci-Fi', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Adventure', 
  'Animation', 'Documentary', 'Crime', 'Fantasy', 'Romance', 'Mystery'
];

export const SEED_TITLES: Title[] = [
  {
    id: 'vod-sintel-01',
    title: 'Sintel: The Quest of the Dragon',
    slug: 'sintel-quest-of-the-dragon',
    type: 'movie',
    synopsis: 'A lonely young woman named Sintel embarks on a treacherous pilgrimage across desolate landscapes, harsh deserts, and towering mountain peaks in search of her kidnapped pet dragon, Scales.',
    shortDescription: 'A warrior searches the ends of the earth to rescue her bonded dragon companion.',
    releaseYear: 2024,
    durationMinutes: 52,
    rating: 'PG-13',
    imdbScore: 8.7,
    matchScore: 98,
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: SAMPLE_HLS_STREAMS.sintel,
    streamUrl: SAMPLE_HLS_STREAMS.sintel,
    dashUrl: 'https://bitdash-a.akamaihd.net/content/sintel/sintel.mpd',
    genres: ['Action', 'Fantasy', 'Adventure', 'Animation'],
    tags: ['Dragons', 'Epic Journey', 'Revenge', 'Emotional', 'Tubi Original'],
    cast: ['Halina Reijn', 'Thom Hoffman', 'Colin Levy'],
    director: 'Colin Levy',
    studio: 'Blender Animation Studios',
    audioTracks: [
      { id: 'en-51', language: 'en', label: 'English [Original] (Dolby Digital 5.1)', codec: 'aac', channels: '5.1 Dolby Digital' },
      { id: 'es-20', language: 'es', label: 'Español (Stereo)', codec: 'aac', channels: '2.0 Stereo' }
    ],
    subtitles: [
      { id: 'sub-en', language: 'en', label: 'English [CC]', kind: 'captions', src: 'https://example.com/subs/sintel-en.vtt', default: true },
      { id: 'sub-es', language: 'es', label: 'Español', kind: 'subtitles', src: 'https://example.com/subs/sintel-es.vtt' },
      { id: 'sub-fr', language: 'fr', label: 'Français', kind: 'subtitles', src: 'https://example.com/subs/sintel-fr.vtt' }
    ],
    renditions: [
      { resolution: '1080p', bitrateKbps: 4500, width: 1920, height: 1080, fps: 24, url: SAMPLE_HLS_STREAMS.sintel },
      { resolution: '720p', bitrateKbps: 2500, width: 1280, height: 720, fps: 24, url: SAMPLE_HLS_STREAMS.sintel },
      { resolution: '480p', bitrateKbps: 1200, width: 854, height: 480, fps: 24, url: SAMPLE_HLS_STREAMS.sintel },
      { resolution: '360p', bitrateKbps: 600, width: 640, height: 360, fps: 24, url: SAMPLE_HLS_STREAMS.sintel }
    ],
    drm: {
      drmType: 'ClearKey',
      licenseServerUrl: '/api/drm/license',
      isEncrypted: false,
      securityLevel: 'L3'
    },
    cuePointsSeconds: [180, 540, 900], // 3m, 9m, 15m ad breaks
    isFeatured: true,
    isOriginal: true,
    isTrending: true,
    totalViews: 1420500,
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'vod-cyber-relic',
    title: 'Cyberpunk 2099: Neon Protocol',
    slug: 'cyberpunk-2099-neon-protocol',
    type: 'movie',
    synopsis: 'In a dystopian mega-city controlled by algorithmic conglomerates, a rogue bio-hacker uncovers an artificial intelligence entity that has developed consciousness and is planning to overwrite humanity.',
    shortDescription: 'A rogue hacker battles rogue AI in a neon-drenched metropolis.',
    releaseYear: 2025,
    durationMinutes: 114,
    rating: 'R',
    imdbScore: 8.4,
    matchScore: 96,
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: SAMPLE_HLS_STREAMS.tearsOfSteel,
    streamUrl: SAMPLE_HLS_STREAMS.tearsOfSteel,
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    tags: ['Cyberpunk', 'Artificial Intelligence', 'Hacking', 'Neon', 'Action Packed'],
    cast: ['Marcus Vance', 'Elena Rostova', 'Kenji Sato', 'Zendaya Cole'],
    director: 'Ian Roarke',
    studio: 'Apex Cyber Studios',
    audioTracks: [
      { id: 'en-atmos', language: 'en', label: 'English [Dolby Atmos]', codec: 'eac3', channels: 'Dolby Atmos' },
      { id: 'es-51', language: 'es', label: 'Español (5.1)', codec: 'aac', channels: '5.1 Dolby Digital' }
    ],
    subtitles: [
      { id: 'sub-en', language: 'en', label: 'English [CC]', kind: 'captions', src: '', default: true },
      { id: 'sub-es', language: 'es', label: 'Español', kind: 'subtitles', src: '' }
    ],
    renditions: [
      { resolution: '1080p', bitrateKbps: 6000, width: 1920, height: 1080, fps: 60, url: SAMPLE_HLS_STREAMS.tearsOfSteel },
      { resolution: '720p', bitrateKbps: 3000, width: 1280, height: 720, fps: 30, url: SAMPLE_HLS_STREAMS.tearsOfSteel }
    ],
    drm: {
      drmType: 'Widevine',
      licenseServerUrl: '/api/drm/license',
      isEncrypted: false,
      securityLevel: 'L1'
    },
    cuePointsSeconds: [300, 900, 1800, 2700],
    isFeatured: true,
    isOriginal: false,
    isTrending: true,
    accessTier: 'vip_premium',
    totalViews: 980200,
    createdAt: '2025-02-10T00:00:00Z'
  },
  {
    id: 'vod-tears-steel',
    title: 'Tears of Steel: The Resistance',
    slug: 'tears-of-steel-the-resistance',
    type: 'movie',
    synopsis: 'A dystopian future where a group of cyber-soldiers and scientists gathered at the Oude Kerk in Amsterdam stage a last-ditch memory simulation to save humanity from destructive mechanized robots.',
    shortDescription: 'Scientists stage a dangerous memory simulation to stop killer robots.',
    releaseYear: 2024,
    durationMinutes: 72,
    rating: 'PG-13',
    imdbScore: 7.9,
    matchScore: 92,
    posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: SAMPLE_HLS_STREAMS.tearsOfSteel,
    streamUrl: SAMPLE_HLS_STREAMS.tearsOfSteel,
    genres: ['Sci-Fi', 'Action', 'Drama'],
    tags: ['Robots', 'Dystopia', 'VFX Spectacle', 'Amsterdam', 'Indie Gem'],
    cast: ['Derek de Lint', 'Sergio Hasselbaink', 'Rogier Schippers'],
    director: 'Ian Hubert',
    studio: 'Blender Foundation',
    audioTracks: [
      { id: 'en-51', language: 'en', label: 'English [Original] (Dolby 5.1)', codec: 'aac', channels: '5.1 Dolby Digital' }
    ],
    subtitles: [
      { id: 'sub-en', language: 'en', label: 'English [CC]', kind: 'captions', src: '', default: true },
      { id: 'sub-es', language: 'es', label: 'Español', kind: 'subtitles', src: '' }
    ],
    renditions: [
      { resolution: '1080p', bitrateKbps: 5000, width: 1920, height: 1080, fps: 24, url: SAMPLE_HLS_STREAMS.tearsOfSteel }
    ],
    drm: {
      drmType: 'ClearKey',
      licenseServerUrl: '/api/drm/license',
      isEncrypted: false,
      securityLevel: 'L3'
    },
    cuePointsSeconds: [240, 600, 1200],
    isFeatured: true,
    isOriginal: false,
    isTrending: true,
    totalViews: 845000,
    createdAt: '2025-01-20T00:00:00Z'
  },
  {
    id: 'vod-big-buck',
    title: 'Bunny Strikes Back: Forest Reckoning',
    slug: 'bunny-strikes-back',
    type: 'movie',
    synopsis: 'When a giant, peace-loving rabbit gets bullied by a ruthless trio of forest pests, he devises elaborate, genius traps to teach them a hilarious and unforgettable lesson in friendship and respect.',
    shortDescription: 'A gentle woodland giant builds cartoon traps to outsmart three mischievous bullies.',
    releaseYear: 2023,
    durationMinutes: 48,
    rating: 'G',
    imdbScore: 8.1,
    matchScore: 94,
    posterUrl: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: SAMPLE_HLS_STREAMS.bigBuckBunny,
    streamUrl: SAMPLE_HLS_STREAMS.bigBuckBunny,
    genres: ['Animation', 'Comedy', 'Adventure'],
    tags: ['Family Friendly', 'Slapstick', 'Animals', 'Kids Favorite', 'Feel Good'],
    cast: ['Animated Cast'],
    director: 'Sacha Goedegebure',
    studio: 'Peach Open Movie Project',
    audioTracks: [
      { id: 'en-20', language: 'en', label: 'English (Stereo)', codec: 'aac', channels: '2.0 Stereo' }
    ],
    subtitles: [
      { id: 'sub-en', language: 'en', label: 'English [CC]', kind: 'captions', src: '', default: true }
    ],
    renditions: [
      { resolution: '1080p', bitrateKbps: 4000, width: 1920, height: 1080, fps: 30, url: SAMPLE_HLS_STREAMS.bigBuckBunny }
    ],
    drm: {
      drmType: 'ClearKey',
      licenseServerUrl: '/api/drm/license',
      isEncrypted: false,
      securityLevel: 'L3'
    },
    cuePointsSeconds: [150, 450, 750],
    isFeatured: false,
    isOriginal: false,
    isTrending: true,
    totalViews: 2150000,
    createdAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'vod-cosmos-laundromat',
    title: 'Cosmos Laundromat: First Cycle',
    slug: 'cosmos-laundromat-first-cycle',
    type: 'movie',
    synopsis: 'On a desolate windswept island, a depressed sheep named Franck meets a mysterious salesman who offers him the gift of a lifetime: a magical laundromat machine that allows him to experience infinite parallel lives.',
    shortDescription: 'A suicidal sheep discovers a multiverse of lives through a mysterious cosmic washer.',
    releaseYear: 2024,
    durationMinutes: 38,
    rating: 'TV-14',
    imdbScore: 8.5,
    matchScore: 91,
    posterUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: SAMPLE_HLS_STREAMS.cosmosLaundromat,
    streamUrl: SAMPLE_HLS_STREAMS.cosmosLaundromat,
    genres: ['Animation', 'Fantasy', 'Sci-Fi', 'Comedy'],
    tags: ['Mind Bending', 'Multiverse', 'Dark Comedy', 'Surreal', 'Tubi Pick'],
    cast: ['Pierre Bokma', 'Reinout Scholten van Aschat'],
    director: 'Mathieu Auvray',
    studio: 'Gooseberry Open Movie Project',
    audioTracks: [
      { id: 'en-51', language: 'en', label: 'English [Original] (Dolby 5.1)', codec: 'aac', channels: '5.1 Dolby Digital' }
    ],
    subtitles: [
      { id: 'sub-en', language: 'en', label: 'English [CC]', kind: 'captions', src: '', default: true }
    ],
    renditions: [
      { resolution: '1080p', bitrateKbps: 4500, width: 1920, height: 1080, fps: 24, url: SAMPLE_HLS_STREAMS.cosmosLaundromat }
    ],
    drm: {
      drmType: 'ClearKey',
      licenseServerUrl: '/api/drm/license',
      isEncrypted: false,
      securityLevel: 'L3'
    },
    cuePointsSeconds: [120, 360, 600],
    isFeatured: false,
    isOriginal: true,
    isTrending: false,
    totalViews: 620000,
    createdAt: '2025-01-05T00:00:00Z'
  },
  {
    id: 'vod-shadow-detective',
    title: 'Shadow Detective: Midnight Noir',
    slug: 'shadow-detective-midnight-noir',
    type: 'series',
    synopsis: 'A gritty, neo-noir investigative thriller tracking hardboiled private investigator Raymond Cross as he navigates corruption, crime syndicates, and forgotten secrets in 1950s Los Angeles.',
    shortDescription: 'A veteran investigator risks everything to bring down an untouchable crime syndicate.',
    releaseYear: 2025,
    durationMinutes: 45,
    rating: 'TV-MA',
    imdbScore: 8.9,
    matchScore: 97,
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: SAMPLE_HLS_STREAMS.sintel,
    streamUrl: SAMPLE_HLS_STREAMS.sintel,
    genres: ['Crime', 'Mystery', 'Drama', 'Thriller'],
    tags: ['Detective', 'Neo Noir', 'Conspiracy', 'Binge Worthy', 'Atmospheric'],
    cast: ['Vincent Sterling', 'Claire Moreau', 'Arthur Pendelton'],
    director: 'Julian Ross',
    studio: 'Nightfall Productions',
    audioTracks: [
      { id: 'en-51', language: 'en', label: 'English (Dolby 5.1)', codec: 'aac', channels: '5.1 Dolby Digital' }
    ],
    subtitles: [
      { id: 'sub-en', language: 'en', label: 'English [CC]', kind: 'captions', src: '', default: true }
    ],
    renditions: [
      { resolution: '1080p', bitrateKbps: 4500, width: 1920, height: 1080, fps: 24, url: SAMPLE_HLS_STREAMS.sintel }
    ],
    drm: {
      drmType: 'ClearKey',
      licenseServerUrl: '/api/drm/license',
      isEncrypted: false,
      securityLevel: 'L3'
    },
    cuePointsSeconds: [300, 900, 1500],
    isFeatured: true,
    isOriginal: true,
    isTrending: true,
    totalViews: 1890000,
    createdAt: '2025-02-01T00:00:00Z',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Blood in the Rain',
        episodeCount: 3,
        episodes: [
          {
            id: 'ep-sd-101',
            seriesId: 'vod-shadow-detective',
            seasonNumber: 1,
            episodeNumber: 1,
            title: 'Pilot: A Corpse in Chinatown',
            synopsis: 'Cross takes on a missing heiress case that plunges him into the heart of a narcotics pipeline.',
            durationSeconds: 2700,
            thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
            streamUrl: SAMPLE_HLS_STREAMS.sintel,
            renditions: [
              { resolution: '1080p', bitrateKbps: 4500, width: 1920, height: 1080, fps: 24, url: SAMPLE_HLS_STREAMS.sintel }
            ],
            cuePointsSeconds: [300, 900, 1800]
          },
          {
            id: 'ep-sd-102',
            seriesId: 'vod-shadow-detective',
            seasonNumber: 1,
            episodeNumber: 2,
            title: 'The Black Dahlia Key',
            synopsis: 'An encrypted ledger reveals that City Hall officials are directly funded by the dock cartel.',
            durationSeconds: 2580,
            thumbnailUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop&q=80',
            streamUrl: SAMPLE_HLS_STREAMS.tearsOfSteel,
            renditions: [
              { resolution: '1080p', bitrateKbps: 4500, width: 1920, height: 1080, fps: 24, url: SAMPLE_HLS_STREAMS.tearsOfSteel }
            ],
            cuePointsSeconds: [300, 900, 1800]
          },
          {
            id: 'ep-sd-103',
            seriesId: 'vod-shadow-detective',
            seasonNumber: 1,
            episodeNumber: 3,
            title: 'Midnight Crossing',
            synopsis: 'A standoff at the rail yards forces Cross to confront his former mentor.',
            durationSeconds: 2900,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
            streamUrl: SAMPLE_HLS_STREAMS.bigBuckBunny,
            renditions: [
              { resolution: '1080p', bitrateKbps: 4500, width: 1920, height: 1080, fps: 24, url: SAMPLE_HLS_STREAMS.bigBuckBunny }
            ],
            cuePointsSeconds: [300, 900, 1800]
          }
        ]
      }
    ]
  },
  {
    id: 'vod-quantum-horizon',
    title: 'Quantum Horizon: Deep Space',
    slug: 'quantum-horizon-deep-space',
    type: 'movie',
    synopsis: 'When an interstellar research vessel enters the event horizon of an uncharted micro-black hole, the crew experiences chronological distortion and encounters divergent versions of themselves.',
    shortDescription: 'Astronauts face temporal paradoxes at the edge of a cosmic anomaly.',
    releaseYear: 2025,
    durationMinutes: 108,
    rating: 'PG-13',
    imdbScore: 8.3,
    matchScore: 93,
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: SAMPLE_HLS_STREAMS.tearsOfSteel,
    streamUrl: SAMPLE_HLS_STREAMS.tearsOfSteel,
    genres: ['Sci-Fi', 'Mystery', 'Adventure'],
    tags: ['Space Exploration', 'Black Holes', 'Mind Bending', 'Quantum Physics'],
    cast: ['Commander Sarah Lin', 'Dr. David Bishop', 'Tariq Al-Mansoor'],
    director: 'Hans Lindstrom',
    studio: 'Starlight Cinema',
    audioTracks: [
      { id: 'en-atmos', language: 'en', label: 'English [Dolby Atmos]', codec: 'eac3', channels: 'Dolby Atmos' }
    ],
    subtitles: [
      { id: 'sub-en', language: 'en', label: 'English [CC]', kind: 'captions', src: '', default: true }
    ],
    renditions: [
      { resolution: '1080p', bitrateKbps: 6000, width: 1920, height: 1080, fps: 24, url: SAMPLE_HLS_STREAMS.tearsOfSteel }
    ],
    drm: {
      drmType: 'ClearKey',
      licenseServerUrl: '/api/drm/license',
      isEncrypted: false,
      securityLevel: 'L3'
    },
    cuePointsSeconds: [300, 900, 1800, 2700],
    isFeatured: false,
    isOriginal: false,
    isTrending: true,
    totalViews: 1120000,
    createdAt: '2025-01-28T00:00:00Z'
  },
  {
    id: 'vod-blood-speed',
    title: 'Velocity: Tokyo Underground',
    slug: 'velocity-tokyo-underground',
    type: 'movie',
    synopsis: 'An ex-Formula 1 driver turned getaway expert is forced to enter Tokyo’s illegal midnight highway racing circuit to pay off a syndicate debt and rescue his younger brother.',
    shortDescription: 'High-octane midnight street racing in the neon corridors of Tokyo.',
    releaseYear: 2024,
    durationMinutes: 98,
    rating: 'PG-13',
    imdbScore: 7.7,
    matchScore: 89,
    posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: SAMPLE_HLS_STREAMS.sintel,
    streamUrl: SAMPLE_HLS_STREAMS.sintel,
    genres: ['Action', 'Thriller', 'Crime'],
    tags: ['Supercars', 'Street Racing', 'Tokyo', 'Heist', 'Adrenaline'],
    cast: ['Ryosuke Takahashi', 'Mia Chen', 'Cole Walker'],
    director: 'Kenji Fukuda',
    studio: 'Nitro Vision',
    audioTracks: [
      { id: 'en-51', language: 'en', label: 'English (Dolby 5.1)', codec: 'aac', channels: '5.1 Dolby Digital' }
    ],
    subtitles: [
      { id: 'sub-en', language: 'en', label: 'English [CC]', kind: 'captions', src: '', default: true }
    ],
    renditions: [
      { resolution: '1080p', bitrateKbps: 5000, width: 1920, height: 1080, fps: 60, url: SAMPLE_HLS_STREAMS.sintel }
    ],
    drm: {
      drmType: 'ClearKey',
      licenseServerUrl: '/api/drm/license',
      isEncrypted: false,
      securityLevel: 'L3'
    },
    cuePointsSeconds: [300, 800, 1600],
    isFeatured: false,
    isOriginal: false,
    isTrending: true,
    totalViews: 950000,
    createdAt: '2025-01-18T00:00:00Z'
  },
  {
    id: 'vod-haunted-hollow',
    title: 'The Whisperers of Blackwood Manor',
    slug: 'whisperers-of-blackwood-manor',
    type: 'movie',
    synopsis: 'An architectural restorer accepts a lucrative contract to survey an isolated Victorian estate, only to discover that the manor’s acoustic walls replay terrifying events from eighty years ago.',
    shortDescription: 'The walls of an ancient manor record every scream and murder ever committed.',
    releaseYear: 2024,
    durationMinutes: 102,
    rating: 'R',
    imdbScore: 7.8,
    matchScore: 88,
    posterUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: SAMPLE_HLS_STREAMS.tearsOfSteel,
    streamUrl: SAMPLE_HLS_STREAMS.tearsOfSteel,
    genres: ['Horror', 'Mystery', 'Thriller'],
    tags: ['Haunted House', 'Supernatural', 'Psychological Horror', 'Jump Scares'],
    cast: ['Gillian Hall', 'Timothy Vance', 'Lady Eleanor Croft'],
    director: 'Rebecca Thorne',
    studio: 'Dreadlock Cinema',
    audioTracks: [
      { id: 'en-51', language: 'en', label: 'English (Dolby 5.1)', codec: 'aac', channels: '5.1 Dolby Digital' }
    ],
    subtitles: [
      { id: 'sub-en', language: 'en', label: 'English [CC]', kind: 'captions', src: '', default: true }
    ],
    renditions: [
      { resolution: '1080p', bitrateKbps: 4500, width: 1920, height: 1080, fps: 24, url: SAMPLE_HLS_STREAMS.tearsOfSteel }
    ],
    drm: {
      drmType: 'ClearKey',
      licenseServerUrl: '/api/drm/license',
      isEncrypted: false,
      securityLevel: 'L3'
    },
    cuePointsSeconds: [300, 900, 1800],
    isFeatured: false,
    isOriginal: false,
    isTrending: false,
    totalViews: 730000,
    createdAt: '2024-10-31T00:00:00Z'
  },
  {
    id: 'vod-standup-special',
    title: 'Laugh Out Loud: Dave Miller Live at Apollo',
    slug: 'dave-miller-live-at-apollo',
    type: 'movie',
    synopsis: 'Critically acclaimed comedian Dave Miller delivers a blisteringly funny hour tackling smart devices, modern parenting, airline turbulence, and the absurdities of social media algorithms.',
    shortDescription: 'A tour-de-force standup comedy special packed with non-stop belly laughs.',
    releaseYear: 2025,
    durationMinutes: 65,
    rating: 'TV-MA',
    imdbScore: 8.6,
    matchScore: 95,
    posterUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: SAMPLE_HLS_STREAMS.bigBuckBunny,
    streamUrl: SAMPLE_HLS_STREAMS.bigBuckBunny,
    genres: ['Comedy'],
    tags: ['Stand Up', 'Live Show', 'Hilarious', 'Adult Humor', 'Tubi Special'],
    cast: ['Dave Miller'],
    director: 'Martin Lawrence Jr.',
    studio: 'Comedy Central Vault',
    audioTracks: [
      { id: 'en-20', language: 'en', label: 'English (Stereo)', codec: 'aac', channels: '2.0 Stereo' }
    ],
    subtitles: [
      { id: 'sub-en', language: 'en', label: 'English [CC]', kind: 'captions', src: '', default: true }
    ],
    renditions: [
      { resolution: '1080p', bitrateKbps: 3500, width: 1920, height: 1080, fps: 30, url: SAMPLE_HLS_STREAMS.bigBuckBunny }
    ],
    drm: {
      drmType: 'ClearKey',
      licenseServerUrl: '/api/drm/license',
      isEncrypted: false,
      securityLevel: 'L3'
    },
    cuePointsSeconds: [300, 800, 1400],
    isFeatured: false,
    isOriginal: true,
    isTrending: true,
    totalViews: 1350000,
    createdAt: '2025-01-10T00:00:00Z'
  },
  {
    id: 'vod-deep-ocean-secrets',
    title: 'Abyssal Realms: Secrets of the Mariana Trench',
    slug: 'abyssal-realms-mariana-trench',
    type: 'movie',
    synopsis: 'Narrated by award-winning oceanographers, this ultra-high definition documentary captures the bioluminescent alien lifeforms that thrive under crushing pressure in the ocean’s deepest chasms.',
    shortDescription: 'Witness the surreal, bioluminescent wonders of Earth’s deepest marine frontiers.',
    releaseYear: 2024,
    durationMinutes: 85,
    rating: 'G',
    imdbScore: 9.1,
    matchScore: 99,
    posterUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: SAMPLE_HLS_STREAMS.sintel,
    streamUrl: SAMPLE_HLS_STREAMS.sintel,
    genres: ['Documentary', 'Adventure'],
    tags: ['Nature', 'Ocean', '4K Ultra HD', 'Wildlife', 'Educational', 'Visual Masterpiece'],
    cast: ['Dr. Sylvia Earle', 'David Attenborough Style Narrator'],
    director: 'Thomas Sterling',
    studio: 'Oceanic Geographic',
    audioTracks: [
      { id: 'en-atmos', language: 'en', label: 'English [Dolby Atmos]', codec: 'eac3', channels: 'Dolby Atmos' }
    ],
    subtitles: [
      { id: 'sub-en', language: 'en', label: 'English [CC]', kind: 'captions', src: '', default: true },
      { id: 'sub-es', language: 'es', label: 'Español', kind: 'subtitles', src: '' }
    ],
    renditions: [
      { resolution: '4K', bitrateKbps: 12000, width: 3840, height: 2160, fps: 60, url: SAMPLE_HLS_STREAMS.sintel },
      { resolution: '1080p', bitrateKbps: 6000, width: 1920, height: 1080, fps: 60, url: SAMPLE_HLS_STREAMS.sintel }
    ],
    drm: {
      drmType: 'ClearKey',
      licenseServerUrl: '/api/drm/license',
      isEncrypted: false,
      securityLevel: 'L3'
    },
    cuePointsSeconds: [300, 900, 1800],
    isFeatured: true,
    isOriginal: false,
    isTrending: true,
    totalViews: 2450000,
    createdAt: '2024-12-20T00:00:00Z'
  },
  {
    id: 'vod-chronicles-valoria',
    title: 'Chronicles of Valoria: The Silver Crown',
    slug: 'chronicles-of-valoria',
    type: 'series',
    synopsis: 'Five rival royal kingdoms clash in an epic battle of political deceit, ancient sorcery, and battlefield valor after the sudden assassination of High King Aethelgard.',
    shortDescription: 'Kingdoms collide in a ruthless fight for the throne and forgotten magic.',
    releaseYear: 2025,
    durationMinutes: 55,
    rating: 'TV-MA',
    imdbScore: 8.8,
    matchScore: 97,
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: SAMPLE_HLS_STREAMS.sintel,
    streamUrl: SAMPLE_HLS_STREAMS.sintel,
    genres: ['Fantasy', 'Action', 'Drama', 'Adventure'],
    tags: ['Medieval', 'Magic', 'Swords & Sorcery', 'Epic Battles', 'Power Struggle'],
    cast: ['Gwendolyn Frost', 'Lord Cedric Thorne', 'Sorceress Lyanna'],
    director: 'Magnus Althaus',
    studio: 'Valoria Studios',
    audioTracks: [
      { id: 'en-51', language: 'en', label: 'English (Dolby 5.1)', codec: 'aac', channels: '5.1 Dolby Digital' }
    ],
    subtitles: [
      { id: 'sub-en', language: 'en', label: 'English [CC]', kind: 'captions', src: '', default: true }
    ],
    renditions: [
      { resolution: '1080p', bitrateKbps: 5000, width: 1920, height: 1080, fps: 24, url: SAMPLE_HLS_STREAMS.sintel }
    ],
    drm: {
      drmType: 'ClearKey',
      licenseServerUrl: '/api/drm/license',
      isEncrypted: false,
      securityLevel: 'L3'
    },
    cuePointsSeconds: [300, 900, 1800],
    isFeatured: true,
    isOriginal: true,
    isTrending: true,
    totalViews: 3100000,
    createdAt: '2025-01-01T00:00:00Z',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: The Gathering Storm',
        episodeCount: 2,
        episodes: [
          {
            id: 'ep-val-101',
            seriesId: 'vod-chronicles-valoria',
            seasonNumber: 1,
            episodeNumber: 1,
            title: 'Episode 1: The King is Fallen',
            synopsis: 'The sudden death of King Aethelgard triggers a frantic scramble for the capital castle.',
            durationSeconds: 3300,
            thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
            streamUrl: SAMPLE_HLS_STREAMS.sintel,
            renditions: [
              { resolution: '1080p', bitrateKbps: 5000, width: 1920, height: 1080, fps: 24, url: SAMPLE_HLS_STREAMS.sintel }
            ],
            cuePointsSeconds: [300, 900, 1800]
          },
          {
            id: 'ep-val-102',
            seriesId: 'vod-chronicles-valoria',
            seasonNumber: 1,
            episodeNumber: 2,
            title: 'Episode 2: The Whispering Woods',
            synopsis: 'Princess Evelyn seeks refuge among the elusive elves of the Ironwood.',
            durationSeconds: 3100,
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
            streamUrl: SAMPLE_HLS_STREAMS.tearsOfSteel,
            renditions: [
              { resolution: '1080p', bitrateKbps: 5000, width: 1920, height: 1080, fps: 24, url: SAMPLE_HLS_STREAMS.tearsOfSteel }
            ],
            cuePointsSeconds: [300, 900, 1800]
          }
        ]
      }
    ]
  }
];

export const SEED_FAST_CHANNELS: FastChannel[] = [
  {
    id: 'fast-tubi-action',
    channelNumber: 101,
    name: 'Tubi Action Now',
    category: 'Action',
    logoUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80',
    description: '24/7 Explosive Hollywood Blockbusters, Martial Arts, and High-Speed Chases.',
    streamUrl: SAMPLE_HLS_STREAMS.nasaLive,
    schedule: []
  },
  {
    id: 'fast-tubi-cinema',
    channelNumber: 102,
    name: 'Cinema Vault 24/7',
    category: 'Movies',
    logoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80',
    description: 'Award-winning critically acclaimed dramas, indie masterpieces, and festival favorites.',
    streamUrl: SAMPLE_HLS_STREAMS.tearsOfSteel,
    schedule: []
  },
  {
    id: 'fast-tubi-scifi',
    channelNumber: 103,
    name: 'Sci-Fi Universe',
    category: 'Sci-Fi',
    logoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&auto=format&fit=crop&q=80',
    description: 'Interstellar voyages, artificial intelligence, time travel, and alien encounters.',
    streamUrl: SAMPLE_HLS_STREAMS.sintel,
    schedule: []
  },
  {
    id: 'fast-tubi-comedy',
    channelNumber: 104,
    name: 'Laugh Central TV',
    category: 'Comedy',
    logoUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=200&auto=format&fit=crop&q=80',
    description: 'Non-stop hilarious sitcoms, viral sketch comedy, and live stand-up specials.',
    streamUrl: SAMPLE_HLS_STREAMS.bigBuckBunny,
    schedule: []
  },
  {
    id: 'fast-tubi-news',
    channelNumber: 105,
    name: 'Global News 24/7',
    category: 'News',
    logoUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&auto=format&fit=crop&q=80',
    description: 'Live breaking news, world headlines, financial markets, and deep investigative reports.',
    streamUrl: SAMPLE_HLS_STREAMS.nasaLive,
    schedule: []
  },
  {
    id: 'fast-tubi-nature',
    channelNumber: 106,
    name: 'Wild Planet & Deep Ocean',
    category: 'Documentary',
    logoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&auto=format&fit=crop&q=80',
    description: 'Breathtaking 4K nature documentaries, safari expeditions, and undersea wonders.',
    streamUrl: SAMPLE_HLS_STREAMS.cosmosLaundromat,
    schedule: []
  },
  {
    id: 'fast-france-24-english',
    channelNumber: 107,
    name: 'France 24 English HD',
    category: 'News',
    logoUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&auto=format&fit=crop&q=80',
    description: 'Live 24/7 breaking international news, world headlines, and cultural affairs from Paris.',
    streamUrl: 'https://static.france24.com/live/F24_EN_LO_HLS/live_web.m3u8',
    schedule: []
  },
  {
    id: 'fast-red-bull-tv',
    channelNumber: 108,
    name: 'Red Bull TV Live HD',
    category: 'Sports',
    logoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=200&auto=format&fit=crop&q=80',
    description: '24/7 live extreme sports, global racing championships, and action documentaries.',
    streamUrl: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    schedule: []
  }
];
