(function (global) {
  'use strict';

  // EDITABLE FAQ CONTENT
  // This MVP copy is provisional. Update or extend only the `locales` data below;
  // matching and rendering behavior lives in faq-assistant.js.
  global.ltFaqAssistantContent = {
    version: 'provisional-2026-08-23b',
    whatsappNumber: '639695291297',
    locales: {
      en: {
        ui: {
          triggerLabel: 'Need help?',
          closeLabel: 'Close the help guide',
          eyebrow: 'Quick guide · Provisional content',
          title: 'How can we point you in the right direction?',
          intro: 'Choose a topic or type a short question. Details can change, so confirm availability, schedules and quotes with the team.',
          topicsLabel: 'Popular topics',
          questionLabel: 'What can we help with?',
          questionPlaceholder: 'Try “Apo Island”, “room” or “course”',
          submitLabel: 'Find answer',
          privacy: 'Your typed question stays in this browser. It is not sent, saved or included in analytics.',
          resultLabel: 'Suggested answer',
          provisionalNote: 'This guide is provisional. The linked pages and La Tortue team can confirm current details.',
          emptyQuestion: 'Type a short question first.',
          noMatchTitle: 'Let’s ask the team',
          noMatchText: 'This guide does not have a reliable answer yet. Open WhatsApp and add your question there.',
          whatsappLabel: 'Ask on WhatsApp',
          whatsappMessage: 'Hello La Tortue! I have a question after using the website guide.'
        },
        topics: [
          {
            id: 'resort',
            label: 'Resort & stay',
            title: 'Resort and stay planning',
            answer: 'Start with room options, the restaurant, or the contact page for practical trip planning.',
            links: [
              { id: 'rooms', label: 'View rooms', path: '/cottages.html' },
              { id: 'restaurant', label: 'View restaurant', path: '/dining.html' },
              { id: 'contact', label: 'Contact the team', path: '/contact.html' }
            ]
          },
          {
            id: 'diving',
            label: 'Diving',
            title: 'Diving information',
            answer: 'Start with courses, guided fun dives, Apo Island trips, or the local dive-site guide.',
            links: [
              { id: 'courses', label: 'Explore courses', path: '/diving.html' },
              { id: 'fun_dives', label: 'See fun dives', path: '/diving-fun-dives.html' },
              { id: 'apo_island', label: 'See Apo trips', path: '/diving-apo-trips.html' },
              { id: 'dive_sites', label: 'Browse dive sites', path: '/diving-sites.html' }
            ]
          }
        ],
        entries: [
          {
            id: 'rooms',
            title: 'Rooms and accommodation',
            answer: 'See the Rooms page for room types and the booking options currently shown on the site. Ask the team to confirm dates, occupancy, availability and the final quote.',
            keywords: ['room', 'rooms', 'cottage', 'cottages', 'dorm', 'dormitory', 'accommodation', 'stay', 'bed', 'private room', 'chambre', 'chambres', 'hébergement', 'dortoir', 'lit', 'séjour', 'séjourner', 'logement'],
            links: [
              { id: 'rooms', label: 'View rooms', path: '/cottages.html' },
              { id: 'contact', label: 'Ask about a stay', path: '/contact.html' }
            ]
          },
          {
            id: 'restaurant',
            title: 'Restaurant and day visits',
            answer: 'Use the Restaurant page for the menu and visitor information published on the site. Confirm current service, group requests or special needs directly with the team.',
            keywords: ['restaurant', 'menu', 'food', 'eat', 'dining', 'breakfast', 'lunch', 'dinner', 'drink', 'drinks', 'day pass', 'meal', 'repas', 'manger', 'petit déjeuner', 'déjeuner', 'dîner', 'boisson', 'boissons', 'pass journée'],
            links: [
              { id: 'restaurant', label: 'View restaurant', path: '/dining.html' },
              { id: 'contact', label: 'Contact the team', path: '/contact.html' }
            ]
          },
          {
            id: 'arrival_contact',
            title: 'Contact, location and arrival',
            answer: 'The Contact page has the site’s contact options and location details. Confirm any pickup, transfer or time-sensitive travel plan directly with the team.',
            keywords: ['contact', 'address', 'location', 'map', 'where are you located', 'airport', 'transfer', 'transport', 'getting there', 'arrival', 'arrive', 'dumaguete', 'ferry', 'adresse', 'où êtes-vous situés', 'aéroport', 'transfert', 'transport', 'venir', 'arrivée', 'bateau'],
            links: [
              { id: 'contact', label: 'Open contact page', path: '/contact.html' }
            ]
          },
          {
            id: 'courses',
            title: 'Diving courses and certifications',
            answer: 'Browse the Courses page for the training paths published on the site. The team should confirm the suitable level, prerequisites, dates, schedule and final quote.',
            keywords: ['course', 'courses', 'learn to dive', 'certification', 'open water', 'advanced', 'rescue', 'divemaster', 'instructor', 'ssi', 'ffessm', 'training', 'cours', 'apprendre à plonger', 'formation', 'certification', 'niveau', 'plongeur', 'instructeur'],
            links: [
              { id: 'courses', label: 'Explore courses', path: '/diving.html' },
              { id: 'contact', label: 'Ask about training', path: '/contact.html' }
            ]
          },
          {
            id: 'fun_dives',
            title: 'Guided fun dives',
            answer: 'The Fun Dives page explains the guided diving options and posted information for certified divers. Ask the team to confirm a plan that fits your dates, certification and experience.',
            keywords: ['fun dive', 'fun dives', 'guided dive', 'guided dives', 'certified diver', 'shore dive', 'shore diving', 'nitrox', 'dive package', 'plongée loisir', 'plongées loisirs', 'plongée guidée', 'plongées guidées', 'plongeur certifié', 'plongée du bord', 'forfait plongée'],
            links: [
              { id: 'fun_dives', label: 'See fun dives', path: '/diving-fun-dives.html' },
              { id: 'contact', label: 'Plan guided dives', path: '/contact.html' }
            ]
          },
          {
            id: 'apo_island',
            title: 'Apo Island trips',
            answer: 'See the Apo Island page for the trip information published on the site. Boat schedules, access and conditions can change, so confirm your preferred date with the team.',
            keywords: ['apo', 'apo island', 'apo trip', 'apo trips', 'boat trip', 'boat dive', 'island dive', 'turtle', 'turtles', 'sortie apo', 'sorties apo', 'île apo', 'bateau apo', 'plongée apo', 'tortue', 'tortues'],
            links: [
              { id: 'apo_island', label: 'See Apo trips', path: '/diving-apo-trips.html' },
              { id: 'contact', label: 'Ask about a date', path: '/contact.html' }
            ]
          },
          {
            id: 'dive_sites',
            title: 'Dauin dive sites and marine life',
            answer: 'Use the Dive Sites page to explore the local underwater environments described on the site. Conditions and wildlife sightings vary and cannot be guaranteed.',
            keywords: ['dive site', 'dive sites', 'house reef', 'macro', 'muck', 'marine life', 'critters', 'underwater photography', 'reef', 'reefs', 'site de plongée', 'sites de plongée', 'récif maison', 'macro', 'faune marine', 'photo sous-marine', 'récif', 'récifs'],
            links: [
              { id: 'dive_sites', label: 'Browse dive sites', path: '/diving-sites.html' },
              { id: 'fun_dives', label: 'See fun dives', path: '/diving-fun-dives.html' }
            ]
          },
          {
            id: 'quote_booking',
            title: 'Availability, booking and quotes',
            answer: 'For current availability, schedules and a final quote, contact the team directly. Include your dates, number of guests and diving goals so they can reply accurately.',
            keywords: ['price', 'prices', 'pricing', 'rate', 'rates', 'cost', 'how much', 'quote', 'availability', 'available', 'book', 'booking', 'reserve', 'reservation', 'schedule', 'dates', 'prix', 'tarif', 'tarifs', 'coût', 'combien', 'devis', 'disponibilité', 'disponible', 'réserver', 'réservation', 'planning'],
            links: [
              { id: 'contact', label: 'Contact the team', path: '/contact.html' }
            ]
          }
        ]
      },
      fr: {
        ui: {
          triggerLabel: 'Besoin d’aide ?',
          closeLabel: 'Fermer le guide d’aide',
          eyebrow: 'Guide rapide · Contenu provisoire',
          title: 'Comment pouvons-nous vous orienter ?',
          intro: 'Choisissez un thème ou saisissez une courte question. Les détails peuvent changer : confirmez disponibilités, horaires et devis auprès de l’équipe.',
          topicsLabel: 'Thèmes populaires',
          questionLabel: 'Comment pouvons-nous vous aider ?',
          questionPlaceholder: 'Essayez « Apo Island », « chambre » ou « cours »',
          submitLabel: 'Trouver',
          privacy: 'Votre question reste dans ce navigateur. Elle n’est ni envoyée, ni enregistrée, ni incluse dans les statistiques.',
          resultLabel: 'Réponse suggérée',
          provisionalNote: 'Ce guide est provisoire. Les pages liées et l’équipe de La Tortue peuvent confirmer les informations actuelles.',
          emptyQuestion: 'Saisissez d’abord une courte question.',
          noMatchTitle: 'Demandons à l’équipe',
          noMatchText: 'Ce guide n’a pas encore de réponse fiable. Ouvrez WhatsApp et ajoutez-y votre question.',
          whatsappLabel: 'Demander sur WhatsApp',
          whatsappMessage: 'Bonjour La Tortue ! J’ai une question après avoir utilisé le guide du site.'
        },
        topics: [
          {
            id: 'resort',
            label: 'Resort & séjour',
            title: 'Préparer votre séjour au resort',
            answer: 'Commencez par les chambres, le restaurant ou la page Contact pour les aspects pratiques du voyage.',
            links: [
              { id: 'rooms', label: 'Voir les chambres', path: '/cottages.html' },
              { id: 'restaurant', label: 'Voir le restaurant', path: '/dining.html' },
              { id: 'contact', label: 'Contacter l’équipe', path: '/contact.html' }
            ]
          },
          {
            id: 'diving',
            label: 'Plongée',
            title: 'Informations plongée',
            answer: 'Commencez par les cours, les plongées loisirs guidées, les sorties Apo Island ou le guide des sites locaux.',
            links: [
              { id: 'courses', label: 'Découvrir les cours', path: '/diving.html' },
              { id: 'fun_dives', label: 'Voir les plongées loisirs', path: '/diving-fun-dives.html' },
              { id: 'apo_island', label: 'Voir les sorties Apo', path: '/diving-apo-trips.html' },
              { id: 'dive_sites', label: 'Explorer les sites', path: '/diving-sites.html' }
            ]
          }
        ],
        entries: [
          {
            id: 'rooms',
            title: 'Chambres et hébergement',
            answer: 'Consultez la page Chambres pour les types d’hébergement et les options de réservation affichées sur le site. Demandez à l’équipe de confirmer les dates, l’occupation, la disponibilité et le devis final.',
            keywords: ['room', 'rooms', 'cottage', 'cottages', 'dorm', 'dormitory', 'accommodation', 'stay', 'bed', 'private room', 'chambre', 'chambres', 'hébergement', 'dortoir', 'lit', 'séjour', 'séjourner', 'logement'],
            links: [
              { id: 'rooms', label: 'Voir les chambres', path: '/cottages.html' },
              { id: 'contact', label: 'Demander un séjour', path: '/contact.html' }
            ]
          },
          {
            id: 'restaurant',
            title: 'Restaurant et visite à la journée',
            answer: 'Consultez la page Restaurant pour le menu et les informations visiteurs publiées sur le site. Confirmez le service actuel, les demandes de groupe ou les besoins particuliers auprès de l’équipe.',
            keywords: ['restaurant', 'menu', 'food', 'eat', 'dining', 'breakfast', 'lunch', 'dinner', 'drink', 'drinks', 'day pass', 'meal', 'repas', 'manger', 'petit déjeuner', 'déjeuner', 'dîner', 'boisson', 'boissons', 'pass journée'],
            links: [
              { id: 'restaurant', label: 'Voir le restaurant', path: '/dining.html' },
              { id: 'contact', label: 'Contacter l’équipe', path: '/contact.html' }
            ]
          },
          {
            id: 'arrival_contact',
            title: 'Contact, localisation et arrivée',
            answer: 'La page Contact regroupe les moyens de joindre l’équipe et les informations de localisation du site. Confirmez directement tout transfert, prise en charge ou trajet soumis à un horaire.',
            keywords: ['contact', 'address', 'location', 'map', 'where are you located', 'airport', 'transfer', 'transport', 'getting there', 'arrival', 'arrive', 'dumaguete', 'ferry', 'adresse', 'où êtes-vous situés', 'aéroport', 'transfert', 'transport', 'venir', 'arrivée', 'bateau'],
            links: [
              { id: 'contact', label: 'Ouvrir la page Contact', path: '/contact.html' }
            ]
          },
          {
            id: 'courses',
            title: 'Cours et certifications de plongée',
            answer: 'Parcourez la page Cours pour les formations publiées sur le site. L’équipe doit confirmer le niveau adapté, les prérequis, les dates, le planning et le devis final.',
            keywords: ['course', 'courses', 'learn to dive', 'certification', 'open water', 'advanced', 'rescue', 'divemaster', 'instructor', 'ssi', 'ffessm', 'training', 'cours', 'apprendre à plonger', 'formation', 'certification', 'niveau', 'plongeur', 'instructeur'],
            links: [
              { id: 'courses', label: 'Découvrir les cours', path: '/diving.html' },
              { id: 'contact', label: 'Demander une formation', path: '/contact.html' }
            ]
          },
          {
            id: 'fun_dives',
            title: 'Plongées loisirs guidées',
            answer: 'La page Plongées loisirs présente les options guidées et les informations publiées pour les plongeurs certifiés. Demandez à l’équipe de confirmer un programme adapté à vos dates, votre certification et votre expérience.',
            keywords: ['fun dive', 'fun dives', 'guided dive', 'guided dives', 'certified diver', 'shore dive', 'shore diving', 'nitrox', 'dive package', 'plongée loisir', 'plongées loisirs', 'plongée guidée', 'plongées guidées', 'plongeur certifié', 'plongée du bord', 'forfait plongée'],
            links: [
              { id: 'fun_dives', label: 'Voir les plongées loisirs', path: '/diving-fun-dives.html' },
              { id: 'contact', label: 'Planifier des plongées', path: '/contact.html' }
            ]
          },
          {
            id: 'apo_island',
            title: 'Sorties Apo Island',
            answer: 'Consultez la page Apo Island pour les informations publiées sur la sortie. Les horaires bateau, l’accès et les conditions peuvent changer : confirmez votre date préférée auprès de l’équipe.',
            keywords: ['apo', 'apo island', 'apo trip', 'apo trips', 'boat trip', 'boat dive', 'island dive', 'turtle', 'turtles', 'sortie apo', 'sorties apo', 'île apo', 'bateau apo', 'plongée apo', 'tortue', 'tortues'],
            links: [
              { id: 'apo_island', label: 'Voir les sorties Apo', path: '/diving-apo-trips.html' },
              { id: 'contact', label: 'Demander une date', path: '/contact.html' }
            ]
          },
          {
            id: 'dive_sites',
            title: 'Sites de Dauin et vie marine',
            answer: 'Utilisez la page Sites de plongée pour découvrir les environnements sous-marins locaux décrits sur le site. Les conditions et observations d’animaux varient et ne peuvent pas être garanties.',
            keywords: ['dive site', 'dive sites', 'house reef', 'macro', 'muck', 'marine life', 'critters', 'underwater photography', 'reef', 'reefs', 'site de plongée', 'sites de plongée', 'récif maison', 'macro', 'faune marine', 'photo sous-marine', 'récif', 'récifs'],
            links: [
              { id: 'dive_sites', label: 'Explorer les sites', path: '/diving-sites.html' },
              { id: 'fun_dives', label: 'Voir les plongées loisirs', path: '/diving-fun-dives.html' }
            ]
          },
          {
            id: 'quote_booking',
            title: 'Disponibilités, réservation et devis',
            answer: 'Pour les disponibilités, les plannings et un devis final à jour, contactez directement l’équipe. Indiquez vos dates, le nombre de personnes et vos objectifs de plongée pour recevoir une réponse précise.',
            keywords: ['price', 'prices', 'pricing', 'rate', 'rates', 'cost', 'how much', 'quote', 'availability', 'available', 'book', 'booking', 'reserve', 'reservation', 'schedule', 'dates', 'prix', 'tarif', 'tarifs', 'coût', 'combien', 'devis', 'disponibilité', 'disponible', 'réserver', 'réservation', 'planning'],
            links: [
              { id: 'contact', label: 'Contacter l’équipe', path: '/contact.html' }
            ]
          }
        ]
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
