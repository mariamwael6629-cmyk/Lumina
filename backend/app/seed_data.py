"""Static seed data mirroring the original frontend mock content.

Used to populate system/bot users, discover rooms, and starter demo
conversations for every newly registered user, so the product feels
populated the same way the original static prototype did - except the
data now lives in the database instead of hardcoded JS.
"""

SYSTEM_USERS = [
    {
        "username": "aria_nova",
        "display_name": "Aria Nova",
        "initials": "AR",
        "color": "#C84163",
    },
    {
        "username": "zephyr_kira",
        "display_name": "Kira",
        "initials": "KI",
        "color": "#B4532A",
    },
    {
        "username": "zephyr_maya",
        "display_name": "Maya",
        "initials": "MY",
        "color": "#8A5A2B",
    },
    {
        "username": "kai_vortex",
        "display_name": "Kai Vortex",
        "initials": "KV",
        "color": "#A16207",
    },
    {
        "username": "nova_luna",
        "display_name": "Luna",
        "initials": "LU",
        "color": "linear-gradient(135deg,#f59e0b,#C84163)",
    },
    {
        "username": "lyra_storm",
        "display_name": "Lyra Storm",
        "initials": "LS",
        "color": "#6B4F3A",
    },
    {
        "username": "cypher_dev",
        "display_name": "Cypher Dev",
        "initials": "CD",
        "color": "#9C2D49",
    },
    {
        "username": "nyx_archive",
        "display_name": "Nyx Archive",
        "initials": "NA",
        "color": "linear-gradient(135deg,#63584D,#3B1E25)",
    },
    {
        "username": "lumina_system",
        "display_name": "Lumina",
        "initials": "L",
        "color": "#C84163",
    },
]

# (conversation key, is_group, name, initials, color, [(sender_username|None for self, text)])
DEMO_CONVERSATIONS = [
    {
        "key": "aria",
        "is_group": False,
        "name": "Aria Nova",
        "initials": "AR",
        "color": "#B4532A",
        "members": ["aria_nova"],
        "messages": [
            ("aria_nova", "Hey! Did you see the new Lumina spatial audio feature? The 3D rooms are \U0001f525"),
            (None, "Yes!! Been using it all day. The positional audio in group rooms is next-level."),
            ("aria_nova", "Look at this nebula render I made with the AI art tool"),
            (None, "Woah \U0001f60d That's insane! What prompt did you use?"),
            ("aria_nova", '"deep space nebula, ultraviolet glow, quantum photons, cinematic render" — try it!'),
            (None, "on it rn \U0001f47e btw are you joining the Lumina devs room at 8pm?"),
            ("aria_nova", "100%! I'll be there early to help set up the stage. It's going to be a vibe ✨"),
        ],
    },
    {
        "key": "zephyr",
        "is_group": True,
        "name": "Zephyr Collective",
        "initials": "ZC",
        "color": "#8A5A2B",
        "members": ["zephyr_kira", "zephyr_maya"],
        "messages": [
            ("zephyr_kira", "Just pushed the new nav update \U0001f680 Check the staging branch"),
            (None, "Looking good! The sidebar animation is smooth \U0001f525"),
            ("zephyr_maya", "shipping to prod at midnight — all hands on deck!"),
        ],
    },
    {
        "key": "kai",
        "is_group": False,
        "name": "Kai Vortex",
        "initials": "KV",
        "color": "#A16207",
        "members": ["kai_vortex"],
        "messages": [
            ("kai_vortex", "Yo check this article → lumina.dev/blog/spatial-ui"),
            (None, "Reading it now, this is wild tech"),
        ],
    },
    {
        "key": "nova",
        "is_group": True,
        "name": "Nova Squad",
        "initials": "NS",
        "color": "linear-gradient(135deg,#f59e0b,#C84163)",
        "members": ["nova_luna"],
        "messages": [
            ("nova_luna", "omg the new voice rooms are PERFECT for game nights \U0001fac6"),
            (None, "Absolutely, setting one up for Friday?"),
        ],
    },
    {
        "key": "lyra",
        "is_group": False,
        "name": "Lyra Storm",
        "initials": "LS",
        "color": "#6B4F3A",
        "members": ["lyra_storm"],
        "messages": [
            ("lyra_storm", "Be back in 20 \U0001f319"),
        ],
    },
    {
        "key": "cypher",
        "is_group": False,
        "name": "Cypher Dev",
        "initials": "CD",
        "color": "#9C2D49",
        "members": ["cypher_dev"],
        "messages": [
            ("cypher_dev", "The build failed again..."),
        ],
    },
    {
        "key": "nyx",
        "is_group": False,
        "name": "Nyx Archive",
        "initials": "NA",
        "color": "linear-gradient(135deg,#63584D,#3B1E25)",
        "members": ["nyx_archive"],
        "messages": [
            (None, "Thanks for the file!"),
        ],
    },
]

DEMO_NOTIFICATIONS = [
    ("aria_nova", "reacted \U0001f525 to your message"),
    ("zephyr_kira", 'Kira: "Just pushed the nav update"'),
    ("kai_vortex", "sent you a link: lumina.dev/blog/spatial-ui"),
    ("nova_luna", "7 new messages in Nova Squad"),
    ("lyra_storm", "is now online"),
    ("lumina_system", "New feature: Hologram Rooms are live \U0001f389"),
]

DISCOVER_ROOMS = [
    {
        "name": "Design Universe",
        "slug": "design-universe",
        "initials": "DU",
        "color": "#C84163",
        "members": 1247,
        "description": "A space for UI/UX designers, motion artists, and creative technologists shaping the future.",
        "tags": "design,ui,motion,creative",
    },
    {
        "name": "Lumina Dev Hub",
        "slug": "lumina-dev-hub",
        "initials": "LD",
        "color": "#B4532A",
        "members": 3892,
        "description": "Official Lumina developer community. API discussions, SDK releases, and integration support.",
        "tags": "dev,api,sdk,official",
    },
    {
        "name": "Crypto Nebula",
        "slug": "crypto-nebula",
        "initials": "CN",
        "color": "linear-gradient(135deg,#f59e0b,#ef4444)",
        "members": 892,
        "description": "DeFi, NFTs, Web3 — real-time alpha drops and deep-dive research threads.",
        "tags": "crypto,web3,defi,nft",
    },
    {
        "name": "AI Frontier",
        "slug": "ai-frontier",
        "initials": "AF",
        "color": "#8A5A2B",
        "members": 2105,
        "description": "Latest papers, model releases, and debates on artificial general intelligence and beyond.",
        "tags": "ai,ml,llm,research",
    },
    {
        "name": "Night Owls \U0001f989",
        "slug": "night-owls",
        "initials": "NO",
        "color": "#A16207",
        "members": 455,
        "description": "Late-night chats, random deep thoughts, lo-fi music sharing, and vibes. No agenda.",
        "tags": "chill,music,vibes,lofi",
    },
    {
        "name": "Startup Orbit",
        "slug": "startup-orbit",
        "initials": "SO",
        "color": "linear-gradient(135deg,#C84163,#f59e0b)",
        "members": 678,
        "description": "Founders, early employees and investors sharing insights, intros, and launch announcements.",
        "tags": "startup,founder,vc,product",
    },
]

BOT_REPLIES = [
    "Haha yes!! \U0001f389",
    "That's exactly what I was thinking ✨",
    "100% agree, let's do it \U0001f680",
    "Omg right?? The future is now \U0001f47e",
]
