import { useTranslation } from "react-i18next";
import { useVisualizerStore } from "../../store/visualizerStore";
import { parseKmpStepExtra } from "../../types/kmpExtra";

/** LPS table + pointer readout for KMP steps (roadmap §3). Renders only when the current step carries KMP metadata. */
export function KMPAlgorithmPanel() {
  const { t } = useTranslation();
  const pattern = useVisualizerStore((s) => s.pattern);
  const steps = useVisualizerStore((s) => s.steps);
  const currentStepIndex = useVisualizerStore((s) => s.currentStepIndex);
  const step = steps[currentStepIndex];
  const kmp = parseKmpStepExtra(
    step?.extraData as Record<string, unknown> | undefined,
  );

  if (!kmp || pattern.length === 0) {
    return null;
  }

  const showLpsRow = kmp.lps.length > 0;
  const matchStarts = kmp.matchStarts ?? [];

  return (
    <div className="glass-panel space-y-4 p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          {t("panels.kmp.lpsTable")}
        </h3>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t("panels.phase")}:{" "}
          <span className="text-slate-800 dark:text-slate-200">
            {kmp.phase}
          </span>
        </span>
      </div>

      {showLpsRow ? (
        <div className="space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("panels.kmp.lpsValues")}
          </p>
          <div className="flex flex-wrap gap-1">
            {kmp.lps.map((v, idx) => (
              <div
                key={`lps-${idx}`}
                className="flex w-10 flex-col items-center rounded-lg border border-slate-200/80 bg-white/60 py-1 dark:border-slate-700 dark:bg-slate-900/50"
              >
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{idx}</span>
                <span className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-slate-200/70 bg-white/50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50">
        {kmp.phase === "lps" &&
        kmp.lpsI !== undefined &&
        kmp.lpsLen !== undefined ? (
          <p>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {t("panels.kmp.lpsBuild")}
            </span>{" "}
            {t("panels.kmp.patternIndices")} <span className="font-mono">i = {kmp.lpsI}</span>,{" "}
            <span className="font-mono">len = {kmp.lpsLen}</span> ({t("panels.kmp.compareBorder")}).
          </p>
        ) : kmp.phase === "search" || kmp.phase === "complete" ? (
          <p>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {t("panels.kmp.searchPointers")}
            </span>{" "}
            {t("panels.kmp.text")} <span className="font-mono">i = {step.textIndex}</span>,
            {t("panels.kmp.pattern")} <span className="font-mono">j = {step.patternIndex}</span>
            {kmp.matchStarts && kmp.matchStarts.length > 0 ? (
              <>
                {" "}
                · {t("panels.kmp.matchesAtStarts")}{" "}
                <span className="font-mono">
                  [{kmp.matchStarts.join(", ")}]
                </span>
              </>
            ) : null}
          </p>
        ) : (
          <p className="text-slate-600 dark:text-slate-300">
            {t("panels.kmp.fallback")}
          </p>
        )}
      </div>

      {kmp.phase === "complete" ? (
        <div className="rounded-xl border border-emerald-300/50 bg-emerald-50/50 px-4 py-3 dark:border-emerald-700/50 dark:bg-emerald-950/30">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            {t("panels.kmp.result")}
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {matchStarts.length > 0
              ? t("panels.kmp.resultMatches", { starts: matchStarts.join(", ") })
              : t("panels.kmp.resultNoMatches")}
          </p>
          {showLpsRow ? (
            <p className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-300">
              {t("panels.kmp.resultLps", { lps: kmp.lps.join(", ") })}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
