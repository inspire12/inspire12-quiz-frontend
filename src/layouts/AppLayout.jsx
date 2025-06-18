import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { AnimatePresence, motion } from 'framer-motion'

export default function AppLayout() {
    const location = useLocation()

    return (
        <div className="flex h-screen">
            <Sidebar />
            <AnimatePresence mode="wait">
                <motion.main
                    key={location.pathname} // 중요!
                    className="flex-1 overflow-y-auto p-6"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                >
                    <Outlet />
                </motion.main>
            </AnimatePresence>
        </div>
    )
}
