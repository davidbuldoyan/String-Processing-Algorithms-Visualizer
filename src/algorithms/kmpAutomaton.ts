/**
 * KMP Deterministic Finite Automaton builder.
 *
 * Given a pattern P of length m over alphabet Σ, the DFA has m+1 states (0 … m).
 * State j means "the last j characters of input match P[0..j-1]".
 * State m is the accepting state (full match).
 *
 * Transition rule:
 *   δ(j, c) = j + 1              if P[j] === c   (match: advance)
 *   δ(j, c) = δ(LPS[j-1], c)     if P[j] !== c   (follow failure links)
 *   δ(0, c) = 0                  if P[0] !== c   (base case)
 */

export type DFAEdge = {
  from: number
  to: number
  char: string
  kind: 'match' | 'fallback' | 'self-loop'
}

export type DFANode = {
  id: number
  label: string
  isAccept: boolean
}

export type KmpDFA = {
  nodes: DFANode[]
  edges: DFAEdge[]
  failureLinks: { from: number; to: number }[]
  transitionTable: Map<string, number>[]
  alphabet: string[]
}

function buildLPS(pattern: string): number[] {
  const m = pattern.length
  if (m === 0) return []
  const lps = new Array<number>(m).fill(0)
  let len = 0
  let i = 1
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++
      lps[i] = len
      i++
    } else if (len !== 0) {
      len = lps[len - 1]
    } else {
      lps[i] = 0
      i++
    }
  }
  return lps
}

export function buildKmpDFA(pattern: string): KmpDFA {
  const m = pattern.length
  const lps = buildLPS(pattern)

  const charSet = new Set<string>()
  for (const c of pattern) charSet.add(c)
  if (charSet.size === 0) charSet.add('A')
  const alphabet = [...charSet].sort()

  const nodes: DFANode[] = []
  for (let s = 0; s <= m; s++) {
    nodes.push({
      id: s,
      label: `q${s}`,
      isAccept: s === m,
    })
  }

  const transitionTable: Map<string, number>[] = Array.from({ length: m + 1 }, () => new Map())

  function delta(state: number, c: string): number {
    if (state < m && pattern[state] === c) return state + 1
    if (state === 0) return 0
    return delta(lps[state - 1], c)
  }

  for (let s = 0; s <= m; s++) {
    for (const c of alphabet) {
      transitionTable[s].set(c, delta(s, c))
    }
  }

  const edges: DFAEdge[] = []
  const edgeSet = new Set<string>()

  for (let s = 0; s <= m; s++) {
    for (const c of alphabet) {
      const target = transitionTable[s].get(c)!
      const key = `${s}-${target}-${c}`
      if (edgeSet.has(key)) continue
      edgeSet.add(key)

      let kind: DFAEdge['kind']
      if (target === s + 1) kind = 'match'
      else if (target === s) kind = 'self-loop'
      else kind = 'fallback'

      edges.push({ from: s, to: target, char: c, kind })
    }
  }

  const failureLinks: { from: number; to: number }[] = []
  for (let s = 1; s <= m; s++) {
    const target = s <= m - 1 ? lps[s - 1] : lps[m - 1]
    if (target !== 0 || s > 1) {
      failureLinks.push({ from: s, to: s <= m - 1 ? lps[s - 1] : lps[m - 1] })
    }
  }

  return { nodes, edges, failureLinks, transitionTable, alphabet }
}
