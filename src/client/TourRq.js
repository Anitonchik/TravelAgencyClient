import { getRequest } from "./requests";

export default class Tour {
    URL = "/tour";

    async getAll(pageNumber, pageSize) {
        return getRequest(this.URL, { 
            params: { 
                pageNumber: pageNumber, 
                pageSize: pageSize 
            } 
        });
    }

    async getByHotelName(hotelName, pageNumber, pageSize) {
        return getRequest(`${this.URL}/search/byHotel`, { 
            params: { 
                hotelName: hotelName,
                pageNumber: pageNumber,
                pageSize: pageSize
            } 
        });
    }

    async getByDirection(direction, pageNumber, pageSize) {
        return getRequest(`${this.URL}/search/byDirection`, { 
            params: { 
                direction: direction,
                pageNumber: pageNumber,
                pageSize: pageSize
            } 
        });
    }

    async getByDate(date, pageNumber, pageSize) {
        let newDate = new Date(date).toISOString().split("T")[0];
        return getRequest(`${this.URL}/search/byDate`, { 
            params: { 
                date: newDate,
                pageNumber: pageNumber,
                pageSize: pageSize
            } 
        });
    }

    async getByDates(startDate, endDate, pageNumber, pageSize) {
        let newStartDate = new Date(startDate).toISOString().split("T")[0];
        let newEndDate = new Date(endDate).toISOString().split("T")[0];
        return getRequest(`${this.URL}/search/byDates`, { 
            params: { 
                startDate: newStartDate,
                endDate: newEndDate,
                pageNumber: pageNumber,
                pageSize: pageSize
            } 
        });
    }

    async getByPriceFrom(priceFrom, pageNumber, pageSize) {
        return getRequest(`${this.URL}/search/byPriceFrom`, { 
            params: { 
                priceFrom: priceFrom,
                pageNumber: pageNumber,
                pageSize: pageSize
            } 
        });
    }

    async getByPriceTo(priceTo, pageNumber, pageSize) {
        return getRequest(`${this.URL}/search/byPriceTo`, { 
            params: { 
                priceTo: priceTo,
                pageNumber: pageNumber,
                pageSize: pageSize
            } 
        });
    }

    async getByPriceRange(priceFrom, priceTo, pageNumber, pageSize) {
        return getRequest(`${this.URL}/search/byPriceRange`, { 
            params: { 
                priceFrom: priceFrom,
                priceTo: priceTo,
                pageNumber: pageNumber,
                pageSize: pageSize
            } 
        });
    }
}