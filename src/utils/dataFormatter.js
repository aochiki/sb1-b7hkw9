import { HEADERS } from '../constants/headers';

export class DataFormatter {
    static formatData(data) {
        if (!Array.isArray(data) || data.length === 0) return [];

        // ヘッダーの順序を定義
        const orderedHeaders = [
            HEADERS.ISRC,
            HEADERS.PROJECT_CODE,
            HEADERS.TRACK_NAME,
            HEADERS.ARTIST_NAME,
            HEADERS.SERVICE_NAME,
            HEADERS.USAGE_MONTH,
            HEADERS.ALBUM_NAME,
            HEADERS.LABEL_NAME,
            HEADERS.QUANTITY,
            HEADERS.UNIT_PRICE,
            HEADERS.TOTAL_SALES,
            HEADERS.DISTRIBUTION_RATE,
            HEADERS.DISTRIBUTION_UNIT_PRICE,
            HEADERS.MASTER_ROYALTY,
            HEADERS.COPYRIGHT_UNIT_PRICE,
            HEADERS.COPYRIGHT_TOTAL,
            HEADERS.TOTAL_ROYALTY,
            HEADERS.COMMISSION,
            HEADERS.TOTAL_PAYMENT,
            HEADERS.ROYALTY_RATE,
            HEADERS.DISTRIBUTION_AMOUNT,
            HEADERS.SALES_TYPE,
            HEADERS.DISTRIBUTION_TYPE
        ];
        
        return data.map(row => {
            const formattedRow = {};
            
            // まず定義済みのヘッダーを順番通りに追加
            orderedHeaders.forEach(header => {
                // 大文字小文字を区別せずにヘッダーを検索
                const value = this.findValueCaseInsensitive(row, header);
                formattedRow[header] = value || '';
            });
            
            // 定義されていないヘッダーがあれば最後に追加
            Object.keys(row).forEach(header => {
                if (!orderedHeaders.includes(header)) {
                    formattedRow[header] = row[header];
                }
            });
            
            return formattedRow;
        });
    }

    static findValueCaseInsensitive(row, targetHeader) {
        const lowerTargetHeader = targetHeader.toLowerCase();
        const entry = Object.entries(row).find(([key]) => 
            key.toLowerCase() === lowerTargetHeader
        );
        return entry ? entry[1] : null;
    }

    static validateData(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return false;
        }

        const requiredHeaders = [
            HEADERS.ISRC,
            HEADERS.PROJECT_CODE,
            HEADERS.TRACK_NAME,
            HEADERS.ARTIST_NAME,
            HEADERS.SERVICE_NAME,
            HEADERS.ALBUM_NAME,
            HEADERS.LABEL_NAME
        ];

        const firstRow = data[0];
        return requiredHeaders.every(header => 
            this.findValueCaseInsensitive(firstRow, header) !== null
        );
    }
}