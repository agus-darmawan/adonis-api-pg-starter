import fs from 'fs'
import path from 'path'

export async function saveFile(base64String: string, filePath: string, fileName: string): Promise<void> {
    const fileBuffer = Buffer.from(base64String.split(',')[1], 'base64')
    const fullFilePath = path.join(filePath, fileName)
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true })
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
    if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath)
    }
}

export function getFileName(name: string, extension: string): string {
    return `file_${name}.${extension}`
}

export function getFilePath(userId: string | number | BigInt, folder : string): string {
    return path.join(__dirname, '..', '..', 'uploads',folder, String(userId))
}
