
import { LightBulbIcon, RocketLaunchIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import AboutCard from '../../components/AboutCard'


const values = [
    {
        title: "Innovation",
        description: "Nous repoussons les limites avec des idées nouvelles.",
        icon: LightBulbIcon,
        color: "from-primary to-accent"
    },
{
    title: "Engagement",
    description: "Chaque projet est une mission menée avec passion.",
    icon: UserGroupIcon,
    color: "from-secondary to-secondary-light"
},
{
    title: "Croissance",
    description: "Nous aidons nos clients à évoluer grâce à la tech.",
    icon: RocketLaunchIcon,
    color: "from-accent to-primary-dark"
}
]

export default function AboutSection() {
    return (
        <section className="py-20 bg-white" id="about">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        {/* Image */}
        <div className="md:w-1/2">
        <img
         src="/src/assets/team_techinnoventia.jpg" // remplace par ton image locale ou distante
//        src="https://images.stockcake.com/public/c/d/9/cd949533-e235-4f58-81e5-9bb154c83d3d/future-team-innovation-stockcake.jpg"

        alt="Innovation Team"
        className="w-full h-full max-w-md mx-auto"
        />
        </div>

        {/* Texte + valeurs */}
        <div className="md:w-1/2">
        <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-6">
        Qui sommes-nous ?
        </h2>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        TECH INNOVENTIA est une plateforme dédiée à l’innovation, la technologie et à la formation continue.
        Nous accompagnons les porteurs de projets, les entreprises et les étudiants dans leur transformation digitale.
        </p>

        {/* Grille de valeurs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {values.map((value, index) => (
            <AboutCard key={index} {...value} />
        ))}
        </div>
        </div>
        </div>
        </section>
    )
}
