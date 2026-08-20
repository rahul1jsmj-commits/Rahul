import Database from 'better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const db = new Database(path.join(__dirname, 'transcripts.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS transcripts (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT,
    transcript TEXT NOT NULL,
    duration REAL,
    created_at TEXT NOT NULL
  )
`)

export default db
