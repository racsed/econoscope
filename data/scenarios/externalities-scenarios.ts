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
    description: "Une usine rejette des polluants sans en supporter le coût.",
    coutMarginalPrive: 15,
    coutExterneUnitaire: 10,
    typeExternalite: 'negative',
    taxePigouvienne: 0,
    explanation:
      "L'usine produit au-delà de l'optimum social car elle ne tient pas compte du coût de la pollution (santé, environnement). La différence entre la quantité de marché et la quantité optimale représente la surproduction. La perte sèche mesure le coût social de cette défaillance.",
  },
  {
    id: 'taxe-carbone-optimale',
    title: 'Taxe carbone optimale',
    description: "Introduction d'une taxe exactement égale au coût externe.",
    coutMarginalPrive: 15,
    coutExterneUnitaire: 10,
    typeExternalite: 'negative',
    taxePigouvienne: 10,
    explanation:
      "La taxe pigouvienne de 10 euros internalise le coût de la pollution. Le producteur intègre désormais le coût social dans son calcul. La quantité produite coïncide avec l'optimum social et la perte sèche disparaît.",
  },
  {
    id: 'taxe-insuffisanté',
    title: 'Taxe carbone insuffisanté',
    description: "La taxe ne couvre pas la totalité du coût externe.",
    coutMarginalPrive: 15,
    coutExterneUnitaire: 10,
    typeExternalite: 'negative',
    taxePigouvienne: 5,
    explanation:
      "Une taxe de 5 euros alors que le coût externe est de 10 euros ne corrige que partiellement la défaillance. Il reste une surproduction et une perte sèche résiduelle, bien que moindres qu'en l'absence de taxe.",
  },
  {
    id: 'vaccination-positive',
    title: 'Vaccination (externalité positive)',
    description: "La vaccination protège au-delà de l'individu vacciné (immunité collective).",
    coutMarginalPrive: 20,
    coutExterneUnitaire: 12,
    typeExternalite: 'positive',
    taxePigouvienne: 0,
    explanation:
      "Le marché sous-produit les vaccins car les individus ne prennent en compte que leur propre bénéfice, ignorant le bénéfice pour la collectivité (immunité de groupe). Une subvention est nécessaire pour atteindre l'optimum social.",
  },
  {
    id: 'subvention-education',
    title: "Subvention à l'éducation",
    description: "L'éducation génère des bénéfices sociaux au-delà de l'individu formé.",
    coutMarginalPrive: 25,
    coutExterneUnitaire: 15,
    typeExternalite: 'positive',
    taxePigouvienne: 15,
    explanation:
      "Une subvention de 15 euros par unité permet d'aligner la production sur l'optimum social. L'éducation produit des externalités positives : innovation, cohésion sociale, productivité collective. Sans subvention, le marché sous-investit dans l'éducation.",
  },
];

export function getExternalitiesScenario(id: string): ExternalitiesScenario | undefined {
  return externalitiesScenarios.find((s) => s.id === id);
}
