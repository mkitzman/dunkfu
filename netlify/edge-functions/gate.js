// Temporary gate while the new site is in progress. Everyone sees a "coming
// soon" page; /login with PREVIEW_PASSWORD sets a cookie that shows the real
// site. Runs before static files and functions, so /data is gated too.
// Delete this file (and the PREVIEW_PASSWORD env var) to launch.

const COOKIE = 'dunkfu_preview'
const MAX_AGE = 60 * 60 * 24 * 90 // 90 days

async function token(password) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`dunkfu:${password}`))
  return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, '0')).join('')
}

const cookieOf = (req, name) =>
  (req.headers.get('cookie') || '').split(/;\s*/).find(c => c.startsWith(name + '='))?.slice(name.length + 1)

const page = (title, body, status = 200) =>
  new Response(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@500&family=Sora:wght@400;600;800&display=swap">
<style>
  :root { --bg:#faf9f7; --sf:#fff; --fg:#15171a; --mu:#646a72; --ln:rgba(20,23,26,.12); --ac:oklch(0.58 0.14 215); --dn:oklch(0.58 0.16 25); color-scheme: light dark; }
  @media (prefers-color-scheme: dark) { :root { --bg:#121416; --sf:#1a1d21; --fg:#eceef0; --mu:#8f959d; --ln:rgba(255,255,255,.12); --ac:oklch(0.8 0.12 215); --dn:oklch(0.76 0.14 25); } }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; display:grid; place-items:center; background:var(--bg); color:var(--fg); font-family:Sora,system-ui,sans-serif; padding:24px; text-align:center; }
  .mark { font:800 56px/1 Sora,sans-serif; letter-spacing:-.03em; }
  .mark span { font-weight:400; color:var(--ac); }
  .eyebrow { font:500 11px 'DM Mono',monospace; letter-spacing:.12em; text-transform:uppercase; color:var(--ac); margin-top:22px; }
  p { color:var(--mu); font-size:14px; line-height:1.6; margin:8px 0 0; }
  form { display:flex; gap:8px; margin-top:22px; justify-content:center; }
  input, button { font:inherit; font-size:14px; border-radius:999px; border:1px solid var(--ln); padding:10px 16px; }
  input { background:var(--sf); color:var(--fg); width:220px; }
  button { background:var(--fg); color:var(--bg); font-weight:600; cursor:pointer; border-color:var(--fg); }
  .err { color:var(--dn); }
</style>
</head>
<body><main>${body}</main></body>
</html>`, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } })

const comingSoon = () => page('dunkfu', `
  <div class="mark">dunk<span>fu</span></div>
  <div class="eyebrow">Coming soon</div>
  <p>A new dunkfu is on the way: last night's scores, box scores and standings.</p>`)

const login = (error, unset) => page('dunkfu · preview', `
  <div class="mark">dunk<span>fu</span></div>
  <div class="eyebrow">Preview</div>
  <form method="post" action="/login">
    <input type="password" name="password" placeholder="Password" aria-label="Password" autofocus required>
    <button type="submit">Enter</button>
  </form>
  ${unset ? '<p class="err">Preview login isn\'t set up yet (PREVIEW_PASSWORD is missing in this deploy).</p>' : error ? '<p class="err">Wrong password.</p>' : ''}`, error ? 401 : 200)

export default async (req, context) => {
  const url = new URL(req.url)
  const password = Netlify.env.get('PREVIEW_PASSWORD')?.trim()
  const expected = password ? await token(password) : null // no password set = nobody gets in

  if (url.pathname === '/login') {
    if (req.method === 'POST') {
      const form = await req.formData()
      if (expected && (await token(String(form.get('password') || '').trim())) === expected) {
        return new Response(null, {
          status: 303,
          headers: { location: '/', 'set-cookie': `${COOKIE}=${expected}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax` },
        })
      }
      return login(true, !expected)
    }
    return login(false, !expected)
  }

  if (url.pathname === '/logout') {
    return new Response(null, { status: 303, headers: { location: '/', 'set-cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` } })
  }

  if (expected && cookieOf(req, COOKIE) === expected) {
    const res = await context.next()
    res.headers.set('x-robots-tag', 'noindex') // keep the preview out of search engines
    return res
  }

  if (url.pathname === '/favicon.ico') return context.next()
  return comingSoon()
}

export const config = { path: '/*' }
