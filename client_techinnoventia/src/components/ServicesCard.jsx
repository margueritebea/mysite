

import { motion } from 'framer-motion'

export default function ServicesCard({ title, description, icon: Icon, color }) {
    return (
        <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border-t-4 border-primary"
        >
        <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r ${color} text-white`}>
        <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-secondary mb-2 text-center">{title}</h3>
        <p className="text-gray-600 text-sm text-center">{description}</p>
        </motion.div>
    )
}
