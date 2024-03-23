type classTable = {
    "timezone": string,
    "version": number,
    "name": string,
    "templates": {
        [key: string]: {
            "basicDuration": number
            "repeat": {
                "interval": number
                "from": string
                "to": string
                "fills": number[]
            }
            "schedule": {
                [key: string]: {
                    "startTime": string
                    "endTime": string
                    "periods": {
                        "startTime": string
                        "duration"?: number
                    }[]
                }
            }
        }
    },
    "names": {
        [key: string]: string
    },
    "tables": {
        [key: string]: {
            "template": string,
            "targetRepeat"?: number,
            "arrangement": {
                [key: string]: {
                    "id": string,
                }[]
            }[]
        }
    }
}

type Schedule = classTable["templates"][string]["schedule"][string];