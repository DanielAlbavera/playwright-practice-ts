import fs from 'fs';

export class FileHandler {

    static async readFiles(path: string) : Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                if (err) reject(err);
                resolve(files);
            });
        });
    }
    
    static async removeFile(path: string) : Promise<void> {
        return new Promise((resolve, reject) => {
            fs.unlink(path, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

}