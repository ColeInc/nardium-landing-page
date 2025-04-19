import crypto from 'crypto';
import { EncryptedToken } from '../types/auth';

// Type alias for better code documentation
type CryptoBuffer = Uint8Array;

export class EncryptionService {
    private readonly algorithm = 'aes-256-gcm';
    private readonly encryptionKey: CryptoBuffer;
    private readonly ivLength = 16; // For AES, this is always 16 bytes

    constructor() {
        // Make sure the key exists
        if (!process.env.ENCRYPTION_KEY) {
            throw new Error('ENCRYPTION_KEY environment variable is required');
        }
        // Store as Buffer
        // @ts-ignore: Node.js crypto typing issues with Buffer
        this.encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
        console.log(`[EncryptionService] Initialized with algorithm: ${this.algorithm}`);
    }

    public encrypt(text: string): EncryptedToken {
        console.log(`[EncryptionService] Encrypting text (length: ${text.length})`);

        // Generate random initialization vector
        const iv = crypto.randomBytes(this.ivLength);

        // Create cipher
        // @ts-ignore: Node.js crypto typing issues with Buffer
        const cipher = crypto.createCipheriv(
            // @ts-ignore: Node.js crypto typing issues with Buffer
            this.algorithm,
            // @ts-ignore: Node.js crypto typing issues with Buffer
            this.encryptionKey,
            // @ts-ignore: Node.js crypto typing issues with Buffer
            iv
        );

        // Encrypt the text
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Get auth tag for GCM mode
        const authTag = cipher.getAuthTag();

        // Return structured encrypted data
        const result = {
            iv: iv.toString('hex'),
            encrypted,
            authTag: authTag.toString('hex')
        };

        console.log(`[EncryptionService] Encryption result: IV(${result.iv.substring(0, 8)}...), ` +
            `Encrypted(${result.encrypted.substring(0, 10)}...${result.encrypted.substring(result.encrypted.length - 10)}), ` +
            `AuthTag(${result.authTag.substring(0, 8)}...)`);

        return result;
    }

    public decrypt(encryptedToken: EncryptedToken): string {
        console.log(`[EncryptionService] Decrypting token: IV(${encryptedToken.iv.substring(0, 8)}...), ` +
            `Encrypted(${encryptedToken.encrypted.substring(0, 10)}...${encryptedToken.encrypted.substring(encryptedToken.encrypted.length - 10)}), ` +
            `AuthTag(${encryptedToken.authTag.substring(0, 8)}...)`);

        // Convert hex strings back to buffers
        const ivBuffer = Buffer.from(encryptedToken.iv, 'hex');
        const authTagBuffer = Buffer.from(encryptedToken.authTag, 'hex');

        // Create decipher
        // @ts-ignore: Node.js crypto typing issues with Buffer
        const decipher = crypto.createDecipheriv(
            // @ts-ignore: Node.js crypto typing issues with Buffer
            this.algorithm,
            // @ts-ignore: Node.js crypto typing issues with Buffer
            this.encryptionKey,
            // @ts-ignore: Node.js crypto typing issues with Buffer
            ivBuffer
        );

        // Set auth tag for GCM mode
        // @ts-ignore: Node.js crypto typing issues with Buffer
        decipher.setAuthTag(authTagBuffer);

        // Decrypt
        let decrypted = decipher.update(encryptedToken.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        console.log(`[EncryptionService] Decryption complete, result length: ${decrypted.length}`);

        return decrypted;
    }

    // ... rest of encryption methods
} 