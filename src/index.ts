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
        writeApi.writePoint(new Point('Weather')
            .tag("sensor", sensor.name)
            .tag("room", "living_room")
            .floatField('C degrees', sensor.temperature)
            .floatField('% Humidity', sensor.humidity))
        console.log(sensor.temperature, sensor.humidity)
    }
})

new zigbee.WeatherSensorZigbee("bedroom_climate_sensor", {
    updateCallback: (sensor: zigbee.WeatherSensorZigbee) => {
        writeApi.writePoint(new Point('Weather')
            .tag("room", "bedroom")
            .tag("sensor", sensor.name)
            .floatField('C degrees', sensor.temperature)
            .floatField('% Humidity', sensor.humidity))
        console.log(sensor.temperature, sensor.humidity)
    }
})

new zigbee.WeatherSensorZigbee("studio_climate_sensor", {
    updateCallback: (sensor: zigbee.WeatherSensorZigbee) => {
        writeApi.writePoint(new Point('Weather')
            .tag("room", "studio")
            .tag("sensor", sensor.name)
            .floatField('C degrees', sensor.temperature)
            .floatField('% Humidity', sensor.humidity))
        console.log(sensor.temperature, sensor.humidity)
    }
})

new esphome.SensorESPHome("datacenter-power", "datacenter_power", {
    updateCallback: (sensor: esphome.SensorESPHome) => {
        writeApi.writePoint(new Point('Energy')
            .tag("room", "datacenter")
            .tag("sensor", sensor.name)
            .floatField('W', sensor.state))
    }
})

new zigbee.PowerSensorZigbee("house_power_sensor", {
    updateCallback: (sensor: zigbee.PowerSensorZigbee) => {
        writeApi.writePoint(new Point('Energy')
            .tag("room", "home")
            .tag("sensor", sensor.name)
            .floatField('W', sensor.power))
    }
})

new esphome.SensorESPHome("scale", "weight_jaume", {
    updateCallback: (sensor: esphome.SensorESPHome) => {
        writeApi.writePoint(new Point('Body')
            .tag("person", "Jaume")
            .tag("sensor", sensor.name)
            .floatField('Kg', sensor.state))
        telegram.info(`New weight measure taken \`${sensor.state}\` Kg`)
    }
})

new esphome.SensorESPHome("scale", "weight_judit", {
    updateCallback: (sensor: esphome.SensorESPHome) => {
        writeApi.writePoint(new Point('Body')
            .tag("person", "Judit")
            .tag("sensor", sensor.name)
            .floatField('Kg', sensor.state))
        telegram.info({ message: `New weight measure taken \`${sensor.state}\` Kg`, recipient: "user" })
    }
})

new esphome.SensorESPHome("airquality", "pm_2_5", {
    updateCallback: (sensor: esphome.SensorESPHome) => {
        writeApi.writePoint(new Point('Weather')
            .tag("room", "studio")
            .tag("sensor", sensor.name)
            .floatField('PM 2.5 µg/m3', sensor.state))
    }
})