export interface ComparativeAdvantageScenario {
  id: string;
  title: string;
  description: string;
  productivitePays1A: number;
  productivitePays1B: number;
  productivitePays2A: number;
  productivitePays2B: number;
  régime: 'autarcie' | 'libre-échange';
  explanation: string;
}

export const comparativeAdvantageScenarios: ComparativeAdvantageScenario[] = [
  {
    id: 'avantage-absolu-mutuel',
    title: 'Avantage absolu mutuel',
    description: "Chaque pays est le meilleur dans un bien différent.",
    productivitePays1A: 10,
    productivitePays1B: 4,
    productivitePays2A: 3,
    productivitePays2B: 12,
    régime: 'libre-échange',
    explanation:
      "Cas le plus intuitif : le pays 1 est meilleur en A, le pays 2 en B. Chacun se spécialisé dans son point fort. L'avantage absolu coïncide ici avec l'avantage comparatif.",
  },
  {
    id: 'ricardo-classique',
    title: 'Ricardo classique',
    description: "Un pays est plus productif partout, mais le commerce reste bénéfique.",
    productivitePays1A: 10,
    productivitePays1B: 5,
    productivitePays2A: 4,
    productivitePays2B: 8,
    régime: 'libre-échange',
    explanation:
      "Le pays 1 à un avantage absolu en A (10 > 4) mais le pays 2 à un avantage comparatif en B car son coût d'opportunité est plus faible (4/8 = 0,5 A par B contre 10/5 = 2 A par B pour le pays 1). Le commerce profite aux deux.",
  },
  {
    id: 'autarcie-vs-échange',
    title: 'Autarcie vs libre-échange',
    description: "Comparaison directe des deux regimes.",
    productivitePays1A: 12,
    productivitePays1B: 6,
    productivitePays2A: 5,
    productivitePays2B: 10,
    régime: 'autarcie',
    explanation:
      "En autarcie, chaque pays doit produire les deux biens. Passez en libre-échange pour observer les gains de la spécialisation : la production mondiale totale augmente pour au moins un bien sans diminuer pour l'autre.",
  },
  {
    id: 'productivité-identique',
    title: 'Productivites identiques',
    description: "Aucun avantage comparatif : le commerce n'apporte rien.",
    productivitePays1A: 6,
    productivitePays1B: 6,
    productivitePays2A: 6,
    productivitePays2B: 6,
    régime: 'libre-échange',
    explanation:
      "Quand les coûts d'opportunité sont identiques dans les deux pays, il n'y a pas d'avantage comparatif. Le libre-échange ne génère aucun gain. Ce cas théorique est rare dans la réalité.",
  },
  {
    id: 'pays-émergent-vs-développé',
    title: 'Pays émergent vs développé',
    description: "Écart de productivité important entre les deux pays.",
    productivitePays1A: 20,
    productivitePays1B: 15,
    productivitePays2A: 2,
    productivitePays2B: 3,
    régime: 'libre-échange',
    explanation:
      "Meme avec un écart de productivité considerable, le pays émergent (pays 2) conserve un avantage comparatif dans le bien B (coût d'opp. = 2/3 contre 20/15 = 4/3 pour le pays 1). C'est la puissance de la théorie ricardienne : le commerce bénéficie même au pays le moins productif.",
  },
];

export function getComparativeAdvantageScenario(id: string): ComparativeAdvantageScenario | undefined {
  return comparativeAdvantageScenarios.find((s) => s.id === id);
}
