// Manifeste du catalogue Cook Africa : ordre, jour, plats et prix par page.
// Source des prix : 10000 FCFA le plat / 15000 FCFA le buffet (sauf mention contraire).
// Ce fichier est la donnée de repli (bundlée) utilisée si l'API /api/catalog est indisponible.

export const catalog = {
  title: 'Cook Africa — Le Menu',
  subtitle: "Découvrez les richesses culinaires africaines",
  pages: [
    {
      id: 'cover-debut',
      kind: 'cover-start',
      image: '00-couverture-debut.jpg',
      alt: 'Couverture du catalogue Cook Africa : Le Menu, découvrez les richesses culinaires.'
    },

    // ---------- LUNDI ----------
    {
      id: 'lundi-cover', kind: 'day-cover', day: 'lundi', dayLabel: 'Lundi', theme: 'Menu Dida et Attié',
      image: '01-lundi-couverture.jpg',
      alt: 'Menu du lundi : Dida et Attié',
      items: ['Locossoukoua', 'Biékosseu / Poisson, Poulet pondeuse', 'Tchétchra', 'Sauce Tikriti / Riz local', 'Sauce graine au cœur de palmier']
    },
    {
      id: 'lundi-1', kind: 'day-detail', day: 'lundi', dayLabel: 'Lundi',
      image: '02-lundi-locossoukoua.jpg',
      alt: 'Locossoukoua et Sauce graine au cœur de palmier',
      items: [
        { name: 'Locossoukoua', description: 'Purée de banane, queue de bœuf, poisson brochet fumé'},
        { name: 'Sauce graine au cœur de palmier', description: 'Riz local, queue de bœuf, poisson brochet fumé'}
      ]
    },
    {
      id: 'lundi-2', kind: 'day-detail', day: 'lundi', dayLabel: 'Lundi',
      image: '03-lundi-biekosseu.jpg',
      alt: 'Biékosseu au poisson et Biékosseu au poulet',
      items: [
        { name: 'Biékosseu au poisson', description: 'Foutou banane ou riz, soupe de carpe'},
        { name: 'Biékosseu au poulet', description: 'Foutou banane ou riz, poulet pondeuse'}
      ]
    },
    {
      id: 'lundi-3', kind: 'day-detail', day: 'lundi', dayLabel: 'Lundi',
      image: '04-lundi-tchetchra.jpg',
      alt: 'Tchétchra et Sauce graine Tikriti',
      items: [
        { name: 'Tchétchra', description: 'Foutou banane, poisson brochet fumé, escargot'},
        { name: 'Sauce graine Tikriti', description: 'Riz local, queue de bœuf, poisson brochet fumé'}
      ]
    },

    // ---------- MARDI ----------
    {
      id: 'mardi-cover', kind: 'day-cover', day: 'mardi', dayLabel: 'Mardi', theme: 'Menu Abron, Agni, Baoulé',
      image: '05-mardi-couverture.jpg',
      alt: 'Menu du mardi : Abron, Agni, Baoulé',
      items: ['Akpessi', 'Placali / Sauce Côpè', 'Foutou / Sauce Djoumblé', 'Foutou / Sauce Gnangnan', 'Foutou / Sauce Gouagouassou', 'Riz ou Foutou / Sauce Pistache']
    },
    {
      id: 'mardi-1', kind: 'day-detail', day: 'mardi', dayLabel: 'Mardi',
      image: '06-mardi-cope-djoumgble.jpg',
      alt: 'Côpè et Djoumgblé',
      items: [
        { name: 'Côpè', description: 'Placali, crabe, tripes, kplo'},
        { name: 'Djoumgblé', description: 'Foutou banane, escargot, viande de bœuf'}
      ]
    },
    {
      id: 'mardi-2', kind: 'day-detail', day: 'mardi', dayLabel: 'Mardi',
      image: '07-mardi-akpessi-pistache.jpg',
      alt: 'Akpessi et Sauce pistache',
      items: [
        { name: 'Akpessi', description: 'Carpe grillée et feuilles de taros, igname et banane bouillis'},
        { name: 'Sauce pistache', description: 'Riz importé, poulet pondeuse'}
      ]
    },
    {
      id: 'mardi-3', kind: 'day-detail', day: 'mardi', dayLabel: 'Mardi',
      image: '08-mardi-gnangnan-gouagouassou.jpg',
      alt: 'Gnangnan et Gouagouassou',
      items: [
        { name: 'Gnangnan', description: 'Foutou igname, viande de bœuf et tripes'},
        { name: 'Gouagouassou', description: 'Foutou igname, poisson brochet fumé et queue de bœuf'}
      ]
    },

    // ---------- MERCREDI ----------
    {
      id: 'mercredi-cover', kind: 'day-cover', day: 'mercredi', dayLabel: 'Mercredi', theme: 'Menu Krobou, Ebrié, Adjoukrou',
      image: '09-mercredi-couverture.jpg',
      alt: 'Menu du mercredi : Krobou, Ebrié, Adjoukrou',
      items: ['Kokotcha', "N'tro / Riz ou Foutou", 'Foutou / Sauce arrachide', 'Attiéké huile rouge / Sauce emerédji', 'Foutou / Sauce graine ébrié']
    },
    {
      id: 'mercredi-1', kind: 'day-detail', day: 'mercredi', dayLabel: 'Mercredi',
      image: '10-mercredi-kokotcha-djoumgble.jpg',
      alt: 'Kokotcha et Djoumgblé sauce graine',
      items: [
        { name: 'Kokotcha', description: 'Foufou, crabe, escargot, queue de bœuf, poisson brochet fumé'},
        { name: 'Djoumgblé sauce graine', description: 'Foutou banane, escargot, tripes, poisson brochet fumé'}
      ]
    },
    {
      id: 'mercredi-2', kind: 'day-detail', day: 'mercredi', dayLabel: 'Mercredi',
      image: '11-mercredi-ntro-arrachide.jpg',
      alt: "N'tro et Sauce arrachide",
      items: [
        { name: "N'tro", description: 'Foutou banane, poisson brochet fumé et queue de bœuf'},
        { name: 'Sauce arrachide', description: 'Riz ou foutou, poisson brochet fumé et queue de bœuf'}
      ]
    },
    {
      id: 'mercredi-3', kind: 'day-detail', day: 'mercredi', dayLabel: 'Mercredi',
      image: '12-mercredi-emeredji-graine.jpg',
      alt: 'Emérédji et Sauce graine ébrié',
      items: [
        { name: 'Emérédji', description: 'Attiéké huile rouge ou blanc, poisson carpe et crabe'},
        { name: 'Sauce graine ébrié', description: 'Foutou banane, poisson brochet fumé et queue de bœuf'}
      ]
    },

    // ---------- JEUDI ----------
    {
      id: 'jeudi-cover', kind: 'day-cover', day: 'jeudi', dayLabel: 'Jeudi', theme: 'Menu Wê et Dan',
      image: '13-jeudi-couverture.jpg',
      alt: 'Menu du jeudi : Wê et Dan',
      items: ['Kplé Bâha', 'Gouin Saman', 'Zrin', 'Bawin', 'Gombo grillé', 'Tehi Saman']
    },
    {
      id: 'jeudi-1', kind: 'day-detail', day: 'jeudi', dayLabel: 'Jeudi',
      image: '14-jeudi-gombo-tehi.jpg',
      alt: 'Gombo grillé et Téhi saman',
      items: [
        { name: 'Gombo grillé', description: 'Riz local, viande de bœuf, crabe'},
        { name: 'Téhi saman', description: 'Foutou banane, viande de bœuf, tripes, brochet fumé'}
      ]
    },
    {
      id: 'jeudi-2', kind: 'day-detail', day: 'jeudi', dayLabel: 'Jeudi',
      image: '15-jeudi-zrin-bawin.jpg',
      alt: 'Zrin et Bawin',
      items: [
        { name: 'Zrin', description: 'Riz local, viande de bœuf, crabe'},
        { name: 'Bawin', description: 'Riz local, queue de bœuf, poisson brochet fumé'}
      ]
    },
    {
      id: 'jeudi-3', kind: 'day-detail', day: 'jeudi', dayLabel: 'Jeudi',
      image: '16-jeudi-kple-gouin.jpg',
      alt: 'Kplé Bâha et Gouin saman',
      items: [
        { name: 'Kplé Bâha', description: 'Foutou manioc, queue de bœuf, poisson brochet fumé'},
        { name: 'Gouin saman', description: 'Foutou banane, queue de bœuf, poisson brochet fumé'}
      ]
    },

    // ---------- VENDREDI ----------
    {
      id: 'vendredi-cover', kind: 'day-cover', day: 'vendredi', dayLabel: 'Vendredi', theme: 'Menu Mandigue et Wolof',
      image: '17-vendredi-couverture.jpg',
      alt: 'Menu du vendredi : Mandigue et Wolof',
      items: ['Soumara Lafri', 'Foutou ou Riz / Sauce arrachide', 'Tchep au poulet', 'Cabato blanc / Sauce da', 'Cabato jaune / Sauce da']
    },
    {
      id: 'vendredi-1', kind: 'day-detail', day: 'vendredi', dayLabel: 'Vendredi',
      image: '18-vendredi-cabato-da.jpg',
      alt: 'Cabato blanc et Cabato jaune, Sauce da',
      items: [
        { name: 'Cabato blanc', description: 'Queue de bœuf, poisson brochet fumé — Sauce da'},
        { name: 'Cabato jaune', description: 'Queue de bœuf, poisson brochet fumé — Sauce da'}
      ]
    },
    {
      id: 'vendredi-2', kind: 'day-detail', day: 'vendredi', dayLabel: 'Vendredi',
      image: '19-vendredi-tchep.jpg',
      alt: 'Tchep au poulet et Tchep au poisson',
      items: [
        { name: 'Tchep au poulet', description: 'Riz importé, poulet pondeuse, légumes'},
        { name: 'Tchep au poisson', description: 'Riz importé, poisson grillé, légumes'}
      ]
    },
    {
      id: 'vendredi-3', kind: 'day-detail', day: 'vendredi', dayLabel: 'Vendredi',
      image: '20-vendredi-soumara-arrachide.jpg',
      alt: 'Soumara lafri et Sauce arrachide',
      items: [
        { name: 'Soumara lafri', description: 'Riz importé, viande de bœuf'},
        { name: 'Sauce arrachide', description: 'Foutou ou riz, viande de bœuf'}
      ]
    },

    // ---------- SAMEDI ----------
    {
      id: 'samedi-cover', kind: 'day-cover', day: 'samedi', dayLabel: 'Samedi', theme: 'Menu Ebrié, Baoulé, Bété',
      image: '21-samedi-couverture.jpg',
      alt: 'Menu du samedi : Ebrié, Baoulé, Bété',
      items: ['Placali / Côpè', 'Emérédji', 'Kokotcha', 'Sauce graine / Riz ou Foutou', 'Sauce pistache / Riz ou Foutou']
    },
    {
      id: 'samedi-1', kind: 'day-detail', day: 'samedi', dayLabel: 'Samedi',
      image: '22-samedi-kokotcha.jpg',
      alt: 'Kokotcha',
      items: [
        { name: 'Kokotcha', description: 'Foufou, crabe, escargot, queue de bœuf, poisson brochet fumé'}
      ]
    },
    {
      id: 'samedi-2', kind: 'day-detail', day: 'samedi', dayLabel: 'Samedi',
      image: '23-samedi-cope-pistache.jpg',
      alt: 'Côpè et Sauce pistache',
      items: [
        { name: 'Côpè', description: 'Placali, crabe, tripes, kplo'},
        { name: 'Sauce pistache', description: 'Riz importé, poulet pondeuse'}
      ]
    },
    {
      id: 'samedi-3', kind: 'day-detail', day: 'samedi', dayLabel: 'Samedi',
      image: '24-samedi-emeredji-graine.jpg',
      alt: 'Emérédji et Sauce graine ébrié',
      items: [
        { name: 'Emérédji', description: 'Attiéké huile rouge ou blanc, poisson carpe et crabe'},
        { name: 'Sauce graine ébrié', description: 'Foutou banane, poisson brochet fumé et queue de bœuf'}
      ]
    },

    // ---------- DIMANCHE ----------
    {
      id: 'dimanche-cover', kind: 'day-cover', day: 'dimanche', dayLabel: 'Dimanche', theme: 'Menu Ebrié, Baoulé, Bété',
      image: '25-dimanche-couverture.jpg',
      alt: 'Menu du dimanche : Ebrié, Baoulé, Bété',
      items: ['Placali / Côpè', 'Kokotcha', 'Sauce graine / Riz ou Foutou', 'Feuille de patate / Riz']
    },
    {
      id: 'dimanche-1', kind: 'day-detail', day: 'dimanche', dayLabel: 'Dimanche',
      image: '26-dimanche-feuille-graine.jpg',
      alt: 'Feuille de patate et Sauce graine ébrié',
      items: [
        { name: 'Feuille de patate', description: 'Riz local'},
        { name: 'Sauce graine ébrié', description: 'Foutou banane, poisson brochet fumé et queue de bœuf'}
      ]
    },
    {
      id: 'dimanche-2', kind: 'day-detail', day: 'dimanche', dayLabel: 'Dimanche',
      image: '27-dimanche-placali-kokotcha.jpg',
      alt: 'Placali Côpè et Kokotcha',
      items: [
        { name: 'Placali / Côpè', description: 'Crabe, tripes, kplo'},
        { name: 'Kokotcha', description: 'Foufou, crabe, escargot, queue de bœuf, poisson brochet fumé'}
      ]
    },

    {
      id: 'cover-fin',
      kind: 'cover-end',
      image: '28-couverture-fin.jpg',
      alt: 'Occasions Cook Africa : dot, mariage, anniversaires, repas en famille et entre amis — adresses et contacts.'
    }
  ],

  contact: {
    addressShort: '2 plateaux vallons rue des jardins, RESIDENCE OHINENE',
    phones: ['05 84 37 79 80', '01 51 45 91 34'],
    site: 'www.cookafricavip.com'
  }
};

export default catalog;
