type PseudocodeLine = {
  line: string;
  indent: number;
  /** Step action prefixes that highlight this line. */
  actions: string[];
};

export type PseudocodeBlock = {
  title: string;
  lines: PseudocodeLine[];
};

export const KMP_PSEUDOCODE: PseudocodeBlock[] = [
  {
    title: "pseudocode.kmpLps",
    lines: [
      {
        line: "LPS[0] ← 0; len ← 0; i ← 1",
        indent: 0,
        actions: ["kmp:lps-init"],
      },
      { line: "while i < m:", indent: 0, actions: ["kmp:lps-compare"] },
      { line: "if P[i] = P[len]:", indent: 1, actions: ["kmp:lps-compare"] },
      { line: "len ← len + 1", indent: 2, actions: ["kmp:lps-extend"] },
      {
        line: "LPS[i] ← len; i ← i + 1",
        indent: 2,
        actions: ["kmp:lps-extend"],
      },
      { line: "else if len ≠ 0:", indent: 1, actions: ["kmp:lps-fallback"] },
      { line: "len ← LPS[len - 1]", indent: 2, actions: ["kmp:lps-fallback"] },
      { line: "else:", indent: 1, actions: ["kmp:lps-zero"] },
      { line: "LPS[i] ← 0; i ← i + 1", indent: 2, actions: ["kmp:lps-zero"] },
    ],
  },
  {
    title: "pseudocode.kmpSearch",
    lines: [
      { line: "i ← 0; j ← 0", indent: 0, actions: ["kmp:lps-done"] },
      { line: "while i < n:", indent: 0, actions: ["kmp:compare"] },
      { line: "if P[j] = T[i]:", indent: 1, actions: ["kmp:compare"] },
      { line: "i ← i + 1; j ← j + 1", indent: 2, actions: ["kmp:compare"] },
      { line: "if j = m:", indent: 2, actions: ["kmp:match"] },
      { line: "report match at i - m", indent: 3, actions: ["kmp:match"] },
      { line: "j ← LPS[j - 1]", indent: 3, actions: ["kmp:match"] },
      { line: "else if j > 0:", indent: 1, actions: ["kmp:search-fallback"] },
      { line: "j ← LPS[j - 1]", indent: 2, actions: ["kmp:search-fallback"] },
      { line: "else:", indent: 1, actions: ["kmp:advance-i"] },
      { line: "i ← i + 1", indent: 2, actions: ["kmp:advance-i"] },
    ],
  },
];

export const RABIN_KARP_PSEUDOCODE: PseudocodeBlock[] = [
  {
    title: "pseudocode.rabinKarp",
    lines: [
      {
        line: "patHash ← hash(P[0..m-1])",
        indent: 0,
        actions: ["rk:pattern-hash"],
      },
      {
        line: "winHash ← hash(T[0..m-1])",
        indent: 0,
        actions: ["rk:window-hash"],
      },
      { line: "h ← base^(m-1) mod q", indent: 0, actions: ["rk:intro"] },
      { line: "for s ← 0 to n - m:", indent: 0, actions: ["rk:window-hash"] },
      { line: "if winHash = patHash:", indent: 1, actions: ["rk:hash-match"] },
      { line: "for k ← 0 to m - 1:", indent: 2, actions: ["rk:verify"] },
      { line: "if T[s+k] ≠ P[k]:", indent: 3, actions: ["rk:collision"] },
      { line: "break  // collision", indent: 4, actions: ["rk:collision"] },
      {
        line: "if all matched: report at s",
        indent: 2,
        actions: ["rk:confirmed"],
      },
      { line: "if s < n - m:", indent: 1, actions: ["rk:roll"] },
      {
        line: "winHash ← roll(winHash, T[s], T[s+m])",
        indent: 2,
        actions: ["rk:roll"],
      },
    ],
  },
];

export const Z_FUNCTION_PSEUDOCODE: PseudocodeBlock[] = [
  {
    title: "pseudocode.zFunction",
    lines: [
      { line: "Z[0] ← 0; L ← 0; R ← 0", indent: 0, actions: ["z:intro"] },
      { line: "for i ← 1 to n - 1:", indent: 0, actions: ["z:iterate"] },
      { line: "if i > R:", indent: 1, actions: ["z:outside-box"] },
      { line: "L ← i; R ← i", indent: 2, actions: ["z:outside-box"] },
      {
        line: "while R < n and S[R-L] = S[R]:",
        indent: 2,
        actions: ["z:naive-compare"],
      },
      { line: "R ← R + 1", indent: 3, actions: ["z:naive-compare"] },
      { line: "Z[i] ← R - L; R ← R - 1", indent: 2, actions: ["z:update-box"] },
      { line: "else:", indent: 1, actions: ["z:inside-box"] },
      {
        line: "k ← i - L; β ← R - i + 1",
        indent: 2,
        actions: ["z:inside-box"],
      },
      { line: "if Z[k] < β:", indent: 2, actions: ["z:copy"] },
      { line: "Z[i] ← Z[k]", indent: 3, actions: ["z:copy"] },
      { line: "else:", indent: 2, actions: ["z:from-beta"] },
      {
        line: "Z[i] ← β; extend beyond R",
        indent: 3,
        actions: ["z:from-beta", "z:extend-compare"],
      },
    ],
  },
];
