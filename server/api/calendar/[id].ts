import * as fs from 'fs';
import * as path from 'path';

export default defineEventHandler((event) => {
    const id = event.context.params?.id;
    const config = useRuntimeConfig();
    const dataDir = config.dataDir;
    
    const calDataPath = path.join(dataDir, 'calendar', `${id}.json`);
    const calContent = fs.readFileSync(calDataPath, 'utf-8');
    const data = JSON.parse(calContent);
    return data;
});