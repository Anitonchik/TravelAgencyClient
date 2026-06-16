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

    async getByClientPreferencies(clientId, pageNumber, pageSize) {
        return getRequest(`${this.URL}/search/byClientPreferences`, { 
            params: { 
                clientId: clientId,
                pageNumber: pageNumber,
                pageSize: pageSize
            } 
        });
    }

    async searchTours(params) {
        console.log(params);
        return getRequest(`${this.URL}/search`, { params });
    }
}