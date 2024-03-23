import ical from "ical-generator";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";

export default function (data: classTable) {
    const calendar = ical({ name: "Classtable" });

    let minDate: string = "";
    let maxDate: string = "";
    for (const key in data.templates) {
        const template = data.templates[key];
        const fromDate = dayjs(template.repeat.from);
        const toDate = dayjs(template.repeat.to);
        if (!minDate || fromDate.isBefore(minDate) || fromDate.isSame(minDate)) {
            minDate = fromDate.format("YYYY-MM-DD");
        }
        if (!maxDate || toDate.isAfter(maxDate) || toDate.isSame(maxDate)) {
            maxDate = toDate.format("YYYY-MM-DD");
        }
    }

    let currentDate = dayjs(minDate);
    for (; currentDate.isBefore(dayjs(maxDate)); currentDate = currentDate.add(1, "day")) {
        const template = getTemplate(currentDate, data);
        const table = getTable(currentDate, data);
        if (table === null || template === null) continue;

        const scheduleList = Object.keys(data.templates[template].schedule);
        for (const scheduleName of scheduleList) {
            const schedule = data.templates[template].schedule[scheduleName];
            for (const i in schedule.periods) {
                let duration: number;
                const period = schedule.periods[i];
                if (period.duration != undefined) {
                    duration = period.duration!;
                } else {
                    duration = data.templates[template].basicDuration;
                }
                const start = dayjs(currentDate.format("YYYY-MM-DD") + " " + period.startTime);
                const end = start.add(duration, "minute");
                const id = getClassId(Number(i), scheduleName, currentDate, table, data);
                if (id===null) continue;
                const name = getClassName(id, data);
                calendar.createEvent({
                    start: start.toDate(),
                    end: end.toDate(),
                    summary: name
                });
            }
        }
    }

    return calendar.toString();
}

function getTemplate(date: Dayjs, data: classTable) {
    const givenDate = dayjs(date);
    dayjs.extend(isBetween);

    for (const templateKey in data.templates) {
        const template = data.templates[templateKey];
        const repeatFrom = dayjs(template.repeat.from);
        const repeatTo = dayjs(template.repeat.to);

        if (givenDate.isBetween(repeatFrom, repeatTo, "day", "[]")) {
            const interval = template.repeat.interval;
            const fills = template.repeat.fills;
            const daysDiff = givenDate.diff(repeatFrom, "day");
            const fillIndex = daysDiff % interval;

            if (fills.includes(fillIndex)) {
                return templateKey;
            }
        }
    }
    return null;
}

function getTable(targetDate: Dayjs, data: classTable): string | null {
    dayjs.extend(isBetween);
    const targetTemplate = getTemplate(targetDate, data);

    if (targetTemplate === null) {
        return null;
    }

    const tables = Object.entries(data.tables)
        .filter(([_, table]) => table.template === targetTemplate);

    if (tables.length === 0) {
        return null;
    }

    for (const [tableName, tableData] of tables) {
        if (tableName === null || tableData === null) {
            continue;
        }

        const repeatInfo = data.templates[targetTemplate].repeat;
        const repeatFrom = dayjs(repeatInfo.from);
        const repeatTo = dayjs(repeatInfo.to);
        const interval = repeatInfo.interval;

        if (!targetDate.isBetween(repeatFrom, repeatTo, "day", "[]")) {
            continue;
        }

        const diff = targetDate.diff(repeatFrom, "day");

        if (tableData.targetRepeat) {
            if (Math.floor(diff / interval) === tableData.targetRepeat) {
                return tableName;
            }
        } else if (tableData.arrangement.length > diff % interval) {
            return tableName;
        }
    }

    return null;
}


function getRepeatPosition(date: Dayjs, data: classTable) {
    // assertion is safe because getTemplate has been checked before call.
    const template = getTemplate(date, data)!;
    const repeatInfo = data.templates[template].repeat;
    const interval = repeatInfo.interval;
    const daysDiff = date.diff(dayjs(repeatInfo.from), "day");
    return daysDiff % interval;
}

function getClassName(id: string, data: classTable) {
    return data.names[id];
}

function getClassId(index: number, scheduleName: string, date: Dayjs, table: string, data: classTable):string|null {
    if (data.tables[table].arrangement[getRepeatPosition(date, data)][scheduleName].length<=index) {
        return null;
    }
    return data.tables[table].arrangement[getRepeatPosition(date, data)][scheduleName][index].id;
}
