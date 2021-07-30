import PQueue from "p-queue";
import { FilesystemDirectory, FilesystemEncoding, Plugins } from "@capacitor/core";

class Logger {
    private logDirectory: string;
    private logFile: string;
    private logPath: string;
    private fsDirectory: FilesystemDirectory;
    private fsEncoding: FilesystemEncoding;
    private maxLogFileSizeInBytes: number;
    private persistenceQueue: PQueue;

    constructor() {
        this.logDirectory = "lv.mezaipasnieki.mednis/logs";
        this.logFile = "debug-logs.txt";
        this.logPath = this.logDirectory + "/" + this.logFile;
        this.fsDirectory = FilesystemDirectory.Cache;
        this.fsEncoding = FilesystemEncoding.UTF8;
        this.maxLogFileSizeInBytes = 10 * 1024 * 1024; // 10 MB
        this.persistenceQueue = new PQueue({ concurrency: 1 });
    }

    public log(message: any) {
        console.log(message);
        // Use queue for limiting parallel writes
        this.persistenceQueue.add(() => this.persist("log", message));
    }

    public error(message: any) {
        console.error(message);
        // Use queue for limiting parallel writes
        this.persistenceQueue.add(() => this.persist("error", message));
    }

    public async getLogFileUri() {
        const { uri } = await Plugins.Filesystem.getUri({
            path: this.logPath,
            directory: this.fsDirectory,
        });

        return uri;
    }

    private async persist(type: "log" | "error", message: any) {
        try {
            // Check if directory exists by reading it's contents
            await Plugins.Filesystem.readdir({
                path: this.logDirectory,
                directory: this.fsDirectory,
            });
        } catch (error) {
            // Directory doesn't exist (most likely), create it
            await Plugins.Filesystem.mkdir({
                path: this.logDirectory,
                directory: this.fsDirectory,
                recursive: true,
            });
        }

        // Prepare log message as JSON string
        const timestamp = new Date().toISOString();
        const data = JSON.stringify({ type, timestamp, message }) + "\n";

        let size: number;
        try {
            // Read file statistics
            const stat = await Plugins.Filesystem.stat({ path: this.logPath, directory: this.fsDirectory });
            size = stat.size;
        } catch (error) {
            // File doesn't exist (most likely), create it
            await Plugins.Filesystem.writeFile({
                path: this.logPath,
                directory: this.fsDirectory,
                encoding: this.fsEncoding,
                data,
            });
            return;
        }

        // Append entries until max size limit is reached, then start from scratch
        if (size < this.maxLogFileSizeInBytes) {
            await Plugins.Filesystem.appendFile({
                path: this.logPath,
                directory: this.fsDirectory,
                encoding: this.fsEncoding,
                data,
            });
        } else {
            await Plugins.Filesystem.writeFile({
                path: this.logPath,
                directory: this.fsDirectory,
                encoding: this.fsEncoding,
                data,
            });
        }
    }
}

export const logger = new Logger();
