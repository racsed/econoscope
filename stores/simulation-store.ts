import { create } from 'zustand';

interface SimulationState {
  values: Record<string, number | boolean | string>;
  activeScenarioId: string | null;
  comparisonValues: Record<string, number | boolean | string> | null;
  isComparing: boolean;
  isProjectionMode: boolean;
  setValues: (values: Record<string, number | boolean | string>) => void;
  setValue: (key: string, value: number | boolean | string) => void;
  setActiveScenario: (id: string | null) => void;
  setComparisonValues: (values: Record<string, number | boolean | string> | null) => void;
  toggleComparison: () => void;
  toggleProjectionMode: () => void;
  reset: (defaults: Record<string, number | boolean | string>) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  values: {},
  activeScenarioId: null,
  comparisonValues: null,
  isComparing: false,
  isProjectionMode: false,

  setValues: (values) => set({ values, activeScenarioId: null }),

  setValue: (key, value) =>
    set((state) => ({
      values: { ...state.values, [key]: value },
      activeScenarioId: null,
    })),

  setActiveScenario: (id) => set({ activeScenarioId: id }),

  setComparisonValues: (values) => set({ comparisonValues: values }),

  toggleComparison: () =>
    set((state) => ({
      isComparing: !state.isComparing,
      comparisonValues: state.isComparing ? null : { ...state.values },
    })),

  toggleProjectionMode: () =>
    set((state) => ({ isProjectionMode: !state.isProjectionMode })),

  reset: (defaults) =>
    set({
      values: defaults,
      activeScenarioId: null,
      comparisonValues: null,
      isComparing: false,
    }),
}));
