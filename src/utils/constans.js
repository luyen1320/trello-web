// export const API_ROOT = 'http://localhost:8017'
// export const API_ROOT = 'https://trello-api-b6f7.onrender.com'

let apiRoot = ''
if(process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}

if(process.env.BUILD_MODE === 'production'){
  apiRoot = 'https://trello-api-b6f7.onrender.com'
}

export const API_ROOT = apiRoot