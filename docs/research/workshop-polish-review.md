# PR 25: Customer polish and mobile concept

## Implemented

- Rewrote German and English copy around workshop tasks and operator benefits.
- Removed documentation and GitHub links (including the footer), PR references, firmware provenance and protocol diagrams from the sales story. Source research stays in the repository; the customer experience is self-contained.
- Removed redundant German narrative labels from the 3D scene and regenerated all 22 fallback illustrations. Authentic reader labels remain German, with localized HTML explanations.
- Replaced the tiny mobile sticky scene with chapter preview cards and a full-screen interactive step view. Scene and controls share one view; controls scroll independently on taller screens. Short screens scroll the whole view. Closing restores the article position and trigger focus; completed steps persist.
- Deferred mobile 3D downloads until a preview is opened, retained illustrated fallback, and fixed false startup failures for loaded but offscreen scenes.
- Fixed focus after controls are replaced, clarified cross-step navigation, and reset modal scroll/focus when changing steps.
- Added forward-route scroll/focus handling. Privacy links beside forms open explicitly labeled new tabs rather than discarding drafts. German legal content is marked with its language.

## Decisions needed before publication

### Legal notice and addresses

The footer currently has no legal-notice link. A historical destination is
`https://mein.online-impressum.de/jappyjan/`. During inspection it included provider
details using a Sankt Augustin forwarding address, while the site's Terms and
Privacy pages name Hamburg. The external page also had a page-not-found title.
Confirm the current legal address and a canonical, working notice destination
before adding that footer link. The historical URL was not restored because its
content could not be treated as current and reliable.

### Privacy text versus implementation

The existing privacy policy describes an embedded legal-notice iframe, initial
language selection through `navigator.language`, and statistical tracking of
external-link clicks. The current implementation has no legal-notice iframe,
uses saved language or German, and has explicit page-view/contact/newsletter
analytics events instead. Reconcile these disclosures with the actual service;
the legal wording was not rewritten during this design pass.

### Pilot and feature availability

The previous fixed 90-day pilot promise was not supported by an established offer
in the reviewed material. Copy now says scope and duration are agreed in advance.
Confirm commercial terms before advertising a fixed duration. Problem reporting
and maintenance remain qualified by installed version, modules and setup; confirm
the shipping version before removing that qualification.

## Remaining design and performance considerations

- Mobile is an implemented concept, not a claim of completed user research. Test it with workshop operators, particularly discoverability of the preview cards and the separate control scrolling on taller phones.
- Authentic reader screens are still German in English mode. Localized HTML explains them, but a localized product capture would make the English demonstration more coherent.
- The build still warns about large JavaScript chunks (approximately 1.23 MB main and 555 kB lazy scene, before compression). Mobile interaction now defers the scene, but reducing the main bundle and testing on physical low-end devices remain worthwhile.
- Browser regression coverage includes widths of 320 and 390 pixels, short screens, both languages, dark/light presentation, live rendering and fallbacks. This does not replace physical iOS/Android testing, particularly virtual-keyboard and browser-toolbar behavior.
