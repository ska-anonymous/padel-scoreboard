export const getSocketURL = () => {
    const isServedFromEsp = window.location.hostname === '192.168.4.1'

    const socketUrl = isServedFromEsp ? `ws://${window.location.hostname}/ws` : `ws://${window.location.hostname}:8080/ws`
    
    return socketUrl
}
