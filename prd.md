\# MASTER PRD — FBS | فارس بن سعود للوحات المميزة

\## Production-Grade Saudi Vehicle Plate Auction Platform



PROJECT NAME:

FBS — فارس بن سعود للوحات المميزة



PRODUCT:

منصة سعودية احترافية متخصصة في عرض ومزادات لوحات المركبات المميزة.



PRIMARY MARKET:

Saudi Arabia



PRIMARY LANGUAGE:

Arabic — RTL



SECONDARY LANGUAGE:

English — LTR ready



==================================================

1\. MANDATORY TECHNOLOGY ARCHITECTURE

==================================================



The frontend and application architecture MUST be built using:



\- Next.js

\- TypeScript

\- Tailwind CSS



MANDATORY IMPLEMENTATION:



Next.js:

\- App Router

\- Server Components by default

\- Client Components only when necessary

\- Route Handlers

\- Server Actions where appropriate

\- SSR / ISR / SSG according to page requirements

\- Strong SEO implementation

\- Production-grade caching strategy



TypeScript:

\- Strict Mode

\- No implicit any

\- Shared domain types

\- Strong API contracts

\- Strong validation



Tailwind CSS:

\- MUST be the primary styling system.

\- Do not introduce another competing CSS framework.

\- Build reusable design tokens.

\- Mobile-first responsive design.

\- Support RTL and LTR from the architecture level.



DO NOT replace this architecture with:

\- WordPress

\- Elementor

\- Vue

\- Angular

\- plain React SPA

\- Bootstrap

\- Material UI as the main UI system



The core architecture is:



Next.js

\+

TypeScript

\+

Tailwind CSS



Deployment:

Vercel



Database:

PostgreSQL via Supabase



Authentication:

Supabase Auth



Storage:

Supabase Storage initially



Auction Hot State:

Redis / Upstash



Realtime:

Dedicated Realtime Adapter

Initial provider can be Ably



Background Jobs:

Queue / QStash initially



Transactional Email:

Resend



Monitoring:

Sentry + Vercel Observability



Security / DNS:

Cloudflare-ready architecture





==================================================

2\. PRODUCT VISION

==================================================



Build FBS as a premium Saudi platform for:



\- Premium vehicle plates.

\- Plate listings.

\- Plate ownership verification.

\- Live auctions.

\- Auction participation.

\- Security deposit management.

\- Realtime bidding.

\- Winner settlement.

\- Seller / owner workflows.

\- Administration and financial control.



FBS should NOT look like a generic ecommerce website.



The finished product should feel like:



Saudi

\+

Premium

\+

Automotive

\+

Trustworthy

\+

Financially Secure

\+

Realtime

\+

Modern



The platform acts as a digital marketplace / mediator and auction organizer.



The system must be designed so FBS does not need to technically own the listed plate in order to operate the marketplace.



==================================================

3\. PRIMARY BUSINESS OBJECTIVE

==================================================



Create a complete marketplace where:



Plate Owner

↓

Submits Plate

↓

Ownership Verification

↓

Admin Approval

↓

Auction Configuration

↓

Auction Registration

↓

Bidder Security Deposit

↓

Waiting Room

↓

Live Auction

↓

Winner

↓

Settlement

↓

Ownership Transfer Follow-up

↓

Completed Transaction





==================================================

4\. CORE SYSTEMS

==================================================



Treat the platform as three connected systems:



1\. FBS Marketplace



2\. Realtime Auction Engine



3\. Financial / Settlement System



Do NOT mix all business logic directly inside React components or API route files.





==================================================

5\. USER ROLES

==================================================



VISITOR



Can:

\- Browse plates.

\- Browse auctions.

\- Search.

\- Filter.

\- View auction details.

\- View completed auctions.

\- Register.

\- Login.





REGISTERED USER



Can:

\- Manage profile.

\- Save favorites.

\- View notifications.

\- Submit plate.

\- Follow auctions.





BIDDER



Can:

\- Register for auctions.

\- Complete auction requirements.

\- Authorize security deposit.

\- Enter waiting room.

\- Enter live auction.

\- Submit bids.

\- View bid history.

\- View deposit status.





SELLER / PLATE OWNER



Can:

\- Submit plate.

\- Upload plate information.

\- Upload ownership verification documents.

\- Track verification.

\- Track auction.

\- Track result.

\- Track settlement.





SUPPORT



Can:

\- View permitted customer records.

\- Assist users.

\- View non-sensitive auction information.



Cannot:

\- Capture payments.

\- Void financial transactions manually.

\- Verify their own plate.

\- Change auction winner.





AUCTION MANAGER



Can:

\- Review plates.

\- Configure auctions.

\- Schedule auctions.

\- Manage auction rules.

\- Pause/resume auctions where authorized.

\- Monitor live auctions.





FINANCE



Can:

\- View deposits.

\- View payment authorizations.

\- Capture.

\- Void.

\- Refund where allowed.

\- Perform reconciliation.

\- View settlements.





ADMIN



Can manage permitted system areas according to RBAC.





SUPER ADMIN



Full administrative authority.



Sensitive actions must require:

\- permission

\- confirmation

\- reason

\- audit logging

\- optional reauthentication / MFA





==================================================

6\. PUBLIC WEBSITE STRUCTURE

==================================================



Routes:



/

&#x20;/auctions

&#x20;/auctions/live

&#x20;/auctions/upcoming

&#x20;/auctions/completed

&#x20;/auctions/\[slug]



&#x20;/plates

&#x20;/plates/search

&#x20;/plates/\[slug]



&#x20;/sell-your-plate



&#x20;/how-it-works

&#x20;/about

&#x20;/faq

&#x20;/contact



&#x20;/terms

&#x20;/privacy

&#x20;/auction-policy

&#x20;/deposit-policy





AUTH:



&#x20;/login

&#x20;/register

&#x20;/verify

&#x20;/forgot-password

&#x20;/reset-password





USER AREA:



&#x20;/account

&#x20;/account/auctions

&#x20;/account/bids

&#x20;/account/plates

&#x20;/account/favorites

&#x20;/account/deposits

&#x20;/account/payments

&#x20;/account/notifications

&#x20;/account/profile

&#x20;/account/security





LIVE AUCTION:



&#x20;/auction-room/\[auctionId]





ADMIN:



&#x20;/admin

&#x20;/admin/plates

&#x20;/admin/verifications

