import { globalEventManager, StatefulComponent } from "mqtt-assistant/dist/components/component";
import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { getEnvVariable } from "mqtt-assistant"

import 'dotenv/config'
import { interfaces } from "mqtt-assistant";


const token = getEnvVariable("INFLUXDB_TOKEN")
const org = getEnvVariable("INFLUXDB_ORG")
const bucket = getEnvVariable("INFLUXDB_BUCKET")
const url = getEnvVariable("INFLUXDB_URL")

const client = new InfluxDB({ url: url, token: token })

const writeApi = client.getWriteApi(org, bucket)
writeApi.useDefaultTags({ host: 'warehouse' })

export class FloatConveyor {
    constructor(sensor: interfaces.NumericSensor, pointName: string, tags: Record<string, string>, callback?: (sensor: interfaces.NumericSensor) => void) {
        globalEventManager.on(sensor.events.state,
            () => {
                let point = new Point(pointName)
                    .tag("sensor", sensor.name)
                    .floatField(sensor.unit, sensor.state)
                for (let item in tags) {
                    point.tag(item, tags[item])
                }

                console.log(pointName, sensor.name, sensor.unit, sensor.state, tags)
                writeApi.writePoint(point)
                if (callback !== undefined) {
                    callback(sensor)
                }
            }
        )
    }
}