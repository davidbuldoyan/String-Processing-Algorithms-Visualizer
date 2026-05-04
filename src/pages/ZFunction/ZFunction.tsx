import { useTranslation } from 'react-i18next'
import { generateZFunctionSteps } from '../../algorithms/zFunction'
import { ZFunctionPanel } from '../../components/algorithm-panels/ZFunctionPanel'
import { AlgorithmPageShell } from '../../components/layout/AlgorithmPageShell'
import { PseudocodePanel } from '../../components/shared/PseudocodePanel'
import { getZFunctionTheory } from '../../data/theoryContent'
import { Z_FUNCTION_PSEUDOCODE } from '../../data/pseudocode'

export function ZFunction() {
  const { t } = useTranslation()
  const theory = getZFunctionTheory(t)

  return (
    <AlgorithmPageShell
      title={t('pages.zFunction.title')}
      description={t('pages.zFunction.description')}
      stepMode="textOnly"
      showPatternField={false}
      showPatternRow={false}
      customStepBuilder={(t) => generateZFunctionSteps(t)}
      sampleKinds={['z']}
      theoryTitle={theory.title}
      theoryContent={theory.content}
      belowVisualizer={
        <>
          <ZFunctionPanel />
          <PseudocodePanel pseudocode={Z_FUNCTION_PSEUDOCODE} />
        </>
      }
    />
  )
}
