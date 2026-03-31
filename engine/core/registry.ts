import type { SimulationModule } from '../types';

const moduleRegistry = new Map<string, SimulationModule>();

export function registerModule(mod: SimulationModule): void {
  moduleRegistry.set(mod.meta.slug, mod);
}

export function getModule(slug: string): SimulationModule | undefined {
  return moduleRegistry.get(slug);
}

export function getAllModules(): SimulationModule[] {
  return Array.from(moduleRegistry.values());
}

export function getModulesByTheme(theme: string): SimulationModule[] {
  return getAllModules().filter((m) => m.meta.theme === theme);
}

export function getModuleSlugs(): string[] {
  return Array.from(moduleRegistry.keys());
}

export { moduleRegistry };
