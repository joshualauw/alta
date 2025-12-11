import { AllowedSourceMetadata } from "@/modules/source/dtos/createSourceDto";
import { FilterSchema } from "@/modules/source/dtos/searchSourceDto";

export function buildMetadataFilter(filters: FilterSchema): { sql: string; params: AllowedSourceMetadata[] } {
    const clauses: string[] = [];
    const params: AllowedSourceMetadata[] = [];

    for (const [field, ops] of Object.entries(filters)) {
        for (const [op, value] of Object.entries(ops)) {
            if (value === undefined) continue;

            let sqlFragment: string;

            switch (op) {
                case "$eq":
                    params.push(value);
                    sqlFragment = `metadata->>'${field}' = $${params.length}`;
                    break;
                case "$ne":
                    params.push(value);
                    sqlFragment = `metadata->>'${field}' <> $${params.length}`;
                    break;
                case "$gt":
                    params.push(value);
                    sqlFragment = `(metadata->>'${field}')::numeric > $${params.length}`;
                    break;
                case "$gte":
                    params.push(value);
                    sqlFragment = `(metadata->>'${field}')::numeric >= $${params.length}`;
                    break;
                case "$lt":
                    params.push(value);
                    sqlFragment = `(metadata->>'${field}')::numeric < $${params.length}`;
                    break;
                case "$lte":
                    params.push(value);
                    sqlFragment = `(metadata->>'${field}')::numeric <= $${params.length}`;
                    break;
                case "$in":
                    params.push(value);
                    sqlFragment = `metadata->>'${field}' = ANY($${params.length})`;
                    break;
                case "$nin":
                    params.push(value);
                    sqlFragment = `metadata->>'${field}' <> ALL($${params.length})`;
                    break;
                default:
                    throw new Error(`Unsupported operator: ${op}`);
            }

            clauses.push(sqlFragment);
        }
    }

    return {
        sql: clauses.length ? clauses.join(" AND ") : "",
        params
    };
}
