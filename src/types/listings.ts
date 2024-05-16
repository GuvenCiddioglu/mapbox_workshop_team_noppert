export interface ListingCoordinatesDTO {
    /** @format int64 */
    id?: number;
    /** @format double */
    latitude?: number;
    /** @format double */
    longitude?: number;
    neighbourhood?: string | null;
}