import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-burger-builder0.firebaseio.com/'
});

export default instance;
