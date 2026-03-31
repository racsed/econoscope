export interface ElasticityScenario {
  id: string;
  title: string;
  description: string;
  /** Elasticite-prix de la demande (valeur absolue) */
  elasticity: number;
  /** Prix initial */
  initialPrice: number;
  /** Quantite initiale */
  initialQuantity: number;
  /** Pente de la courbe de demande (negative) */
  demandSlope: number;
  /** Intercept de la courbe de demande */
  demandIntercept: number;
  category: 'luxe' | 'necessite' | 'addictif' | 'substituts-proches';
  explanation: string;
}

export const elasticityScenarios: ElasticityScenario[] = [
  {
    id: 'bien-de-luxe',
    title: 'Bien de luxe (sac a main haut de gamme)',
    description:
      'La demande est tres sensible au prix : une hausse de 10 % fait chuter la demande de 25 %.',
    elasticity: 2.5,
    initialPrice: 500,
    initialQuantity: 1000,
    demandSlope: -5,
    demandIntercept: 3500,
    category: 'luxe',
    explanation:
      'Les biens de luxe ont une elasticite elevee (|Ep| > 1) car ils ne sont pas indispensables et de nombreux substituts existent. Les consommateurs renoncent facilement a un sac a 500 euros si le prix augmente. La recette totale diminue en cas de hausse de prix.',
  },
  {
    id: 'bien-de-premiere-necessite',
    title: 'Bien de premiere necessite (pain)',
    description:
      'La demande est peu sensible au prix : une hausse de 10 % ne reduit la demande que de 2 %.',
    elasticity: 0.2,
    initialPrice: 1.2,
    initialQuantity: 10000,
    demandSlope: -1667,
    demandIntercept: 12000,
    category: 'necessite',
    explanation:
      'Le pain est un bien de premiere necessite avec une tres faible elasticite (|Ep| < 1). Les consommateurs continuent d\'en acheter meme si le prix augmente car il n\'y a pas de veritable substitut pour ce produit de base. Une hausse de prix augmente la recette totale des boulangers.',
  },
  {
    id: 'tabac',
    title: 'Tabac (produit addictif)',
    description:
      'La dependance rend la demande relativement inelastique a court terme.',
    elasticity: 0.4,
    initialPrice: 12,
    initialQuantity: 5000,
    demandSlope: -167,
    demandIntercept: 7000,
    category: 'addictif',
    explanation:
      'Le tabac a une elasticite faible a court terme (environ 0,4) en raison de la dependance. A long terme, l\'elasticite augmente (0,7-0,8) car certains fumeurs parviennent a arreter. C\'est pourquoi les politiques de hausse des taxes sur le tabac reduisent la consommation, mais lentement. L\'Etat peut augmenter les recettes en elevant la taxe.',
  },
  {
    id: 'smartphones',
    title: 'Smartphones (substituts proches)',
    description:
      'De nombreuses marques et modeles en concurrence rendent la demande elastique.',
    elasticity: 1.5,
    initialPrice: 800,
    initialQuantity: 3000,
    demandSlope: -5.6,
    demandIntercept: 7500,
    category: 'substituts-proches',
    explanation:
      'Le marche des smartphones est concurrentiel avec de nombreuses marques (Apple, Samsung, Xiaomi...). Si une marque augmente ses prix, les consommateurs se tournent vers les alternatives. L\'elasticite est superieure a 1, ce qui signifie qu\'une hausse de prix reduit la recette totale. Les entreprises rivalisent donc sur les prix et les fonctionnalites.',
  },
];

export function getElasticityScenario(id: string): ElasticityScenario | undefined {
  return elasticityScenarios.find((s) => s.id === id);
}
