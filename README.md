# TripNest Pro

A Vercel-ready tourism business directory frontend/backend.

## Included
- Public directory and searchable business cards
- Crawlable dedicated business URLs: `/business/{slug}`
- Server-rendered business profile HTML with title, description, canonical, Open Graph and LocalBusiness JSON-LD
- Dynamic sitemap at `/sitemap.xml`
- Google + mobile-number/password account login; the app does not implement SMS OTP
- Business dashboard with editable details, photos, enquiry inbox, reviews and page preview
- Supabase Realtime review updates
- Razorpay recurring ₹699/month subscription flow + webhook status sync
- Lead capture, profile-view tracking and subscription-based publishing
- Supabase RLS policies and public photo storage bucket

## Production setup
1. Create a Supabase project and run `supabase/schema.sql` in SQL Editor.
2. Enable Google provider in Supabase Auth.
3. For no-SMS mobile/password login, configure Supabase Auth so phone confirmation is not required; the app itself only uses password login and never asks for an OTP.
4. Create a Razorpay monthly plan for ₹699 and put its plan ID in `RAZORPAY_PLAN_ID`.
5. Add the environment variables in `.env.example` to Vercel.
6. Set Razorpay webhook URL to `/api/razorpay-webhook` and add the webhook secret.
7. Set `PUBLIC_SITE_URL` to the production domain. Update the canonical URLs in the static HTML pages if you use a domain other than `your-domain.com`.

## SEO note
The platform uses legitimate crawlable HTML, stable public URLs, canonical URLs, sitemap and structured data. There is no invisible keyword stuffing. Google controls crawling, indexing and whether rich results are shown.
