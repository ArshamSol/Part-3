import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl)
  }
  
  const create = newObject => {
    return axios.post(baseUrl, newObject)
  }
  
  const update = (id, newObject) => {
    return axios.put(`${baseUrl}/update/${id}`, newObject)
  }
  
  const remove = (id)=>{
    console.log("remove"+id)
    return axios.delete(`${baseUrl}/delete/${id}`).then((response) => {
      console.log("Successfully deleted:", response.data);
    })
    .catch((error) => {
      console.error("Error deleting:", error);
    })

    
  }

  export default { 
    getAll: getAll, 
    create: create, 
    update: update,
    remove: remove
  }
