# Webwise OS

Separate Next.js app. Does **not** change the live marketing site.

```bash
cd webwise-os
cp .env.example .env.local
# set SESSION_SECRET
npm install
npm run dev
```

Open http://localhost:3000

Demo password `demo123`

- `meera@kapoordental.in` — clinic owner
- `rahul@sharmatravels.in` — activation
- `saurabh@webwisedigital.net` — agency console

Production: new Vercel project with root directory `webwise-os`. Apply `supabase/schema.sql` and `supabase/rls.sql` before turning `DEMO_MODE=false`.
