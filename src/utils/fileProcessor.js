import Papa from 'papaparse';
import { HeaderMapper } from './headerMapper';
import { DataFormatter } from './dataFormatter';

export class FileProcessor {
    static async processFile(file) {
        try {
            if (file.name.endsWith('.csv')) {
                return await this.processCSV(file);
            } else if (file.name.endsWith('.txt')) {
                return await this.processTXT(file);
            }
            throw new Error(`未対応のファイル形式です: ${file.name}`);
        } catch (error) {
            console.error('ファイル処理エラー:', error);
            throw error;
        }
    }

    static processCSV(file) {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                transformHeader: (header) => HeaderMapper.mapHeader(header),
                complete: (results) => {
                    const formattedData = DataFormatter.formatData(results.data);
                    resolve(formattedData);
                },
                error: (error) => reject(new Error(`CSVパースエラー: ${error.message}`))
            });
        });
    }

    static async processTXT(file) {
        try {
            const text = await file.text();
            const lines = text.split('\n').filter(line => line.trim());
            
            if (lines.length === 0) {
                throw new Error('ファイルが空です');
            }

            // ヘッダー行を処理
            const headers = HeaderMapper.normalizeHeaders(
                lines[0].split('\t').map(header => header.trim())
            );

            // データ行を処理
            const data = lines.slice(1).map(line => {
                const values = line.split('\t').map(value => value.trim());
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                return row;
            });

            return DataFormatter.formatData(data);
        } catch (error) {
            console.error('TXTファイル処理エラー:', error);
            throw error;
        }
    }

    static combineData(dataArray) {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return [];
        }

        const combinedData = dataArray.flat();
        return DataFormatter.formatData(combinedData);
    }
}