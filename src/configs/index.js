export default {
    api: window.location.protocol == "http:" ? process.env.REACT_APP_DEV_API_URL : process.env.REACT_APP_HEROKU_API_URL,
    socket: process.env.REACT_APP_SOCKET_PREFIX
}