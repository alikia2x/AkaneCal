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

    const calContent = fs.readFileSync(calDataPath, "utf-8");
    try {
        const data = JSON.parse(calContent);
        return data;
    } catch (e) {
        console.error(e);
        return null;
    }
});
