export interface FppScenario {
  id: string;
  title: string;
  description: string;
  ressourcesTotales: number;
  productiviteA: number;
  productiviteB: number;
  allocationA: number;
  explanation: string;
}

export const fppScenarios: FppScenario[] = [
  {
    id: 'équilibre-initial',
    title: 'Équilibre 50/50',
    description: "Repartition égale des ressources entre les deux biens.",
    ressourcesTotales: 500,
    productiviteA: 5,
    productiviteB: 3,
    allocationA: 50,
    explanation:
      "Avec une allocation égale, l'économie produit les deux biens de manière equilibree. Le coût d'opportunité est modéré dans les deux directions.",
  },
  {
    id: 'spécialisation-bien-a',
    title: 'Spécialisation dans le bien A',
    description: "L'économie consacré la quasi-totalite de ses ressources au bien A.",
    ressourcesTotales: 500,
    productiviteA: 5,
    productiviteB: 3,
    allocationA: 95,
    explanation:
      "Proche de la spécialisation totale, le coût d'opportunité de chaque unite supplémentaire de A est très élevé car il faut renoncer a beaucoup de B. La concavite de la FPP illustre ce rendement decroissant.",
  },
  {
    id: 'sous-utilisation',
    title: 'Sous-utilisation des ressources',
    description: "Faible allocation (chômage ou gaspillage des ressources).",
    ressourcesTotales: 500,
    productiviteA: 5,
    productiviteB: 3,
    allocationA: 15,
    explanation:
      "Avec seulement 15% des ressources allouees au bien A, la production de A est faible. Si le point se situe à l'intérieur de la frontière, cela révèle une inefficience (chômage, sous-emploi des capacités).",
  },
  {
    id: 'progrès-technique',
    title: 'Progrès technique (FPP élargie)',
    description: "Une innovation technologique augmente les productivités.",
    ressourcesTotales: 500,
    productiviteA: 8,
    productiviteB: 6,
    allocationA: 50,
    explanation:
      "Le progrès technique déplace la FPP vers l'exterieur : l'économie peut produire davantage des deux biens avec les mêmes ressources. C'est le moteur de la croissance économique à long terme.",
  },
  {
    id: 'économie-de-guerre',
    title: 'Économie de guerre',
    description: "Ressources abondantes mais fortement orientees vers un seul bien.",
    ressourcesTotales: 1000,
    productiviteA: 7,
    productiviteB: 2,
    allocationA: 85,
    explanation:
      "En période de guerre, l'économie realloue massivement ses ressources vers la production militaire (bien A), sacrifiant la production civile (bien B). Le coût d'opportunité de cette reallocation est visible sur la FPP.",
  },
];

export function getFppScenario(id: string): FppScenario | undefined {
  return fppScenarios.find((s) => s.id === id);
}
