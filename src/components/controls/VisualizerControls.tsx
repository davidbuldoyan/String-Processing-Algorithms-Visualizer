import { useCallback, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useAnimationController } from "../../hooks/useAnimationController";
import type { PlaybackSpeed } from "../../store/visualizerStore";
import { useVisualizerStore } from "../../store/visualizerStore";
import type { VisualizerStep } from "../../types/visualizerStep";
import {
  createPlaceholderSteps,
  randomAlphabetString,
  SAMPLE_TEXTS,
} from "../../utils/demoSteps";

export type VisualizerControlsProps = {
  /** `textOnly` skips pattern for Z-style demos. */
  stepMode?: "pair" | "textOnly";
  showPatternField?: boolean;
  showAlgorithmPicker?: boolean;
  /** When set (e.g. KMP page), replaces placeholder step generation. */
  customStepBuilder?: (text: string, pattern: string) => VisualizerStep[];
  /** Which quick-load samples to show. Default: both. */
  sampleKinds?: ("kmp" | "rabinKarp" | "z")[];
};

const speeds: PlaybackSpeed[] = [0.5, 1, 2];

export function VisualizerControls({
  stepMode = "pair",
  showPatternField = true,
  showAlgorithmPicker = false,
  customStepBuilder,
  sampleKinds = ["kmp", "z"],
}: VisualizerControlsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { play, pause, next, previous, reset } = useAnimationController();

  const text = useVisualizerStore((s) => s.text);
  const pattern = useVisualizerStore((s) => s.pattern);
  const steps = useVisualizerStore((s) => s.steps);
  const currentStepIndex = useVisualizerStore((s) => s.currentStepIndex);
  const isPlaying = useVisualizerStore((s) => s.isPlaying);
  const playbackSpeed = useVisualizerStore((s) => s.playbackSpeed);
  const setText = useVisualizerStore((s) => s.setText);
  const setPattern = useVisualizerStore((s) => s.setPattern);
  const setSteps = useVisualizerStore((s) => s.setSteps);
  const setCurrentStepIndex = useVisualizerStore((s) => s.setCurrentStepIndex);
  const setPlaybackSpeed = useVisualizerStore((s) => s.setPlaybackSpeed);
  const setIsPlaying = useVisualizerStore((s) => s.setIsPlaying);

  const computeSteps = useCallback(() => {
    if (customStepBuilder) {
      return customStepBuilder(text, pattern);
    }
    return createPlaceholderSteps(text, pattern, stepMode);
  }, [customStepBuilder, pattern, stepMode, text]);

  const buildSteps = useCallback(() => {
    setIsPlaying(false);
    setSteps(computeSteps());
  }, [computeSteps, setIsPlaying, setSteps]);

  const applySample = useCallback(
    (kind: "kmp" | "rabinKarp" | "z") => {
      setIsPlaying(false);
      if (kind === "kmp") {
        setText(SAMPLE_TEXTS.kmp);
        setPattern(SAMPLE_TEXTS.pattern);
        setSteps(
          customStepBuilder
            ? customStepBuilder(SAMPLE_TEXTS.kmp, SAMPLE_TEXTS.pattern)
            : createPlaceholderSteps(
                SAMPLE_TEXTS.kmp,
                SAMPLE_TEXTS.pattern,
                "pair",
              ),
        );
      } else if (kind === "rabinKarp") {
        setText(SAMPLE_TEXTS.rabinKarp);
        setPattern(SAMPLE_TEXTS.rabinKarpPattern);
        setSteps(
          customStepBuilder
            ? customStepBuilder(
                SAMPLE_TEXTS.rabinKarp,
                SAMPLE_TEXTS.rabinKarpPattern,
              )
            : createPlaceholderSteps(
                SAMPLE_TEXTS.rabinKarp,
                SAMPLE_TEXTS.rabinKarpPattern,
                "pair",
              ),
        );
      } else {
        setText(SAMPLE_TEXTS.z);
        setPattern("");
        setSteps(
          customStepBuilder
            ? customStepBuilder(SAMPLE_TEXTS.z, "")
            : createPlaceholderSteps(SAMPLE_TEXTS.z, "", "textOnly"),
        );
      }
    },
    [customStepBuilder, setIsPlaying, setPattern, setSteps, setText],
  );

  const randomize = useCallback(() => {
    setIsPlaying(false);
    const t = randomAlphabetString(10 + Math.floor(Math.random() * 8));
    const p = randomAlphabetString(2 + Math.floor(Math.random() * 4));
    setText(t);
    if (showPatternField) {
      setPattern(p);
      setSteps(
        customStepBuilder
          ? customStepBuilder(t, p)
          : createPlaceholderSteps(t, p, stepMode),
      );
    } else {
      setPattern("");
      setSteps(
        customStepBuilder
          ? customStepBuilder(t, "")
          : createPlaceholderSteps(t, "", "textOnly"),
      );
    }
  }, [
    customStepBuilder,
    setIsPlaying,
    setPattern,
    setSteps,
    setText,
    showPatternField,
    stepMode,
  ]);

  const showKmpSample = sampleKinds.includes("kmp");
  const showRabinKarpSample = sampleKinds.includes("rabinKarp");
  const showZSample = sampleKinds.includes("z");

  const lastIndex = Math.max(0, steps.length - 1);

  return (
    <div className="glass-panel space-y-5 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            {t("controls.text")}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 shadow-inner outline-none ring-algo-window/30 focus:ring-2 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:ring-algo-window/50"
              spellCheck={false}
            />
          </label>
          {showPatternField ? (
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("controls.pattern")}
              <input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 shadow-inner outline-none ring-algo-window/30 focus:ring-2 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:ring-algo-window/50"
                spellCheck={false}
              />
            </label>
          ) : null}
        </div>

        {showAlgorithmPicker ? (
          <AlgorithmDropdown
            value={
              location.pathname.includes("rabin")
                ? "rabin"
                : location.pathname.includes("z-function")
                  ? "z"
                  : "kmp"
            }
            onChange={(v) => {
              if (v === "kmp") navigate("/kmp");
              if (v === "rabin") navigate("/rabin-karp");
              if (v === "z") navigate("/z-function");
            }}
          />
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={buildSteps}
          className="rounded-lg bg-algo-window px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
        >
          {t("controls.buildSteps")}
        </button>
        {showKmpSample ? (
          <button
            type="button"
            onClick={() => applySample("kmp")}
            className="rounded-lg border border-slate-200/80 bg-white/60 px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            {t("controls.sampleKmp")}
          </button>
        ) : null}
        {showRabinKarpSample ? (
          <button
            type="button"
            onClick={() => applySample("rabinKarp")}
            className="rounded-lg border border-slate-200/80 bg-white/60 px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            {t("controls.sampleRabinKarp")}
          </button>
        ) : null}
        {showZSample ? (
          <button
            type="button"
            onClick={() => applySample("z")}
            className="rounded-lg border border-slate-200/80 bg-white/60 px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            {t("controls.sampleZ")}
          </button>
        ) : null}
        <button
          type="button"
          onClick={randomize}
          className="rounded-lg border border-slate-200/80 bg-white/60 px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900"
        >
          {t("controls.random")}
        </button>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-200/60 pt-4 dark:border-slate-700/60">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t("controls.speed")}
          </span>
          {speeds.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setPlaybackSpeed(s)}
              className={[
                "rounded-md px-2.5 py-1 text-sm font-medium transition",
                playbackSpeed === s
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
              ].join(" ")}
            >
              {s}×
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {!isPlaying ? (
            <button
              type="button"
              onClick={play}
              disabled={steps.length === 0}
              className="rounded-lg bg-algo-match px-4 py-2 text-sm font-semibold text-white shadow-sm transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("controls.play")}
            </button>
          ) : (
            <button
              type="button"
              onClick={pause}
              className="rounded-lg bg-algo-hash px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              {t("controls.pause")}
            </button>
          )}
          <button
            type="button"
            onClick={previous}
            disabled={currentStepIndex <= 0 || steps.length === 0}
            className="rounded-lg border border-slate-200/80 bg-white/60 px-3 py-2 text-sm font-medium transition enabled:hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900/60 dark:enabled:hover:bg-slate-900"
          >
            {t("controls.previous")}
          </button>
          <button
            type="button"
            onClick={next}
            disabled={currentStepIndex >= lastIndex || steps.length === 0}
            className="rounded-lg border border-slate-200/80 bg-white/60 px-3 py-2 text-sm font-medium transition enabled:hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900/60 dark:enabled:hover:bg-slate-900"
          >
            {t("controls.next")}
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={steps.length === 0}
            className="rounded-lg border border-algo-mismatch/40 bg-algo-mismatch/10 px-3 py-2 text-sm font-medium text-algo-mismatch transition enabled:hover:bg-algo-mismatch/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("controls.reset")}
          </button>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>{t("controls.step")}</span>
            <span>
              {steps.length === 0
                ? "—"
                : `${currentStepIndex + 1} / ${steps.length}`}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={lastIndex}
            value={steps.length ? currentStepIndex : 0}
            disabled={steps.length === 0}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStepIndex(Number(e.target.value));
            }}
            className="w-full accent-algo-window dark:accent-blue-400 disabled:opacity-40"
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom Algorithm Dropdown                                         */
/* ------------------------------------------------------------------ */

const ALGO_OPTIONS = [
  { value: "kmp", label: "Knuth-Morris-Pratt" },
  { value: "rabin", label: "Rabin-Karp" },
  { value: "z", label: "Z-function" },
] as const;

function AlgorithmDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = ALGO_OPTIONS.find((o) => o.value === value) ?? ALGO_OPTIONS[0];

  return (
    <div ref={ref} className="relative min-w-[12rem]">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {t("controls.algorithm")}
      </span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-medium shadow-sm backdrop-blur transition-all",
          open
            ? "border-algo-window/50 bg-algo-window/10 text-algo-window ring-2 ring-algo-window/20 dark:border-blue-400/50 dark:bg-blue-500/15 dark:text-blue-300"
            : "border-slate-200/80 bg-white/70 text-slate-900 hover:border-slate-300 hover:bg-white/90 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:hover:border-slate-600",
        ].join(" ")}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="flex-1 truncate">{current.label}</span>
        <svg
          className={["h-4 w-4 text-slate-400 dark:text-slate-500 transition-transform duration-200", open ? "rotate-180" : ""].join(" ")}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-0 z-50 mt-1.5 w-full origin-top animate-[dropdown-in_150ms_ease-out] rounded-xl border border-white/50 bg-white/90 p-1 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/95 dark:shadow-black/30"
          role="listbox"
          aria-activedescendant={current.value}
        >
          {ALGO_OPTIONS.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                id={opt.value}
                aria-selected={active}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={[
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-algo-window/12 text-algo-window dark:bg-blue-500/20 dark:text-blue-300"
                    : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-200 dark:hover:bg-slate-800/60",
                ].join(" ")}
              >
                <span className="flex-1 text-left">{opt.label}</span>
                {active && (
                  <svg className="h-4 w-4 shrink-0 text-algo-window dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
