export const en = {
  app: {
    title: "String Processing Algorithms Visualizer",
    diplomaProject: "Diploma project",
    footerTitle:
      "String Processing Algorithms Visualizer - Diploma Project {{year}}",
    techStack: "React + TypeScript + Vite",
    shortcuts: {
      space: "play/pause",
      arrows: "step",
    },
  },
  language: {
    label: "Language",
    english: "English",
    armenian: "Armenian",
    switchTo: "Switch language",
  },
  nav: {
    home: "Home",
  },
  theme: {
    light: "Light",
    dark: "Dark",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
  },
  home: {
    hero: {
      title: "String Processing Algorithms Visualizer",
      description:
        "An interactive learning tool for Knuth-Morris-Pratt, Rabin-Karp, and the Z-function. Step through comparisons, windows, and explanations designed for thesis-quality presentations.",
      cta: "Start visualization",
    },
    exploreTitle: "Explore algorithms",
    exploreDescription:
      "Each page shares the same control panel and visualizer frame.",
    openPage: "Open page",
    theoryPreview: "Theory preview",
    algorithms: {
      kmp: {
        name: "Knuth-Morris-Pratt",
        blurb:
          "Prefix function (LPS), linear-time search, and clear mismatch fallback - ideal when the alphabet is small and comparisons are expensive.",
      },
      rabinKarp: {
        name: "Rabin-Karp",
        blurb:
          "Rolling hash over a sliding window; fast filtering with rare collisions - great for multiple patterns or large alphabets.",
      },
      zFunction: {
        name: "Z-function",
        blurb:
          "Z-array and Z-box reuse for longest prefix matches at each suffix - foundational for many string analyses.",
      },
    },
    theoryPoints: {
      visualize: {
        title: "Why visualize?",
        body: "Seeing pointers, windows, and fallback jumps turns abstract invariants into something you can explain at the board.",
      },
      defend: {
        title: "What you will defend",
        body: "Correctness sketches, worst-case complexity, and when each algorithm wins in practice - supported by step-by-step playback.",
      },
      built: {
        title: "How the app is built",
        body: "Algorithms emit explicit steps; the UI replays them with shared controls, timing, and an explanation panel.",
      },
    },
  },
  pages: {
    kmp: {
      title: "Knuth-Morris-Pratt",
      description:
        "Step through LPS (prefix function) construction on the pattern, then the linear-time search with mismatch fallback using LPS. The DFA automaton below activates during the search phase.",
    },
    rabinKarp: {
      title: "Rabin-Karp",
      description:
        "Polynomial rolling hash over a sliding window: compare H(window) to H(pattern), then verify candidates. Collisions (equal hash, different text) are shown when they occur with the demo modulus.",
    },
    zFunction: {
      title: "Z-function",
      description:
        "Build the Z-array in linear time using the Z-box [L, R]: inside the box, reuse Z[k]; outside, extend naively. Purple marks the box, violet marks the current index i.",
    },
    notFound: {
      title: "Page not found",
      description: "The page you are looking for does not exist.",
      backHome: "Back to Home",
    },
  },
  controls: {
    text: "Text",
    pattern: "Pattern",
    algorithm: "Algorithm",
    buildSteps: "Build steps",
    sampleKmp: "Sample KMP",
    sampleRabinKarp: "Sample Rabin-Karp",
    sampleZ: "Sample Z",
    random: "Random",
    speed: "Speed",
    play: "Play",
    pause: "Pause",
    previous: "Prev",
    next: "Next",
    reset: "Reset",
    step: "Step",
  },
  visualizer: {
    title: "Visualizer",
    description:
      "Text and pattern as cells; window, match, and mismatch colors follow the algorithm state. KMP LPS steps highlight pattern indices only on the pattern row.",
    noSteps: "No steps loaded. Build steps from the control panel.",
    textRow: "Text (indices - i during search)",
    patternRow:
      "Pattern (indices - j during search; LPS build uses i / len on this row)",
    emptyText: "Empty text",
    timeline: "Step timeline",
    explanation: "Explanation",
    metrics: {
      textIndex: "textIndex",
      patternIndex: "patternIndex",
      window: "window",
      compared: "compared",
    },
  },
  shell: {
    theory: "Theory",
    closeTheory: "Close theory modal",
    pseudocode: "Pseudocode",
  },
  panels: {
    phase: "Phase",
    kmp: {
      lpsTable: "KMP - LPS table",
      lpsValues: "LPS values (index under pattern)",
      lpsBuild: "LPS build:",
      patternIndices: "pattern indices",
      compareBorder: "compare P[i] with the next border character",
      searchPointers: "Search pointers:",
      text: "text",
      pattern: "pattern",
      matchesAtStarts: "matches at starts",
      fallback:
        "Follow the steps above: LPS preprocessing on the pattern, then linear scan of the text using the LPS fallback rule.",
      automaton: "KMP Automaton (DFA)",
      currentState: "Current state:",
      match: "match!",
      finishedWithMatches: "Finished — pattern matched",
      finishedNoMatches: "Finished — no match",
      activatesDuringSearch: "Automaton activates during search phase",
      transitionTable: "Transition table δ(state, char)",
      state: "State",
      legendMatch: "match (advance)",
      legendFailure: "failure link (LPS)",
      legendActive: "active state",
      legendAccept: "accept",
      legendFallbackTransition: "mismatch transition",
      result: "Result",
      resultMatches: "Pattern found at indices: [{{starts}}]",
      resultNoMatches: "Pattern not found in text",
      resultLps: "LPS array: [{{lps}}]",
    },
    rabinKarp: {
      hashes: "Rabin-Karp - hashes",
      hashComparison: "Hash comparison",
      different: "Different",
      collision: "Collision!",
      confirmed: "Confirmed!",
      matchVerify: "Match - verify",
      rollingHashUpdate: "Rolling hash update",
      hashHistory: "Hash history",
      candidate: "candidate",
      confirmedLegend: "confirmed",
      collisionLegend: "collision",
      baseModulus: "Base - modulus",
      patternHash: "Pattern hash H(P)",
      windowHash: "Window hash H(window)",
      collisionMessage:
        "Hash collision: equal rolling hash, unequal substring - verify step ruled it out.",
      verifyingCharacter: "Verifying character {{index}} after a hash match.",
      candidateMessage:
        "Candidate: window hash equals pattern hash (yellow in the visualizer). Exact check required.",
      rollingUpdated:
        "Rolling hash updated for the next window (see formula above).",
      confirmedMatches: "Confirmed matches at starts: [{{starts}}].",
      defaultHint:
        "Slide the window; compare hashes before spending time on character equality.",
      result: "Result",
      resultMatches: "Pattern found at indices: [{{starts}}]",
      resultNoMatches: "Pattern not found in text",
    },
    zFunction: {
      chart: "Z-array chart",
      currentI: "current i",
      zBox: "Z-box",
      prefix: "prefix",
      mirror: "mirror",
      panelTitle: "Z-function - array & box",
      zBoxRange: "Z-box [L, R]",
      currentIndex: "Current i",
      result: "Result - Z-array",
    },
  },
  pseudocode: {
    kmpLps: "Build LPS (prefix function)",
    kmpSearch: "KMP Search",
    rabinKarp: "Rabin-Karp Algorithm",
    zFunction: "Z-Function Algorithm",
    reportMatch: "report match at i - m",
    collisionComment: "break  // collision",
    reportConfirmed: "if all matched: report at s",
  },
  algorithms: {
    kmp: {
      emptyPattern:
        "Pattern is empty: there is nothing to search for. Enter a non-empty pattern.",
      intro:
        "We first build the LPS array for the pattern (length {{m}}), then scan the text (length {{n}}). LPS[q] is the length of the longest proper prefix of P[0..q] that is also a suffix of that prefix.",
      lpsInit:
        "By definition LPS[0] = 0: a single character has no proper prefix.",
      lpsCompare:
        'LPS pass: compare P[{{pi}}] = "{{left}}" with P[{{len}}] = "{{right}}" (candidate border length {{len}}).',
      lpsExtend:
        "Characters match: extend the border and set LPS[{{pi}}] = {{len}}.",
      lpsFallback:
        "Mismatch: fall back to the next shorter border - len <- LPS[{{from}}] = {{nextLen}}. Index i stays {{pi}}.",
      lpsZero: "No border available: LPS[{{pi}}] = 0, then advance i.",
      lpsDone:
        "LPS array complete: [{{lps}}]. We now scan the text with pointer i and pattern pointer j.",
      compare:
        'Compare T[{{i}}] = "{{textChar}}" with P[{{j}}] = "{{patternChar}}". Window aligns P[0..] with T[{{windowStart}}..].',
      advanceInternal: "Advance (internal).",
      fullMatch:
        "Full match at text offset {{start}}. Next value j <- LPS[{{last}}] = {{nextJ}} allows overlapping matches.",
      searchFallback:
        "Mismatch with j = {{j}}. Skip characters using LPS: j <- LPS[{{from}}] = {{nextJ}} (no backtrack on i).",
      advanceI:
        "P[0] does not match T[{{i}}]; advance text index i <- {{nextI}} with j = 0.",
      doneNone: "Scan finished: no occurrence of the pattern in the text.",
      doneSome:
        "Scan finished: found {{count}} occurrence(s) starting at indices [{{starts}}].",
    },
    rabinKarp: {
      emptyPattern:
        "Pattern is empty: define a non-empty pattern to run Rabin-Karp.",
      intro:
        "Rabin-Karp uses a rolling polynomial hash (base {{base}}, modulo {{mod}}). The modulus is modest so occasional hash collisions can appear in this demo; practical implementations use a large prime and often double hashing.",
      patternHash:
        "Pattern hash H(P) = {{patternHash}} (computed over all {{m}} characters). We compare this to each length-{{m}} substring of the text.",
      textTooShort: "Text is shorter than the pattern: no window to place.",
      windowHash:
        "Window T[{{s}}..{{wEnd}}] has hash {{windowHash}}. Pattern hash is {{patternHash}}. {{decision}}",
      hashEqual: "Equal - must verify character by character (hash can lie).",
      hashDifferent:
        "Not equal - skip character comparison and slide the window.",
      hashMatch:
        "Hashes match. This is a candidate only: perform an exact comparison to confirm or detect a hash collision.",
      verifySame: 'Verify position {{k}}: "{{char}}" equals P[{{k}}].',
      verifyDifferent:
        'Verify position {{k}}: "{{textChar}}" != "{{patternChar}}" - hash collision; substring is not the pattern.',
      collisionResolved:
        "Collision resolved: unequal characters prove the substring differs despite equal rolling hash. Slide the window using the rolling update.",
      confirmed:
        "All {{m}} characters match: confirmed occurrence starting at text index {{s}}.",
      rolling:
        'Rolling update: drop "{{outCh}}" at the left (subtract x {{powH}}), shift by base {{base}}, add "{{inCh}}" on the right - all modulo {{mod}}. New window will start at {{nextStart}}.',
      doneNone: "Scan complete: no confirmed occurrences.",
      doneSome: "Scan complete: confirmed matches at starts [{{starts}}].",
    },
    zFunction: {
      empty: "Empty string: Z is undefined. Enter a non-empty string.",
      intro:
        "Z[i] is the length of the longest substring starting at i that matches a prefix of S. We compute Z[i] for i = 1 .. {{last}} in O(n) using the Z-box [L, R] (purple) - the segment already known to match S[0..].",
      single: "Single character: there is no index i >= 1. Z = [0].",
      iterateOutside:
        "i = {{i}} lies strictly to the right of R = {{r}}: we are outside the current Z-box and compare naively against the prefix.",
      iterateInside:
        "i = {{i}} lies inside [L, R] = [{{l}}, {{r}}]: we can reuse earlier Z values (Z-box covers a prefix match from position L).",
      insideBox:
        "Inside the box: k = i - L = {{k}}, remaining segment length beta = R - i + 1 = {{beta}}. Compare Z[{{k}}] = {{zk}} with beta.",
      copy: "Z[{{k}}] = {{zk}} < beta, so the match cannot reach past R: set Z[{{i}}] = Z[{{k}}] = {{zi}} without extra comparisons.",
      fromBeta:
        "Z[{{k}}] >= beta: we know at least beta characters match; set Z[{{i}}] = beta = {{beta}}, then extend character by character beyond R.",
      extendSame:
        'Extend: S[{{a}}] = "{{ca}}" equals S[{{b}}] = "{{cb}}"; increment Z[{{i}}].',
      extendDifferent:
        'Stop extending: S[{{a}}] = "{{ca}}" differs from S[{{b}}] = "{{cb}}".',
      outsideBox:
        "Outside the Z-box: start with Z[{{i}}] = 0 and extend while S[Z[{{i}}]] equals S[i + Z[{{i}}]].",
      naiveSame:
        'S[{{a}}] = "{{ca}}" matches S[{{b}}] = "{{cb}}"; increase Z[{{i}}].',
      naiveDifferent:
        "Mismatch at S[{{a}}] vs S[{{b}}]; Z[{{i}}] is final for this i.",
      updateBox:
        "New rightmost Z-box: [L, R] <- [{{l}}, {{r}}] (was [{{prevL}}, {{prevR}}]) because i + Z[{{i}}] - 1 = {{right}} extends past R.",
      done: "Complete Z-array: [{{z}}]. Use it for substring-prefix analyses (e.g. finding occurrences of a prefix in O(n)).",
    },
    demo: {
      enterText:
        'Enter a text string. Use sample strings or random data, then press "Build steps" to generate demo frames.',
      enterPattern:
        "Enter a pattern for substring-style demos, or switch to the Z-function page for text-only visualization.",
      scanning: "Demo: scanning text at index {{s}}.",
      window:
        'Demo window [{{s}}, {{end}}]: comparing text "{{textChar}}" with pattern start "{{patternChar}}".',
    },
  },
  theory: {
    common: {
      timeComplexity: "Time Complexity",
      spaceComplexity: "Space Complexity",
    },
    kmp: {
      title: "KMP - Mathematical Foundation",
      prefixTitle: "Prefix Function (LPS Array)",
      prefixDefinition:
        "For a pattern P[0..m-1], the prefix function (also called the failure function) is defined as:",
      prefixWords:
        "In words, LPS[q] is the length of the longest proper prefix of P[0..q] that is also a suffix of P[0..q]. By definition, LPS[0] = 0.",
      invariantTitle: "Search Invariant",
      invariant:
        "KMP maintains two pointers: i into the text T and j into the pattern P. The key invariant is:",
      mismatch:
        "On a mismatch at T[i] vs P[j], the algorithm sets j = LPS[j-1] without moving i backwards. This is valid because the LPS value guarantees the longest border of the matched prefix is already aligned.",
      correctnessTitle: "Correctness Argument",
      correctness:
        "The pointer i never moves left; j can only decrease via the prefix function. The amortized number of LPS lookups is bounded by the number of times j has been incremented (at most n times), so the total fallback steps across the entire search is O(n).",
      time: "Preprocessing:  O(m)  - building the LPS array\nSearch:          O(n)  - each text character visited at most twice\nTotal:           O(n + m)",
      space: "O(m) - for the LPS array",
    },
    rabinKarp: {
      title: "Rabin-Karp - Mathematical Foundation",
      hashTitle: "Polynomial Rolling Hash",
      hash: "The hash of a string S[0..m-1] is computed as a polynomial in a chosen base b modulo a prime q:",
      rollingTitle: "Rolling Update",
      rolling:
        "When sliding the window from position s to s+1, the hash is updated in O(1):",
      avoids:
        "This avoids recomputing the hash from scratch for each window position.",
      collisionTitle: "Collision Handling",
      collision:
        "When H(window) = H(pattern), we must verify character by character because different strings can map to the same hash (pigeonhole principle). A hash match without character equality is a spurious hit (collision).",
      notesTitle: "Practical Notes",
      notes:
        "Using a large prime modulus (e.g., 10^9+7) and double hashing drastically reduces collision probability. Rabin-Karp is particularly useful for multi-pattern search (e.g., plagiarism detection) because the hash-based filter scales well to many patterns.",
      time: "Average case:   O(n + m)  - few hash collisions expected\nWorst case:     O(nm)    - all windows trigger verification\n                          (adversarial input or bad hash function)",
      space: "O(1) - only hash values and the power constant stored",
    },
    zFunction: {
      title: "Z-Function - Mathematical Foundation",
      definitionTitle: "Definition",
      definition: "For a string S of length n, the Z-array is defined as:",
      zBoxTitle: "Z-Box [L, R]",
      zBox: "The algorithm maintains a segment [L, R] - the rightmost Z-box - where S[L..R] = S[0..R-L]. For each new index i:",
      searchTitle: "Substring Search via Z-function",
      search:
        'To find pattern P in text T, concatenate: S = P + "$" + T (where "$" does not appear in P or T). Compute Z on S. Any index i where Z[i] = |P| corresponds to an occurrence of P in T.',
      amortizedTitle: "Amortized Analysis",
      amortized:
        "The pointer R only moves to the right. Every character comparison either increments R (at most n times total) or results in a copy from a previously computed Z-value (no comparison). Hence the total work is O(n).",
      definitionFormula:
        "Z[i] = length of the longest substring starting at S[i]\n        that is also a prefix of S\n\nZ[0] is undefined (or set to 0 by convention).",
      zBoxFormula:
        "If i > R:   Extend naively from i, comparing S[0..] with S[i..]\n            Update [L, R] = [i, i + Z[i] - 1] if Z[i] > 0\n\nIf i <= R:  Let k = i - L, beta = R - i + 1\n            If Z[k] < beta:  Z[i] = Z[k]  (fully inside box, no comparisons)\n            If Z[k] >= beta: Z[i] = beta, then extend beyond R",
      searchFormula:
        'S = P + "$" + T\nIf Z[i] = m for i > m, then P occurs at T[i - m - 1]',
      time: "O(n) - each character participates in at most one\n        extension that advances R to the right",
      space: "O(n) - for the Z-array",
    },
  },
} as const;
