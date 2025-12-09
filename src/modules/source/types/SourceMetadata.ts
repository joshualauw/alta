export interface SourceMetadata {
    id: string;
    chunk_text: string;
    chunk_number: number;
    source_id: number;
    source_name: string;
    created_at: string;

    [key: string]: unknown;
}
