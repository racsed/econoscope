export interface ComparativeAdvantageScenario {
  id: string;
  title: string;
  description: string;
  productivitePays1A: number;
  productivitePays1B: number;
  productivitePays2A: number;
  productivitePays2B: number;
  regime: 'autarcie' | 'libre-echange';
  explanation: string;
}

export const comparativeAdvantageScenarios: ComparativeAdvantageScenario[] = [
  {
    id: 'avantage-absolu-mutuel',
    title: 'Avantage absolu mutuel',
    description: "Chaque pays est le meilleur dans un bien different.",
    productivitePays1A: 10,
    productivitePays1B: 4,
    productivitePays2A: 3,
    productivitePays2B: 12,
    regime: 'libre-echange',
    explanation:
      "Cas le plus intuitif : le pays 1 est meilleur en A, le pays 2 en B. Chacun se specialise dans son point fort. L'avantage absolu coincide ici avec l'avantage comparatif.",
  },
  {
    id: 'ricardo-classique',
    title: 'Ricardo classique',
    description: "Un pays est plus productif partout, mais le commerce reste benefique.",
    productivitePays1A: 10,
    productivitePays1B: 5,
    productivitePays2A: 4,
    productivitePays2B: 8,
    regime: 'libre-echange',
    explanation:
      "Le pays 1 a un avantage absolu en A (10 > 4) mais le pays 2 a un avantage comparatif en B car son cout d'opportunite est plus faible (4/8 = 0,5 A par B contre 10/5 = 2 A par B pour le pays 1). Le commerce profite aux deux.",
  },
  {
    id: 'autarcie-vs-echange',
    title: 'Autarcie vs libre-echange',
    description: "Comparaison directe des deux regimes.",
    productivitePays1A: 12,
    productivitePays1B: 6,
    productivitePays2A: 5,
    productivitePays2B: 10,
    regime: 'autarcie',
    explanation:
      "En autarcie, chaque pays doit produire les deux biens. Passez en libre-echange pour observer les gains de la specialisation : la production mondiale totale augmente pour au moins un bien sans diminuer pour l'autre.",
  },
  {
    id: 'productivite-identique',
    title: 'Productivites identiques',
    description: "Aucun avantage comparatif : le commerce n'apporte rien.",
    productivitePays1A: 6,
    productivitePays1B: 6,
    productivitePays2A: 6,
    productivitePays2B: 6,
    regime: 'libre-echange',
    explanation:
      "Quand les couts d'opportunite sont identiques dans les deux pays, il n'y a pas d'avantage comparatif. Le libre-echange ne genere aucun gain. Ce cas theorique est rare dans la realite.",
  },
  {
    id: 'pays-emergent-vs-developpe',
    title: 'Pays emergent vs developpe',
    description: "Ecart de productivite important entre les deux pays.",
    productivitePays1A: 20,
    productivitePays1B: 15,
    productivitePays2A: 2,
    productivitePays2B: 3,
    regime: 'libre-echange',
    explanation:
      "Meme avec un ecart de productivite considerable, le pays emergent (pays 2) conserve un avantage comparatif dans le bien B (cout d'opp. = 2/3 contre 20/15 = 4/3 pour le pays 1). C'est la puissance de la theorie ricardienne : le commerce beneficie meme au pays le moins productif.",
  },
];

export function getComparativeAdvantageScenario(id: string): ComparativeAdvantageScenario | undefined {
  return comparativeAdvantageScenarios.find((s) => s.id === id);
}