&#x20;/admin/auctions

&#x20;/admin/live

&#x20;/admin/registrations

&#x20;/admin/bids

&#x20;/admin/users

&#x20;/admin/deposits

&#x20;/admin/payments

&#x20;/admin/settlements

&#x20;/admin/notifications

&#x20;/admin/reports

&#x20;/admin/cms

&#x20;/admin/audit

&#x20;/admin/settings





==================================================

7\. HOMEPAGE

==================================================



Homepage order:



Hero



↓



Quick Plate Search



↓



Live Auctions



↓



Ending Soon Auctions



↓



Upcoming Auctions



↓



Featured Plates



↓



How FBS Works



↓



Why FBS



↓



Sell Your Plate CTA



↓



Statistics



↓



FAQ



↓



Footer





==================================================

8\. HEADER

==================================================



Desktop:



\- FBS logo.

\- Auctions.

\- Plates.

\- Sell Your Plate.

\- How It Works.

\- About FBS.

\- Search.

\- Login.

\- Register / Account.



Mobile:



\- Logo.

\- Search.

\- Account.

\- Menu.



Header can be sticky.



Do not make it excessively tall.





==================================================

9\. HERO

==================================================



Purpose:



The visitor must immediately understand that FBS specializes in premium Saudi vehicle plates and auctions.



Suggested messaging direction:



"لوحتك المميزة تبدأ من هنا"



Primary CTA:



استكشف المزادات



Secondary CTA:



اعرض لوحتك



Hero design:



\- Premium.

\- Automotive.

\- Saudi.

\- Elegant.

\- Fast-loading.



Do not use a huge background asset that destroys LCP.





==================================================

10\. FBS BRAND SYSTEM

==================================================



Official brand colors:



Primary Navy:

\#1A2541



Secondary Navy:

\#1E2A5E



Premium Gold:

\#D9B87F



Accent Gold:

\#D0AD67



The site MUST use these as the brand foundation.



However:



Do NOT build every page with a dark navy background.



Use:



\- White.

\- Warm white.

\- Light neutral backgrounds.



Use Navy for:



\- Header.

\- Hero.

\- Important premium sections.

\- Strong contrast blocks.



Use Gold for:



\- CTA accents.

\- Selected states.

\- Premium highlights.

\- Price emphasis.

\- Auction status emphasis where appropriate.





==================================================

11\. TYPOGRAPHY

==================================================



Brand guideline specifies:



Arabic:

Myriad Arabic



English:

Norwester



If licensed web font files are provided:

Use them properly.



If font files are not available:

Do NOT illegally download them.



Use a professional fallback font temporarily and keep the typography system ready for the official fonts.





==================================================

12\. DESIGN DIRECTION

==================================================



The UI must NOT look like:



\- Generic ecommerce template.

\- Generic admin template.

\- Crypto auction platform.

\- Cheap classifieds site.

\- Clone of another marketplace.



Visual direction:



Premium automotive marketplace.



Characteristics:



\- Strong visual hierarchy.

\- Clean layouts.

\- Premium spacing.

\- Limited border radiuses.

\- Controlled shadows.

\- High contrast.

\- High readability.

\- Subtle animations.

\- Strong mobile experience.



Do not overuse gradients.



Do not overuse glassmorphism.



Do not sacrifice usability for decorative effects.





==================================================

13\. PLATE DATA MODEL

==================================================



Plate data must be structured.



Do NOT store a plate only as:



"ABC 1234"



Store:



plate id

owner id



plate type



letter 1

letter 2

letter 3



digits

digits count



region

city



description



verification status



listing status



featured state



views count

favorites count



created at

updated at





==================================================

14\. PLATE LETTERS

==================================================



Create reference table:



plate\_letters



Fields:



id

arabic

latin

normalized\_code

sort\_order

active



Do not hardcode Arabic/Latin plate letter mapping inside UI components.





==================================================

15\. PLATE TYPES

==================================================



Create:



plate\_types



Do not hardcode types inside application code.



Admin must be able to manage them.



Initial examples can include:



خصوصي



نقل



صغيرة / رياضية



But final available types are admin-configurable.





==================================================

16\. PLATE MEDIA

==================================================



Support:



\- Main image.

\- Gallery.

\- Verification documents.

\- Ownership evidence.



Separate:



PUBLIC MEDIA



from



PRIVATE DOCUMENTS





Public plate images can use CDN-accessible URLs.



Ownership documents MUST remain private.



Use signed URLs for private documents.





==================================================

17\. OWNERSHIP VERIFICATION

==================================================



Plate verification lifecycle:



DRAFT



↓



SUBMITTED



↓



DOCUMENTS\_PENDING



↓



UNDER\_REVIEW



↓



Either:



CHANGES\_REQUIRED



REJECTED



VERIFIED



↓



APPROVED





A plate MUST NOT automatically become auction-ready before verification.





==================================================

18\. SELL YOUR PLATE FLOW

==================================================



User Login



↓



Add Plate



↓



Enter Plate Data



↓



Upload Plate Images



↓



Upload Ownership Evidence



↓



Review Submission



↓



Submit



↓



Admin Review



↓



Verified / Changes Required / Rejected



↓



Auction Configuration



↓



Scheduled Auction





Seller dashboard must clearly show the current status.





==================================================

19\. PLATE SEARCH

==================================================



Search is a PRIMARY PRODUCT FEATURE.



Users must be able to search using:



LETTERS:



\- first letter.

\- second letter.

\- third letter.

\- any selected letter.

\- three equal letters.

\- two matching letters.

\- first and last matching.

\- all different.





NUMBERS:



\- one digit.

\- two digits.

\- three digits.

\- four digits.

\- exact number.

\- repeated digits.

\- two matching digits.

\- three matching digits.

\- four matching digits.

\- sequential numbers.

\- first and last equal.

\- unique number patterns.





OTHER FILTERS:



\- price.

\- plate type.

\- auction status.

\- region.

\- city.

\- verified plates.

\- featured.

\- ending soon.





SORTING:



\- recommended.

\- newest.

\- lowest price.

\- highest price.

\- most viewed.

\- most bids.

\- ending soon.





==================================================

20\. SEARCH SIGNATURE

==================================================



Calculate searchable number / letter characteristics when the plate is created or changed.



Do NOT perform complex pattern analysis across the complete database on every search request.



Example metadata:



digit\_count

digit\_pattern

digit\_sequence

