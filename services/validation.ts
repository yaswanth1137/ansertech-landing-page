import { z } from 'zod';

/**
 * Validate data against a Zod schema and log errors in development.
 * In production, validation failures are reported to Sentry but never crash the UI.
 */
export function validateResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    
    if (!result.success) {
        if (process.env.NODE_ENV === 'development') {
            console.group('[Validation Error]');
            console.error('Schema Error (flattened):', result.error.flatten().fieldErrors);
            console.error('Schema Error (raw):', result.error.issues);
            console.error('Raw Data:', data);
            
            // Try to find what schema this is
            try {
                // @ts-ignore - access internal name if possible for better debugging
                const schemaName = schema._def?.description || 'Unnamed Schema';
                console.warn(`Validation failed for: ${schemaName}`);
            } catch (e) {}
            
            console.groupEnd();
        } else {
            // Production: report to Sentry (best-effort, never crash)
            import('@sentry/nextjs')
                .then((Sentry) => {
                    Sentry.captureException(
                        new Error(`Response validation failed: ${result.error.message}`),
                        {
                            extra: {
                                issues: result.error.issues,
                                rawDataKeys: data && typeof data === 'object' ? Object.keys(data) : typeof data,
                            },
                        }
                    );
                })
                .catch(() => {
                    // Sentry not loaded — fail silently
                    console.warn('[Validation] Schema mismatch in prod:', result.error.issues.length, 'issues');
                });
        }
        // Still return data to avoid breaking the UI
        return data as T;
    }
    
    return result.data;
}
