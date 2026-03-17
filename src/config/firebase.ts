import admin from 'firebase-admin';
import { envVars } from './envVars';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId:   envVars.FIREBASE_PROJECT_ID,
            clientEmail: envVars.FIREBASE_CLIENT_EMAIL,
            privateKey:  envVars.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        })
    })
}

export default admin;