const axios = require("axios");

function toQueryString(obj){
    let query = "?"
    query = query + Object.entries(obj).map(entry => entry[0] + "=" + entry[1]).join("&");
    return query
}

function createConfig(client,method,endpoint,body,query){
    let hasBodyObject = body && typeof body == "object" && !Array.isArray(body);
    let hasQueryObject = query && typeof query == "object" && !Array.isArray(query);


    let config = {
        method: method,
        url: `https://webexapis.com/v1/${endpoint}`,
        headers: {
            Authorization: `Bearer ${client.config.getAccessToken()}`
        }
    }
    if(hasBodyObject){
        config.data = JSON.stringify(data);
        config.headers["Content-Type"] = "application/json"
    }
    if(hasQueryObject){
        config.url = `${config.url}${toQueryString(query)}`
    }
    
    return config;
}

async function webexRequest(client,method,endpoint,body,query){

    try {
        let config = createConfig(client,method,endpoint,body,query);
        return Promise.resolve((await axios(config)).data)
    } catch (error) {
        if(error.hasOwnProperty("response")){
            error = {
                status: error.response.status,
                data: error.response.data
            }
                
            if(typeof error == "object"){
                error = JSON.stringify(error)
            }
        }
        return Promise.reject(new Error(error));
    }
}


class WebexClient {

    #accessToken;

    constructor(accessToken){
        this.#accessToken = accessToken;
    }

    config = {
        getAccessToken: () => {return this.#accessToken},
        setAccessToken: () => {this.accessToken = this.accessToken}
    }

    adminAuditEvents = {
        listAdminAuditEvents: (query) => {return webexRequest(this,"get","adminAudit/events",null,query)}
    }

    attachmentActions = {
        createAnAttachementAction: (body) => {return webexRequest(this,"Post","attachment/actions",body,null)},
        getAttachmentActionDetails: (id) => {return webexRequest(this,"get",`attachment/actions${id}`,null,null)}
    }

    broadWorksBillingReports = {
        listBroadWorksBillingReports: (query) => { return webexRequest(this,"get","broadworks/billing/reports",null,query)},
        getBroadWorksBillingReport: (id) => {return webexRequest(this,"get",`broadworks/billing/reports/${id}`,null,null)},
        createABroadWorksBillingReport: (body) => {return webexRequest(this,"post","broadworks/billing/reports",body,null)},
        deleteABroadWorksBillingReport: (id) => {return webexRequest(this,"delete",`broadworks/billing/reports/${id}`,null,null)}
    }

    broadWorksEnterprises = {
        listBroadWorksEnterprises: (query) => {return webexRequest(this,"get","broadworks/enterprises",null,query)},
        updateDirectorySyncForABroadWorksEnterprise: (id,body) => {
            return webexRequest(this,"put",`broadworks/enterprises${id}/broadworksDirectorySync`,body,null)
        },
        triggerDirectorySyncForAnEnterprise: (id,body) => { 
            return webexRequest(this,"post",`broadworks/enterprises${id}/broadworksDirectorySync`,body,null)
        }
    }

    broadWorksEnterprisesWithListEnterprisesByPartner = {
        listBroadWorksEnterprises: (query) => {return webexRequest(this,"get","broadworks/enterprises",null,query)},
        updateDirectorySyncForABroadWorksEnterprise: (id,body) => {
            return webexRequest(this,"put",`broadworks/enterprises${id}/broadworksDirectorySync`,body,null)
        },
        triggerDirectorySyncForAnEnterprise: (id,body) => {
             return webexRequest(this,"post",`broadworks/enterprises${id}/broadworksDirectorySync`,body,null)
            }
    }

    broadWorksSubscribers = {
        listBroadWorksSubscribers: (query) => {return webexRequest(this,"get","broadworks/subscribers",null,query)},
        provisionABroadWorksSubscriber: (body) => {return webexRequest(this,"post","broadworks/subscribers",body)},
        getABroadWorksSubscriber: (subscriberId) => {return webexRequest(this,"get",`broadworks/subscribers/${subscriberId}`,null,null)},
        updateABroadWorksSubscriber: (subscriberId,body) => {return webexRequest(this,"put",`broadworks/subscribers/${subscriberId}`,body,null)},
        removeABroadWorksSubscriber: (subscriberId) => {return webexRequest(this,"delete",`broadworks/subscribers/${subscriberId}`,null,null)}
    }

    people = {
        getMyDetails: () => {return webexRequest(this,"get","people/me")},
        getPersonDetails: () => {return webexRequest(this,"get",`people/${personId}`,null,query)},
        listPeople: (query) => {return webexRequest(this,"get","people",null,query)},
        deletePerson: (personId) => {return webexRequest(this,"delete",`people/${personId}`,null,null)},
        updatePerson: (body,query) => {return webexRequest(this,"put","people",body,query)}
    }

    organizations = {
        listOrganizations: () => {return webexRequest(this,"get","organizations",null,null)},
        getOrganizationDetails: (orgId) => {return webexRequest(this,"get",`organizations/${orgId}`,null,null)},
        deleteOrganization: (orgId) => {return webexRequest(this,"delete",`organizations/${orgId}`,null,null)}
    }

   

}


module.exports = WebexClient