first\_last\_digit\_equal



letter\_pattern

first\_last\_letter\_equal



Create database indexes for search-critical fields.





==================================================

21\. PLATE DETAIL PAGE

==================================================



Show:



\- Premium digital plate representation.

\- Original uploaded images.

\- Letters.

\- Numbers.

\- Plate type.

\- Verification badge.

\- Auction state.

\- Current price.

\- Opening price.

\- Number of bids.

\- Countdown.

\- Minimum next bid.

\- Deposit amount.

\- Auction conditions.

\- Share.

\- Favorite.

\- Auction history where allowed.





==================================================

22\. PLATE VISUALIZER

==================================================



Build reusable PlateVisualizer component.



Generate a premium digital representation of the plate based on structured plate data.



Do not represent it as an official government-issued plate image if it is only a UI representation.



Uploaded real plate photos remain separately visible.





==================================================

23\. AUCTION MODEL

==================================================



Auction fields:



id

plate\_id



status



starting\_price

current\_price



reserve\_price



increment\_mode

minimum\_increment



deposit\_type

deposit\_amount

deposit\_percentage



registration\_start\_at

registration\_end\_at



start\_at

scheduled\_end\_at

effective\_end\_at



anti\_sniping\_enabled

extension\_window\_seconds

extension\_duration\_seconds

max\_extensions



public\_bid\_history



winner\_id

winning\_bid\_id

winning\_amount



commission\_type

commission\_value



created\_at

updated\_at

finalized\_at





==================================================

24\. MONEY

==================================================



Do NOT use floating point values for money.



Store money as integer minor currency units.



Use BIGINT where appropriate.



Currency:



SAR



Example:



100 SAR



stored internally as:



10000 halalas



Create a reusable Money utility.





==================================================

25\. AUCTION STATE MACHINE

==================================================



Main:



DRAFT



↓



PENDING\_APPROVAL



↓



SCHEDULED



↓



REGISTRATION\_OPEN



↓



WAITING\_ROOM



↓



LIVE



↓



ENDING



↓



ENDED



↓



SETTLEMENT



↓



COMPLETED





Exceptional:



PAUSED



SUSPENDED



CANCELLED



DISPUTED



RESERVE\_NOT\_MET





State transitions must be controlled by domain logic.



Do not allow arbitrary status mutation.





==================================================

26\. AUCTION REGISTRATION

==================================================



Flow:



Authenticated?



↓



Account active?



↓



Required user verification complete?



↓



Registration open?



↓



Already registered?



↓



Deposit required?



↓



Payment authorization successful?



↓



QUALIFIED





Registration states:



PENDING

PAYMENT\_PENDING

AUTHORIZED

QUALIFIED

REJECTED

CANCELLED

EXPIRED

SUSPENDED





==================================================

27\. SECURITY DEPOSIT

==================================================



The preferred deposit architecture is:



AUTHORIZATION HOLD



NOT:



CHARGE EVERY USER

THEN REFUND LOSERS





Flow:



Bidder



↓



Authorize Security Deposit



↓



AUTHORIZED



↓



Qualified for Auction





Winner:



CAPTURE according to platform policy.





Non-winner:



VOID authorization.





Do not hardcode assumptions about individual payment method capabilities.





==================================================

28\. PAYMENT ABSTRACTION

==================================================



Create provider abstraction.



Example:



PaymentProvider



with operations:



authorize

capture

void

refund

getPayment

verifyWebhook





The auction domain must not know whether the provider is:



Moyasar



PayTabs



or another provider.





==================================================

29\. PAYMENT CAPABILITIES

==================================================



Model capabilities such as:



supportsAuthorization



supportsCapture



supportsVoid



supportsRefund



authorizationValidity





Do not assume:



Visa

Mastercard

Mada

Apple Pay



all behave identically.





==================================================

30\. PAYMENT STATE MACHINE

==================================================



CREATED



↓



PENDING



↓



AUTHORIZED



↓



CAPTURE\_PENDING

→ CAPTURED



or



VOID\_PENDING

→ VOIDED





Additional states:



EXPIRED

FAILED

REFUND\_PENDING

REFUNDED

REQUIRES\_REVIEW





==================================================

31\. PAYMENT IDEMPOTENCY

==================================================



Every financial operation must use an idempotency key.



Examples:



authorize:{auction}:{user}



capture:{auction}:{winner}



void:{authorization}





Retries MUST NOT execute the same financial operation twice.





==================================================

32\. PAYMENT WEBHOOKS

==================================================



Webhook flow:



Receive webhook



↓



Verify signature



↓



Validate provider event ID



↓



Deduplicate



↓



Validate payment state transition



↓



Persist event



↓



Update transaction



↓



Trigger business event





Create payment\_events table.



Unique:



provider + provider\_event\_id





==================================================

33\. AUTHORIZATION EXPIRY

==================================================



Store:



authorized\_at



expires\_at





Before auction start:



verify the deposit authorization is still valid.



If authorization will expire before auction completion:



require reauthorization or another valid workflow according to payment provider capabilities.





==================================================

34\. WAITING ROOM

==================================================



Waiting room should open a configurable amount before auction start.



Default can be:



15 minutes



but MUST NOT be hardcoded.





Waiting room displays:



\- auction information.

\- countdown.

\- deposit status.

\- bidder eligibility.

\- connection status.

\- auction rules.



Initialize realtime connection here.





==================================================

35\. LIVE AUCTION ROOM

==================================================



This is the most important UX in the product.



Show:



\- Plate visual.

\- Auction state.

\- Current highest bid.

\- Minimum next bid.

\- Countdown.

\- Bid count.

\- Highest bidder masked.

\- Bid controls.

\- Realtime connection state.

\- Auction extension notices.

\- Bid history.

\- Auction rules.

\- Favorite.

\- Share.





==================================================

36\. MOBILE AUCTION EXPERIENCE

==================================================



Mobile is CRITICAL.



At:



360px

390px

430px



always keep the critical auction controls accessible.



Use sticky mobile bidding panel:



Current Price



Countdown



Next Bid



Bid CTA





The bidder must not need to scroll to bid.





==================================================

37\. BID UX

==================================================



Support:



Quick Bid



Current Price + Minimum Increment





Optionally:



Custom Higher Bid



if enabled by auction settings.





The frontend must never be the final validator.





==================================================

38\. BID REQUEST

==================================================



Example request:



