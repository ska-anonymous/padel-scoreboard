const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080, path: '/ws' })

wss.on('connection', (ws) => {
    console.log('Client connected')

    ws.on('message', (message) => {
        console.log('Message received:', message.toString())

        let parsed
        try {
            parsed = JSON.parse(message.toString())
        } catch (err) {
            console.error('[Server] ❌ Invalid JSON received:', message)
            return
        }

        const { event, data } = parsed

        if (event === 'sync:request') {
            // Forward sync request to just one other client (not the sender)
            const availableClients = Array.from(wss.clients).filter(
                (client) => client !== ws && client.readyState === WebSocket.OPEN
            )

            if (availableClients.length > 0) {
                const targetClient = availableClients[0] // or use Math.random() for random selection
                console.log('[Server] 🔁 Forwarding sync request to one client')
                targetClient.send(JSON.stringify({ event, data: null }))
            } else {
                console.log('[Server] ⚠️ No other client available to handle sync request')
            }
        } else {
            // Broadcast all other messages to all other clients
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(parsed))
                }
            })
        }
    })

    ws.on('close', () => {
        console.log('Client disconnected')
    })
})
