import {ValidationSchemaType} from './../../types'



// const generateSession = 'http://localhost:5050/api/v1/application/create';

// const application = 'http://localhost:5050/api/v1/application';

// // PUT application
// const update = 'http://localhost:5050/api/v1/application/update';

// const save = 'http://localhost:5050/api/v1/application/save'
// Push error handling to edge
// Improve design with lower level error handling
const updateApplication = (data:ValidationSchemaType) => fetch('http://localhost:5050/api/v1/application/update', {  
    body: JSON.stringify(data),
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include'
});

const getApplication = () => fetch('http://localhost:5050/api/v1/application', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include'
});


const submitApplication = (data:ValidationSchemaType) => fetch('http://localhost:5050/api/v1/application/complete', { 
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include'
});

const startApplication = () => fetch('http://localhost:5050/api/v1/application/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include'
});

export { getApplication, submitApplication,startApplication, updateApplication}