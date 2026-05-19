import {getRequest, postRequest, putRequest, deleteRequest} from "./requests";

export default class Client {

    URL = "/client";
    
    async getAll(pageNumber, pageSize) {
        return getRequest(this.URL, { 
            params: { 
                pageNumber: pageNumber, 
                pageSize: pageSize } 
            });
    }

    async getByClientId(clientId, pageNumber, pageSize) {
        return getRequest(`${this.URL}/byClientId`, { 
            params: {
                clientId: clientId,
                pageNumber: pageNumber,
                pageSize: pageSize
            } 
        });
    }

    async getByClientName(clientName, pageNumber, pageSize) {
        return getRequest(`${this.URL}/byName`, { 
            params: {
                name: clientName,
                pageNumber: pageNumber,
                pageSize: pageSize
            } 
        });
    }

    async getById(id) {
        return getRequest(`${this.URL}/${id}`);
    }

    async create(clientData) {
        return postRequest(this.URL, clientData);
    }
    async update(clientData, id) {
        return putRequest(`${this.URL}/${id}`, clientData);
    }

    async delete(id) {
        return deleteRequest(`${this.URL}/${id}`);
    }
}