
import { motion } from 'framer-motion'

export default function AboutCard({ icon: Icon, title, description, color }) {
    return (
        <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-300"
        >
        <div className={`w-12 h-12 flex items-center justify-center rounded-full text-white bg-gradient-to-r ${color} mb-3`}>
        <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-secondary mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        </motion.div>
    )
}