{

&#x20; "auctionId": "...",

&#x20; "amount": 15000000,

&#x20; "bidRequestId": "UUID"

}





==================================================

39\. BID VALIDATION

==================================================



Server flow:



Authenticate



↓



Validate request



↓



Rate limit



↓



Auction exists



↓



Auction LIVE



↓



User QUALIFIED



↓



Deposit AUTHORIZED



↓



Server Time < effectiveEndAt



↓



Amount valid



↓



Atomic bid execution





==================================================

40\. BID IDEMPOTENCY

==================================================



Each attempt has:



bidRequestId





If the request is repeated due to:



double click



timeout



browser retry



network reconnect





return the original result.



Do not create another bid.





==================================================

41\. AUCTION ENGINE

==================================================



Create isolated Auction Engine domain.



Responsibilities:



validateBid



submitBid



sequenceBid



extendAuction



pauseAuction



resumeAuction



finalizeAuction





Do not place these functions inside React UI code.





==================================================

42\. REDIS

==================================================



Redis is used for:



\- live auction state.

\- atomic bidding.

\- distributed locks.

\- sequence generation.

\- rate limiting.

\- idempotency caching.





Example:



auction:{auctionId}:state





Fields:



status



currentBid



highestBidderId



sequence



effectiveEndAt



version



lastBidAt





==================================================

43\. ATOMIC BIDDING

==================================================



A bid update must be atomic.



Suggested implementation:



Redis atomic transaction or Lua script.





Within one atomic operation:



Check auction status.



Check end time.



Check bid amount.



Increment sequence.



Update current price.



Update highest bidder.



Update version.



Evaluate anti-sniping.



Update effective end time if required.





No race conditions.





==================================================

44\. BID SEQUENCING

==================================================



Every accepted bid receives:



sequence\_no





Example:



9001



9002



9003





Database constraint:



UNIQUE (

&#x20;auction\_id,

&#x20;sequence\_no

)





==================================================

45\. BID DATABASE

==================================================



Create bids table.



Fields:



id



auction\_id



user\_id



amount\_minor



sequence\_no



bid\_request\_id



server\_received\_at



accepted\_at



status



created\_at





Unique:



bid\_request\_id



auction\_id + sequence\_no





Bids cannot be deleted through normal application workflows.





==================================================

46\. DURABLE BID PERSISTENCE

==================================================



Redis is NOT the historical database.



Architecture:



Atomic Redis Mutation



↓



Durable Event / Queue



↓



Worker



↓



PostgreSQL





Include reconciliation process.





==================================================

47\. REALTIME

==================================================



Create abstraction:



RealtimeProvider





Functions can include:



publish



createChannelToken





Initial implementation may use Ably.



The Auction Engine must not depend directly on Ably-specific implementation.





==================================================

48\. REALTIME CHANNELS

==================================================



Auction channel:



auction:{auctionId}





Clients subscribe.



Clients MUST NOT publish authoritative auction state.





==================================================

49\. REALTIME EVENTS

==================================================



Examples:



auction.started



auction.paused



auction.resumed



auction.extended



auction.ending



auction.ended



bid.accepted



winner.declared





Private user events:



bid.rejected



user.outbid



deposit.updated



payment.updated





==================================================

50\. REALTIME PAYLOAD

==================================================



Keep events lightweight.



Example:



{

&#x20;"type": "bid.accepted",

&#x20;"auctionId": "...",

&#x20;"sequence": 10921,

&#x20;"amount": 20500000,

&#x20;"maskedBidder": "F\*\*\*21",

&#x20;"effectiveEndAt": "...",

&#x20;"serverTime": "..."

}





Never broadcast private bidder data.





==================================================

51\. MISSED EVENTS

==================================================



If client has sequence:



500



and receives:



502



then sequence 501 is missing.



Immediately fetch authoritative auction snapshot.





==================================================

52\. SNAPSHOT

==================================================



Endpoint:



GET /api/v1/auctions/:id/snapshot





Return:



status



currentBid



sequence



serverTime



effectiveEndAt



highestBidderMasked





==================================================

53\. CONNECTION STATES

==================================================



Frontend should support:



CONNECTED



RECONNECTING



SYNCING



DEGRADED





Never show stale auction information as if it is current.





==================================================

54\. SERVER TIME

==================================================



Server is authoritative.



Browser time is ONLY used to render a countdown based on server synchronization.



Never determine:



auction ended



bid valid



winner



using the user's local device clock.





==================================================

55\. ANTI-SNIPING

==================================================



Per auction settings:



anti\_sniping\_enabled



extension\_window\_seconds



extension\_duration\_seconds



max\_extensions





When an accepted bid arrives inside the extension window:



extend the effective end time according to rules.



Publish auction.extended.





==================================================

56\. RESERVE PRICE

==================================================



Support optional:



reserve\_price





If auction finishes below reserve:



RESERVE\_NOT\_MET





Reserve can be hidden from users.





==================================================

57\. AUCTION FINALIZATION

==================================================



Flow:



End time reached



↓



Acquire distributed lock



↓



LIVE → ENDING



↓



Stop new bids



↓



Read authoritative auction state



↓



Persist final state



↓



Create auction result



↓



ENDED



↓



Queue settlement



↓



Publish auction ended





==================================================

58\. DOUBLE FINALIZATION

==================================================



Protect with:



Distributed lock



\+



auction\_results.auction\_id UNIQUE



\+



finalized\_at





The auction must NEVER produce two winners.





==================================================

59\. WINNER

==================================================



Store:



winner\_id



winning\_bid\_id



winning\_amount



finalized\_at





Then start settlement process.





==================================================

60\. WINNER SETTLEMENT

==================================================



Auction Finalized



↓



Winner settlement job



↓



Capture deposit according to policy



↓



Calculate remaining amount if required



↓



Notify winner



↓



Track transfer / settlement workflow





==================================================

61\. LOSING BIDDERS

==================================================



Authorized deposits:



↓



VOID\_PENDING



↓



Void



↓



VOIDED





Do this asynchronously.





==================================================

62\. BULK DEPOSIT RELEASE

==================================================



Never execute thousands of VOID requests inside one HTTP request.



Use:



Queue



Workers



Controlled concurrency



Retries



Dead-letter handling





==================================================

63\. CANCELLED AUCTION

==================================================



Cancel Auction



↓



Stop bids



↓



Persist cancellation reason



↓



