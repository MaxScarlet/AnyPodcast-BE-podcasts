import * as dotenv from 'dotenv';
import path from 'path';

export const load = (envName: string = 'dev') => {
    const envNameExt = `.${envName}`;
    const p = path.resolve(__dirname, `../../.env${envNameExt}`);
    dotenv.config({path: p});
};