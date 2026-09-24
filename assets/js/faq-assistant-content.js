(function (global) {
  'use strict';

  // Editable source snapshot and French translation. See docs/faq-assistant-content.md.
  global.ltFaqAssistantContent = {
  "version": "draft-drive-2026-09-12-routing-3",
  "whatsappNumber": "639695291297",
  "locales": {
    "en": {
      "ui": {
        "triggerLabel": "Need help?",
        "closeLabel": "Close the help guide",
        "title": "FAQ",
        "topicsLabel": "Popular topics",
        "questionLabel": "Ask anything",
        "submitLabel": "Find answer",
        "emptyQuestion": "Type a short question first.",
        "noMatchTitle": "Let’s ask the team",
        "noMatchText": "This guide does not have a reliable answer yet. Open WhatsApp and add your question there.",
        "whatsappLabel": "Ask on WhatsApp",
        "whatsappMessage": "Hello La Tortue! I have a question after using the website guide."
      },
      "topics": [
        {
          "id": "fun_dives",
          "label": "Fun Dives",
          "title": "Fun Dives",
          "entryIds": [
            "fun_dives",
            "dive_sites",
            "dive_prices",
            "dive_schedule",
            "dive_equipment",
            "diver_experience",
            "private_guide"
          ],
          "links": [
            {
              "id": "fun_dives",
              "label": "See page",
              "path": "/diving-fun-dives.html"
            }
          ]
        },
        {
          "id": "courses",
          "label": "Courses & Try Scuba",
          "title": "Courses & Try Scuba",
          "entryIds": [
            "courses",
            "certification_validity",
            "children_diving",
            "refresher"
          ],
          "links": [
            {
              "id": "courses",
              "label": "See page",
              "path": "/diving.html"
            }
          ]
        },
        {
          "id": "apo_island",
          "label": "Apo Island Trips",
          "title": "Apo Island Trips",
          "entryIds": [
            "apo_island",
            "apo_inclusions",
            "apo_requirements",
            "apo_no_prior_dive"
          ],
          "links": [
            {
              "id": "apo_island",
              "label": "See page",
              "path": "/diving-apo-trips.html"
            }
          ]
        },
        {
          "id": "rooms",
          "label": "Rooms & Booking",
          "title": "Rooms & Booking",
          "entryIds": [
            "rooms",
            "quote_booking",
            "combined_booking"
          ],
          "links": [
            {
              "id": "rooms",
              "label": "See page",
              "path": "/cottages.html"
            }
          ]
        },
        {
          "id": "arrival",
          "label": "Getting Here",
          "title": "Getting Here",
          "entryIds": [
            "arrival_contact"
          ],
          "links": [
            {
              "id": "arrival",
              "label": "See page",
              "path": "/contact.html"
            }
          ]
        },
        {
          "id": "resort",
          "label": "Resort & Restaurant",
          "title": "Resort & Restaurant",
          "entryIds": [
            "restaurant",
            "non_divers"
          ],
          "links": [
            {
              "id": "resort",
              "label": "See page",
              "path": "/dining.html"
            }
          ]
        }
      ],
      "searchRoutes": [
        {
          "id": "diving_overview",
          "title": "Diving",
          "answer": "Choose the type of diving information you need:",
          "keywords": [
            "diving",
            "dive",
            "plongée",
            "plonger"
          ],
          "topicIds": [
            "fun_dives",
            "courses"
          ]
        }
      ],
      "entries": [
        {
          "id": "rooms",
          "topicId": "rooms",
          "sourceRow": 11,
          "status": "source-draft",
          "title": "What kind of accommodation does La Tortue have?",
          "answer": "Our accommodation is simple, comfortable and close to the sea, with a relaxed island atmosphere rather than a luxury-resort feel.\n\n We have bamboo cottages with sea or garden views, as well as air-conditioned accommodation. Our Seaview Family Cottage has two queen beds and can accommodate up to four people, making it a good option for families.\n\n Some of our cottages are fan rooms rather than air-conditioned, which is part of the simple, open-to-nature La Tortue experience.",
          "questions": [
            "What kind of accommodation does La Tortue have?",
            "Quels hébergements propose La Tortue ?"
          ],
          "keywords": [
            "room",
            "rooms",
            "cottage",
            "cottages",
            "dorm",
            "dormitory",
            "accommodation",
            "accommodations",
            "stay",
            "bed",
            "private room",
            "chambre",
            "chambres",
            "hébergement",
            "hébergements",
            "dortoir",
            "lit",
            "séjour",
            "séjourner",
            "logement"
          ],
          "links": [
            {
              "id": "rooms",
              "label": "See details",
              "path": "/cottages.html"
            }
          ]
        },
        {
          "id": "restaurant",
          "title": "Restaurant and day visits",
          "answer": "Use the Restaurant page for the menu and visitor information published on the site. Confirm current service, group requests or special needs directly with the team.",
          "keywords": [
            "restaurant",
            "restaurants",
            "menu",
            "food",
            "eat",
            "dining",
            "breakfast",
            "lunch",
            "dinner",
            "drink",
            "drinks",
            "day use",
            "day visit",
            "day visits",
            "day visitor",
            "day pass",
            "meal",
            "repas",
            "manger",
            "petit déjeuner",
            "déjeuner",
            "dîner",
            "boisson",
            "boissons",
            "accès journée",
            "visite journée",
            "visite à la journée",
            "pass journée"
          ],
          "links": [
            {
              "id": "restaurant",
              "label": "View restaurant",
              "path": "/dining.html"
            },
            {
              "id": "contact",
              "label": "Contact the team",
              "path": "/contact.html"
            }
          ],
          "topicId": "resort",
          "status": "page-guidance"
        },
        {
          "id": "arrival_contact",
          "title": "How do I get to La Tortue?",
          "answer": "From Dumaguete, La Tortue is about 30 minutes south by road from the airport or seaport.\n\nFrom Siquijor, Bohol or Cebu, take a ferry to Dumaguete, then continue south by road to the resort.\n\nFrom Moalboal or western Cebu, travel south by road, cross to Negros by ferry, then continue by road towards Dumaguete and Dauin.\n\nFrom elsewhere on Negros, continue by road towards Dumaguete and Dauin.\n\nFerry and bus routes can change. Send the team your starting point, travel date and arrival time so they can help confirm the best current connection or transfer.",
          "keywords": [
            "contact",
            "address",
            "location",
            "map",
            "where are you located",
            "airport",
            "transfer",
            "transport",
            "get there",
            "getting there",
            "how do i get there",
            "how to get there",
            "when can i arrive",
            "what time can i arrive",
            "late arrival",
            "arrival time",
            "arrival",
            "dumaguete",
            "siquijor",
            "bohol",
            "cebu",
            "moalboal",
            "negros",
            "ferry",
            "adresse",
            "où êtes-vous situés",
            "aéroport",
            "transfert",
            "transport",
            "comment venir",
            "comment arriver",
            "comment se rendre",
            "à quelle heure puis-je arriver",
            "arrivée tardive",
            "heure d’arrivée",
            "arrivée",
            "bateau"
          ],
          "links": [
            {
              "id": "contact",
              "label": "Open contact page",
              "path": "/contact.html"
            }
          ],
          "topicId": "arrival",
          "status": "page-guidance"
        },
        {
          "id": "courses",
          "topicId": "courses",
          "sourceRow": 9,
          "status": "source-draft",
          "title": "Can beginners learn to dive at La Tortue?",
          "answer": "Absolutely! We offer SSI courses and introductory experiences for people who want to discover diving or work towards certification.\n\n Our Try Scuba Experience is ₱3,000 per person, inclusive of equipment and marine fees.\n\n If you enjoy your first experience and would like to continue towards certification, we can also help you continue with an Open Water course.",
          "questions": [
            "Can beginners learn to dive at La Tortue?",
            "Les débutants peuvent-ils apprendre à plonger à La Tortue ?"
          ],
          "keywords": [
            "course",
            "courses",
            "learn to dive",
            "open water",
            "advanced",
            "rescue",
            "divemaster",
            "instructor",
            "ssi",
            "ffessm",
            "training",
            "cours",
            "apprendre à plonger",
            "formation",
            "niveau",
            "plongeur",
            "instructeur",
            "beginner",
            "beginners",
            "try scuba",
            "débutant",
            "débutants",
            "baptême"
          ],
          "links": [
            {
              "id": "courses",
              "label": "See details",
              "path": "/diving.html"
            }
          ]
        },
        {
          "id": "fun_dives",
          "title": "Guided fun dives",
          "answer": "The Fun Dives page explains the guided diving options and posted information for certified divers. Ask the team to confirm a plan that fits your dates, certification and experience.",
          "keywords": [
            "fun dive",
            "fun dives",
            "guided dive",
            "guided dives",
            "guided shore dive",
            "guided shore dives",
            "certified diver",
            "shore dive",
            "shore dives",
            "shore diving",
            "nitrox",
            "dive package",
            "plongée loisir",
            "plongées loisirs",
            "plongée guidée",
            "plongées guidées",
            "plongeur certifié",
            "plongée du bord",
            "plongées du bord",
            "plongée guidée du bord",
            "plongées guidées du bord",
            "forfait plongée"
          ],
          "links": [
            {
              "id": "fun_dives",
              "label": "See fun dives",
              "path": "/diving-fun-dives.html"
            },
            {
              "id": "contact",
              "label": "Plan guided dives",
              "path": "/contact.html"
            }
          ],
          "topicId": "fun_dives",
          "status": "page-guidance"
        },
        {
          "id": "apo_island",
          "topicId": "apo_island",
          "sourceRow": 7,
          "status": "source-draft",
          "title": "How do I get to Apo Island from La Tortue?",
          "answer": "We organize Apo Island day trips with three dives and a meal included for ₱6,200 per person.\n\n From November to May, we arrange Apo Island trips every Thursday and Sunday. For the rest of the year, trips are available on demand, depending on conditions and sufficient interest.\n\n Apo Island sea scapes are different from our coastal diving, so we recommend doing both if you have enough time!",
          "questions": [
            "How do I get to Apo Island from La Tortue?",
            "Comment aller à Apo Island depuis La Tortue ?"
          ],
          "keywords": [
            "apo",
            "apo island",
            "apo trip",
            "apo trips",
            "boat trip",
            "boat dive",
            "island dive",
            "turtle",
            "turtles",
            "sortie apo",
            "sorties apo",
            "île apo",
            "bateau apo",
            "plongée apo",
            "tortue",
            "tortues",
            "apo schedule",
            "apo departure",
            "apo horaires"
          ],
          "links": [
            {
              "id": "apo_island",
              "label": "See details",
              "path": "/diving-apo-trips.html"
            }
          ]
        },
        {
          "id": "dive_sites",
          "topicId": "fun_dives",
          "sourceRow": 3,
          "status": "source-draft",
          "title": "What is diving like at La Tortue?",
          "answer": "Dauin is famous for its incredible marine life, especially muck diving and macro photography. We offer guided shore-entry dives along the Dauin coast, with dive sites ranging from shallow reefs to deeper sites.\n\n You can find everything from frogfish, seahorses and nudibranchs to turtles, cuttlefish and many other unusual creatures. Our house reef is just in front of La Tortue, so you don't need to travel far to have a great dive.",
          "questions": [
            "What is diving like at La Tortue?",
            "Comment se passe la plongée à La Tortue ?"
          ],
          "keywords": [
            "dive site",
            "dive sites",
            "house reef",
            "macro",
            "muck",
            "marine life",
            "critters",
            "underwater photography",
            "reef",
            "reefs",
            "site de plongée",
            "sites de plongée",
            "récif maison",
            "faune marine",
            "photo sous-marine",
            "récif",
            "récifs",
            "diving like",
            "plongée à la tortue"
          ],
          "links": [
            {
              "id": "dive_sites",
              "label": "See details",
              "path": "/diving-sites.html"
            }
          ]
        },
        {
          "id": "quote_booking",
          "title": "Availability, booking and quotes",
          "answer": "For current availability, schedules and a final quote, contact the team directly. Include your dates, number of guests and diving goals so they can reply accurately.",
          "keywords": [
            "price",
            "prices",
            "pricing",
            "rate",
            "rates",
            "cost",
            "how much",
            "quote",
            "availability",
            "available",
            "book",
            "booking",
            "reserve",
            "reservation",
            "schedule",
            "dates",
            "prix",
            "tarif",
            "tarifs",
            "coût",
            "combien",
            "devis",
            "disponibilité",
            "disponible",
            "réserver",
            "réservation",
            "planning",
            "payment",
            "payment methods",
            "deposit",
            "paiement",
            "moyens de paiement",
            "acompte"
          ],
          "links": [
            {
              "id": "contact",
              "label": "Contact the team",
              "path": "/contact.html"
            }
          ],
          "topicId": "rooms",
          "status": "page-guidance"
        },
        {
          "id": "certification_validity",
          "topicId": "courses",
          "sourceRow": 2,
          "status": "source-draft",
          "title": "how long is the validity of my certification ?",
          "answer": "diving certification has no expiry. if you dont dive for an extended time after your certification, you will not loose it. however a short \"refresh\" can be recommended or required by the dive center where you will dive again.",
          "questions": [
            "how long is the validity of my certification ?",
            "Quelle est la durée de validité de ma certification ?"
          ],
          "keywords": [
            "certification expiry",
            "certification expire",
            "certification validity",
            "validity of my certification",
            "validité certification",
            "durée de validité",
            "expiration certification"
          ],
          "links": [
            {
              "id": "certification_validity",
              "label": "See details",
              "path": "/diving.html"
            }
          ]
        },
        {
          "id": "dive_prices",
          "topicId": "fun_dives",
          "sourceRow": 4,
          "status": "source-draft",
          "title": "How much does a fun dive cost?",
          "answer": "Our fun dives for certified divers start at ₱1,900 per person per dive, with equipment rental and marine fees included.\n\n We also offer:\n • 5% discount for 6+ dives\n • 10% discount for 12+ dives",
          "questions": [
            "How much does a fun dive cost?",
            "Combien coûte une plongée loisir ?"
          ],
          "keywords": [
            "fun dive cost",
            "fun dive price",
            "dive prices",
            "diving prices",
            "dive cost",
            "prix plongée",
            "prix des plongées",
            "coûte une plongée",
            "tarif plongée",
            "prix d une plongée",
            "discount",
            "réduction"
          ],
          "links": [
            {
              "id": "dive_prices",
              "label": "See details",
              "path": "/diving-fun-dives.html"
            }
          ],
          "matchRules": [
            [
              [
                "dive",
                "dives",
                "diving",
                "plongée",
                "plongées"
              ],
              [
                "price",
                "prices",
                "cost",
                "costs",
                "how much",
                "prix",
                "tarif",
                "tarifs",
                "coûte",
                "combien"
              ]
            ]
          ],
          "excludeKeywords": [
            "apo",
            "snorkeling",
            "snorkelling",
            "try scuba",
            "refresher",
            "baptême",
            "remise à niveau"
          ]
        },
        {
          "id": "dive_schedule",
          "topicId": "fun_dives",
          "sourceRow": 5,
          "status": "source-draft",
          "title": "How many dives can I do in a day?",
          "answer": "We offer shore-entry coastal diving in Dauin daily, with up to four dives a day:\n\n • 8:30am\n • 11:30am\n • 2:30pm\n • 5:30pm — night dive\n\n The schedule can be adjusted depending on conditions and the needs of the group.",
          "questions": [
            "How many dives can I do in a day?",
            "Combien de plongées puis-je faire par jour ?"
          ],
          "keywords": [
            "dives a day",
            "dives per day",
            "dives in a day",
            "daily dive schedule",
            "dive times",
            "night dive",
            "night dives",
            "plongées par jour",
            "horaires plongée",
            "plongée de nuit",
            "plongées de nuit"
          ],
          "links": [
            {
              "id": "dive_schedule",
              "label": "See details",
              "path": "/diving-fun-dives.html"
            }
          ],
          "matchRules": [
            [
              [
                "dives",
                "diving",
                "plongées"
              ],
              [
                "per day",
                "a day",
                "in a day",
                "times",
                "schedule",
                "par jour",
                "horaires"
              ]
            ]
          ]
        },
        {
          "id": "dive_equipment",
          "topicId": "fun_dives",
          "sourceRow": 6,
          "status": "source-draft",
          "title": "Do I need to rent diving equipment?",
          "answer": "No. We include free equipment rental in our fun-dive prices, so there is no separate equipment rental fee.\n\n If you have your own equipment, you're of course welcome to bring and use it. We also offer options such as Nitrox and 15L tanks for an additional fee.",
          "questions": [
            "Do I need to rent diving equipment?",
            "Dois-je louer du matériel de plongée ?"
          ],
          "keywords": [
            "equipment rental",
            "rent diving equipment",
            "own equipment",
            "nitrox",
            "15l",
            "15 litres",
            "matériel",
            "équipement",
            "location matériel"
          ],
          "links": [
            {
              "id": "dive_equipment",
              "label": "See details",
              "path": "/diving-fun-dives.html"
            }
          ],
          "matchRules": [
            [
              [
                "equipment",
                "rental",
                "gear",
                "matériel",
                "équipement",
                "nitrox"
              ]
            ]
          ]
        },
        {
          "id": "apo_inclusions",
          "topicId": "apo_island",
          "sourceRow": 8,
          "status": "source-draft",
          "title": "What is included in the Apo Island trip?",
          "answer": "Our ₱6,200 Apo Island trip includes three dives, marine fees, equipment, dive guide, boat transportation and a meal.\n\n If you'd prefer a more personalized experience, a private guide for Apo Island is available for an additional ₱2,500 per trip.",
          "questions": [
            "What is included in the Apo Island trip?",
            "Que comprend la sortie à Apo Island ?"
          ],
          "keywords": [
            "included in the apo",
            "apo inclusions",
            "apo island trip include",
            "comprend la sortie",
            "inclus dans la sortie apo",
            "apo inclus"
          ],
          "links": [
            {
              "id": "apo_island",
              "label": "See details",
              "path": "/diving-apo-trips.html"
            }
          ],
          "matchRules": [
            [
              [
                "apo"
              ],
              [
                "included",
                "include",
                "includes",
                "inclusions",
                "inclus",
                "comprend",
                "compris"
              ]
            ]
          ]
        },
        {
          "id": "apo_requirements",
          "topicId": "apo_island",
          "status": "client-draft",
          "title": "Do you have any minimum requirements to join an Apo Island trip?",
          "answer": "For scuba divers, a prior coastal dive with La Tortue is necessary before joining an Apo Island trip. This gives the team a chance to make any needed adjustments to your gear and tank size, and to create appropriate dive groups before the full-day boat trip.\n\nThe coastal fun dive costs ₱1,900 per person, including equipment and marine fees.",
          "questions": [
            "Do you have any minimum requirements to join an Apo Island trip?",
            "Quelles sont les conditions minimales pour participer à une sortie Apo Island ?"
          ],
          "keywords": [
            "apo minimum requirements",
            "requirements for apo",
            "prior coastal dive",
            "coastal dive before apo",
            "dive before apo",
            "conditions pour apo",
            "conditions minimales apo",
            "plongée côtière avant apo",
            "plongée avant apo"
          ],
          "excludeKeywords": [
            "no time",
            "dont have time",
            "don't have time",
            "cannot",
            "can't",
            "pas le temps",
            "impossible"
          ],
          "links": [
            {
              "id": "apo_island",
              "label": "See details",
              "path": "/diving-apo-trips.html"
            }
          ],
          "matchRules": [
            [
              ["apo"],
              ["requirement", "requirements", "required", "prior", "before", "condition", "conditions", "nécessaire", "avant"]
            ]
          ]
        },
        {
          "id": "apo_no_prior_dive",
          "topicId": "apo_island",
          "status": "client-draft",
          "title": "What if I don’t have time for a dive before Apo Island?",
          "answer": "If you do not have time for a coastal dive before the Apo Island trip, La Tortue can arrange a private guide for ₱2,500 for the full day at Apo Island. This gives you dedicated attention if you need assistance without disrupting the other members of the group.",
          "questions": [
            "What if I don’t have time for a dive before Apo Island?",
            "What if we don't have time to do a dive prior to Apo Island?",
            "Et si je n’ai pas le temps de plonger avant Apo Island ?"
          ],
          "keywords": [
            "no time before apo",
            "no time for prior dive",
            "cannot dive before apo",
            "can't dive before apo",
            "private guide instead",
            "pas le temps avant apo",
            "pas le temps de plonger avant apo",
            "impossible de plonger avant apo",
            "guide privé à la place"
          ],
          "links": [
            {
              "id": "apo_island",
              "label": "See details",
              "path": "/diving-apo-trips.html"
            }
          ],
          "matchRules": [
            [
              ["apo"],
              ["no time", "cannot", "can't", "dont have time", "don't have time", "pas le temps", "impossible"],
              ["before", "prior", "avant"]
            ]
          ]
        },
        {
          "id": "children_diving",
          "topicId": "courses",
          "sourceRow": 10,
          "status": "source-draft",
          "title": "Can children dive at La Tortue?",
          "answer": "Yes! Children can start their diving journey with us from a young age.\n\n Our Try Scuba Experience is available for children aged 8 and above, making it a great way for them to discover diving and see if they enjoy being underwater.\n\n For children 10 years and above, they can also continue on to the SSI Junior Open Water course. Children under 15 receive a Junior Open Water Diver certification.\n\n Our team can advise you on the most appropriate program based on your child's age, experience and comfort in the water.",
          "questions": [
            "Can children dive at La Tortue?",
            "Les enfants peuvent-ils plonger à La Tortue ?"
          ],
          "keywords": [
            "children",
            "child",
            "kids",
            "minimum age",
            "junior",
            "enfant",
            "enfants",
            "âge minimum"
          ],
          "links": [
            {
              "id": "children_diving",
              "label": "See details",
              "path": "/diving.html"
            }
          ],
          "matchRules": [
            [
              [
                "children",
                "child",
                "kids",
                "enfants",
                "enfant",
                "junior"
              ]
            ]
          ]
        },
        {
          "id": "combined_booking",
          "topicId": "rooms",
          "sourceRow": 12,
          "status": "source-draft",
          "title": "Do I need to book diving and accommodation together?",
          "answer": "Not necessarily! You can book your accommodation separately through Booking.com and arrange your diving directly with us.\n\n We actually recommend securing your preferred room first during busy periods, then we can help you plan your diving around your dates.\n\n For diving, simply let us know your certification level, number of dives, preferred dates and whether you'd like Dauin shore dives, night dives or an Apo Island trip, and we'll help you put together a plan.",
          "questions": [
            "Do I need to book diving and accommodation together?",
            "Faut-il réserver la plongée et l’hébergement ensemble ?"
          ],
          "keywords": [
            "diving and accommodation",
            "book together",
            "booking.com",
            "plongée et hébergement",
            "plongée et l hébergement",
            "réserver ensemble"
          ],
          "links": [
            {
              "id": "combined_booking",
              "label": "See details",
              "path": "/cottages.html"
            }
          ],
          "matchRules": [
            [
              [
                "diving",
                "plongée"
              ],
              [
                "accommodation",
                "hébergement"
              ],
              [
                "together",
                "ensemble"
              ]
            ]
          ]
        },
        {
          "id": "diver_experience",
          "topicId": "fun_dives",
          "sourceRow": 13,
          "status": "source-draft",
          "title": "Do I need to be an experienced diver to dive Dauin?",
          "answer": "Not at all! Dauin has dive sites suitable for different experience levels. Our guides will adapt the dive to your certification, experience and comfort level.\n\n If you're newly certified or haven't dived in a while, just let us know and we'll help you choose the right dives.",
          "questions": [
            "Do I need to be an experienced diver to dive Dauin?",
            "Faut-il être expérimenté pour plonger à Dauin ?"
          ],
          "keywords": [
            "experienced diver",
            "experience level",
            "newly certified",
            "expérimenté",
            "nouvellement certifié",
            "niveau d expérience"
          ],
          "links": [
            {
              "id": "diver_experience",
              "label": "See details",
              "path": "/diving-fun-dives.html"
            }
          ]
        },
        {
          "id": "refresher",
          "topicId": "courses",
          "sourceRow": 14,
          "status": "source-draft",
          "title": "What if I haven't dived in a long time?",
          "answer": "We offer a Refresher Dive for ₱2,700, where you can review your skills and get comfortable in the water again before returning to regular fun diving.",
          "questions": [
            "What if I haven't dived in a long time?",
            "Que faire si je n’ai pas plongé depuis longtemps ?"
          ],
          "keywords": [
            "refresher",
            "refresh",
            "long time",
            "haven t dived",
            "remise à niveau",
            "pas plongé depuis",
            "reprendre la plongée"
          ],
          "links": [
            {
              "id": "refresher",
              "label": "See details",
              "path": "/diving-fun-dives.html"
            }
          ],
          "matchRules": [
            [
              [
                "refresher",
                "remise à niveau",
                "pas plongé depuis",
                "haven t dived"
              ]
            ]
          ]
        },
        {
          "id": "private_guide",
          "topicId": "fun_dives",
          "sourceRow": 15,
          "status": "source-draft",
          "title": "Can I have a private dive guide?",
          "answer": "Yes. We offer private guide options for guests who would like a more personalized experience. This can be particularly useful for photographers, families or divers who simply prefer having a guide dedicated to them.\n\n A private coastal guide is +₱500 per dive, while a private guide for an Apo Island trip is +₱2,500 per trip.",
          "questions": [
            "Can I have a private dive guide?",
            "Puis-je avoir un guide de plongée privé ?"
          ],
          "keywords": [
            "private guide",
            "private dive guide",
            "private coastal guide",
            "guide privé",
            "guide de plongée privé",
            "guide dédié"
          ],
          "links": [
            {
              "id": "private_guide",
              "label": "See details",
              "path": "/diving-fun-dives.html"
            }
          ],
          "matchRules": [
            [
              [
                "private",
                "privé"
              ],
              [
                "guide"
              ]
            ]
          ]
        },
        {
          "id": "non_divers",
          "topicId": "resort",
          "sourceRow": 16,
          "status": "source-draft",
          "title": "Can non-divers enjoy La Tortue?",
          "answer": "Absolutely! You don't have to dive to enjoy La Tortue.\n\n You can stay in our native bungalows, relax by the sea, enjoy our food, explore the area by snorkeling! We have snorkel gear for rent, you can see the reef just a few steps away from your room! If we have a trip scheduled, you can join us for an Apo Island snorkeling trip, which is ₱2,500 per person, including food, marine fees and snorkeling equipment.",
          "questions": [
            "Can non-divers enjoy La Tortue?",
            "Peut-on profiter de La Tortue sans plonger ?"
          ],
          "keywords": [
            "non diver",
            "non divers",
            "non diving",
            "snorkeling",
            "snorkelling",
            "without diving",
            "sans plonger",
            "non plongeur",
            "non plongeurs",
            "palmes masque tuba"
          ],
          "links": [
            {
              "id": "non_divers",
              "label": "See details",
              "path": "/diving-apo-trips.html"
            }
          ],
          "matchRules": [
            [
              [
                "snorkeling",
                "snorkelling",
                "non divers",
                "non diver",
                "non plongeurs",
                "sans plonger"
              ]
            ]
          ]
        }
      ]
    },
    "fr": {
      "ui": {
        "triggerLabel": "Besoin d’aide ?",
        "closeLabel": "Fermer le guide d’aide",
        "title": "FAQ",
        "topicsLabel": "Thèmes populaires",
        "questionLabel": "Posez votre question",
        "submitLabel": "Trouver",
        "emptyQuestion": "Saisissez d’abord une courte question.",
        "noMatchTitle": "Demandons à l’équipe",
        "noMatchText": "Ce guide n’a pas encore de réponse fiable. Ouvrez WhatsApp et ajoutez-y votre question.",
        "whatsappLabel": "Demander sur WhatsApp",
        "whatsappMessage": "Bonjour La Tortue ! J’ai une question après avoir utilisé le guide du site."
      },
      "topics": [
        {
          "id": "fun_dives",
          "label": "Plongées loisirs",
          "title": "Plongées loisirs",
          "entryIds": [
            "fun_dives",
            "dive_sites",
            "dive_prices",
            "dive_schedule",
            "dive_equipment",
            "diver_experience",
            "private_guide"
          ],
          "links": [
            {
              "id": "fun_dives",
              "label": "Voir la page",
              "path": "/diving-fun-dives.html"
            }
          ]
        },
        {
          "id": "courses",
          "label": "Cours & baptêmes",
          "title": "Cours & baptêmes",
          "entryIds": [
            "courses",
            "certification_validity",
            "children_diving",
            "refresher"
          ],
          "links": [
            {
              "id": "courses",
              "label": "Voir la page",
              "path": "/diving.html"
            }
          ]
        },
        {
          "id": "apo_island",
          "label": "Sorties Apo Island",
          "title": "Sorties Apo Island",
          "entryIds": [
            "apo_island",
            "apo_inclusions",
            "apo_requirements",
            "apo_no_prior_dive"
          ],
          "links": [
            {
              "id": "apo_island",
              "label": "Voir la page",
              "path": "/diving-apo-trips.html"
            }
          ]
        },
        {
          "id": "rooms",
          "label": "Chambres & réservation",
          "title": "Chambres & réservation",
          "entryIds": [
            "rooms",
            "quote_booking",
            "combined_booking"
          ],
          "links": [
            {
              "id": "rooms",
              "label": "Voir la page",
              "path": "/cottages.html"
            }
          ]
        },
        {
          "id": "arrival",
          "label": "Venir à La Tortue",
          "title": "Venir à La Tortue",
          "entryIds": [
            "arrival_contact"
          ],
          "links": [
            {
              "id": "arrival",
              "label": "Voir la page",
              "path": "/contact.html"
            }
          ]
        },
        {
          "id": "resort",
          "label": "Resort & restaurant",
          "title": "Resort & restaurant",
          "entryIds": [
            "restaurant",
            "non_divers"
          ],
          "links": [
            {
              "id": "resort",
              "label": "Voir la page",
              "path": "/dining.html"
            }
          ]
        }
      ],
      "searchRoutes": [
        {
          "id": "diving_overview",
          "title": "Plongée",
          "answer": "Choisissez le type d’information sur la plongée qui vous intéresse :",
          "keywords": [
            "diving",
            "dive",
            "plongée",
            "plonger"
          ],
          "topicIds": [
            "fun_dives",
            "courses"
          ]
        }
      ],
      "entries": [
        {
          "id": "rooms",
          "topicId": "rooms",
          "sourceRow": 11,
          "status": "source-draft",
          "title": "Quels hébergements propose La Tortue ?",
          "answer": "Nos hébergements sont simples, confortables et proches de la mer, dans une ambiance détendue plutôt que dans l’esprit d’un resort de luxe.\n\nNous proposons des cottages en bambou avec vue sur la mer ou le jardin, ainsi que des hébergements climatisés. Le Seaview Family Cottage dispose de deux lits queen-size pour accueillir jusqu’à quatre personnes.\n\nCertains cottages sont équipés de ventilateurs plutôt que de climatisation, pour un séjour ouvert sur la nature.",
          "questions": [
            "What kind of accommodation does La Tortue have?",
            "Quels hébergements propose La Tortue ?"
          ],
          "keywords": [
            "room",
            "rooms",
            "cottage",
            "cottages",
            "dorm",
            "dormitory",
            "accommodation",
            "accommodations",
            "stay",
            "bed",
            "private room",
            "chambre",
            "chambres",
            "hébergement",
            "hébergements",
            "dortoir",
            "lit",
            "séjour",
            "séjourner",
            "logement"
          ],
          "links": [
            {
              "id": "rooms",
              "label": "Voir les détails",
              "path": "/cottages.html"
            }
          ]
        },
        {
          "id": "restaurant",
          "title": "Restaurant et visite à la journée",
          "answer": "Consultez la page Restaurant pour le menu et les informations visiteurs publiées sur le site. Confirmez le service actuel, les demandes de groupe ou les besoins particuliers auprès de l’équipe.",
          "keywords": [
            "restaurant",
            "restaurants",
            "menu",
            "food",
            "eat",
            "dining",
            "breakfast",
            "lunch",
            "dinner",
            "drink",
            "drinks",
            "day use",
            "day visit",
            "day visits",
            "day visitor",
            "day pass",
            "meal",
            "repas",
            "manger",
            "petit déjeuner",
            "déjeuner",
            "dîner",
            "boisson",
            "boissons",
            "accès journée",
            "visite journée",
            "visite à la journée",
            "pass journée"
          ],
          "links": [
            {
              "id": "restaurant",
              "label": "Voir le restaurant",
              "path": "/dining.html"
            },
            {
              "id": "contact",
              "label": "Contacter l’équipe",
              "path": "/contact.html"
            }
          ],
          "topicId": "resort",
          "status": "page-guidance"
        },
        {
          "id": "arrival_contact",
          "title": "Comment venir à La Tortue ?",
          "answer": "Depuis Dumaguete, La Tortue se trouve à environ 30 minutes de route au sud de l’aéroport ou du port.\n\nDepuis Siquijor, Bohol ou Cebu, prenez un ferry jusqu’à Dumaguete, puis continuez vers le sud par la route jusqu’au resort.\n\nDepuis Moalboal ou l’ouest de Cebu, descendez vers le sud par la route, traversez jusqu’à Negros en ferry, puis continuez par la route vers Dumaguete et Dauin.\n\nDepuis une autre partie de Negros, continuez par la route vers Dumaguete et Dauin.\n\nLes liaisons de ferry et de bus peuvent changer. Envoyez à l’équipe votre point de départ, votre date de voyage et votre heure d’arrivée afin de confirmer la meilleure liaison ou le meilleur transfert disponible.",
          "keywords": [
            "contact",
            "address",
            "location",
            "map",
            "where are you located",
            "airport",
            "transfer",
            "transport",
            "get there",
            "getting there",
            "how do i get there",
            "how to get there",
            "when can i arrive",
            "what time can i arrive",
            "late arrival",
            "arrival time",
            "arrival",
            "dumaguete",
            "siquijor",
            "bohol",
            "cebu",
            "moalboal",
            "negros",
            "ferry",
            "adresse",
            "où êtes-vous situés",
            "aéroport",
            "transfert",
            "transport",
            "comment venir",
            "comment arriver",
            "comment se rendre",
            "à quelle heure puis-je arriver",
            "arrivée tardive",
            "heure d’arrivée",
            "arrivée",
            "bateau"
          ],
          "links": [
            {
              "id": "contact",
              "label": "Ouvrir la page Contact",
              "path": "/contact.html"
            }
          ],
          "topicId": "arrival",
          "status": "page-guidance"
        },
        {
          "id": "courses",
          "topicId": "courses",
          "sourceRow": 9,
          "status": "source-draft",
          "title": "Les débutants peuvent-ils apprendre à plonger à La Tortue ?",
          "answer": "Oui ! Nous proposons des cours SSI et des expériences d’initiation pour découvrir la plongée ou préparer une certification.\n\nLe Try Scuba Experience coûte ₱3 000 par personne, matériel et frais marins inclus.\n\nSi cette première expérience vous plaît, nous pouvons vous accompagner vers un cours Open Water.",
          "questions": [
            "Can beginners learn to dive at La Tortue?",
            "Les débutants peuvent-ils apprendre à plonger à La Tortue ?"
          ],
          "keywords": [
            "course",
            "courses",
            "learn to dive",
            "open water",
            "advanced",
            "rescue",
            "divemaster",
            "instructor",
            "ssi",
            "ffessm",
            "training",
            "cours",
            "apprendre à plonger",
            "formation",
            "niveau",
            "plongeur",
            "instructeur",
            "beginner",
            "beginners",
            "try scuba",
            "débutant",
            "débutants",
            "baptême"
          ],
          "links": [
            {
              "id": "courses",
              "label": "Voir les détails",
              "path": "/diving.html"
            }
          ]
        },
        {
          "id": "fun_dives",
          "title": "Plongées loisirs guidées",
          "answer": "La page Plongées loisirs présente les options guidées et les informations publiées pour les plongeurs certifiés. Demandez à l’équipe de confirmer un programme adapté à vos dates, votre certification et votre expérience.",
          "keywords": [
            "fun dive",
            "fun dives",
            "guided dive",
            "guided dives",
            "guided shore dive",
            "guided shore dives",
            "certified diver",
            "shore dive",
            "shore dives",
            "shore diving",
            "nitrox",
            "dive package",
            "plongée loisir",
            "plongées loisirs",
            "plongée guidée",
            "plongées guidées",
            "plongeur certifié",
            "plongée du bord",
            "plongées du bord",
            "plongée guidée du bord",
            "plongées guidées du bord",
            "forfait plongée"
          ],
          "links": [
            {
              "id": "fun_dives",
              "label": "Voir les plongées loisirs",
              "path": "/diving-fun-dives.html"
            },
            {
              "id": "contact",
              "label": "Planifier des plongées",
              "path": "/contact.html"
            }
          ],
          "topicId": "fun_dives",
          "status": "page-guidance"
        },
        {
          "id": "apo_island",
          "topicId": "apo_island",
          "sourceRow": 7,
          "status": "source-draft",
          "title": "Comment aller à Apo Island depuis La Tortue ?",
          "answer": "Nous organisons des sorties à Apo Island comprenant trois plongées et un repas pour ₱6 200 par personne.\n\nDe novembre à mai, les sorties ont lieu les jeudis et dimanches. Le reste de l’année, elles sont organisées sur demande, selon les conditions et le nombre de personnes intéressées.\n\nLes paysages sous-marins d’Apo Island diffèrent de ceux de la côte de Dauin : si vous avez le temps, nous vous conseillons de découvrir les deux.",
          "questions": [
            "How do I get to Apo Island from La Tortue?",
            "Comment aller à Apo Island depuis La Tortue ?"
          ],
          "keywords": [
            "apo",
            "apo island",
            "apo trip",
            "apo trips",
            "boat trip",
            "boat dive",
            "island dive",
            "turtle",
            "turtles",
            "sortie apo",
            "sorties apo",
            "île apo",
            "bateau apo",
            "plongée apo",
            "tortue",
            "tortues",
            "apo schedule",
            "apo departure",
            "apo horaires"
          ],
          "links": [
            {
              "id": "apo_island",
              "label": "Voir les détails",
              "path": "/diving-apo-trips.html"
            }
          ]
        },
        {
          "id": "dive_sites",
          "topicId": "fun_dives",
          "sourceRow": 3,
          "status": "source-draft",
          "title": "Comment se passe la plongée à La Tortue ?",
          "answer": "Dauin est réputé pour sa vie marine, notamment le muck diving et la photographie macro. Nous proposons des plongées guidées du bord le long de la côte, sur des récifs peu profonds et des sites plus profonds.\n\nPoissons-grenouilles, hippocampes, nudibranches, tortues et seiches font partie des espèces que l’on peut observer. Notre récif maison se trouve juste devant La Tortue.",
          "questions": [
            "What is diving like at La Tortue?",
            "Comment se passe la plongée à La Tortue ?"
          ],
          "keywords": [
            "dive site",
            "dive sites",
            "house reef",
            "macro",
            "muck",
            "marine life",
            "critters",
            "underwater photography",
            "reef",
            "reefs",
            "site de plongée",
            "sites de plongée",
            "récif maison",
            "faune marine",
            "photo sous-marine",
            "récif",
            "récifs",
            "diving like",
            "plongée à la tortue"
          ],
          "links": [
            {
              "id": "dive_sites",
              "label": "Voir les détails",
              "path": "/diving-sites.html"
            }
          ]
        },
        {
          "id": "quote_booking",
          "title": "Disponibilités, réservation et devis",
          "answer": "Pour les disponibilités, les plannings et un devis final à jour, contactez directement l’équipe. Indiquez vos dates, le nombre de personnes et vos objectifs de plongée pour recevoir une réponse précise.",
          "keywords": [
            "price",
            "prices",
            "pricing",
            "rate",
            "rates",
            "cost",
            "how much",
            "quote",
            "availability",
            "available",
            "book",
            "booking",
            "reserve",
            "reservation",
            "schedule",
            "dates",
            "prix",
            "tarif",
            "tarifs",
            "coût",
            "combien",
            "devis",
            "disponibilité",
            "disponible",
            "réserver",
            "réservation",
            "planning",
            "payment",
            "payment methods",
            "deposit",
            "paiement",
            "moyens de paiement",
            "acompte"
          ],
          "links": [
            {
              "id": "contact",
              "label": "Contacter l’équipe",
              "path": "/contact.html"
            }
          ],
          "topicId": "rooms",
          "status": "page-guidance"
        },
        {
          "id": "certification_validity",
          "topicId": "courses",
          "sourceRow": 2,
          "status": "source-draft",
          "title": "Quelle est la durée de validité de ma certification ?",
          "answer": "Une certification de plongée n’expire pas. Même après une longue interruption, vous la conservez. Une courte remise à niveau peut toutefois être recommandée ou demandée par le centre où vous reprendrez la plongée.",
          "questions": [
            "how long is the validity of my certification ?",
            "Quelle est la durée de validité de ma certification ?"
          ],
          "keywords": [
            "certification expiry",
            "certification expire",
            "certification validity",
            "validity of my certification",
            "validité certification",
            "durée de validité",
            "expiration certification"
          ],
          "links": [
            {
              "id": "certification_validity",
              "label": "Voir les détails",
              "path": "/diving.html"
            }
          ]
        },
        {
          "id": "dive_prices",
          "topicId": "fun_dives",
          "sourceRow": 4,
          "status": "source-draft",
          "title": "Combien coûte une plongée loisir ?",
          "answer": "Nos plongées loisirs pour plongeurs certifiés commencent à ₱1 900 par personne et par plongée, avec location du matériel et frais marins inclus.\n\n• 5 % de réduction à partir de 6 plongées\n• 10 % de réduction à partir de 12 plongées",
          "questions": [
            "How much does a fun dive cost?",
            "Combien coûte une plongée loisir ?"
          ],
          "keywords": [
            "fun dive cost",
            "fun dive price",
            "dive prices",
            "diving prices",
            "dive cost",
            "prix plongée",
            "prix des plongées",
            "coûte une plongée",
            "tarif plongée",
            "prix d une plongée",
            "discount",
            "réduction"
          ],
          "links": [
            {
              "id": "dive_prices",
              "label": "Voir les détails",
              "path": "/diving-fun-dives.html"
            }
          ],
          "matchRules": [
            [
              [
                "dive",
                "dives",
                "diving",
                "plongée",
                "plongées"
              ],
              [
                "price",
                "prices",
                "cost",
                "costs",
                "how much",
                "prix",
                "tarif",
                "tarifs",
                "coûte",
                "combien"
              ]
            ]
          ],
          "excludeKeywords": [
            "apo",
            "snorkeling",
            "snorkelling",
            "try scuba",
            "refresher",
            "baptême",
            "remise à niveau"
          ]
        },
        {
          "id": "dive_schedule",
          "topicId": "fun_dives",
          "sourceRow": 5,
          "status": "source-draft",
          "title": "Combien de plongées puis-je faire par jour ?",
          "answer": "Nous proposons chaque jour jusqu’à quatre plongées du bord à Dauin :\n\n• 8 h 30\n• 11 h 30\n• 14 h 30\n• 17 h 30 — plongée de nuit\n\nLe programme peut être adapté aux conditions et aux besoins du groupe.",
          "questions": [
            "How many dives can I do in a day?",
            "Combien de plongées puis-je faire par jour ?"
          ],
          "keywords": [
            "dives a day",
            "dives per day",
            "dives in a day",
            "daily dive schedule",
            "dive times",
            "night dive",
            "night dives",
            "plongées par jour",
            "horaires plongée",
            "plongée de nuit",
            "plongées de nuit"
          ],
          "links": [
            {
              "id": "dive_schedule",
              "label": "Voir les détails",
              "path": "/diving-fun-dives.html"
            }
          ],
          "matchRules": [
            [
              [
                "dives",
                "diving",
                "plongées"
              ],
              [
                "per day",
                "a day",
                "in a day",
                "times",
                "schedule",
                "par jour",
                "horaires"
              ]
            ]
          ]
        },
        {
          "id": "dive_equipment",
          "topicId": "fun_dives",
          "sourceRow": 6,
          "status": "source-draft",
          "title": "Dois-je louer du matériel de plongée ?",
          "answer": "Non. La location du matériel est incluse dans le prix de nos plongées loisirs, sans supplément de location.\n\nVous pouvez aussi utiliser votre propre équipement. Le Nitrox et les bouteilles de 15 litres sont proposés en supplément.",
          "questions": [
            "Do I need to rent diving equipment?",
            "Dois-je louer du matériel de plongée ?"
          ],
          "keywords": [
            "equipment rental",
            "rent diving equipment",
            "own equipment",
            "nitrox",
            "15l",
            "15 litres",
            "matériel",
            "équipement",
            "location matériel"
          ],
          "links": [
            {
              "id": "dive_equipment",
              "label": "Voir les détails",
              "path": "/diving-fun-dives.html"
            }
          ],
          "matchRules": [
            [
              [
                "equipment",
                "rental",
                "gear",
                "matériel",
                "équipement",
                "nitrox"
              ]
            ]
          ]
        },
        {
          "id": "apo_inclusions",
          "topicId": "apo_island",
          "sourceRow": 8,
          "status": "source-draft",
          "title": "Que comprend la sortie à Apo Island ?",
          "answer": "La sortie à ₱6 200 comprend trois plongées, les frais marins, le matériel, le guide, le transport en bateau et un repas.\n\nUn guide privé est disponible pour un supplément de ₱2 500 par sortie.",
          "questions": [
            "What is included in the Apo Island trip?",
            "Que comprend la sortie à Apo Island ?"
          ],
          "keywords": [
            "included in the apo",
            "apo inclusions",
            "apo island trip include",
            "comprend la sortie",
            "inclus dans la sortie apo",
            "apo inclus"
          ],
          "links": [
            {
              "id": "apo_island",
              "label": "Voir les détails",
              "path": "/diving-apo-trips.html"
            }
          ],
          "matchRules": [
            [
              [
                "apo"
              ],
              [
                "included",
                "include",
                "includes",
                "inclusions",
                "inclus",
                "comprend",
                "compris"
              ]
            ]
          ]
        },
        {
          "id": "apo_requirements",
          "topicId": "apo_island",
          "status": "client-draft",
          "title": "Quelles sont les conditions minimales pour participer à une sortie Apo Island ?",
          "answer": "Pour les plongeurs, une plongée côtière préalable avec La Tortue est nécessaire avant de participer à une sortie Apo Island. Elle permet à l’équipe d’ajuster si besoin le matériel et la taille de la bouteille, puis de constituer des groupes de niveau adaptés avant la journée complète en bateau.\n\nCette plongée loisir côtière coûte ₱1 900 par personne, matériel et frais marins inclus.",
          "questions": [
            "Do you have any minimum requirements to join an Apo Island trip?",
            "Quelles sont les conditions minimales pour participer à une sortie Apo Island ?"
          ],
          "keywords": [
            "apo minimum requirements",
            "requirements for apo",
            "prior coastal dive",
            "coastal dive before apo",
            "dive before apo",
            "conditions pour apo",
            "conditions minimales apo",
            "plongée côtière avant apo",
            "plongée avant apo"
          ],
          "excludeKeywords": [
            "no time",
            "dont have time",
            "don't have time",
            "cannot",
            "can't",
            "pas le temps",
            "impossible"
          ],
          "links": [
            {
              "id": "apo_island",
              "label": "Voir les détails",
              "path": "/diving-apo-trips.html"
            }
          ],
          "matchRules": [
            [
              ["apo"],
              ["requirement", "requirements", "required", "prior", "before", "condition", "conditions", "nécessaire", "avant"]
            ]
          ]
        },
        {
          "id": "apo_no_prior_dive",
          "topicId": "apo_island",
          "status": "client-draft",
          "title": "Et si je n’ai pas le temps de plonger avant Apo Island ?",
          "answer": "Si vous n’avez pas le temps de faire une plongée côtière avant la sortie Apo Island, La Tortue peut organiser un guide privé pour ₱2 500 pour toute la journée à Apo Island. Vous bénéficiez ainsi de l’attention nécessaire si vous avez besoin d’aide, sans perturber les autres membres du groupe.",
          "questions": [
            "What if I don’t have time for a dive before Apo Island?",
            "What if we don't have time to do a dive prior to Apo Island?",
            "Et si je n’ai pas le temps de plonger avant Apo Island ?"
          ],
          "keywords": [
            "no time before apo",
            "no time for prior dive",
            "cannot dive before apo",
            "can't dive before apo",
            "private guide instead",
            "pas le temps avant apo",
            "pas le temps de plonger avant apo",
            "impossible de plonger avant apo",
            "guide privé à la place"
          ],
          "links": [
            {
              "id": "apo_island",
              "label": "Voir les détails",
              "path": "/diving-apo-trips.html"
            }
          ],
          "matchRules": [
            [
              ["apo"],
              ["no time", "cannot", "can't", "dont have time", "don't have time", "pas le temps", "impossible"],
              ["before", "prior", "avant"]
            ]
          ]
        },
        {
          "id": "children_diving",
          "topicId": "courses",
          "sourceRow": 10,
          "status": "source-draft",
          "title": "Les enfants peuvent-ils plonger à La Tortue ?",
          "answer": "Oui ! Le Try Scuba Experience est accessible à partir de 8 ans pour découvrir la plongée.\n\nÀ partir de 10 ans, les enfants peuvent suivre le cours SSI Junior Open Water. Les moins de 15 ans reçoivent une certification Junior Open Water Diver.\n\nNotre équipe vous conseillera selon l’âge, l’expérience et l’aisance de votre enfant dans l’eau.",
          "questions": [
            "Can children dive at La Tortue?",
            "Les enfants peuvent-ils plonger à La Tortue ?"
          ],
          "keywords": [
            "children",
            "child",
            "kids",
            "minimum age",
            "junior",
            "enfant",
            "enfants",
            "âge minimum"
          ],
          "links": [
            {
              "id": "children_diving",
              "label": "Voir les détails",
              "path": "/diving.html"
            }
          ],
          "matchRules": [
            [
              [
                "children",
                "child",
                "kids",
                "enfants",
                "enfant",
                "junior"
              ]
            ]
          ]
        },
        {
          "id": "combined_booking",
          "topicId": "rooms",
          "sourceRow": 12,
          "status": "source-draft",
          "title": "Faut-il réserver la plongée et l’hébergement ensemble ?",
          "answer": "Pas nécessairement ! Vous pouvez réserver votre hébergement séparément sur Booking.com et organiser vos plongées directement avec nous.\n\nEn période de forte affluence, nous recommandons de réserver d’abord votre chambre, puis de planifier les plongées autour de vos dates.\n\nIndiquez-nous votre certification, votre nombre de plongées, vos dates et vos envies : plongées du bord à Dauin, plongée de nuit ou sortie à Apo Island.",
          "questions": [
            "Do I need to book diving and accommodation together?",
            "Faut-il réserver la plongée et l’hébergement ensemble ?"
          ],
          "keywords": [
            "diving and accommodation",
            "book together",
            "booking.com",
            "plongée et hébergement",
            "plongée et l hébergement",
            "réserver ensemble"
          ],
          "links": [
            {
              "id": "combined_booking",
              "label": "Voir les détails",
              "path": "/cottages.html"
            }
          ],
          "matchRules": [
            [
              [
                "diving",
                "plongée"
              ],
              [
                "accommodation",
                "hébergement"
              ],
              [
                "together",
                "ensemble"
              ]
            ]
          ]
        },
        {
          "id": "diver_experience",
          "topicId": "fun_dives",
          "sourceRow": 13,
          "status": "source-draft",
          "title": "Faut-il être expérimenté pour plonger à Dauin ?",
          "answer": "Pas du tout ! Dauin possède des sites adaptés à différents niveaux d’expérience. Nos guides adaptent la plongée à votre certification, votre expérience et votre aisance.\n\nSi vous venez d’être certifié ou n’avez pas plongé depuis longtemps, dites-le-nous pour que nous puissions vous orienter vers les plongées adaptées.",
          "questions": [
            "Do I need to be an experienced diver to dive Dauin?",
            "Faut-il être expérimenté pour plonger à Dauin ?"
          ],
          "keywords": [
            "experienced diver",
            "experience level",
            "newly certified",
            "expérimenté",
            "nouvellement certifié",
            "niveau d expérience"
          ],
          "links": [
            {
              "id": "diver_experience",
              "label": "Voir les détails",
              "path": "/diving-fun-dives.html"
            }
          ]
        },
        {
          "id": "refresher",
          "topicId": "courses",
          "sourceRow": 14,
          "status": "source-draft",
          "title": "Que faire si je n’ai pas plongé depuis longtemps ?",
          "answer": "Nous proposons une plongée de remise à niveau à ₱2 700 pour revoir vos compétences et retrouver votre aisance dans l’eau avant de reprendre les plongées loisirs.",
          "questions": [
            "What if I haven't dived in a long time?",
            "Que faire si je n’ai pas plongé depuis longtemps ?"
          ],
          "keywords": [
            "refresher",
            "refresh",
            "long time",
            "haven t dived",
            "remise à niveau",
            "pas plongé depuis",
            "reprendre la plongée"
          ],
          "links": [
            {
              "id": "refresher",
              "label": "Voir les détails",
              "path": "/diving-fun-dives.html"
            }
          ],
          "matchRules": [
            [
              [
                "refresher",
                "remise à niveau",
                "pas plongé depuis",
                "haven t dived"
              ]
            ]
          ]
        },
        {
          "id": "private_guide",
          "topicId": "fun_dives",
          "sourceRow": 15,
          "status": "source-draft",
          "title": "Puis-je avoir un guide de plongée privé ?",
          "answer": "Oui. Un guide privé permet un accompagnement personnalisé, notamment pour les photographes, les familles ou les plongeurs qui préfèrent un guide dédié.\n\n• Côte de Dauin : supplément de ₱500 par plongée\n• Apo Island : supplément de ₱2 500 par sortie",
          "questions": [
            "Can I have a private dive guide?",
            "Puis-je avoir un guide de plongée privé ?"
          ],
          "keywords": [
            "private guide",
            "private dive guide",
            "private coastal guide",
            "guide privé",
            "guide de plongée privé",
            "guide dédié"
          ],
          "links": [
            {
              "id": "private_guide",
              "label": "Voir les détails",
              "path": "/diving-fun-dives.html"
            }
          ],
          "matchRules": [
            [
              [
                "private",
                "privé"
              ],
              [
                "guide"
              ]
            ]
          ]
        },
        {
          "id": "non_divers",
          "topicId": "resort",
          "sourceRow": 16,
          "status": "source-draft",
          "title": "Peut-on profiter de La Tortue sans plonger ?",
          "answer": "Oui ! Vous pouvez séjourner dans nos bungalows, vous détendre au bord de la mer, profiter du restaurant et explorer les environs en snorkeling. Du matériel de snorkeling est proposé à la location pour découvrir le récif à quelques pas de votre chambre.\n\nLorsqu’une sortie est programmée, vous pouvez nous rejoindre pour une excursion snorkeling à Apo Island à ₱2 500 par personne, repas, frais marins et matériel de snorkeling inclus.",
          "questions": [
            "Can non-divers enjoy La Tortue?",
            "Peut-on profiter de La Tortue sans plonger ?"
          ],
          "keywords": [
            "non diver",
            "non divers",
            "non diving",
            "snorkeling",
            "snorkelling",
            "without diving",
            "sans plonger",
            "non plongeur",
            "non plongeurs",
            "palmes masque tuba"
          ],
          "links": [
            {
              "id": "non_divers",
              "label": "Voir les détails",
              "path": "/diving-apo-trips.html"
            }
          ],
          "matchRules": [
            [
              [
                "snorkeling",
                "snorkelling",
                "non divers",
                "non diver",
                "non plongeurs",
                "sans plonger"
              ]
            ]
          ]
        }
      ]
    }
  },
  "source": {
    "title": "FAQ Question Answers",
    "url": "https://docs.google.com/spreadsheets/d/1jrasLdj2Zv3f7qAdtyGM0n4YgkTASdZFCsJHoIHZcBA/edit",
    "retrievedAt": "2026-09-12",
    "modifiedAt": "2026-09-11",
    "status": "work-in-progress",
    "translation": "French translated from English source; owner review pending",
    "pending": [
      "Payment methods - how to reserve"
    ]
  }
};
})(typeof window !== 'undefined' ? window : globalThis);
