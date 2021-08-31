import path from 'path'

export function getAsset(pathSegments: string[]) {
    if (process.env.NODE_ENV === 'development') {
        return path.resolve(__dirname,
            '..',
            '..',
            '..',
            '..',
            '..',
            '..',
            '..',
            '..',
            "dist", "assets", ...pathSegments)
    } else {
        return path.resolve(__dirname,
            '..',
            "assets", ...pathSegments)
    }
}