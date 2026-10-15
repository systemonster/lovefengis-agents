#!/usr/bin/env node
// lovefengis CLI: sitenin salt-okunur API'sinin (https://lovefengis.com/api/v1) komut satırı istemcisi.
// Bağımlılık yok; Node 18+ fetch'i yeter. Kişisel veri toplamaz, yazma işlemi yapmaz.
import { readFileSync, realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const API = (process.env.LOVEFENGIS_API_URL || 'https://lovefengis.com/api/v1').replace(/\/+$/, '')
const MCP = (process.env.LOVEFENGIS_MCP_URL || 'https://lovefengis.com/mcp').replace(/\/+$/, '')
const SURUM = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version
const DONEMLER = ['one_time', 'monthly', 'yearly']
const KIMLIK = /^[a-z0-9]+(-[a-z0-9]+)*$/

const YARDIM = `lovefengis ${SURUM}: services and prices of lovefengis from the terminal

Usage
  lovefengis services                      List every service with its prices
  lovefengis service <id>                  Show one service
  lovefengis pricing [--service <id>] [--period one_time|monthly|yearly]
  lovefengis docs                          Print developer documentation links
  lovefengis mcp                           Run the lovefengis MCP server over stdio (bridge to ${MCP})

Options
  --json       Print the raw API JSON (for scripts and agents)
  -h, --help   Show this help
  -v, --version

Data comes from ${API} (read-only, no API key). Prices are in TRY and include VAT.
Docs: https://lovefengis.com/gelistirici/cli`

const BELGELER = [
  ['Developer docs', 'https://lovefengis.com/gelistirici'],
  ['REST API reference', 'https://lovefengis.com/gelistirici/api'],
  ['MCP server', 'https://lovefengis.com/gelistirici/mcp'],
  ['CLI', 'https://lovefengis.com/gelistirici/cli'],
  ['OpenAPI 3.1', 'https://lovefengis.com/openapi.json'],
  ['llms.txt', 'https://lovefengis.com/llms.txt'],
]

class KullanimHatasi extends Error {}

export function argumanlariAyir(argv) {
  const sonuc = { komut: null, konum: [], json: false, service: null, period: null, yardim: false, surum: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--json') sonuc.json = true
    else if (a === '-h' || a === '--help') sonuc.yardim = true
    else if (a === '-v' || a === '--version') sonuc.surum = true
    else if (a === '--service' || a === '--period') {
      const deger = argv[++i]
      if (!deger || deger.startsWith('-')) throw new KullanimHatasi(`${a} needs a value`)
      sonuc[a.slice(2)] = deger
    } else if (a.startsWith('--service=')) sonuc.service = a.slice(10)
    else if (a.startsWith('--period=')) sonuc.period = a.slice(9)
    else if (a.startsWith('-')) throw new KullanimHatasi(`unknown option ${a}`)
    else if (!sonuc.komut) sonuc.komut = a
    else sonuc.konum.push(a)
  }
  if (sonuc.service && !KIMLIK.test(sonuc.service)) throw new KullanimHatasi(`invalid service id "${sonuc.service}"`)
  if (sonuc.period && !DONEMLER.includes(sonuc.period)) throw new KullanimHatasi(`--period must be one of ${DONEMLER.join(', ')}`)
  return sonuc
}

async function getir(yol, sorgu = {}) {
  const url = new URL(API + yol)
  for (const [k, v] of Object.entries(sorgu)) if (v) url.searchParams.set(k, v)
  let yanit
  try {
    yanit = await fetch(url, { headers: { Accept: 'application/json', 'API-Version': '1', 'User-Agent': `lovefengis-cli/${SURUM}` } })
  } catch (e) {
    throw new Error(`could not reach ${url.origin}: ${e.cause?.code || e.message}`)
  }
  const govde = await yanit.json().catch(() => null)
  if (!yanit.ok) {
    const h = govde?.error
    throw new Error(h ? `${h.code}: ${h.message}${h.hint ? ` (${h.hint})` : ''}` : `HTTP ${yanit.status}`)
  }
  return govde
}

const tl = (n) => `${new Intl.NumberFormat('tr-TR').format(n)} TRY`
const DONEM_ETIKETI = { one_time: '', monthly: '/month', yearly: '/year' }

export function fiyatSatiri(p) {
  const tutar = `${p.type === 'from' ? 'from ' : ''}${tl(p.amount_try)}${DONEM_ETIKETI[p.period] ?? ''}`
  return `  ${p.label}: ${tutar}${p.delivery ? ` · ${p.delivery}` : ''}`
}

const hizmetMetni = (h) => [`${h.name}  [${h.id}]`, ...h.prices.map(fiyatSatiri), `  ${h.url}`].join('\n')

// stdio MCP köprüsü: her satır bir JSON-RPC iletisi; uzak Streamable HTTP sunucusuna POST edilir, cevap
// tek satır olarak stdout'a yazılır. Bildirimlere (id'siz) sunucu gövdesiz döner, satır yazılmaz.
export async function mcpIlet(satir, gonder = fetch) {
  let ileti
  try { ileti = JSON.parse(satir) } catch { return JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }) }
  try {
    const yanit = await gonder(MCP, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'User-Agent': `lovefengis-cli/${SURUM}` }, body: JSON.stringify(ileti) })
    const metin = (await yanit.text()).trim()
    return metin || null
  } catch (e) {
    return ileti && ileti.id !== undefined ? JSON.stringify({ jsonrpc: '2.0', id: ileti.id, error: { code: -32603, message: `could not reach ${MCP}: ${e.cause?.code || e.message}` } }) : null
  }
}

