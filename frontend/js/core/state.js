const AVATAR_COLORS = [
  'linear-gradient(135deg,#7c3aed,#06b6d4)',
  'linear-gradient(135deg,#f472b6,#7c3aed)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#ec4899)',
  'linear-gradient(135deg,#6366f1,#f472b6)',
];

let state = {
  user: null,
  regColor: AVATAR_COLORS[0],
  conversations: [],
  activeConversationId: null,
  tab: 'all',
  rooms: [],
  pollHandle: null,
  lastNavBtn: null,
};
