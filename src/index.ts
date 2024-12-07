import 'dotenv/config'
import { zigbee, getEnvVariable, esphome, telegram } from "mqtt-assistant"
import { FloatConveyor } from './conveyors'


telegram.info("Starting Warehouse")

const livingrooAirSensor = new zigbee.sensors.air.TH01Z("livingroom_climate_sensor")
new FloatConveyor(livingrooAirSensor.temperature, "Weather", { room: "living_room" })
new FloatConveyor(livingrooAirSensor.humidity, "Weather", { room: "living_room" })

const bedroomAirSensor = new zigbee.sensors.air.WSD500A("bedroom_climate_sensor")
new FloatConveyor(bedroomAirSensor.temperature, "Weather", { room: "bedroom" })
new FloatConveyor(bedroomAirSensor.humidity, "Weather", { room: "bedroom" })

const studioAirSensor = new zigbee.sensors.air.TH01Z("studio_climate_sensor")
new FloatConveyor(studioAirSensor.temperature, "Weather", { room: "studio" })
new FloatConveyor(studioAirSensor.humidity, "Weather", { room: "studio" })

const powerDatacenter = new esphome.SensorESPHome("datacenter-power", "datacenter_power", "W")
new FloatConveyor(powerDatacenter, "Energy", { room: "datacenter" })

const housePowerSensor = new zigbee.sensors.power.PJ_1203_W("house_power_sensor")
new FloatConveyor(housePowerSensor.power, "Energy", { room: "home" })

const jaumeWeight = new esphome.SensorESPHome("scale", "weight_jaume", "Kg")
new FloatConveyor(jaumeWeight, "Body", { person: "Jaume" }, () => { telegram.info(`New weight measure taken \`${jaumeWeight.state}\` Kg`) })

const juditWeight = new esphome.SensorESPHome("scale", "weight_judit")
new FloatConveyor(juditWeight, "Body", { person: "Judit" }, (sensor) => { telegram.info({ message: `New weight measure taken \`${sensor.state}\` Kg`, recipient: "user" }) })

const studioAirQuality = new esphome.SensorESPHome("airquality", "pm_2_5", "PM 2.5 µg/m3")
new FloatConveyor(studioAirQuality, "Weather", { room: "studio" })