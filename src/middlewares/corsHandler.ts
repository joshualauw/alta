import config from "@/config";
import cors from "cors";

export default cors({
    origin: config.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
});
