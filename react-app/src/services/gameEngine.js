// Helpers
const POINT_SEQUENCE = [0, 15, 30, 40];

function nextPointAfter(current) {
  const i = POINT_SEQUENCE.indexOf(current);
  return i >= 0 && i < POINT_SEQUENCE.length - 1 ? POINT_SEQUENCE[i + 1] : null;
}
function prevPointBefore(current) {
  const i = POINT_SEQUENCE.indexOf(current);
  return i > 0 ? POINT_SEQUENCE[i - 1] : 0;
}

function setsToWin(val) {
  switch (val) {
    case '1': return 1;              // single set
    case '3': return 3;              // first to 3 sets
    case 'best_of_3': return 2;      // standard padel
    case 'best_of_5': return 3;
    case 'unlimited': return Infinity;
    default: return 2;
  }
}

function ensureSetInitialized(state) {
  const i = state.currentSet;
  if (typeof state.teamA.games[i] !== 'number') state.teamA.games[i] = 0;
  if (typeof state.teamB.games[i] !== 'number') state.teamB.games[i] = 0;
}

function rotateServerOnGameEnd(state) {
  // Run only if you already track serving
  if (!state.serving) return;
  if (Array.isArray(state.serving.order) && typeof state.serving.index === 'number') {
    state.serving.index = (state.serving.index + 1) % state.serving.order.length;
    state.serving.current = state.serving.order[state.serving.index];
  }
}

// --- Core transitions ---

function winSet(state, team) {
  const setsNeeded = setsToWin(state.gameConfig.setsToWin);

  state[team].setsWon += 1;
  state.currentSet += 1;

  // Prepare next set game counters @ 0–0
  state.teamA.games[state.currentSet] = 0;
  state.teamB.games[state.currentSet] = 0;

  // Reset intra-game state
  state.teamA.points = 0;
  state.teamB.points = 0;
  state.advantage = null;
  state.tiebreakActive = false;
  state.setDeciderActive = false;

  if (state[team].setsWon >= setsNeeded) {
    state.matchWinner = team;
  }
}

function winGame(state, team) {
  const opponent = team === 'teamA' ? 'teamB' : 'teamA';
  const setIdx = state.currentSet;

  ensureSetInitialized(state);

  // increment games for this set
  state[team].games[setIdx] = (state[team].games[setIdx] || 0) + 1;

  // reset points/adv for next game
  state.teamA.points = 0;
  state.teamB.points = 0;
  state.advantage = null;

  rotateServerOnGameEnd(state);

  const tg = state[team].games[setIdx] ?? 0;
  const og = state[opponent].games[setIdx] ?? 0;

  // If we were in a set-decider (no tiebreaker at 6–6), this game decides the set
  if (state.setDeciderActive) {
    state.setDeciderActive = false;
    winSet(state, team);
    return;
  }

  // Normal set closure: 6+ with 2-game margin
  if (tg >= 6 && tg - og >= 2) {
    winSet(state, team); // 6–0 ... 7–5 etc.
    return;
  }

  // 6–6 → either enter tiebreak or a single deciding game (golden game for the set)
  if (tg === 6 && og === 6) {
    if (state.gameConfig.tiebreaker) {
      state.tiebreakActive = true;     // first to 7, win by 2
    } else {
      state.setDeciderActive = true;   // next game wins set 7–6
    }
  }
}

// --- Public API ---

export function processPoint(state, team) {
  if (state.matchWinner) return;

  const opponent = team === 'teamA' ? 'teamB' : 'teamA';
  const config = state.gameConfig;

  // === POINTS GAME MODE (to target points) ===
  if (config.gameMode === 'points') {
    const target = config.targetPoints || 21;
    state[team].points += 1;
    if (state[team].points >= target) {
      state.matchWinner = team;
    }
    return;
  }

  // Make sure current set index exists before any game/tiebreak logic
  ensureSetInitialized(state);

  // === TIEBREAK MODE: first to 7, win by 2 ===
  if (state.tiebreakActive) {
    state[team].points += 1;

    const tp = state[team].points;
    const op = state[opponent].points;

    // Optional: UI can flip sides when (tp + op) % 6 === 0

    if (tp >= 7 && tp - op >= 2) {
      // Write the set as 7–6 for the winner before closing the set
      const setIdx = state.currentSet;
      state.teamA.games[setIdx] = (team === 'teamA') ? 7 : 6;
      state.teamB.games[setIdx] = (team === 'teamB') ? 7 : 6;

      winSet(state, team);
    }
    return;
  }

  // === REGULAR GAME SCORING ===
  const teamPts = state[team].points;
  const oppPts = state[opponent].points;

  // Deuce at 40–40
  if (teamPts === 40 && oppPts === 40) {
    if (config.goldenPoint) {
      // Golden Point: next point wins game
      winGame(state, team);
      return;
    }
    // With Advantage
    if (state.advantage === team) {
      winGame(state, team);        // had Adv, win game
    } else if (state.advantage === opponent) {
      state.advantage = null;      // opponent loses Adv → back to deuce
    } else {
      state.advantage = team;      // gain Adv
    }
    return;
  }

  // If scorer already at 40 and opponent below 40, this point wins the game
  if (teamPts === 40 && oppPts < 40) {
    winGame(state, team);
    return;
  }

  // Otherwise step 0 → 15 → 30 → 40
  const next = nextPointAfter(teamPts);
  if (next !== null) {
    state[team].points = next;
  }
}

export function processDecrement(state, team) {
  // Any correction clears a terminal match flag (we don't know if it's “final” anymore)
  state.matchWinner = null;

  const opponent = team === 'teamA' ? 'teamB' : 'teamA';
  const config = state.gameConfig;

  // === POINTS GAME MODE ===
  if (config.gameMode === 'points') {
    state[team].points = Math.max(0, state[team].points - 1);
    return;
  }

  // === TIEBREAK MODE ===
  if (state.tiebreakActive) {
    state[team].points = Math.max(0, state[team].points - 1);
    return;
  }

  // === DEUCE / ADVANTAGE correction ===
  if (state.advantage) {
    // Simple, predictable correction: any decrement during Adv returns to Deuce
    state.advantage = null;
    return;
  }

  // === REGULAR POINT DECREMENT ===
  state[team].points = prevPointBefore(state[team].points);
}
