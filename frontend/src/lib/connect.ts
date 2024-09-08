// connection with mongodb
import { MONGO_URI } from "@/utils/env";
import { connect } from "mongoose";
(async()=>{
    await connect(MONGO_URI);
})();