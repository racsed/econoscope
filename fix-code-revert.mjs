import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

function getFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next' || entry.startsWith('fix-')) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      getFiles(full, files);
    } else if (extname(full) === '.ts' || extname(full) === '.tsx') {
      files.push(full);
    }
  }
  return files;
}

// Revert code identifiers that should NOT have been changed
const reverts = [
  // Type names in imports/declarations
  [/\bScénario\b/g, 'Scenario'],
  [/\bscénarios\b/g, 'scenarios'],

  // Property key 'realite' in ModuleMeta (used as property name)
  [/réalité:/g, 'realite:'],
  [/\.réalité\b/g, '.realite'],

  // Slug values must stay ASCII
  [/slug: 'élasticité-prix'/g, "slug: 'elasticite-prix'"],
  [/slug: 'équilibre/g, "slug: 'equilibre"],
  [/slug: 'frontière/g, "slug: 'frontiere"],
  [/slug: 'création-monétaire'/g, "slug: 'creation-monetaire'"],
  [/slug: 'carré-magique/g, "slug: 'carre-magique"],
  [/slug: 'fiscalité-redistribution'/g, "slug: 'fiscalite-redistribution'"],
  [/slug: 'concurrence-monopole'/g, "slug: 'concurrence-monopole'"], // correct already

  // Variable names that got accented (function params, local vars)
  // elasticite as variable/parameter/property access
  [/const élasticité/g, 'const elasticite'],
  [/Number\(values\.élasticité\)/g, 'Number(values.elasticite)'],
  [/values\.élasticité/g, 'values.elasticite'],
  [/élasticité\)/g, 'elasticite)'],
  [/élasticité,/g, 'elasticite,'],
  [/élasticité\./g, 'elasticite.'],
  [/élasticité\b(?=[^'"])/g, 'elasticite'], // Only when not in a string
  [/id: 'élasticité'/g, "id: 'elasticite'"],
  [/élasticité: /g, 'elasticite: '],

  // Values for select/toggle options that are used as data values
  [/value: 'nécessaire'/g, "value: 'necessaire'"],
  [/=== 'nécessaire'/g, "=== 'necessaire'"],
  [/values\.nécessaire/g, 'values.necessaire'],
  [/typeBien === 'nécessaire'/g, "typeBien === 'necessaire'"],
  [/value: 'négative'/g, "value: 'negative'"],
  [/'négative'\)/g, "'negative')"],
  [/=== 'négative'/g, "=== 'negative'"],
  [/\|\| 'négative'/g, "|| 'negative'"],
  [/defaultValue: 'négative'/g, "defaultValue: 'negative'"],

  // The NAV_LINKS href for /scenarios shouldn't point to /scénarios
  [/href: '\/scénarios'/g, "href: '/scenarios'"],

  // Fix forç -> forc (regex gone wrong - 'forcant' became 'forçant')
  [/forçant/g, 'forçant'], // this is actually correct French!

  // Fix 'brisé' when it should be 'brise' (past participle used differently)
  // Actually 'brisé' is correct for "a brisé le monopole"

  // Fix id values that got accented
  [/id: 'électricité'/g, "id: 'electricite'"],

  // Fix "For négative:" in code comments
  [/\/\/ For négative:/g, '// For negative:'],
  [/\/\/.*négative.*tax/g, function(match) { return match.replace(/négative/g, 'negative'); }],

  // The 'deprecie' in the compute function is used as a string value displayed to user, so it's OK accented
  // But check if used as code value

  // Fix même -> meme when used as code variable
  // Actually 'même' is correct in all display text contexts

  // Fix module property name: meta.realite (code) vs display text
  // The pattern is:   realite: [
  // Already handled above

  // Fix côté -> cote when used as code variable
  // Need to check context - "côté" in display text is correct, but if in code...

  // Fix dépôt/dépôts when used as variable names
  [/const dépôt/g, 'const depot'],
  [/values\.dépôt/g, 'values.depot'],
  [/dépôtInitial/g, 'depotInitial'],
  [/dépôtN/g, 'depotN'],

  // Fix 'contrôle' when used as code
  // In display text it's correct

  // Fix état/État in code comments and variable references
  // In display text it's correct

  // Fix 'intèg' which is a broken partial replacement
  [/intèg\b/g, 'intèg'], // keep as is, it's in narration text: "les agents intèg..." -> should be "intègrent"

  // Fix side effects on code-level constructs
  // The 'prets' variable name should stay
  // Actually 'prêts' in display text ("les acheteurs sont prêts à payer") is correct

  // Fix the scenario label href
  [/'\/scénarios'/g, "'/scenarios'"],
];

const files = getFiles('.');
let totalChanges = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf-8');
  let newContent = content;

  for (const [pattern, replacement] of reverts) {
    if (typeof replacement === 'function') {
      newContent = newContent.replace(pattern, replacement);
    } else {
      newContent = newContent.replace(pattern, replacement);
    }
  }

  if (newContent !== content) {
    writeFileSync(file, newContent);
    totalChanges++;
    console.log(`Reverted code identifiers in: ${file}`);
  }
}

console.log(`\nTotal files fixed: ${totalChanges}`);
