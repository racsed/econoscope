export interface ElasticityScenario {
  id: string;
  title: string;
  description: string;
  /** Élasticité-prix de la demande (valeur absolue) */
  elasticity: number;
  /** Prix initial */
  initialPrice: number;
  /** Quantité initiale */
  initialQuantity: number;
  /** Pente de la courbe de demande (négative) */
  demandSlope: number;
  /** Intercept de la courbe de demande */
  demandIntercept: number;
  category: 'luxe' | 'nécessité' | 'addictif' | 'substituts-proches';
  explanation: string;
}

export const elasticityScenarios: ElasticityScenario[] = [
  {
    id: 'bien-de-luxe',
    title: 'Bien de luxe (sac a main haut de gamme)',
    description:
      'La demande est très sensible au prix : une hausse de 10 % fait chuter la demande de 25 %.',
    elasticity: 2.5,
    initialPrice: 500,
    initialQuantity: 1000,
    demandSlope: -5,
    demandIntercept: 3500,
    category: 'luxe',
    explanation:
      'Les biens de luxe ont une élasticité élevée (|Ep| > 1) car ils ne sont pas indispensables et de nombreux substituts existent. Les consommateurs renoncent facilement à un sac a 500 euros si le prix augmente. La recette totale diminue en cas de hausse de prix.',
  },
  {
    id: 'bien-de-première-nécessité',
    title: 'Bien de première nécessité (pain)',
    description:
      'La demande est peu sensible au prix : une hausse de 10 % ne réduit la demande que de 2 %.',
    elasticity: 0.2,
    initialPrice: 1.2,
    initialQuantity: 10000,
    demandSlope: -1667,
    demandIntercept: 12000,
    category: 'nécessité',
    explanation:
      'Le pain est un bien de première nécessité avec une très faible élasticité (|Ep| < 1). Les consommateurs continuent d\'en acheter même si le prix augmente car il n\'y a pas de véritable substitut pour ce produit de base. Une hausse de prix augmente la recette totale des boulangers.',
  },
  {
    id: 'tabac',
    title: 'Tabac (produit addictif)',
    description:
      'La dépendance rend la demande relativement inélastique à court terme.',
    elasticity: 0.4,
    initialPrice: 12,
    initialQuantity: 5000,
    demandSlope: -167,
    demandIntercept: 7000,
    category: 'addictif',
    explanation:
      'Le tabac a une élasticité faible à court terme (environ 0,4) en raison de la dépendance. À long terme, l\'élasticité augmente (0,7-0,8) car certains fumeurs parviennent à arrêter. C\'est pourquoi les politiques de hausse des taxes sur le tabac réduisent la consommation, mais lentement. L\'État peut augmenter les recettes en élevant la taxe.',
  },
  {
    id: 'smartphones',
    title: 'Smartphones (substituts proches)',
    description:
      'De nombreuses marques et modèles en concurrence rendent la demande élastique.',
    elasticity: 1.5,
    initialPrice: 800,
    initialQuantity: 3000,
    demandSlope: -5.6,
    demandIntercept: 7500,
    category: 'substituts-proches',
    explanation:
      'Le marché des smartphones est concurrentiel avec de nombreuses marques (Apple, Samsung, Xiaomi...). Si une marque augmente ses prix, les consommateurs se tournent vers les alternatives. L\'élasticité est supérieure a 1, ce qui signifie qu\'une hausse de prix réduit la recette totale. Les entreprises rivalisent donc sur les prix et les fonctionnalites.',
  },
];

export function getElasticityScenario(id: string): ElasticityScenario | undefined {
  return elasticityScenarios.find((s) => s.id === id);
}
