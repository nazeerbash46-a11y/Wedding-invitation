/* All event-specific content lives here. Edit this file, not the HTML. */
window.WEDDING = {
  theme: "emerald",                 // "emerald" | "dawn" | "royal" | "peacock" | "sandstone"
  groom: "Vijay", bride: "Rashima",
  event: {
    name: "Vivah & Wedding Celebration",
    date: "2026-12-20", time: "18:30", tzOffset: "+05:30", timezone: "Asia/Kolkata",
    durationHours: 4,               // used for the calendar file only (end time not confirmed)
    city: "Bengaluru", country: "India"
  },
  venue: {
    name: "",                       // e.g. "The Garden Palace"
    address: "",
    mapsUrl: "",                    // paste a Google Maps link to enable the Directions button
    note: "Exact venue details will be announced soon."
  },
  site: {
    url: "",                        // e.g. "https://vijay-rashima.example" (set before sharing for WhatsApp preview)
    ogImage: "assets/images/og-image.webp"
  },
  calendarFile: "assets/calendar/vijay-rashima-wedding.ics",   // keep in sync with date/time/venue
  audio: { src: "assets/audio/wedding-theme.mp3", volume: 0.45 },
  hero: { src: "assets/images/hero-garden.webp" },
  gallery: [
    { src: "assets/images/couple-01.webp", alt: "Portrait of Vijay and Rashima (replace with your photograph)" },
    { src: "assets/images/mandap-arch.webp", alt: "A floral mandap arch in a moonlit garden" },
    { src: "assets/images/couple-02.webp", alt: "Portrait of Vijay and Rashima (replace with your photograph)" },
    { src: "assets/images/venue.webp", alt: "Atmospheric garden venue" }
  ],
  // Set enabled:true to show an entry. confirmed:false shows "Timing to be confirmed".
  schedule: [
    { title: "Guest Welcome", time: "", confirmed: false, enabled: true, note: "Arrival and greetings" },
    { title: "Wedding Ceremony at the Mandap", time: "6:30 PM", confirmed: false, enabled: true, note: "Event start time; not a confirmed muhurtham" },
    { title: "Blessings for the Couple", time: "", confirmed: false, enabled: true, note: "" },
    { title: "Dinner & Celebration", time: "", confirmed: false, enabled: true, note: "" },
    { title: "Haldi", time: "", confirmed: false, enabled: false, note: "" },
    { title: "Mehendi", time: "", confirmed: false, enabled: false, note: "" },
    { title: "Sangeet", time: "", confirmed: false, enabled: false, note: "" },
    { title: "Reception", time: "", confirmed: false, enabled: false, note: "" }
    // Add family-approved rituals here, e.g. { title: "Jaimala", time: "", confirmed: false, enabled: true }
  ],
  rsvp: {
    mode: "demo",                   // "demo" | "endpoint"
    endpoint: ""                    // later: your own serverless function URL that talks to Supabase (never put service keys here)
  }
};
