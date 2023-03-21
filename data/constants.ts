import dotenv from 'dotenv';
dotenv.config();

export const URL = {
    BASE : process.env.BASE_URL || 'URL NOT PROVIDED'
}

export const CREDENTIALS = {
    username: process.env.USER || 'USERNAME NOT PROVIDED',
    password: process.env.PASSWORD || 'PASSWORD NOT PROVIDED'
}

export const HTTPS_CREDENTIALS = {

    validCredentials : {
        httpCredentials: {
          username: CREDENTIALS.username,
          password:  CREDENTIALS.password
        }
      },
    
      invalidCredentials : {
        httpCredentials: {
          username: '',
          password:  ''
        }
      }

}
