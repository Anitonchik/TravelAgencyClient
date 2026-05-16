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

    async getByStatus(status, pageNumber, pageSize) {
        return getRequest(`${this.URL}/byStatus`, { 
            params: {
                status: status,
                pageNumber: pageNumber,
                pageSize: pageSize
            } 
        });
    }

    async getById(id) {
        return getRequest(`${this.URL}/${id}`);
    }

    async create(reservationData) {
        return postRequest(this.URL, reservationData);
    }

    async getVoucher(voucherData) {
        return postRequest(`${this.URL}/voucher`, voucherData);
    }

    async sendToEmail(id) {
        return getRequest(`${this.URL}/voucher/send/${id}`);
    }

    async delete(id) {
        return deleteRequest(`${this.URL}/${id}`);
    }

    async getCounts(){
        return getRequest(`${this.URL}/counts`);
    }
}