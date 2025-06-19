// components/AnimatedContainer.jsx
import { AnimatePresence, motion } from 'framer-motion'

export default function AnimatedContainer({ children, className = '', keyId }) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={keyId}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}
