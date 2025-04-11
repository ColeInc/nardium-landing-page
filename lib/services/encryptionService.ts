import crypto from 'crypto';
import { EncryptedToken } from './googleAuthService';

export class EncryptionService {
    private readonly algorithm = 'aes-256-gcm';
    private readonly encryptionKey: Buffer;

    constructor() {
        // Make sure the key exists
        if (!process.env.ENCRYPTION_KEY) {
            throw new Error('ENCRYPTION_KEY environment variable is required');
        }
        // Store as string instead of Buffer to avoid type issues
        this.encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
    }

    public encrypt(text: string): EncryptedToken {
        // Generate random initialization vector
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(
            this.algorithm,
            this.encryptionKey,
            iv
        );

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        return {
            iv: iv.toString('hex'),
            encrypted,
            authTag: authTag.toString('hex')
        };
    }

    public decrypt(encryptedToken: EncryptedToken): string {
        const ivBuffer = Buffer.from(encryptedToken.iv, 'hex');
        const authTagBuffer = Buffer.from(encryptedToken.authTag, 'hex');

        // @ts-ignore: Node.js crypto typing issues
        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.encryptionKey,
            ivBuffer
        );

        // @ts-ignore: Node.js crypto typing issues with Buffer
        decipher.setAuthTag(authTagBuffer);

        let decrypted = decipher.update(encryptedToken.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    // ... rest of encryption methods
} 