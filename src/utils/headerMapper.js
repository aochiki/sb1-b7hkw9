import { HEADER_MAPPINGS } from '../constants/headerMappings';

export class HeaderMapper {
    static mapHeader(header) {
        const trimmedHeader = header.trim();
        const mappedHeader = HEADER_MAPPINGS[trimmedHeader];
        
        if (mappedHeader) {
            return mappedHeader;
        }

        // 大文字小文字を区別しないマッピング
        const lowerHeader = trimmedHeader.toLowerCase();
        const lowerMappings = Object.fromEntries(
            Object.entries(HEADER_MAPPINGS).map(([key, value]) => [key.toLowerCase(), value])
        );
        
        return lowerMappings[lowerHeader] || trimmedHeader;
    }

    static normalizeHeaders(headers) {
        return headers.map(header => this.mapHeader(header));
    }
}