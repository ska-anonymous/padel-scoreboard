import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeCanvas } from 'qrcode.react'
import { useGame } from '../hooks/useGame'

const QRCodePage = () => {
    const navigate = useNavigate()
    const { gameStarted } = useGame()

    useEffect(() => {
        if (gameStarted) {
            navigate('/', { replace: true })
        }
    }, [gameStarted])

    const adminURL = window.location.origin + '/admin'

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center text-white min-vh-100 text-center py-4">
            <h1 className="display-5 mb-4">No game running</h1>
            <p className="lead mb-3">Scan the QR code below to open the Admin Panel and start a new game.</p>

            <div className="p-3 bg-white rounded">
                <QRCodeCanvas value={adminURL} size={200} />
            </div>

            <p className="mt-3 small"> <code>{adminURL}</code></p>
        </div>
    )
}

export default QRCodePage
