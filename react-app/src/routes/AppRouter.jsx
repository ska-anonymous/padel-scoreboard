import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import AdminPage from '../pages/AdminPage'
import QRCodePage from '../pages/QRCodePage'
import ScoreboardGuard from './ScoreboardGuard'

const AppRouter = () => {
    return (
        <Router>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<ScoreboardGuard />} />
                    <Route path="/qr" element={<QRCodePage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </AppLayout>
        </Router>
    )
}

export default AppRouter
