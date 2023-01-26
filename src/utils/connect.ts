import mongoose from "mongoose"
import config from "config"
import logger from "./logger"

async function connect() {

    const dbUri = config.get<string>("dbUri")

    try {
        await mongoose.connect(dbUri)
        logger.info("DB connected")
    } catch (error) {
        logger.error("Could not connect to database")
        process.exit(1)
    }

    mongoose.connection.on("disconnected", () => {
        logger.info("mongoDB disconnected!")
    })
}

export default connect