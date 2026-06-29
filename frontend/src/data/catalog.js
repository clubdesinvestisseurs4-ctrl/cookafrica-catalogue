// Manifeste du catalogue Cook Africa : ordre des pages et image associée.
// Ce fichier est la donnée de repli (bundlée) utilisée si l'API /api/catalog est indisponible.

export const catalog = {
  title: 'Cook Africa — Le Menu',
  subtitle: "Découvrez les richesses culinaires africaines",
  pages: [
    {
      id: 'cover-debut',
      kind: 'cover-start',
      image: 'couverture-debut.jpg',
      alt: 'Couverture du catalogue Cook Africa : Le Menu, découvrez les richesses culinaires.'
    },
    {
      id: 'lundi',
      kind: 'day-cover',
      dayLabel: 'Lundi',
      theme: 'Akié, Bété, Dida',
      image: 'LUNDI.jpg',
      alt: 'Menu du jour — spécialités Akié, Bété, Dida'
    },
    {
      id: 'mardi',
      kind: 'day-cover',
      dayLabel: 'Mardi',
      theme: 'Agni, Abron, Baoulé',
      image: 'MARDI.jpg',
      alt: 'Menu du jour — spécialités Agni, Abron, Baoulé'
    },
    {
      id: 'mercredi',
      kind: 'day-cover',
      dayLabel: 'Mercredi',
      theme: 'Krobou, Ébrié, Adjoukrou',
      image: 'MERCREDI.jpg',
      alt: 'Menu du jour — spécialités Krobou, Ébrié, Adjoukrou'
    },
    {
      id: 'jeudi',
      kind: 'day-cover',
      dayLabel: 'Jeudi',
      theme: 'Wê, Dan',
      image: 'JEUDI.jpeg',
      alt: 'Menu du jour — spécialités Wê et Dan'
    },
    {
      id: 'vendredi',
      kind: 'day-cover',
      dayLabel: 'Vendredi',
      theme: 'Sénoufo, Malinké, Sénégalais',
      image: 'VENDREDI.jpg',
      alt: 'Menu du jour — spécialités Sénoufo, Malinké, Sénégalais'
    },
    {
      id: 'samedi-dimanche',
      kind: 'day-cover',
      dayLabel: 'Samedi & Dimanche',
      theme: 'Ébriés, Baoulés',
      image: 'SAMEDI-DIMANCHE.jpg',
      alt: 'Menu du jour — spécialités Ébriés, Baoulés'
    },
    {
      id: 'cover-fin',
      kind: 'cover-end',
      image: 'couverture-fin.jpg',
      alt: 'Occasions Cook Africa : dot, mariage, anniversaires, repas en famille et entre amis — adresses et contacts.'
    }
  ],

  contact: {
    addressShort: 'Angré 8ème tranche, KFC, derrière la station Shell',
    phones: ['05 84 37 79 80', '01 51 45 91 34'],
    site: 'www.cookafricavip.com'
  }
};

export default catalog;
