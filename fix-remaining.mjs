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

// Additional patterns missed by the first script
// These are all display text patterns
const replacements = [
  // europeenne/europeen
  [/\beuropeenne\b/g, 'européenne'],
  [/\beuropeennes\b/g, 'européennes'],
  [/\beuropeens\b/g, 'européens'],
  [/\beuropeen\b/g, 'européen'],
  // externalite (standalone - not in values)
  // dependance
  [/\bdependance\b/g, 'dépendance'],
  // geopolitique
  [/\bgeopolitique\b/g, 'géopolitique'],
  [/\bgeopolitiques\b/g, 'géopolitiques'],
  // etait
  [/\betait\b/g, 'était'],
  // integrer / integre
  [/\bintegrer\b/g, 'intégrer'],
  // tot
  [/\bplus tot\b/g, 'plus tôt'],
  // emise/emises
  [/\bemise\b/g, 'émise'],
  [/\bemises\b/g, 'émises'],
  // diminue (past participle)
  [/\bdiminue de\b/g, 'diminué de'],
  // estime
  [/\bestime entre\b/g, 'estimé entre'],
  [/\bestime a\b/g, 'estimé à'],
  // suggerant
  [/\bsuggerant\b/g, 'suggérant'],
  // etudes
  [/\betudes\b/g, 'études'],
  // appliquee
  [/\bappliquee\b/g, 'appliquée'],
  [/\bappliquees\b/g, 'appliquées'],
  // regions
  [/\bregions\b/g, 'régions'],
  [/\bregion\b/g, 'région'],
  // succes
  [/\bsucces\b/g, 'succès'],
  // oeuvre
  [/\bd'oeuvre\b/g, "d'oeuvre"], // main-d'oeuvre is acceptable
  // marche (market) - tricky, we only replace in display context
  // "marche du" / "marche de" / "du marche" etc.
  [/\bmarche du\b/g, 'marché du'],
  [/\bmarche de\b/g, 'marché de'],
  [/\bmarche des\b/g, 'marché des'],
  [/\bdu marche\b/g, 'du marché'],
  [/\bde marche\b/g, 'de marché'],
  [/\ble marche\b/g, 'le marché'],
  [/\bLe marche\b/g, 'Le marché'],
  [/\bun marche\b/g, 'un marché'],
  [/\bau marche\b/g, 'au marché'],
  [/\bMarche \b/g, 'Marché '],
  [/\bmarche \b/g, 'marché '],
  [/\bmarche\.\b/g, 'marché.'],
  [/\bmarche,\b/g, 'marché,'],
  [/\bmarche\)/g, 'marché)'],
  [/\bmarches\b/g, 'marchés'],
  // privee
  [/\bprivee\b/g, 'privée'],
  [/\bprivees\b/g, 'privées'],
  [/\bprive\b(?=[^s])/g, 'privé'],
  // effectif -> already correct
  // augmente / augmenter
  // generait
  [/\bgenerait\b/g, 'générait'],
  // revelant
  [/\brevelant\b/g, 'révélant'],
  // energie
  [/\benergie\b/g, 'énergie'],
  [/\bEnergies\b/g, 'Énergies'],
  [/\benergie\b/g, 'énergie'],
  // Cree en
  [/\bCree en\b/g, 'Créé en'],
  [/\bcree en\b/g, 'créé en'],
  // majorite
  [/\bmajorite\b/g, 'majorité'],
  // croissante
  // liberte
  [/\bliberte\b/g, 'liberté'],
  // verite
  [/\beverite\b/g, 'vérité'],
  // difficulte
  [/\bdifficulte\b/g, 'difficulté'],
  [/\bdifficultes\b/g, 'difficultés'],
  // ete
  [/\ba ete\b/g, 'a été'],
  [/\bont ete\b/g, 'ont été'],
  [/\bdu ete\b/g, 'dû être'],
  // a -> à (in "a la", "a l'", etc. - very common)
  // This is tricky, only replace "a" -> "à" in display text context
  [/\b(\d+) a (\d+)/g, '$1 à $2'], // "40 a 100%" -> "40 à 100%"
  [/\bpasse de (\d)/g, 'passe de $1'], // correct
  [/ a court terme\b/g, ' à court terme'],
  [/ a long terme\b/g, ' à long terme'],
  [/ a consommer\b/g, ' à consommer'],
  [/ a importer\b/g, ' à importer'],
  [/ a payer\b/g, ' à payer'],
  [/ a produire\b/g, ' à produire'],
  [/ a acheter\b/g, ' à acheter'],
  [/ a vendre\b/g, ' à vendre'],
  [/ a la hausse\b/g, ' à la hausse'],
  [/ a la baisse\b/g, ' à la baisse'],
  [/ a travers\b/g, ' à travers'],
  [/ grace a\b/g, ' grâce à'],
  [/ Grace a\b/g, ' Grâce à'],
  [/ face a\b/g, ' face à'],
  [/ quant a\b/g, ' quant à'],
  [/ pret a\b/g, ' prêt à'],
  // Apres
  [/\bApres\b/g, 'Après'],
  [/\bapres\b/g, 'après'],
  // durable / durablement - correct
  // negociation
  [/\bnegociation\b/g, 'négociation'],
  [/\bnegociations\b/g, 'négociations'],
  // accelerer
  [/\bacceler\b/g, 'accélér'],
  // rentabilite
  [/\brentabilite\b/g, 'rentabilité'],
  // competitivite - already done
  // deteriore
  [/\bdeteriore\b/g, 'détérioré'],
  [/\bdeterioration\b/g, 'détérioration'],
  // reduit already done
  // prete
  // salaires reels -> salaires réels (already done via reel->réel)
  // chômage
  [/\bchomage\b/g, 'chômage'],
  [/\bChomage\b/g, 'Chômage'],
  [/\bchomeurs\b/g, 'chômeurs'],
  // duree
  [/\bduree\b/g, 'durée'],
  // creuse
  [/\bcreuse\b/g, 'creuse'], // correct (to dig)
  // beneficie already done
  // desincitation already done
  // investisseur
  // propriete
  [/\bpropriete\b/g, 'propriété'],
  // richesse - correct
  // temoigne
  [/\btemoigne\b/g, 'témoigne'],
  // echange -> already done
  // elargie
  [/\belargie\b/g, 'élargie'],
  [/\belargir\b/g, 'élargir'],
  [/\belargissement\b/g, 'élargissement'],
  // devaluer
  // evaluation
  [/\bevaluation\b/g, 'évaluation'],
  // interpretes
  [/\binterpretes\b/g, 'interprétés'],
  [/\binterprete\b/g, 'interprété'],
  // menage/menages
  [/\bmenages\b/g, 'ménages'],
  [/\bmenage\b/g, 'ménage'],
  // emprunte -> not same as emprunt
  // protectionnisme - correct
  // efficiente - correct
  // precaire
  [/\bprecaire\b/g, 'précaire'],
  [/\bprecaires\b/g, 'précaires'],
  [/\bprecarite\b/g, 'précarité'],
  // heterogene
  [/\bheterogene\b/g, 'hétérogène'],
  [/\bheterogenes\b/g, 'hétérogènes'],
  // homogene
  [/\bhomogene\b/g, 'homogène'],
  // remunerations -> already done
  // proletariat
  // patrimoine - correct
  // marche -> done above
  // concentration - correct
  // producteur - correct
  // producteurs - correct
  // intensite
  [/\bintensite\b/g, 'intensité'],
  // Quantites
  // gerer
  [/\bgerer\b/g, 'gérer'],
  // residu
  [/\bresiduel\b/g, 'résiduel'],
  [/\bresiduels\b/g, 'résiduels'],
  // resoudre
  [/\bresoudre\b/g, 'résoudre'],
  // monetisation
  [/\bmonetisation\b/g, 'monétisation'],
  // indexe
  [/\bindexe\b/g, 'indexé'],
  [/\bindexee\b/g, 'indexée'],
  // Cree -> Créé when it's a past participle (already handled)
  // equilibre -> done
  // Marche -> done
  // penuries
  [/\bpenuries\b/g, 'pénuries'],
  [/\bpenurie\b/g, 'pénurie'],
  // insuffisantes
  // stimule
  // reduit -> done
  // relance - correct
  // recul - correct
  // legales
  [/\blegales\b/g, 'légales'],
  [/\blegale\b/g, 'légale'],
  [/\blegalement\b/g, 'légalement'],
  // obligees
  [/\bobligees\b/g, 'obligées'],
  [/\bobligee\b/g, 'obligée'],
  // calculee
  [/\bcalculee\b/g, 'calculée'],
  [/\bcalcule\b/g, 'calculé'],
  // donne -> donné (past part)
  // negociable
  [/\bnegociable\b/g, 'négociable'],
  [/\bnegociables\b/g, 'négociables'],
  // reservee
  [/\breservee\b/g, 'réservée'],
  // depots -> dépôts done
  // terme -> correct
  // liberees
  [/\bliberees\b/g, 'libérées'],
  [/\blibere\b/g, 'libéré'],
  // marche -> done above
  // eurozone
  // maximisee
  [/\bmaximisee\b/g, 'maximisée'],
  [/\bmaximise\b/g, 'maximisé'],
  // operee
  [/\boperee\b/g, 'opérée'],
  // exprime
  [/\bexprime\b/g, 'exprimé'],
  [/\bexprimee\b/g, 'exprimée'],
  // observee
  [/\bobservee\b/g, 'observée'],
  [/\bobserve en\b/g, 'observé en'],
  [/\bobserve dans\b/g, 'observé dans'],
  [/\bObservee\b/g, 'Observée'],
  // Theorisee
  [/\bTheorisee\b/g, 'Théorisée'],
  [/\btheorisee\b/g, 'théorisée'],
  [/\bTheorise\b/g, 'Théorisé'],
  [/\btheorise\b/g, 'théorisé'],
  // engendree
  [/\bengendree\b/g, 'engendrée'],
  [/\bengendre\b/g, 'engendré'],
  // additionnelle
  // procuree
  [/\bprocuree\b/g, 'procurée'],
  // Difference
  // dispose
  [/\bdispose\b/g, 'disposé'],
  [/\bdisposee\b/g, 'disposée'],
  [/\bdisposees\b/g, 'disposées'],
  [/\bdisposes\b/g, 'disposés'],
  // temporelle - correct
  // effondrement - correct
  // stimul -> correct
  // Etats (like "les Etats")
  [/\bEtats\b/g, 'États'],
  // suffisante/suffisant - correct
  // maniere
  [/\bmaniere\b/g, 'manière'],
  // a (to, in many phrases)
  [/ a une /g, ' à une '],
  [/ a un /g, ' à un '],
  [/ a des /g, ' à des '],
  [/ a deux /g, ' à deux '],
  [/ a partir /g, ' à partir '],
  [/ a atteindre/g, ' à atteindre'],
  [/ a maintenir/g, ' à maintenir'],
  [/ a l'/g, " à l'"],
  [/ a la /g, ' à la '],
  [/ a le /g, ' à le '],
  [/ a chaque /g, ' à chaque '],
  [/ a prix /g, ' à prix '],
  [/ a cette /g, ' à cette '],
  [/ a ce /g, ' à ce '],
  [/ a ceux /g, ' à ceux '],
  [/ a cette /g, ' à cette '],
  [/ a mesure/g, ' à mesure'],
  [/ a cause/g, ' à cause'],
  [/ a moins /g, ' à moins '],
  [/ a plus /g, ' à plus '],
  [/ a son /g, ' à son '],
  [/ a se /g, ' à se '],
  [/ a sa /g, ' à sa '],
  [/ a tout/g, ' à tout'],
  [/ a quel/g, ' à quel'],
  [/ a leur/g, ' à leur'],
  [/ a d'autres/g, " à d'autres"],
  [/ ou a /g, ' ou à '],
  [/^a /gm, 'à '], // At beginning of text
  // Also "Comparez a" etc.
  // interesse -> intéressé
  // interessant
  // desequilibre
  // sensibilite -> already done
  // Cree
  [/\bCree\b/g, 'Créé'],
  // gele -> gelé (freeze)
  [/\bgele\b/g, 'gelé'],
  [/\bgeler\b/g, 'geler'], // correct as infinitive
];

const files = getFiles('.');
let totalChanges = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf-8');
  let newContent = content;

  for (const [pattern, replacement] of replacements) {
    newContent = newContent.replace(pattern, replacement);
  }

  if (newContent !== content) {
    writeFileSync(file, newContent);
    totalChanges++;
    console.log(`Fixed: ${file}`);
  }
}

console.log(`\nTotal files modified: ${totalChanges}`);
