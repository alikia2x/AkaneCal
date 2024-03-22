import * as fs from "fs";
import * as path from "path";
import getICSFile from "~/server/paraser/getICSFile";

export default defineEventHandler((event) => {
    const id = event.context.params?.id;
    const config = useRuntimeConfig();
    const dataDir = config.dataDir;
    let calDataPath;

    if (id?.endsWith(".ics")) {
        const filename = path.basename(id, ".ics");
        calDataPath = path.join(dataDir, "calendar", `${filename}.json`);
        return getICSFile(calDataPath);
    } else {
        calDataPath = path.join(dataDir, "calendar", `${id}.json`);
    }

    if (fs.existsSync(calDataPath) === false) {
        throw createError({
            statusCode: 404,
            statusMessage: "Calendar not found",
        })
    }
    
    try {
        const calContent = fs.readFileSync(calDataPath, "utf-8");
        const data = JSON.parse(calContent);
        return data;
    } catch (e:any) {
        console.error(e);
        throw createError({
            statusCode: 500,
            statusMessage: 'Could not read or parse calendar data',
        })
    }
});
