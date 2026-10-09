# Vijay & Rashima: Wedding Invitation

Static site. No build step.

## Run locally
```
cd vijay-rashima
python3 -m http.server 8000
```
Open http://localhost:8000 (use a server rather than double-clicking, so audio/images load correctly).

## Customise
Everything event-specific is in `config.js`: names, date/time, venue, Google Maps link (enables Directions), schedule (`enabled` / `confirmed` flags), gallery paths, audio path, site URL.
Set `site.url` and update the `og:image` / `og:url` meta before sharing on WhatsApp (needs an absolute https URL).

## Assets (all currently missing, replace by dropping files in `assets/`)
See `AI-ASSET-PROMPTS.md`. Without images the site shows built-in SVG/CSS artwork. `assets/audio/wedding-theme.mp3` is a placeholder; use only music you own or are licensed to use. The site works silently if it is missing.

## RSVP
Demo only. Responses are not sent. To go live, build a small server-side function (e.g. Supabase Edge Function) that validates and inserts the row, then set `rsvp.mode:"endpoint"` and `rsvp.endpoint`. Never put Supabase service-role keys in client code.

## Notes
GSAP/ScrollTrigger load from cdnjs for parallax only; reveals, countdown and the opening are plain CSS/JS. Fonts load from Google Fonts with serif fallbacks. For offline/self-hosting, download these into `assets/`.

## Apple Calendar
The Apple/Outlook button links to `assets/calendar/vijay-rashima-wedding.ics` (served as a normal file, which iPhone Safari opens with "Add to Calendar"). If you change the date, time or venue in `config.js`, edit that `.ics` file too (DTSTART/DTEND are in UTC; 18:30 IST = 13:00Z).

## Collecting RSVPs in a Google Sheet
1. Create a Sheet, rename the tab `Responses`, add headers: Time, Name, Attending, Guests, Message.
2. Extensions > Apps Script. Paste:
```js
function clean(v){v=String(v==null?'':v).slice(0,500);return /^[=+\-@]/.test(v)?"'"+v:v}
function doPost(e){
  var d=JSON.parse(e.postData.contents);
  var sh=SpreadsheetApp.getActive().getSheetByName('Responses')||SpreadsheetApp.getActiveSheet();
  sh.appendRow([new Date(),clean(d.name),d.attending?'Joyfully Accept':'Regretfully Decline',Number(d.guests)||0,clean(d.message)]);
  return ContentService.createTextOutput('{"ok":true}').setMimeType(ContentService.MimeType.JSON);
}
```
3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone. Authorise, then copy the URL ending in `/exec`.
4. In `config.js` set `rsvp: { mode: "endpoint", endpoint: "<that URL>" }`.
5. Share the Sheet with the couple (Share button). After editing the script, use Deploy > Manage deployments > New version.
