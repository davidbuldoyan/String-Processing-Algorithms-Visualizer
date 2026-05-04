import { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ReactFlow,
  Handle,
  Position,
  type NodeProps,
  type EdgeProps,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useVisualizerStore } from "../../store/visualizerStore";
import { useThemeStore } from "../../store/themeStore";
import { parseKmpStepExtra } from "../../types/kmpExtra";
import { buildKmpDFA, type KmpDFA } from "../../algorithms/kmpAutomaton";

const NODE_SIZE = 48;
const NODE_R = NODE_SIZE / 2;
const BASE_SPACING = 100;
const MIN_SPACING = 68;

/* ------------------------------------------------------------------ */
/*  Custom node                                                       */
/* ------------------------------------------------------------------ */

type DFAStateData = {
  label: string;
  stateId: number;
  isAccept: boolean;
  isActive: boolean;
  isAcceptActive: boolean;
};

function DFAStateNode({ data }: NodeProps<Node<DFAStateData>>) {
  const { label, stateId, isAccept, isActive, isAcceptActive } = data;
  const active = isActive || isAcceptActive;
  const color = isAcceptActive ? "#16a34a" : isActive ? "#2563eb" : "#94a3b8";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: NODE_SIZE, height: NODE_SIZE }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!opacity-0 !w-0 !h-0 !min-w-0 !min-h-0"
        id="left"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!opacity-0 !w-0 !h-0 !min-w-0 !min-h-0"
        id="right"
      />
      <Handle
        type="source"
        position={Position.Top}
        className="!opacity-0 !w-0 !h-0 !min-w-0 !min-h-0"
        id="top"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!opacity-0 !w-0 !h-0 !min-w-0 !min-h-0"
        id="top-target"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!opacity-0 !w-0 !h-0 !min-w-0 !min-h-0"
        id="bottom"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="!opacity-0 !w-0 !h-0 !min-w-0 !min-h-0"
        id="bottom-target"
      />

      <svg
        width={NODE_SIZE + 16}
        height={NODE_SIZE + 16}
        viewBox={`0 0 ${NODE_SIZE + 16} ${NODE_SIZE + 16}`}
        className="absolute"
        style={{ left: -8, top: -8, pointerEvents: "none" }}
      >
        {isAccept && (
          <circle
            cx={(NODE_SIZE + 16) / 2}
            cy={(NODE_SIZE + 16) / 2}
            r={NODE_R + 4}
            fill="none"
            stroke={color}
            strokeWidth={2}
            opacity={active ? 1 : 0.4}
          />
        )}
        <circle
          cx={(NODE_SIZE + 16) / 2}
          cy={(NODE_SIZE + 16) / 2}
          r={NODE_R}
          fill={active ? color : "transparent"}
          fillOpacity={active ? 0.18 : 0}
          stroke={color}
          strokeWidth={active ? 2.5 : 1.5}
          className="transition-colors"
        />
        {active && (
          <motion.circle
            cx={(NODE_SIZE + 16) / 2}
            cy={(NODE_SIZE + 16) / 2}
            r={NODE_R}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            initial={{ opacity: 0.6, r: NODE_R }}
            animate={{ opacity: 0, r: NODE_R + 14 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            key={`pulse-${stateId}-${isAcceptActive ? "a" : "n"}`}
          />
        )}
      </svg>

      <span
        className={[
          "relative z-10 text-xs font-bold select-none font-mono",
          active
            ? "text-slate-900 dark:text-white"
            : "text-slate-600 dark:text-slate-300",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom edges                                                      */
/* ------------------------------------------------------------------ */

function MatchEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps<Edge<{ char: string }>>) {
  const midX = (sourceX + targetX) / 2;
  const curveOffsetY = -30;
  const edgePath = `M ${sourceX},${sourceY} Q ${midX},${sourceY + curveOffsetY} ${targetX},${targetY}`;

  return (
    <>
      <defs>
        <marker
          id={`match-arrow-${id}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
        </marker>
      </defs>
      <path
        d={edgePath}
        fill="none"
        stroke="#16a34a"
        strokeWidth={2}
        markerEnd={`url(#match-arrow-${id})`}
        className="react-flow__edge-path"
      />
      <text
        x={midX}
        y={sourceY + curveOffsetY - 6}
        textAnchor="middle"
        className="fill-algo-match text-[11px] font-mono font-bold"
        style={{ pointerEvents: "none" }}
      >
        {data?.char ?? ""}
      </text>
    </>
  );
}

type SelfLoopData = { chars: string; isActive?: boolean; stepKey?: number };

function SelfLoopEdge({
  id,
  sourceX,
  sourceY,
  data,
}: EdgeProps<Edge<SelfLoopData>>) {
  const loopR = 16;
  const cx = sourceX;
  const cy = sourceY - loopR - 4;
  const active = data?.isActive ?? false;
  const strokeColor = active ? "#2563eb" : "#94a3b8";

  const edgePath = [
    `M ${cx - 6},${sourceY}`,
    `C ${cx - 18},${cy - loopR}`,
    `${cx + 18},${cy - loopR}`,
    `${cx + 6},${sourceY}`,
  ].join(" ");

  return (
    <>
      <defs>
        <marker
          id={`self-arrow-${id}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={strokeColor} />
        </marker>
      </defs>

      {active && (
        <motion.path
          d={edgePath}
          fill="none"
          stroke="#2563eb"
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.18}
          className="react-flow__edge-path"
          initial={{ opacity: 0.35 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          key={`self-glow-${id}-${data?.stepKey}`}
        />
      )}

      <motion.path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={active ? 2 : 1.3}
        strokeDasharray={active ? "6,4" : "3,2"}
        markerEnd={`url(#self-arrow-${id})`}
        className="react-flow__edge-path"
        initial={false}
        animate={
          active
            ? { strokeDashoffset: [0, -20] }
            : { strokeDashoffset: 0 }
        }
        transition={
          active
            ? { duration: 0.6, ease: "linear", repeat: Infinity }
            : { duration: 0.2 }
        }
        key={`self-path-${id}-${active}`}
      />

      <text
        x={cx}
        y={cy - loopR - 2}
        textAnchor="middle"
        className={
          active
            ? "fill-blue-500 dark:fill-blue-400 text-[10px] font-mono font-bold"
            : "fill-slate-500 dark:fill-slate-400 text-[10px] font-mono font-semibold"
        }
        style={{ pointerEvents: "none" }}
      >
        {data?.chars ?? ""}
      </text>
    </>
  );
}

type FallbackTransitionData = {
  char: string;
  stepKey: number;
  isSelfLoop: boolean;
};

function FallbackTransitionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps<Edge<FallbackTransitionData>>) {
  const char = data?.char ?? "";
  const stepKey = data?.stepKey ?? 0;
  const isSelfLoop = data?.isSelfLoop ?? false;
  const color = "#f59e0b";

  if (isSelfLoop) {
    const loopR = 20;
    const cx = sourceX;
    const cy = sourceY + loopR + 4;
    const edgePath = [
      `M ${cx - 7},${sourceY}`,
      `C ${cx - 24},${cy + loopR}`,
      `${cx + 24},${cy + loopR}`,
      `${cx + 7},${sourceY}`,
    ].join(" ");

    return (
      <>
        <defs>
          <marker
            id={`fb-arrow-${id}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </marker>
        </defs>
        <motion.path
          d={edgePath}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeDasharray="6,3"
          markerEnd={`url(#fb-arrow-${id})`}
          className="react-flow__edge-path"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85, strokeDashoffset: [0, -18] }}
          transition={{
            opacity: { duration: 0.25 },
            strokeDashoffset: {
              duration: 0.6,
              ease: "linear",
              repeat: Infinity,
            },
          }}
          key={`fb-self-${stepKey}`}
        />
        <motion.text
          x={cx}
          y={cy + loopR + 12}
          textAnchor="middle"
          className="text-[10px] font-mono font-bold"
          fill={color}
          style={{ pointerEvents: "none" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          key={`fb-self-lbl-${stepKey}`}
        >
          {char}
        </motion.text>
      </>
    );
  }

  const midX = (sourceX + targetX) / 2;
  const curveOffsetY = 40;
  const edgePath = `M ${sourceX},${sourceY} Q ${midX},${Math.max(sourceY, targetY) + curveOffsetY} ${targetX},${targetY}`;

  return (
    <>
      <defs>
        <marker
          id={`fb-arrow-${id}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <motion.path
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray="6,3"
        markerEnd={`url(#fb-arrow-${id})`}
        className="react-flow__edge-path"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85, strokeDashoffset: [0, -18] }}
        transition={{
          opacity: { duration: 0.3 },
          strokeDashoffset: {
            duration: 0.6,
            ease: "linear",
            repeat: Infinity,
          },
        }}
        key={`fb-path-${stepKey}`}
      />
      <motion.text
        x={midX}
        y={Math.max(sourceY, targetY) + curveOffsetY + 14}
        textAnchor="middle"
        className="text-[11px] font-mono font-bold"
        fill={color}
        style={{ pointerEvents: "none" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        key={`fb-lbl-${stepKey}`}
      >
        {char}
      </motion.text>
    </>
  );
}

const nodeTypes = { dfaState: DFAStateNode };
const edgeTypes = {
  match: MatchEdge,
  selfLoop: SelfLoopEdge,
  fallbackTransition: FallbackTransitionEdge,
};

/* ------------------------------------------------------------------ */
/*  Transition table (unchanged)                                      */
/* ------------------------------------------------------------------ */

function DFATransitionTable({
  dfa,
  activeState,
}: {
  dfa: KmpDFA;
  activeState: number;
}) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-0 border-separate border-spacing-0 text-center text-xs">
        <thead>
          <tr>
            <th className="rounded-tl-lg bg-slate-100/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
              {t("panels.kmp.state")}
            </th>
            {dfa.alphabet.map((c) => (
              <th
                key={c}
                className="bg-slate-100/70 px-3 py-1.5 font-mono font-semibold text-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
              >
                '{c}'
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dfa.nodes.map((node) => (
            <tr
              key={node.id}
              className={
                node.id === activeState
                  ? "bg-algo-window/15 dark:bg-algo-window/20"
                  : ""
              }
            >
              <td
                className={[
                  "border-t border-slate-200/60 px-3 py-1.5 font-mono font-bold dark:border-slate-700/60",
                  node.id === activeState
                    ? "text-algo-window dark:text-blue-300"
                    : "text-slate-700 dark:text-slate-200",
                  node.isAccept
                    ? "underline decoration-algo-match decoration-2 underline-offset-2"
                    : "",
                ].join(" ")}
              >
                q{node.id}
              </td>
              {dfa.alphabet.map((c) => {
                const target = dfa.transitionTable[node.id].get(c)!;
                const isMatch = target === node.id + 1;
                return (
                  <td
                    key={c}
                    className={[
                      "border-t border-slate-200/60 px-3 py-1.5 font-mono dark:border-slate-700/60",
                      isMatch
                        ? "font-bold text-algo-match"
                        : "text-slate-500 dark:text-slate-400",
                    ].join(" ")}
                  >
                    q{target}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function KMPAutomatonGraph() {
  const { t } = useTranslation();
  const theme = useThemeStore((s) => s.theme);
  const pattern = useVisualizerStore((s) => s.pattern);
  const text = useVisualizerStore((s) => s.text);
  const steps = useVisualizerStore((s) => s.steps);
  const currentStepIndex = useVisualizerStore((s) => s.currentStepIndex);

  const step = steps[currentStepIndex];
  const kmp = parseKmpStepExtra(
    step?.extraData as Record<string, unknown> | undefined,
  );

  const dfa = useMemo(() => {
    if (pattern.length === 0) return null;
    return buildKmpDFA(pattern);
  }, [pattern]);

  const m = pattern.length;
  const isSearchPhase =
    kmp && (kmp.phase === "search" || kmp.phase === "complete");

  let activeState = -1;
  let isAcceptActive = false;
  if (isSearchPhase && step) {
    if (step.action === "kmp:match") {
      activeState = m;
      isAcceptActive = true;
    } else {
      activeState = step.patternIndex;
    }
  }

  let selfLoopActiveState = -1;
  if (isSearchPhase && step && dfa && activeState >= 0 && activeState <= m) {
    if (step.action === "kmp:advance-i") {
      selfLoopActiveState = 0;
    } else if (step.action === "kmp:compare" && step.textIndex < text.length) {
      const textChar = text[step.textIndex];
      const nextState = dfa.transitionTable[activeState]?.get(textChar);
      if (nextState === activeState) {
        selfLoopActiveState = activeState;
      }
    }
  }

  let fallbackTransition: {
    from: number;
    to: number;
    char: string;
  } | null = null;
  if (
    isSearchPhase &&
    step &&
    dfa &&
    kmp?.lps &&
    activeState >= 0 &&
    activeState < m
  ) {
    const ti = step.textIndex;
    if (ti >= 0 && ti < text.length) {
      const textChar = text[ti];

      if (textChar !== pattern[activeState]) {
        const nextState =
          activeState > 0 ? kmp.lps[activeState - 1] : 0;
        const isExistingSelfLoop =
          nextState === activeState && dfa.alphabet.includes(textChar);

        if (!isExistingSelfLoop) {
          fallbackTransition = {
            from: activeState,
            to: nextState,
            char: textChar,
          };
        }
      }
    }
  }
  const fallbackKey = fallbackTransition
    ? `${fallbackTransition.from}:${fallbackTransition.to}:${fallbackTransition.char}`
    : "";

  const { nodes, edges, containerHeight } = useMemo(() => {
    if (!dfa)
      return { nodes: [] as Node[], edges: [] as Edge[], containerHeight: 200 };

    const stateCount = dfa.nodes.length;
    const spacingX = Math.max(
      MIN_SPACING,
      Math.min(BASE_SPACING, 520 / stateCount),
    );

    const selfLoopHeadroom = 50;
    const centerY = selfLoopHeadroom + NODE_R;

    const rfNodes: Node<DFAStateData>[] = dfa.nodes.map((node) => ({
      id: String(node.id),
      type: "dfaState",
      position: { x: node.id * spacingX, y: centerY - NODE_R },
      data: {
        label: `q${node.id}`,
        stateId: node.id,
        isAccept: node.isAccept,
        isActive:
          isSearchPhase !== undefined &&
          !!isSearchPhase &&
          node.id === activeState &&
          !isAcceptActive,
        isAcceptActive: isAcceptActive && node.id === activeState,
      },
      draggable: false,
      selectable: false,
      connectable: false,
    }));

    const rfEdges: Edge[] = [];

    const selfLoopChars: Map<number, string[]> = new Map();

    for (const edge of dfa.edges) {
      if (edge.kind === "match") {
        rfEdges.push({
          id: `match-${edge.from}-${edge.to}`,
          source: String(edge.from),
          target: String(edge.to),
          sourceHandle: "right",
          targetHandle: "left",
          type: "match",
          data: { char: edge.char },
        });
      } else if (edge.kind === "self-loop") {
        const existing = selfLoopChars.get(edge.from) ?? [];
        existing.push(edge.char);
        selfLoopChars.set(edge.from, existing);
      }
    }

    for (const [state, chars] of selfLoopChars) {
      rfEdges.push({
        id: `self-${state}`,
        source: String(state),
        target: String(state),
        sourceHandle: "top",
        targetHandle: "top-target",
        type: "selfLoop",
        data: {
          chars: chars.join(","),
          isActive: selfLoopActiveState === state,
          stepKey: selfLoopActiveState === state ? currentStepIndex : 0,
        },
      });
    }

    if (fallbackTransition) {
      const isSelfLoop = fallbackTransition.from === fallbackTransition.to;
      rfEdges.push({
        id: `fallback-trans-${currentStepIndex}`,
        source: String(fallbackTransition.from),
        target: String(fallbackTransition.to),
        sourceHandle: "bottom",
        targetHandle: "bottom-target",
        type: "fallbackTransition",
        data: {
          char: fallbackTransition.char,
          stepKey: currentStepIndex,
          isSelfLoop,
        },
      });
    }

    const hasSelfLoops = selfLoopChars.size > 0;
    const topSpacerY = hasSelfLoops ? -selfLoopHeadroom : centerY - NODE_R;
    const fallbackDepth = fallbackTransition ? 70 : 0;
    const bottomSpacerY = centerY + NODE_R + fallbackDepth;
    const graphMidX = ((stateCount - 1) * spacingX) / 2;

    rfNodes.push({
      id: "__spacer_top",
      type: "dfaState",
      position: { x: graphMidX, y: topSpacerY },
      data: {
        label: "",
        stateId: -1,
        isAccept: false,
        isActive: false,
        isAcceptActive: false,
      },
      hidden: true,
      draggable: false,
      selectable: false,
      connectable: false,
    });
    rfNodes.push({
      id: "__spacer_bottom",
      type: "dfaState",
      position: { x: graphMidX, y: bottomSpacerY },
      data: {
        label: "",
        stateId: -1,
        isAccept: false,
        isActive: false,
        isAcceptActive: false,
      },
      hidden: true,
      draggable: false,
      selectable: false,
      connectable: false,
    });

    const totalHeight = bottomSpacerY - topSpacerY + NODE_SIZE;
    const cHeight = Math.max(Math.min(totalHeight + 20, 340), 180);

    return {
      nodes: rfNodes,
      edges: rfEdges,
      containerHeight: cHeight,
    };
  }, [dfa, activeState, isAcceptActive, isSearchPhase, m, selfLoopActiveState, currentStepIndex, fallbackKey, fallbackTransition]);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);
  const fitViewOpts = useMemo(
    () => ({ padding: 0.12, includeHiddenNodes: true }),
    [],
  );
  const onInit = useCallback(
    (instance: { fitView: (opts?: object) => void }) => {
      requestAnimationFrame(() => instance.fitView(fitViewOpts));
    },
    [fitViewOpts],
  );

  if (!dfa || !kmp || pattern.length === 0) return null;

  return (
    <div className="glass-panel space-y-4 p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          {t("panels.kmp.automaton")}
        </h3>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {isSearchPhase ? (
            <>
              {t("panels.kmp.currentState")}{" "}
              <span
                className={`font-mono ${isAcceptActive ? "text-algo-match" : "text-algo-window dark:text-blue-300"}`}
              >
                q{activeState}
                {isAcceptActive ? ` (${t("panels.kmp.match")})` : ""}
              </span>
            </>
          ) : (
            t("panels.kmp.activatesDuringSearch")
          )}
        </span>
      </div>

      <div
        className="overflow-hidden rounded-xl border border-slate-200/70 bg-white/50 dark:border-slate-700/70 dark:bg-slate-950/50 w-full"
        style={{ height: containerHeight }}
      >
        <ReactFlow
          key={`dfa-${pattern}`}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          colorMode={theme}
          proOptions={proOptions}
          onInit={onInit}
          fitView
          fitViewOptions={{ padding: 0.12, includeHiddenNodes: true }}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          minZoom={0.05}
          maxZoom={1.5}
          className="!bg-transparent"
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t("panels.kmp.transitionTable")}
        </p>
        <DFATransitionTable dfa={dfa} activeState={activeState} />
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded bg-algo-match" />{" "}
          {t("panels.kmp.legendMatch")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full border-2 border-algo-window" />{" "}
          {t("panels.kmp.legendActive")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full border-2 border-algo-match" />{" "}
          {t("panels.kmp.legendAccept")} (q{pattern.length})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded border-t-2 border-dashed border-amber-500" />{" "}
          {t("panels.kmp.legendFallbackTransition")}
        </span>
      </div>
    </div>
  );
}