Release participant deposits



↓



Notify users



↓



Audit event





==================================================

64\. INFRASTRUCTURE FAILURE

==================================================



Realtime failure only:



Use DEGRADED mode and controlled snapshot polling if appropriate.





If the platform cannot guarantee:



bid ordering



atomic state



or durable persistence





PAUSE THE AUCTION.





Never continue a financial auction with unreliable state.





==================================================

65\. DATABASE

==================================================



Primary permanent source of truth:



PostgreSQL / Supabase





Redis:



Operational live state





Realtime provider:



Distribution layer





Queue:



Asynchronous processing





Do not confuse these responsibilities.





==================================================

66\. DATABASE TABLES

==================================================



Create at minimum:



profiles



roles

permissions

role\_permissions

user\_roles



plate\_letters

plate\_types

plates

plate\_media

plate\_documents

plate\_submissions

plate\_verification\_events



regions

cities



auctions

auction\_increment\_rules

auction\_registrations

auction\_state\_snapshots



bids

auction\_results



payment\_authorizations

payment\_transactions

payment\_events



settlements



favorites

saved\_searches



notifications

notification\_preferences



cms\_pages

faqs



contact\_messages



audit\_logs



system\_settings

feature\_flags





==================================================

67\. DATABASE INDEXES

==================================================



Add proper indexes for:



auctions status/start time



auction registrations



bid sequence



bid request id



payment provider event



plate letters



plate digits



search metadata



plate type



auction status



verification state





Never depend on full table scans for live auction operations.





==================================================

68\. AUTHENTICATION

==================================================



Use:



Supabase Auth





V1:



Email



Password



Email verification



Password reset



Session management





Architecture ready for:



Phone OTP



Google



Advanced KYC



Nafath or another provider if added later.





==================================================

69\. RBAC

==================================================



Do NOT use a simplistic frontend-only role check.



Use:



roles



permissions



role\_permissions



user\_roles





Example permissions:



auction.create



auction.edit



auction.pause



auction.resume



auction.cancel



plate.verify



payment.view



payment.capture



payment.void



payment.refund



user.suspend



audit.view



settings.manage





Every sensitive check is server-side.





==================================================

70\. USER DASHBOARD

==================================================



Dashboard:



Overview



My Auctions



My Bids



My Plates



Favorites



Deposits



Payments



Notifications



Profile



Security





==================================================

71\. MY AUCTIONS

==================================================



Tabs:



Registered



Upcoming



Live



Won



Lost



Completed





==================================================

72\. MY PLATES

==================================================



Statuses:



Draft



Pending Verification



Changes Required



Verified



Scheduled



Live



Sold



Cancelled





==================================================

73\. ADMIN DASHBOARD

==================================================



Show:



Active Auctions



Upcoming Auctions



Pending Plate Verifications



Qualified Bidders



Deposits



Payment Problems



Settlement Problems



Users



Recent Activity



System Health





==================================================

74\. LIVE AUCTION ADMIN CENTER

==================================================



Display:



Auction Status



Current Price



Highest Bidder



Connected Users



Participants



Bid Requests/sec



Accepted Bids/sec



Recent Bids



Realtime Health



Redis Health



Database Health



Queue Health



Error Rate





Controls:



Pause



Resume



Emergency Stop



Extend



Cancel





Require:



Permission



Confirmation



Reason



Audit





==================================================

75\. PLATE VERIFICATION ADMIN

==================================================



Admin sees:



Plate data



Owner data



Submitted documents



Previous review activity



Verification history





Actions:



Verify



Request Changes



Reject



Escalate





==================================================

76\. FINANCE ADMIN

==================================================



Provide views for:



Authorized Deposits



Capture Pending



Captured



Void Pending



Voided



Expired



Refunds



Payment Failures



Reconciliation Issues



Settlement Issues





==================================================

77\. CMS

==================================================



Admin can manage:



Homepage text



About



How It Works



FAQ



Contact details



Terms



Privacy



Auction policy



Deposit policy



Footer



Social links





Avoid unnecessary hardcoded content.





==================================================

78\. NOTIFICATIONS

==================================================



Architecture supports:



IN\_APP



EMAIL



SMS



WHATSAPP



PUSH





V1:



IN\_APP



EMAIL





Email provider adapter:



Resend





==================================================

79\. NOTIFICATION EVENTS

==================================================



Include:



account verified



plate submitted



plate changes required



plate verified



plate rejected



auction registration open



auction registration approved



auction starting



auction started



auction extended



auction ended



user outbid



user won



user lost



deposit authorized



deposit released



payment required



payment failed





==================================================

80\. NOTIFICATION THROTTLING

==================================================



Do not send excessive emails during rapid auctions.



Implement:



deduplication



throttling



notification preferences





==================================================

81\. SEO

==================================================



Public pages should include:



Server-rendered metadata



Canonical URLs



Sitemap



robots.txt



OpenGraph



Social preview



Arabic SEO



Structured data where semantically valid





Private pages must not be indexed:



Account



Admin



Waiting Room



Private Auction APIs





==================================================

82\. ANALYTICS

==================================================



Support GA4 or Analytics Adapter.



Track:



search



filter use



plate view



favorite



auction view



registration start



registration completed



bid attempt



bid accepted



seller submission





Never send sensitive PII.





==================================================

83\. PERFORMANCE

==================================================



Public page target:



LCP <= 2.5 seconds



CLS <= 0.1



INP <= 200ms





Live auction performance is more important than decorative animation.





==================================================

84\. IMAGE PERFORMANCE

==================================================



Use:



Next.js Image where appropriate



responsive sizes



WebP / AVIF



explicit dimensions



lazy loading



CDN



proper thumbnails





Never display oversized original uploads on listing cards.





==================================================

85\. ACCESSIBILITY

==================================================



Target:



WCAG 2.2 AA





Implement:



keyboard navigation



focus visibility



screen reader support



proper labels



ARIA only when required



contrast compliance



reduced motion



clear errors





Do not depend on color alone.





==================================================

86\. RESPONSIVE BREAKPOINT QA

==================================================



Manually test:



360px



390px



430px



768px



1024px



1280px



1440px+





No horizontal overflow.





==================================================

87\. SECURITY

==================================================



Implement:



HTTPS



secure headers



CSP



HSTS



HttpOnly cookies



SameSite settings



input validation



XSS prevention



SQL injection prevention



rate limiting



RBAC



