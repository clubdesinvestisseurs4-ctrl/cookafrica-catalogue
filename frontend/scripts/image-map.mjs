// Correspondance entre les fichiers sources (dossier MENU/ fourni par l'utilisateur)
// et les pages finales du catalogue, dans l'ordre de lecture.
// Chemin de base modifiable via la variable d'environnement MENU_SOURCE_DIR.

import path from 'node:path';

export const MENU_SOURCE_DIR = process.env.MENU_SOURCE_DIR || 'C:/Users/abayi/MENU';

export const imageMap = [
  ['00-couverture-debut.jpg', 'couverture-debut.jpg'],

  ['01-lundi-couverture.jpg', 'LUNDI/OUVERTURE copie.jpg'],
  ['02-lundi-locossoukoua.jpg', 'LUNDI/LUNDI-1.jpg'],
  ['03-lundi-biekosseu.jpg', 'LUNDI/LUNDI-2.jpg'],
  ['04-lundi-tchetchra.jpg', 'LUNDI/MENU MAG - Copie (2) copie.jpg'],

  ['05-mardi-couverture.jpg', 'MARDI/MARDI-0.jpg'],
  ['06-mardi-cope-djoumgble.jpg', 'MARDI/MARDI-1.jpg'],
  ['07-mardi-akpessi-pistache.jpg', 'MARDI/MARDI-2.jpg'],
  ['08-mardi-gnangnan-gouagouassou.jpg', 'MARDI/MARDI-3.jpg'],

  ['09-mercredi-couverture.jpg', 'MERCREDI/MERCREDI-0.jpg'],
  ['10-mercredi-kokotcha-djoumgble.jpg', 'MERCREDI/MERCREDI-1.jpg'],
  ['11-mercredi-ntro-arrachide.jpg', 'MERCREDI/MERCREDI-2.jpg'],
  ['12-mercredi-emeredji-graine.jpg', 'MERCREDI/MERCREDI-3.jpg'],

  ['13-jeudi-couverture.jpg', 'JEUDI/JEUDI-0.jpg'],
  ['14-jeudi-gombo-tehi.jpg', 'JEUDI/JEUDI-1.jpg'],
  ['15-jeudi-zrin-bawin.jpg', 'JEUDI/JEUDI-2.jpg'],
  ['16-jeudi-kple-gouin.jpg', 'JEUDI/JEUDI-3.jpg'],

  ['17-vendredi-couverture.jpg', 'VENDREDI/VENDREDI-0.jpg'],
  ['18-vendredi-cabato-da.jpg', 'VENDREDI/VENDREDI-1.jpg'],
  ['19-vendredi-tchep.jpg', 'VENDREDI/VENDREDI-2.jpg'],
  ['20-vendredi-soumara-arrachide.jpg', 'VENDREDI/VENDREDI-3.jpg'],

  ['21-samedi-couverture.jpg', 'SAMEDI/SAMEDI-0.jpg'],
  ['22-samedi-kokotcha.jpg', 'SAMEDI/SAMEDI-1.jpg'],
  ['23-samedi-cope-pistache.jpg', 'SAMEDI/SAMEDI-2.jpg'],
  ['24-samedi-emeredji-graine.jpg', 'SAMEDI/SAMEDI-3.jpg'],

  ['25-dimanche-couverture.jpg', 'DIMANCHE/DIMANCHE-0.jpg'],
  ['26-dimanche-feuille-graine.jpg', 'DIMANCHE/DIMANCHE-1.jpg'],
  ['27-dimanche-placali-kokotcha.jpg', 'DIMANCHE/DIMANCHE-2.jpg'],

  ['28-couverture-fin.jpg', 'couverture-fin.jpeg']
].map(([dest, src]) => [dest, path.join(MENU_SOURCE_DIR, src)]);
