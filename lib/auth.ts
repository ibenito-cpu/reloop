import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import * as schema from '@/db/schema';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        },
    }),

    emailAndPassword: {
        enabled: true,
        // Flip to true once an email provider is wired up; keeps signup
        // frictionless for now during development/testing.
        requireEmailVerification: false,
        minPasswordLength: 8,
    },

    user: {
        additionalFields: {
            role: {
                type: 'string',
                required: false,
                defaultValue: 'user',
                input: false, // clients can't set their own role on signup
            },
        },
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // refresh once per day of activity
    },

    // Set NEXT_PUBLIC_APP_URL / BETTER_AUTH_URL in your env for
    // correct redirect/cookie behavior across environments.
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
    secret: process.env.BETTER_AUTH_SECRET,
});

export type Session = typeof auth.$Infer.Session;