signed payment webhooks



upload validation



MIME validation



file-size restrictions



private storage



audit logs



secret isolation





==================================================

88\. BOT PROTECTION

==================================================



Architecture ready for:



Cloudflare Turnstile





Use on suspicious / abuse-prone operations such as:



Registration



Login anomaly



Password reset



Seller submission





Do not put CAPTCHA on every live bid.





==================================================

89\. RATE LIMITING

==================================================



Redis-based rate limiting.



Separate policies for:



Auth



Search



Uploads



Bids



Payments



Admin





Bid rate limit should include:



User



Session



Auction



IP as secondary signal





==================================================

90\. STORAGE

==================================================



Recommended buckets:



public-plate-media



private-verification-documents



private-settlement-documents





Private documents:



Signed URLs only.





==================================================

91\. AUDIT

==================================================



Audit sensitive operations.



Store:



actor\_id



actor\_role



action



entity\_type



entity\_id



before\_state



after\_state



reason



request\_id



ip



user\_agent



timestamp





Audit logs should not be editable through normal Admin UI.





==================================================

92\. OBSERVABILITY

==================================================



Every request:



requestId





Every auction:



auctionId





Every bid:



bidRequestId





Every payment:



paymentId





Every background job:



jobId





Use structured logging.





==================================================

93\. MONITORING

==================================================



Support:



Vercel Observability



Sentry



Supabase metrics



Redis metrics



Realtime metrics



Queue metrics





==================================================

94\. AUCTION METRICS

==================================================



Measure:



connected\_users



bid\_requests\_per\_second



accepted\_bids\_per\_second



rejected\_bids\_per\_second



bid\_latency\_p50



bid\_latency\_p95



bid\_latency\_p99



redis\_latency



database\_latency



realtime\_latency



queue\_depth



queue\_lag



error\_rate



reconnect\_rate





==================================================

95\. SYSTEM HEALTH

==================================================



System health states:



HEALTHY



DEGRADED



CRITICAL





Critical Auction Engine failure:



PAUSE auction.





==================================================

96\. QUEUE JOBS

==================================================



Implement jobs such as:



persist\_bid



open\_registration



open\_waiting\_room



start\_auction



finalize\_auction



capture\_winner



release\_deposit



payment\_reconciliation



auction\_reconciliation



send\_notification



generate\_document





==================================================

97\. JOB RULES

==================================================



Every job:



Unique job id



Idempotency



Retry strategy



Attempt count



Structured error



Dead Letter Queue handling





==================================================

98\. PAYMENT RECONCILIATION

==================================================



Scheduled process checks:



Pending payments



Authorizations near expiry



Capture pending



Void pending



Refund pending





Compare internal state against payment provider state.





==================================================

99\. AUCTION RECONCILIATION

==================================================



Periodically compare:



Redis live state



PostgreSQL persisted state



Bid sequences





Detect:



Missing sequence



Persistence lag



State mismatch





==================================================

100\. PROJECT ARCHITECTURE

==================================================



Recommended monorepo:



fbs-platform/



apps/

&#x20; web/



packages/

&#x20; ui/

&#x20; database/

&#x20; auction-core/

&#x20; payments/

&#x20; realtime/

&#x20; auth/

&#x20; notifications/

&#x20; schemas/

&#x20; observability/

&#x20; config/



supabase/

&#x20; migrations/

&#x20; seed/



tests/

&#x20; unit/

&#x20; integration/

&#x20; e2e/

&#x20; load/



docs/



scripts/





==================================================

101\. NEXT.JS APP STRUCTURE

==================================================



apps/web/src/



app/



components/



features/



server/



lib/



schemas/



types/





Feature modules:



auth



users



plates



search



verification



auctions



bidding



payments



settlements



notifications



admin



cms



audit



analytics





==================================================

102\. TAILWIND CSS ARCHITECTURE

==================================================



Tailwind CSS is mandatory.



Create centralized design tokens for:



colors



typography



spacing



radius



shadow



container widths



breakpoints



animation durations



z-index





Map FBS branding into Tailwind theme variables.



Example conceptual tokens:



brand-navy-900

brand-navy-800

brand-gold-500

brand-gold-400

surface

surface-muted

text

text-muted

border





Do NOT spread arbitrary hex codes across random components.





==================================================

103\. COMPONENT ARCHITECTURE

==================================================



Build reusable components.



Examples:



PlateCard



PlateVisualizer



AuctionCard



LiveAuctionPanel



AuctionCountdown



BidButton



BidHistory



ConnectionStatus



PriceDisplay



DepositStatus



PaymentStatus



VerificationBadge



SearchFilters



MobileAuctionBar



EmptyState



ErrorState



LoadingSkeleton



ConfirmationDialog





==================================================

104\. API VERSIONING

==================================================



Use:



/api/v1





Example endpoints:



GET /api/v1/plates



GET /api/v1/plates/:id



POST /api/v1/plates



PATCH /api/v1/plates/:id



POST /api/v1/plates/:id/submit





GET /api/v1/auctions



GET /api/v1/auctions/:id



POST /api/v1/auctions/:id/register



GET /api/v1/auctions/:id/snapshot



POST /api/v1/auctions/:id/bids





GET /api/v1/bids/:requestId





POST /api/v1/payments/authorize



GET /api/v1/payments/:id





POST /api/v1/webhooks/payments/:provider





POST /api/v1/realtime/token





Admin:



/api/v1/admin/\*





==================================================

105\. VALIDATION

==================================================



Use shared validation schemas.



Recommended:



Zod





Client validation improves UX.



Server validation is mandatory.



Never trust browser input.





==================================================

106\. ERROR CONTRACT

==================================================



Standardize errors.



Example:



{

&#x20;"error": {

&#x20;  "code": "STALE\_BID",

&#x20;  "message": "تعذر قبول المزايدة لأن السعر تغير.",

&#x20;  "details": {

&#x20;     "currentBid": 20100000,

&#x20;     "minimumNextBid": 20200000

&#x20;  },

&#x20;  "requestId": "..."

&#x20;}

}





==================================================

107\. ERROR CODES

==================================================



Include:



AUTH\_REQUIRED



ACCOUNT\_SUSPENDED



PLATE\_NOT\_VERIFIED



AUCTION\_NOT\_FOUND



AUCTION\_NOT\_LIVE



AUCTION\_PAUSED



AUCTION\_ENDED



