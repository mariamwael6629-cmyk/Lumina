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
        "color": "linear-gradient(135deg,#f472b6,#7c3aed)",
    },
    {
        "username": "zephyr_kira",
        "display_name": "Kira",
        "initials": "KI",
        "color": "linear-gradient(135deg,#06b6d4,#7c3aed)",
    },
    {
        "username": "zephyr_maya",
        "display_name": "Maya",
        "initials": "MY",
        "color": "linear-gradient(135deg,#06b6d4,#7c3aed)",
    },
    {
        "username": "kai_vortex",
        "display_name": "Kai Vortex",
        "initials": "KV",
        "color": "linear-gradient(135deg,#10b981,#06b6d4)",
    },
    {
        "username": "nova_luna",
        "display_name": "Luna",
        "initials": "LU",
        "color": "linear-gradient(135deg,#f59e0b,#f472b6)",
    },
    {
        "username": "lyra_storm",
        "display_name": "Lyra Storm",
        "initials": "LS",
        "color": "linear-gradient(135deg,#8b5cf6,#f472b6)",
    },
    {
        "username": "cypher_dev",
        "display_name": "Cypher Dev",
        "initials": "CD",
        "color": "linear-gradient(135deg,#6366f1,#06b6d4)",
    },
    {
        "username": "nyx_archive",
        "display_name": "Nyx Archive",
        "initials": "NA",
        "color": "linear-gradient(135deg,#475569,#1e293b)",
    },
    {
        "username": "lumina_system",
        "display_name": "Lumina",
        "initials": "L",
        "color": "linear-gradient(135deg,#7c3aed,#06b6d4)",
    },
]

# (conversation key, is_group, name, initials, color, [(sender_username|None for self, text)])
DEMO_CONVERSATIONS = [
    {
        "key": "aria",
        "is_group": False,
        "name": "Aria Nova",
        "initials": "AR",
        "color": "linear-gradient(135deg,#f472b6,#7c3aed)",
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
        "color": "linear-gradient(135deg,#06b6d4,#7c3aed)",
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
        "color": "linear-gradient(135deg,#10b981,#06b6d4)",
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
        "color": "linear-gradient(135deg,#f59e0b,#f472b6)",
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
        "color": "linear-gradient(135deg,#8b5cf6,#f472b6)",
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
        "color": "linear-gradient(135deg,#6366f1,#06b6d4)",
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
        "color": "linear-gradient(135deg,#475569,#1e293b)",
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
        "color": "linear-gradient(135deg,#7c3aed,#f472b6)",
        "members": 1247,
        "description": "A space for UI/UX designers, motion artists, and creative technologists shaping the future.",
        "tags": "design,ui,motion,creative",
    },
    {
        "name": "Lumina Dev Hub",
        "slug": "lumina-dev-hub",
        "initials": "LD",
        "color": "linear-gradient(135deg,#06b6d4,#7c3aed)",
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
        "color": "linear-gradient(135deg,#10b981,#06b6d4)",
        "members": 2105,
        "description": "Latest papers, model releases, and debates on artificial general intelligence and beyond.",
        "tags": "ai,ml,llm,research",
    },
    {
        "name": "Night Owls \U0001f989",
        "slug": "night-owls",
        "initials": "NO",
        "color": "linear-gradient(135deg,#6366f1,#7c3aed)",
        "members": 455,
        "description": "Late-night chats, random deep thoughts, lo-fi music sharing, and vibes. No agenda.",
        "tags": "chill,music,vibes,lofi",
    },
    {
        "name": "Startup Orbit",
        "slug": "startup-orbit",
        "initials": "SO",
        "color": "linear-gradient(135deg,#ec4899,#f59e0b)",
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
