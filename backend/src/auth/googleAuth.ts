import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(token: string) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        });

        const payload = ticket.getPayload();

        if (!payload) {
            throw new Error('Invalid token payload');
        }

        // Returns user information from Google
        return {
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            sub: payload.sub, // Google user ID
        } 
    } catch (error) {
        console.error('Error verifying Google token:', error);
        throw new Error('Invalid Google token');
    }
};