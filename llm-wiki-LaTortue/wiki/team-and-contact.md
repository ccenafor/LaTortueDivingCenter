# Team And Contact

**Summary**: Current resort story, team section, contact data, forms, Booking.com, WhatsApp, and social/contact behavior.

**Sources**: about.html, fr/about.html, contact.html, fr/contact.html, contact-success.html, fr/contact-success.html, footer.html, fr/footer.html, assets/js/contact.js, assets/js/booking-com.js, NETLIFY.md.

**Last updated**: 2026-06-10.

---

The about page says La Tortue started from Marielle and Nicolas's vision to live by the sea and share their passions with travelers, with the venture beginning in February 2020 in Dauin, Negros Oriental (source: about.html; source: fr/about.html). The brand name "La Tortue" is explained as French for "The Turtle" and initially aimed at a French-speaking market Nicolas could teach diving (source: about.html; source: fr/about.html).

## Current Team Section

The current in-house dive pros displayed on the about page are Glenn and Charlie (source: about.html; source: fr/about.html). Glenn is described as a house dive master with a mental map of Dauin and Apo, strong spotting skills for macro and wide-angle, and patience with photographers (source: about.html; source: fr/about.html).

Charlie is described as a Dive Master originally from Apo Island, fluent in French, with warm personality, local knowledge, and professionalism that shape guest experiences in and out of the water (source: about.html; source: fr/about.html).

The about page also presents resident pets Dolly, Panda, Buttercup, Bubbles, and Blossom with images and short descriptions (source: about.html; source: fr/about.html).

## Contact Channels

The contact page publishes email `latortue.info@gmail.com`, phone `+63 917 881 0313` in structured data, WhatsApp link `https://wa.me/639695291297`, and Instagram `https://www.instagram.com/latortuediving` (source: contact.html; source: fr/contact.html). The footer links to Facebook `https://www.facebook.com/scubadivingdauin` and Instagram (source: footer.html; source: fr/footer.html).

## Forms And Booking

The contact page contains a Booking.com room widget for live room availability and a Netlify form for dive, table, and other inquiries (source: contact.html; source: fr/contact.html). The form uses `data-netlify="true"`, a honeypot, and Netlify reCAPTCHA attributes (source: contact.html; source: fr/contact.html; source: NETLIFY.md).

`assets/js/contact.js` submits the contact form to `/` with URL-encoded form data, handles localized status messages, resets the form on success, and redirects/updates state through client behavior (source: assets/js/contact.js). `assets/js/booking-com.js` builds Booking.com URLs with check-in, check-out, two adults, one room, and no children when dates are provided (source: assets/js/booking-com.js).

The contact-success pages provide WhatsApp and email fallback after form submission (source: contact-success.html; source: fr/contact-success.html).

## Related Pages

- [[rooms-and-dining]]
- [[website-overview]]
- [[technical-implementation]]
- [[maintenance-rules]]

