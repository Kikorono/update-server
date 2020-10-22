import { logger } from '@runejs/logger';
import { JSON_SCHEMA, safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';

export interface ServerConfig {
    updateServerHost: string;
    updateServerPort: number;
    cacheDir: string;
}

export function parseServerConfig(useDefault?: boolean): ServerConfig {
    try {
        const config = safeLoad(readFileSync(`data/config/server-config${useDefault ? '-default' : ''}.yaml`, 'utf8'), { schema: JSON_SCHEMA }) as ServerConfig;

        if(!config) {
            if(!useDefault) {
                logger.warn('Server config not provided, using default...');
                return parseServerConfig(true);
            } else {
                throw new Error('Syntax Error');
            }
        }

        return config;
    } catch(error) {
        if(!useDefault) {
            logger.warn('Server config not provided, using default...');
            return parseServerConfig(true);
        } else {
            logger.error('Error parsing server config: ' + error);
            return null;
        }
    }
}
