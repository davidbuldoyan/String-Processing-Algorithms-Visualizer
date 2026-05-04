import { useTranslation } from 'react-i18next'
import { generateRabinKarpSteps } from '../../algorithms/rabinKarp'
import { RabinKarpPanel } from '../../components/algorithm-panels/RabinKarpPanel'
import { AlgorithmPageShell } from '../../components/layout/AlgorithmPageShell'
import { PseudocodePanel } from '../../components/shared/PseudocodePanel'
import { getRabinKarpTheory } from '../../data/theoryContent'
import { RABIN_KARP_PSEUDOCODE } from '../../data/pseudocode'

export function RabinKarp() {
  const { t } = useTranslation()
  const theory = getRabinKarpTheory(t)

  return (
    <AlgorithmPageShell
      title={t('pages.rabinKarp.title')}
      description={t('pages.rabinKarp.description')}
      stepMode="pair"
      showPatternField
      showPatternRow
      customStepBuilder={generateRabinKarpSteps}
      sampleKinds={['rabinKarp']}
      theoryTitle={theory.title}
      theoryContent={theory.content}
      belowVisualizer={
        <>
          <RabinKarpPanel />
          <PseudocodePanel pseudocode={RABIN_KARP_PSEUDOCODE} />
        </>
      }
    />
  )
}
