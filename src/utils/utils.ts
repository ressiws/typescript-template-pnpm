import { fileURLToPath } from "url";
import path from "path";

export function makeLocations(importMetaUrl: string) {
    const _filename = fileURLToPath(importMetaUrl);
    const _currentDir = path.dirname(_filename);
    const _dirname = path.resolve(_currentDir, "..");

    return { filename: _filename, dirname: _dirname };
}

export const { dirname: __dirname } = makeLocations(import.meta.url);