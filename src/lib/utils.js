export const getSocketURL = () => {
    const isServedFromESP = window.location.hostname === '192.168.4.1'
    return isServedFromESP
        ? import.meta.env.VITE_ESP_SOCKET_URL
        : import.meta.env.VITE_NODE_SOCKET_URL
}
