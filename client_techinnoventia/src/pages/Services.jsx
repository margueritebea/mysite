

import {
    CodeBracketIcon,
    ShieldCheckIcon,
    CpuChipIcon,
} from '@heroicons/react/24/outline'
import ServicesCard from '../components/ServicesCard'

const services = [
    {
        title: "Développement Web",
        description: "Création de sites modernes, performants et responsive.",
        icon: CodeBracketIcon,
        color: "from-primary to-accent"
    },
{
    title: "Intelligence Artificielle",
    description: "Exploitez vos données grâce à nos solutions IA innovantes.",
    icon: CpuChipIcon,
    color: "from-accent to-primary-dark"
},
{
    title: "Cybersécurité",
    description: "Sécurisez vos applications et protégez vos utilisateurs.",
    icon: ShieldCheckIcon,
    color: "from-secondary to-secondary-light"
},
]

export default function Services() {
    return (
        <section className="py-16 bg-gray-50" id="services">
        <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-12">
        Nos Services
        </h2>

        <div className="grid gap-10 md:grid-cols-3">
        {services.map((service, index) => (
            <ServicesCard key={index} {...service} />
        ))}
        </div>
        </div>
        </section>
    )
}
