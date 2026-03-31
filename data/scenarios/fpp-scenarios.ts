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
    id: 'equilibre-initial',
    title: 'Equilibre 50/50',
    description: "Repartition egale des ressources entre les deux biens.",
    ressourcesTotales: 500,
    productiviteA: 5,
    productiviteB: 3,
    allocationA: 50,
    explanation:
      "Avec une allocation egale, l'economie produit les deux biens de maniere equilibree. Le cout d'opportunite est modere dans les deux directions.",
  },
  {
    id: 'specialisation-bien-a',
    title: 'Specialisation dans le bien A',
    description: "L'economie consacre la quasi-totalite de ses ressources au bien A.",
    ressourcesTotales: 500,
    productiviteA: 5,
    productiviteB: 3,
    allocationA: 95,
    explanation:
      "Proche de la specialisation totale, le cout d'opportunite de chaque unite supplementaire de A est tres eleve car il faut renoncer a beaucoup de B. La concavite de la FPP illustre ce rendement decroissant.",
  },
  {
    id: 'sous-utilisation',
    title: 'Sous-utilisation des ressources',
    description: "Faible allocation (chomage ou gaspillage des ressources).",
    ressourcesTotales: 500,
    productiviteA: 5,
    productiviteB: 3,
    allocationA: 15,
    explanation:
      "Avec seulement 15% des ressources allouees au bien A, la production de A est faible. Si le point se situe a l'interieur de la frontiere, cela revele une inefficience (chomage, sous-emploi des capacites).",
  },
  {
    id: 'progres-technique',
    title: 'Progres technique (FPP elargie)',
    description: "Une innovation technologique augmente les productivites.",
    ressourcesTotales: 500,
    productiviteA: 8,
    productiviteB: 6,
    allocationA: 50,
    explanation:
      "Le progres technique deplace la FPP vers l'exterieur : l'economie peut produire davantage des deux biens avec les memes ressources. C'est le moteur de la croissance economique a long terme.",
  },
  {
    id: 'economie-de-guerre',
    title: 'Economie de guerre',
    description: "Ressources abondantes mais fortement orientees vers un seul bien.",
    ressourcesTotales: 1000,
    productiviteA: 7,
    productiviteB: 2,
    allocationA: 85,
    explanation:
      "En periode de guerre, l'economie realloue massivement ses ressources vers la production militaire (bien A), sacrifiant la production civile (bien B). Le cout d'opportunite de cette reallocation est visible sur la FPP.",
  },
];

export function getFppScenario(id: string): FppScenario | undefined {
  return fppScenarios.find((s) => s.id === id);
}
