import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GpsService } from "../gps/gps.service";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";


@Injectable()
export class GpsCronService {
  private readonly logger = new Logger(GpsCronService.name);

  constructor(private readonly gpsService: GpsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleGpsDataImport() {
    this.logger.debug("Running GPS data import cron job...");

    // 1. Define the directory where GPS CSV files are stored
    const gpsDataDirectory = path.join(__dirname, "../../../gps-data");

    // 2. Read all CSV files from the directory
    const files = fs.readdirSync(gpsDataDirectory);

    for (const file of files) {
      if (path.extname(file) === ".csv") {
        const filePath = path.join(gpsDataDirectory, file);

        // 3. Read and parse the CSV file
        const gpsData = await this.parseCsvFile(filePath);

        // 4. Process each row of the CSV data and save it to the database
        await this.saveGpsDataToDatabase(gpsData, file);

        // 5. Optionally, delete or move the processed file to avoid re-processing
        this.cleanupFile(filePath);
      }
    }

    this.logger.debug("GPS data import cron job completed.");
  }

  // Helper function to parse CSV file
  private async parseCsvFile(filePath: string): Promise<any[]> {
    const gpsData: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(parse({ columns: true, delimiter: "," }))
        .on("data", (row) => {
          gpsData.push(row);
        })
        .on("end", () => {
          resolve(gpsData);
        })
        .on("error", (error) => {
          this.logger.error(`Error parsing file ${filePath}: ${error.message}`);
          reject(error);
        });
    });
  }

  // Helper function to save parsed GPS data to the database
  private async saveGpsDataToDatabase(gpsData: any[], filename: string) {
    for (const data of gpsData) {
      // 6. Place your logic here for processing the parsed data
      // For example, you can map CSV rows to the GpsPosition entity
    }
  }

  // Helper function to remove or archive processed files
  private cleanupFile(filePath: string) {
    // 7. Place your logic here to clean up files (move or delete)
    this.logger.debug(`Processed and deleted file: ${filePath}`);
  }
}