async function mcpKoprusu() {
  const { createInterface } = await import('node:readline')
  const satirlar = createInterface({ input: process.stdin, crlfDelay: Infinity })
  for await (const satir of satirlar) {
    if (!satir.trim()) continue
    const cevap = await mcpIlet(satir)
    if (cevap) process.stdout.write(`${cevap}\n`)
  }
}

export async function calistir(argv, yaz = console.log) {
  const a = argumanlariAyir(argv)
  if (a.surum) return yaz(SURUM)
  if (a.yardim || !a.komut) return yaz(YARDIM)

  const cikti = (veri, metin) => yaz(a.json ? JSON.stringify(veri, null, 2) : metin(veri))
  switch (a.komut) {
    case 'services':
    case 'list':
      return cikti(await getir('/hizmetler'), (v) => v.data.map(hizmetMetni).join('\n\n'))
    case 'service': {
      const id = a.konum[0]
      if (!id || !KIMLIK.test(id)) throw new KullanimHatasi('usage: lovefengis service <id>  (ids: lovefengis services)')
      return cikti(await getir(`/hizmetler/${id}`), (v) => hizmetMetni(v.data ?? v))
    }
    case 'pricing':
    case 'prices':
      return cikti(await getir('/fiyatlar', { service: a.service, period: a.period }), (v) =>
        v.data.length ? v.data.map((p) => `${p.service_name}\n${fiyatSatiri(p)}`).join('\n') : 'No prices match.')
    case 'mcp':
      return mcpKoprusu()
    case 'docs':
      return a.json ? yaz(JSON.stringify(Object.fromEntries(BELGELER), null, 2)) : yaz(BELGELER.map(([ad, u]) => `${ad}: ${u}`).join('\n'))
    default:
      throw new KullanimHatasi(`unknown command "${a.komut}". Run lovefengis --help`)
  }
}

const dogrudan = (() => { try { return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url) } catch { return false } })()
if (dogrudan) {
  calistir(process.argv.slice(2)).catch((e) => {
    console.error(`lovefengis: ${e.message}`)
    process.exitCode = e instanceof KullanimHatasi ? 2 : 1
  })
}
