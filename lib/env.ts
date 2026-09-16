/**
 * Environment Variable Validation
 * Validates required environment variables at build time
 */

const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXTAUTH_SECRET',
] as const;

const optionalEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
] as const;

/**
 * Validate environment variables
 * Call this in middleware or app initialization
 */
export function validateEnv() {
    const missing: string[] = [];
    const warnings: string[] = [];

    // Check required variables
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }

    // Check optional but recommended variables
    for (const envVar of optionalEnvVars) {
        if (!process.env[envVar]) {
            warnings.push(envVar);
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
            `Please check your .env.local file.`
        );
    }

    if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
        console.warn(
            '\n⚠️  Optional environment variables not set:\n' +
            warnings.map(v => `  - ${v}`).join('\n') +
            '\n  (Some features may be disabled)\n'
        );
    }
}

// Export typed environment variables for use in the app
export const env = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    nextAuthSecret: process.env.NEXTAUTH_SECRET || '',
    nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    publicGoogleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
} as const;
