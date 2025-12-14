import { Preset } from "@/database/generated/prisma/client";
import { AnswerTone } from "@/lib/openai/types/AnswerTone";

export interface GenerateResponseParams {
    question: string;
    chunksContext: string[];
    preset: Preset;
    tone: AnswerTone;
}
