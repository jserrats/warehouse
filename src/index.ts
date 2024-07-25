import 'dotenv/config'
import { zigbee, getEnvVariable, esphome, telegram } from "mqtt-assistant"
import { InfluxDB, Point } from '@influxdata/influxdb-client'


telegram.info("Starting Warehouse")

const token = getEnvVariable("INFLUXDB_TOKEN")
const org = getEnvVariable("INFLUXDB_ORG")
const bucket = getEnvVariable("INFLUXDB_BUCKET")
const url = getEnvVariable("INFLUXDB_URL")

const client = new InfluxDB({ url: url, token: token })

const writeApi = client.getWriteApi(org, bucket)
writeApi.useDefaultTags({ host: 'warehouse' })

new zigbee.WeatherSensorZigbee("livingroom_climate_sensor", {
    updateCallback: (sensor: zigbee.WeatherSensorZigbee) => {
        writeApi.writePoint(new Point('Livingroom climate')
            .tag("sensor", sensor.name)
            .floatField('C degrees', sensor.temperature)
            .floatField('% Humidity', sensor.humidity))
        console.log(sensor.temperature, sensor.humidity)
    }
})

new zigbee.WeatherSensorZigbee("bedroom_climate_sensor", {
    updateCallback: (sensor: zigbee.WeatherSensorZigbee) => {
        writeApi.writePoint(new Point('Bedroom climate')
            .tag("sensor", sensor.name)
            .floatField('C degrees', sensor.temperature)
            .floatField('% Humidity', sensor.humidity))
        console.log(sensor.temperature, sensor.humidity)
    }
})

new zigbee.PowerSensorZigbee("house_power_sensor", {
    updateCallback: (sensor: zigbee.PowerSensorZigbee) => {
        writeApi.writePoint(new Point('House Power Consumption')
            .tag("sensor", sensor.name)
            .floatField('W', sensor.power))
    }
})

new esphome.SensorESPHome("datacenter", "weight_jaume", {
    updateCallback: (sensor: esphome.SensorESPHome) => {
        writeApi.writePoint(new Point('Jaume Weight')
            .tag("sensor", sensor.name)
            .floatField('Kg', sensor.state))
        telegram.info(`New weight measure taken \`${sensor.state}\` Kg`)
    }
})