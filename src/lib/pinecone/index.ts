import config from "@/config";
import { Pinecone } from "@pinecone-database/pinecone";

export const pinecone = new Pinecone({
    apiKey: config.pineconeApikey,
});
