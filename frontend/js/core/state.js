const AVATAR_COLORS = [
  '#C84163',
  '#B4532A',
  '#8A5A2B',
  '#A16207',
  '#6B4F3A',
  '#9C2D49',
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