REGISTRATION\_REQUIRED



NOT\_QUALIFIED



DEPOSIT\_REQUIRED



DEPOSIT\_EXPIRED



BID\_TOO\_LOW



STALE\_BID



DUPLICATE\_BID



RATE\_LIMITED



PAYMENT\_FAILED



PAYMENT\_PENDING



SYSTEM\_DEGRADED





==================================================

108\. FEATURE FLAGS

==================================================



Create feature flags for future capabilities:



fixed\_price\_sales



buy\_now



proxy\_bidding



phone\_otp



advanced\_kyc



whatsapp



sms



saved\_search\_alerts



seller\_self\_service





==================================================

109\. SALE MODES

==================================================



Architecture supports:



AUCTION



FIXED\_PRICE



AUCTION\_WITH\_BUY\_NOW





Initial UI can focus on:



AUCTION



if required by the approved scope.





==================================================

110\. COMMISSION

==================================================



Do NOT hardcode platform commission.



Support:



NONE



FIXED



PERCENTAGE





Configuration can be:



global default



or auction-specific override.





==================================================

111\. OWNERSHIP TRANSFER

==================================================



Do not invent a government integration.



Initial workflow:



WINNER\_CONFIRMED



↓



PARTIES\_CONTACTED



↓



TRANSFER\_IN\_PROGRESS



↓



TRANSFER\_CONFIRMED



↓



COMPLETED





Future official integration can be added via adapter if available.





==================================================

112\. ANIMATION

==================================================



Use subtle motion.



Typical UI animation:



150–350ms





Respect:



prefers-reduced-motion





Avoid expensive animation inside the live bidding critical path.





==================================================

113\. LOADING STATES

==================================================



Implement:



Skeletons



Button loading



Upload progress



Route loading



Auction connecting state





No blank screens.





==================================================

114\. EMPTY STATES

==================================================



Custom empty states for:



No auctions



No bids



No favorites



No submitted plates



No search results



No notifications





==================================================

115\. LIVE BID UI STATES

==================================================



READY



↓



SUBMITTING



↓



ACCEPTED





or:



REJECTED





Do not show:



"You are winning"



until server acknowledgement.





==================================================

116\. CONNECTION LOSS DURING BID

==================================================



If Bid request was sent and connection disappeared:



Do not assume failed.



After reconnection:



GET bid result using bidRequestId.



Display authoritative result.





==================================================

117\. TESTING

==================================================



Mandatory:



Unit Tests



Integration Tests



E2E Tests



Contract Tests



Load Tests



Stress Tests



Failure / Chaos Tests



Security Tests





==================================================

118\. CRITICAL UNIT TESTS

==================================================



Test thoroughly:



Auction state machine



Bid validation



Bid sequencing



Bid idempotency



Anti-sniping



Reserve price



Money utilities



Payment state machine



Payment idempotency



Auction finalization



Search pattern generation





==================================================

119\. E2E FLOW

==================================================



Automate:



Register



Login



Submit plate



Upload documents



Admin verification



Schedule auction



Bidder registration



Deposit authorization



Waiting room



Live auction



Bid



Outbid



Anti-sniping extension



Auction end



Winner



Loser deposit release





==================================================

120\. LOAD TEST

==================================================



Test:



1,000 concurrent users



5,000 concurrent users



10,000 concurrent users





Then stress beyond normal target.





==================================================

121\. HIGH LOAD SCENARIO

==================================================



Simulate:



10,000 viewers



1,000 active bidders



bursty bidding



last 30 seconds



reconnects





Must result in:



No duplicate sequence.



No accepted invalid bid.



No lost accepted bid.



Correct final winner.



Correct client reconciliation.





==================================================

122\. PERFORMANCE TARGETS

==================================================



Bid processing:



P95 < 300ms target under expected load.





Realtime propagation:



Target reasonable P95 < 500ms where infrastructure allows.





Measure.



Do not assume.





==================================================

123\. FAILURE TESTING

==================================================



Simulate:



Redis outage



PostgreSQL slowdown



Realtime provider disconnect



Payment timeout



Duplicate payment webhook



Delayed payment webhook



Queue retry



Worker crash



Server retry



Mass reconnect





==================================================

124\. ENVIRONMENTS

==================================================



Use:



local



development



staging



production





Never expose Production credentials to Preview environments.





==================================================

125\. ENVIRONMENT VALIDATION

==================================================



Create typed env validation.



Fail fast if critical variables are missing.





==================================================

126\. DATABASE MIGRATIONS

==================================================



All schema modifications must use version-controlled migrations.



No manual undocumented Production changes.





==================================================

127\. DEVELOPMENT ORDER

==================================================



PHASE 1

Foundation



Next.js

TypeScript

Tailwind CSS

Project structure

Brand system

Lint

Formatting

Testing

Environment validation





PHASE 2

Database



Schema

Migrations

Indexes

RLS

Seed

Types





PHASE 3

Authentication



Register

Login

Verification

Password recovery

Profile

RBAC





PHASE 4

Plate Marketplace



Plate submission

Media

Verification

Search

Filters

Plate cards

Plate details





PHASE 5

Admin



Dashboard

Users

Plate verification

Settings





PHASE 6

Auction Domain



Auction CRUD

Scheduling

State machine

Registration

Waiting room





PHASE 7

Auction Engine



Redis

Atomic bidding

Sequencing

Anti-sniping

Finalization





PHASE 8

Realtime



Channels

Events

Snapshot

Reconnect

Reconciliation





PHASE 9

Payments



Provider abstraction

Authorization

Webhooks

Capture

Void

Refund

Reconciliation





PHASE 10

Settlement



Winner workflow

Loser deposit release

Completion flow





PHASE 11

Notifications



In-app

Resend email





PHASE 12

CMS and SEO





PHASE 13

Monitoring and Security





PHASE 14

Responsive QA

Accessibility

E2E

Load testing

Failure testing





PHASE 15

Production Readiness





==================================================

128\. CODE QUALITY

==================================================



Required:



TypeScript Strict



ESLint



Prettier



No implicit any



No dead code



No unresolved imports



No hydration errors



No unhandled promises



No production console spam





Business logic must be testable outside the UI.





==================================================

129\. DOCUMENTATION

==================================================



Create:



README.md





docs/



architecture.md



auction-engine.md



database.md



payments.md



realtime.md



security.md



deployment.md



environment.md



disaster-recovery.md





