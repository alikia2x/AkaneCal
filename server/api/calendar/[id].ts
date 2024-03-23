import * as fs from "fs";
import * as path from "path";
import getICSFile from "~/server/paraser/getICSFile";

export default defineEventHandler((event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid request',
        });
    }
    
    const config = useRuntimeConfig();
    const dataDir = config.dataDir;
    const calDataPath = path.join(dataDir, "calendar", id.endsWith(".ics") ? `${id.slice(0, -4)}.json` : `${id}.json`);

    if (!fs.existsSync(calDataPath)) {
        throw createError({
            statusCode: 404,
            statusMessage: "Calendar not found",
        });
    }

    if (id.endsWith(".ics")) {
        // set response header
        event.node.res.setHeader("Content-Type", "text/calendar");
        event.node.res.setHeader("Content-Disposition", `attachment; filename="${path.basename(id)}"`);
    }

    try {
        const calContent = fs.readFileSync(calDataPath, "utf-8");
        const data = JSON.parse(calContent);
        return id.endsWith(".ics") ? getICSFile(data) : data;
    } catch (e:any) {
        console.error(e);
        throw createError({
            statusCode: 500,
            statusMessage: 'Could not read or parse calendar data',
        });
    }
});