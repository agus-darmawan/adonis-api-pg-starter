import fs from 'node:fs'
import path from 'node:path'

export async function saveFile(
  base64String: string,
  filePath: string,
  fileName: string
): Promise<void> {
  const fileBuffer = Buffer.from(base64String.split(',')[1], 'base64')
  const newFilePath = path.join('uploads', filePath)
  const fullFilePath = path.join(newFilePath, fileName)

  if (!fs.existsSync(newFilePath)) {
    fs.mkdirSync(newFilePath, { recursive: true })
  }
  await fs.promises.writeFile(fullFilePath, fileBuffer)
}

export function checkBase64(base64String: string, validFormats: string[]): string | null {
  const match = base64String.match(/^data:image\/([a-z]+);base64,/)
  if (!match) {
    return null
  }
  const fileExtension = match[1]
  return validFormats.includes(fileExtension) ? fileExtension : null
}

export async function deleteFile(filePath: string): Promise<void> {
  const newFilePath = path.join('uploads', filePath)
  if (fs.existsSync(newFilePath)) {
    await fs.promises.unlink(newFilePath)
  }
}

export function getFileName(name: string, extension: string): string {
  const sanitizedName = name.replace(/\s+/g, '_')
  return `${sanitizedName}.${extension}`
}

export function getFilePath(userId: string | number | bigint, folder: string): string {
  return path.join(folder, String(userId))
}