==================================================

130\. README

==================================================



Must explain:



Architecture



Installation



Environment variables



Development setup



Supabase setup



Redis setup



Realtime setup



Payment provider setup



Resend setup



Database migrations



Seed data



Testing



Deployment



Admin bootstrap





==================================================

131\. PLACEHOLDER CLEANUP

==================================================



Before final delivery search the entire repository for:



TODO



FIXME



Lorem ipsum



example.com



dummy



fake



placeholder



javascript:void



href="#"





Remove customer-facing placeholders.





==================================================

132\. FINAL BUILD CHECKS

==================================================



Must pass:



pnpm lint



pnpm typecheck



pnpm test



pnpm build





Run E2E tests.





No:



TypeScript errors



broken assets



broken routes



console errors



hydration errors



critical accessibility issues





==================================================

133\. SECURITY ACCEPTANCE

==================================================



Verify:



A user cannot access another user's private documents.



A client cannot insert a bid directly into database.



Seller cannot verify own plate.



Support cannot capture payment.



User cannot promote own role.



Forged webhook rejected.



Duplicate webhook is idempotent.



Expired auction rejects bids.



Duplicate bid request creates only one bid.





==================================================

134\. AUCTION ACCEPTANCE

==================================================



Verify:



simultaneous bids



multiple application instances



network retries



last-second bids



anti-sniping



pause/resume



reconnection



missed events



finalization retry





Winner must always be deterministic.





==================================================

135\. FINANCIAL ACCEPTANCE

==================================================



Test:



Authorization



Authorization retry



Capture



Capture retry



Void



Void retry



Refund



Duplicate webhook



Delayed webhook



Out-of-order webhook



Provider timeout





There must be no scenario that causes an unintended double capture.





==================================================

136\. RESPONSIVE ACCEPTANCE

==================================================



Manually inspect:



360px



390px



430px



768px



1024px



1280px



1440px+





Critical pages:



Homepage



Plate search



Plate details



Login



Register



Account



Seller submission



Waiting room



Live auction



Admin





==================================================

137\. PRODUCTION INFRASTRUCTURE

==================================================



APPLICATION:



Next.js + TypeScript + Tailwind CSS



↓



Vercel





DATABASE / AUTH / STORAGE:



Supabase





LIVE AUCTION STATE:



Upstash Redis





REALTIME:



Ably through adapter





BACKGROUND JOBS:



QStash / worker architecture





EMAIL:



Resend





MONITORING:



Sentry





DNS / SECURITY:



Cloudflare-ready





==================================================

138\. SCALING STRATEGY

==================================================



Start with low-cost plans.



Do NOT buy enterprise plans before real usage requires them.



However:



The application architecture must be production-grade from day one.





Development:



Use Free tiers where practical.





Early Production:



Upgrade critical services such as:



Vercel Pro



Supabase Pro





Realtime / Redis / Queue:



Upgrade based on real load and load-test results.





Before any major auction:



Run load test.



Confirm limits.



Verify monitoring.



Verify payment gateway limits.



Verify realtime capacity.



Verify Redis capacity.





==================================================

139\. NON-NEGOTIABLE RULES

==================================================



NO CLIENT-SIDE BID AUTHORITY.



NO DIRECT CLIENT BID INSERT INTO DATABASE.



NO BROWSER CLOCK AS AUCTION AUTHORITY.



NO AUCTION STATE STORED ONLY IN NEXT.JS PROCESS MEMORY.



NO FINANCIAL OPERATION WITHOUT IDEMPOTENCY.



NO PAYMENT SUCCESS BASED ONLY ON FRONTEND CALLBACK.



NO UNSIGNED PAYMENT WEBHOOK TRUST.



NO WINNER DETERMINED BY FRONTEND.



NO BULK VOID LOOP INSIDE ONE HTTP REQUEST.



NO DELETING BID HISTORY.



NO LIVE AUCTION WHEN STATE CONSISTENCY CANNOT BE GUARANTEED.



NO LARGE PRODUCTION AUCTION WITHOUT LOAD TESTING.





==================================================

140\. BUSINESS VALUES THAT MUST REMAIN CONFIGURABLE

==================================================



Do NOT invent or hardcode values for:



Security deposit amount



Deposit percentage



Minimum increment



Increment strategy



Anti-sniping window



Anti-sniping extension duration



Maximum extensions



Reserve price



Platform commission



Seller commission



Auction registration duration



Waiting room duration



Payment provider



KYC requirements



Sale mode





Provide suitable Admin Settings / Auction Settings.





==================================================

141\. DEFINITION OF DONE

==================================================



The project is NOT finished until all of the following exist and work:



Public website



FBS branding



Next.js architecture



Tailwind CSS design system



Responsive interface



Plate search



Plate detail page



Seller plate submission



Private document upload



Ownership verification



User dashboard



Admin dashboard



Auction creation



Auction scheduling



Auction registration



Security deposits



Waiting room



Live auction



Atomic bidding



Bid sequencing



Realtime updates



Reconnect



Snapshot reconciliation



Anti-sniping



Auction finalization



Winner determination



Payment architecture



Capture



Void



Reconciliation



Settlement workflow



Notifications



RBAC



Audit logs



CMS



SEO



Accessibility



Monitoring



Rate limiting



Security hardening



Testing



Load testing



Documentation



Production build





==================================================

142\. FINAL CODEX DIRECTIVE

==================================================



Build the complete FBS platform as a real production product.



DO NOT build a visual prototype.



DO NOT stop after creating the homepage.



DO NOT create fake dashboards with no business logic.



DO NOT replace Next.js or Tailwind CSS with another framework.



The mandatory frontend architecture is:



NEXT.JS

\+

TYPESCRIPT

\+

TAILWIND CSS





Keep business logic modular.



Keep auction logic server-authoritative.



Keep payment operations idempotent.



Keep realtime separate from the permanent database.



Keep Redis as operational hot state, not the permanent historical record.



Keep PostgreSQL as the durable source of truth.



Keep financial workflows auditable.



Prioritize:



Auction correctness

>

Financial safety

>

Security

>

Mobile UX

>

Performance

>

Visual polish





The final product must feel like a premium Saudi automotive auction marketplace built specifically for FBS.



Where business rules are not yet finalized:



DO NOT invent them.



Make them configurable.



Complete implementation, testing, responsive QA, security review, load testing and documentation before considering the project complete.

