import * as fs from 'fs';
import * as path from 'path';

export default function (path: string) {
    const data = fs.readFileSync(path, 'utf-8');
    return data;
}