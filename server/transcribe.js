import ytdlp from 'yt-dlp-exec'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import OpenAI from 'openai'

let openai = null
function getOpenAI() {
  if (!openai) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return openai
}

const INSTAGRAM_HOST_RE = /(^|\.)instagram\.com$/i
const MAX_UPLOAD_BYTES = 24 * 1024 * 1024 // Whisper API limit is 25MB

export function isInstagramUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl)
    return parsed.protocol === 'https:' && INSTAGRAM_HOST_RE.test(parsed.hostname)
  } catch {
    return false
  }
}

export async function transcribeInstagramLink(url) {
  const id = randomUUID()
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'reel-'))

  let info = null
  try {
    info = await ytdlp(url, {
      dumpSingleJson: true,
      skipDownload: true,
      noWarnings: true,
      noCheckCertificates: true,
    })
  } catch {
    // Metadata is a nice-to-have; fall through and try the download anyway.
  }

  const outputTemplate = path.join(tmpDir, `${id}.%(ext)s`)
  try {
    await ytdlp(url, {
      output: outputTemplate,
      format: 'mp4/best',
      noWarnings: true,
      noCheckCertificates: true,
      noPlaylist: true,
    })
  } catch (err) {
    await fs.rm(tmpDir, { recursive: true, force: true })
    throw new Error(`Could not download that link: ${err.shortMessage || err.message}`, { cause: err })
  }

  const files = await fs.readdir(tmpDir)
  const videoFile = files.find((f) => f.startsWith(id))
  if (!videoFile) {
    await fs.rm(tmpDir, { recursive: true, force: true })
    throw new Error('Download finished but the video file could not be found.')
  }
  const videoPath = path.join(tmpDir, videoFile)

  const stats = await fs.stat(videoPath)
  if (stats.size > MAX_UPLOAD_BYTES) {
    await fs.rm(tmpDir, { recursive: true, force: true })
    throw new Error('That video is larger than the 25MB Whisper API limit — try a shorter clip.')
  }

  try {
    const response = await getOpenAI().audio.transcriptions.create({
      file: fsSync.createReadStream(videoPath),
      model: 'whisper-1',
    })
    return {
      id,
      url,
      title: info?.title ?? null,
      transcript: response.text,
      duration: info?.duration ?? null,
    }
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true })
  }
}
