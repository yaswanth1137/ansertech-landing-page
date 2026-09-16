import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Server-side: prefer internal Docker URL so the Next.js container can reach
// the backend directly without going through the public domain (which resolves
// to 127.0.0.1 inside Docker and gives ECONNREFUSED).
const SERVER_API_URL =
    process.env.NEXTAUTH_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:8000/api/v1';

/**
 * Get an authenticated Axios instance for Server Components.
 * Uses the internal Docker service URL (NEXTAUTH_BACKEND_URL) to avoid
 * the public-domain → loopback issue inside the container.
 */
export async function getServerApi() {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    return axios.create({
        baseURL: SERVER_API_URL,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}
