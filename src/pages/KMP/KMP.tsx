import { useTranslation } from 'react-i18next'
import { generateKMPSteps } from '../../algorithms/kmp'
import { KMPAlgorithmPanel } from '../../components/algorithm-panels/KMPAlgorithmPanel'
import { KMPAutomatonGraph } from '../../components/algorithm-panels/KMPAutomatonGraph'
import { AlgorithmPageShell } from '../../components/layout/AlgorithmPageShell'
import { PseudocodePanel } from '../../components/shared/PseudocodePanel'
import { getKmpTheory } from '../../data/theoryContent'
import { KMP_PSEUDOCODE } from '../../data/pseudocode'

export function KMP() {
  const { t } = useTranslation()
  const theory = getKmpTheory(t)

  return (
    <AlgorithmPageShell
      title={t('pages.kmp.title')}
      description={t('pages.kmp.description')}
      stepMode="pair"
      showPatternField
      showPatternRow
      customStepBuilder={generateKMPSteps}
      sampleKinds={['kmp']}
      theoryTitle={theory.title}
      theoryContent={theory.content}
      belowVisualizer={
        <>
          <KMPAlgorithmPanel />
          <KMPAutomatonGraph />
          <PseudocodePanel pseudocode={KMP_PSEUDOCODE} />
        </>
      }
    />
  )
}
