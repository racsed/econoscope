export interface ExternalitiesScenario {
  id: string;
  title: string;
  description: string;
  coutMarginalPrive: number;
  coutExterneUnitaire: number;
  typeExternalite: 'negative' | 'positive';
  taxePigouvienne: number;
  explanation: string;
}

export const externalitiesScenarios: ExternalitiesScenario[] = [
  {
    id: 'pollution-industrielle',
    title: 'Pollution industrielle',
    description: "Une usine rejette des polluants sans en supporter le cout.",
    coutMarginalPrive: 15,
    coutExterneUnitaire: 10,
    typeExternalite: 'negative',
    taxePigouvienne: 0,
    explanation:
      "L'usine produit au-dela de l'optimum social car elle ne tient pas compte du cout de la pollution (sante, environnement). La difference entre la quantite de marche et la quantite optimale represente la surproduction. La perte seche mesure le cout social de cette defaillance.",
  },
  {
    id: 'taxe-carbone-optimale',
    title: 'Taxe carbone optimale',
    description: "Introduction d'une taxe exactement egale au cout externe.",
    coutMarginalPrive: 15,
    coutExterneUnitaire: 10,
    typeExternalite: 'negative',
    taxePigouvienne: 10,
    explanation:
      "La taxe pigouvienne de 10 euros internalise le cout de la pollution. Le producteur integre desormais le cout social dans son calcul. La quantite produite coincide avec l'optimum social et la perte seche disparait.",
  },
  {
    id: 'taxe-insuffisante',
    title: 'Taxe carbone insuffisante',
    description: "La taxe ne couvre pas la totalite du cout externe.",
    coutMarginalPrive: 15,
    coutExterneUnitaire: 10,
    typeExternalite: 'negative',
    taxePigouvienne: 5,
    explanation:
      "Une taxe de 5 euros alors que le cout externe est de 10 euros ne corrige que partiellement la defaillance. Il reste une surproduction et une perte seche residuelle, bien que moindres qu'en l'absence de taxe.",
  },
  {
    id: 'vaccination-positive',
    title: 'Vaccination (externalite positive)',
    description: "La vaccination protege au-dela de l'individu vaccine (immunite collective).",
    coutMarginalPrive: 20,
    coutExterneUnitaire: 12,
    typeExternalite: 'positive',
    taxePigouvienne: 0,
    explanation:
      "Le marche sous-produit les vaccins car les individus ne prennent en compte que leur propre benefice, ignorant le benefice pour la collectivite (immunite de groupe). Une subvention est necessaire pour atteindre l'optimum social.",
  },
  {
    id: 'subvention-education',
    title: "Subvention a l'education",
    description: "L'education genere des benefices sociaux au-dela de l'individu forme.",
    coutMarginalPrive: 25,
    coutExterneUnitaire: 15,
    typeExternalite: 'positive',
    taxePigouvienne: 15,
    explanation:
      "Une subvention de 15 euros par unite permet d'aligner la production sur l'optimum social. L'education produit des externalites positives : innovation, cohesion sociale, productivite collective. Sans subvention, le marche sous-investit dans l'education.",
  },
];

export function getExternalitiesScenario(id: string): ExternalitiesScenario | undefined {
  return externalitiesScenarios.find((s) => s.id === id);
}
