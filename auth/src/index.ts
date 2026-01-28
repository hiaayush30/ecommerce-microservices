import { PORT } from "./config/server.config.js";
import { connectDB } from "./config/db.config.js";
import app from "./app.js";


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("server running on " + PORT)
        })
    })