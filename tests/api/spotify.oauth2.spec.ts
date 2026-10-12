


import { test, expect } from '@playwright/test';

const OAUTH_CONFIG = {
    tokenURL: 'https://accounts.spotify.com/api/token',
    clientId: process.env.OAUTH_CLIENT_ID?.trim(),
    clientSecret: process.env.OAUTH_CLIENT_SECRET?.trim(),
};

test('get albums data test', async ({ request }) => {

    // Step 1: Validate environment variables
    if (!OAUTH_CONFIG.clientId || !OAUTH_CONFIG.clientSecret) {
        throw new Error('Spotify OAuth credentials are missing');
    }

    // Step 2: Generate Basic Authentication
    const basicAuth = Buffer.from(
        `${OAUTH_CONFIG.clientId}:${OAUTH_CONFIG.clientSecret}`
    ).toString('base64');

    // Step 3: Request Spotify access token
    const tokenResponse = await request.post(
        OAUTH_CONFIG.tokenURL,
        {
            headers: {
                Authorization: `Basic ${basicAuth}`,
            },
            form: {
                grant_type: 'client_credentials'
            }
        }
    );

    if (!tokenResponse.ok()) {
        console.error(
            'Spotify token request failed:',
            tokenResponse.status(),
            await tokenResponse.text()
        );
    }

    expect(tokenResponse.status()).toBe(200);

    const tokenBody = await tokenResponse.json();
    const accessToken = tokenBody.access_token;

    expect(accessToken).toBeTruthy();

    // Step 4: Get album data
    const albumResponse = await request.get(
        'https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    if (!albumResponse.ok()) {
        console.error(
            'Spotify album request failed:',
            albumResponse.status(),
            await albumResponse.text()
        );
    }

    expect(albumResponse.status()).toBe(200);

    // Step 5: Validate album response
    const jsonBody = await albumResponse.json();

    console.log('Total tracks:', jsonBody.total_tracks);
    console.log('Spotify album URL:', jsonBody.external_urls.spotify);
    console.log('Number of images:', jsonBody.images.length);

    expect(jsonBody.images.length).toBe(3);
});

