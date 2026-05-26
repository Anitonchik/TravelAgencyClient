import {getRequest, postRequest, putRequest, deleteRequest, postRequestBlob} from "./requests";

export default class Reservation {

    URL = "/reservation";

    async getAll(pageNumber, pageSize) {
        return getRequest(this.URL, { 
            params: { 
                pageNumber: pageNumber, 
                pageSize: pageSize } 
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

    async getByClientId(clientId, pageNumber, pageSize) {
        return getRequest(`${this.URL}/search/byClient`, { 
            params: {
                clientId: clientId,
                pageNumber: pageNumber,
                pageSize: pageSize
            } 
        });
    }

    async getByClientName(clientName, pageNumber, pageSize) {
        return getRequest(`${this.URL}/search/byClientName`, { 
            params: {
                clientName: clientName,
                pageNumber: pageNumber,
                pageSize: pageSize
            } 
        });
    }

    async getByStatus(status, pageNumber, pageSize) {
        console.log(status);
        return getRequest(`${this.URL}/search/byStatus`, { 
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

    async startReservation(reservationData) {
        return postRequest(`${this.URL}/start`, reservationData);
    }

    async endReservation(reservationData) {
        return putRequest(`${this.URL}/end`, reservationData);
    }

    async cancelInProcess(reservationData) {
        return putRequest(`${this.URL}/cancelInProcess`, reservationData);
    }

    async cancel(reservationData) {
        return putRequest(`${this.URL}/cancel`, reservationData);
    }

    async getVoucher(voucherData) {
        return postRequestBlob(`${this.URL}/voucher`, voucherData);
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
  