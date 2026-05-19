import {getRequest, postRequest, putRequest, deleteRequest} from "./requests";

export default class Manager {

    URL = "/manager";
    
   
    async getById(id) {
        return getRequest(`${this.URL}/${id}`);
    }

    async update(clientData, id) {
        return putRequest(`${this.URL}/${id}`, clientData);
    }


}