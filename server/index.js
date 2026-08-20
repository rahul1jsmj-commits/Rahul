import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import db from './db.js'
import { transcribeInstagramLink, isInstagramUrl } from './transcribe.js'

const app = express()
app.use(cors())
app.use(express.json())

const insertStmt = db.prepare(`
  INSERT INTO transcripts (id, url, title, transcript, duration, created_at)
  VALUES (@id, @url, @title, @transcript, @duration, @created_at)
`)
const listStmt = db.prepare(`
  SELECT id, url, title, duration, created_at, substr(transcript, 1, 160) AS preview
  FROM transcripts ORDER BY created_at DESC
`)
const getStmt = db.prepare('SELECT * FROM transcripts WHERE id = ?')
const deleteStmt = db.prepare('DELETE FROM transcripts WHERE id = ?')
const allStmt = db.prepare('SELECT * FROM transcripts ORDER BY created_at DESC')

app.get('/api/transcripts', (req, res) => {
  res.json(listStmt.all())
})

app.get('/api/export', (req, res) => {
  const rows = allStmt.all()
  const body = rows
    .map((r) => {
      const date = new Date(r.created_at).toLocaleString()
      return `## ${r.title || 'Untitled reel'}\n\n- Source: ${r.url}\n- Saved: ${date}\n\n${r.transcript}\n`
    })
    .join('\n---\n\n')
  const header = `# Instagram Reel Transcripts\n\nExported ${new Date().toLocaleString()} · ${rows.length} reel${rows.length !== 1 ? 's' : ''}\n\n---\n\n`

  res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
  res.setHeader('Content-Disposition', 'attachment; filename="reel-transcripts.md"')
  res.send(header + body)
})

app.get('/api/transcripts/:id', (req, res) => {
  const row = getStmt.get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json(row)
})

app.delete('/api/transcripts/:id', (req, res) => {
  deleteStmt.run(req.params.id)
  res.status(204).end()
})

app.post('/api/transcripts', async (req, res) => {
  const { url } = req.body ?? {}
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing "url".' })
  }
  if (!isInstagramUrl(url)) {
    return res.status(400).json({ error: 'That does not look like an instagram.com link.' })
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Server is missing OPENAI_API_KEY — add it to your .env file.' })
  }

  try {
    const result = await transcribeInstagramLink(url)
    const record = {
      id: result.id,
      url: result.url,
      title: result.title,
      transcript: result.transcript,
      duration: result.duration,
      created_at: new Date().toISOString(),
    }
    insertStmt.run(record)
    res.status(201).json(record)
  } catch (err) {
    console.error(err)
    res.status(502).json({ error: err.message || 'Transcription failed.' })
  }
})

const PORT = process.env.PORT || 8787
app.listen(PORT, () => {
  console.log(`Reel transcriber API listening on http://localhost:${PORT}`)
})
