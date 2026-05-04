import type { ReactNode } from 'react'
import type { TFunction } from 'i18next'

export type TheoryEntry = {
  id: string
  title: string
  content: ReactNode
}

const sectionTitle = 'text-base font-bold text-slate-900 dark:text-white mt-5 mb-2'
const formula =
  'my-3 rounded-xl bg-slate-200/70 px-4 py-3 font-mono text-sm text-slate-800 dark:bg-slate-800/80 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap'
const paragraph = 'text-sm leading-relaxed text-slate-700 dark:text-slate-300 mb-2'

export function getKmpTheory(t: TFunction): TheoryEntry {
  return {
    id: 'kmp',
    title: t('theory.kmp.title'),
    content: (
      <>
        <h3 className={sectionTitle}>{t('theory.kmp.prefixTitle')}</h3>
        <p className={paragraph}>{t('theory.kmp.prefixDefinition')}</p>
        <div className={formula}>
          {'LPS[q] = max { k : k < q + 1 and P[0..k-1] is a suffix of P[0..q] }'}
        </div>
        <p className={paragraph}>{t('theory.kmp.prefixWords')}</p>

        <h3 className={sectionTitle}>{t('theory.kmp.invariantTitle')}</h3>
        <p className={paragraph}>{t('theory.kmp.invariant')}</p>
        <div className={formula}>{'T[i - j .. i - 1] = P[0 .. j - 1]'}</div>
        <p className={paragraph}>{t('theory.kmp.mismatch')}</p>

        <h3 className={sectionTitle}>{t('theory.common.timeComplexity')}</h3>
        <div className={formula}>{t('theory.kmp.time')}</div>

        <h3 className={sectionTitle}>{t('theory.common.spaceComplexity')}</h3>
        <div className={formula}>{t('theory.kmp.space')}</div>

        <h3 className={sectionTitle}>{t('theory.kmp.correctnessTitle')}</h3>
        <p className={paragraph}>{t('theory.kmp.correctness')}</p>
      </>
    ),
  }
}

export function getRabinKarpTheory(t: TFunction): TheoryEntry {
  return {
    id: 'rabin-karp',
    title: t('theory.rabinKarp.title'),
    content: (
      <>
        <h3 className={sectionTitle}>{t('theory.rabinKarp.hashTitle')}</h3>
        <p className={paragraph}>{t('theory.rabinKarp.hash')}</p>
        <div className={formula}>
          {'H(S[0..m-1]) = ( S[0]*b^(m-1) + S[1]*b^(m-2) + ... + S[m-1]*b^0 ) mod q'}
        </div>

        <h3 className={sectionTitle}>{t('theory.rabinKarp.rollingTitle')}</h3>
        <p className={paragraph}>{t('theory.rabinKarp.rolling')}</p>
        <div className={formula}>
          {'H(T[s+1..s+m]) = ( b * ( H(T[s..s+m-1]) - T[s]*b^(m-1) ) + T[s+m] ) mod q'}
        </div>
        <p className={paragraph}>{t('theory.rabinKarp.avoids')}</p>

        <h3 className={sectionTitle}>{t('theory.rabinKarp.collisionTitle')}</h3>
        <p className={paragraph}>{t('theory.rabinKarp.collision')}</p>

        <h3 className={sectionTitle}>{t('theory.common.timeComplexity')}</h3>
        <div className={formula}>{t('theory.rabinKarp.time')}</div>

        <h3 className={sectionTitle}>{t('theory.common.spaceComplexity')}</h3>
        <div className={formula}>{t('theory.rabinKarp.space')}</div>

        <h3 className={sectionTitle}>{t('theory.rabinKarp.notesTitle')}</h3>
        <p className={paragraph}>{t('theory.rabinKarp.notes')}</p>
      </>
    ),
  }
}

export function getZFunctionTheory(t: TFunction): TheoryEntry {
  return {
    id: 'z-function',
    title: t('theory.zFunction.title'),
    content: (
      <>
        <h3 className={sectionTitle}>{t('theory.zFunction.definitionTitle')}</h3>
        <p className={paragraph}>{t('theory.zFunction.definition')}</p>
        <div className={formula}>{t('theory.zFunction.definitionFormula')}</div>

        <h3 className={sectionTitle}>{t('theory.zFunction.zBoxTitle')}</h3>
        <p className={paragraph}>{t('theory.zFunction.zBox')}</p>
        <div className={formula}>{t('theory.zFunction.zBoxFormula')}</div>

        <h3 className={sectionTitle}>{t('theory.zFunction.searchTitle')}</h3>
        <p className={paragraph}>{t('theory.zFunction.search')}</p>
        <div className={formula}>{t('theory.zFunction.searchFormula')}</div>

        <h3 className={sectionTitle}>{t('theory.common.timeComplexity')}</h3>
        <div className={formula}>{t('theory.zFunction.time')}</div>

        <h3 className={sectionTitle}>{t('theory.common.spaceComplexity')}</h3>
        <div className={formula}>{t('theory.zFunction.space')}</div>

        <h3 className={sectionTitle}>{t('theory.zFunction.amortizedTitle')}</h3>
        <p className={paragraph}>{t('theory.zFunction.amortized')}</p>
      </>
    ),
  }
}
