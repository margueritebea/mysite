import HeroBanner from "../../components/home/HeroBanner"
import Services from "../../pages/Services"

import AboutSection from "./AboutSection"


export default function Home() {
    return (
        <div className="p-1">
            <HeroBanner/>
            <Services/>
            <AboutSection/>
        </div>
    )
}
