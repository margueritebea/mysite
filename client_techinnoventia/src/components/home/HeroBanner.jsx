import { useEffect, useState } from "react";

export default function HeroBanner() {
    const phrases = [
        "Bienvenue sur TECH INNOVENTIA",
        "Une plateforme pour innover, apprendre et créer.",
        "Explorez le monde du code et de la technologie.",
    ];

    const [displayedLines, setDisplayedLines] = useState([]);
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isErasing, setIsErasing] = useState(false);

    useEffect(() => {
        const currentLine = phrases[lineIndex];

        const typingInterval = setTimeout(() => {
            if (!isErasing) {
                // TYPING
                if (charIndex < currentLine.length) {
                    const newLines = [...displayedLines];
                    newLines[lineIndex] = (newLines[lineIndex] || "") + currentLine[charIndex];
                    setDisplayedLines(newLines);
                    setCharIndex((prev) => prev + 1);
                } else {
                    // Full line typed
                    if (lineIndex < phrases.length - 1) {
                        setLineIndex((prev) => prev + 1);
                        setCharIndex(0);
                    } else {
                        // All lines typed, wait before erasing
                        setTimeout(() => setIsErasing(true), 2000);
                    }
                }
            } else {
                // ERASING
                if (displayedLines.length > 0) {
                    const newLines = [...displayedLines];
                    const lastLine = newLines[newLines.length - 1];
                    if (lastLine.length > 0) {
                        newLines[newLines.length - 1] = lastLine.slice(0, -1);
                    } else {
                        newLines.pop(); // remove empty line
                    }
                    setDisplayedLines(newLines);
                } else {
                    // Reset
                    setIsErasing(false);
                    setLineIndex(0);
                    setCharIndex(0);
                }
            }
        }, isErasing ? 25 : 70); // faster erase

        return () => clearTimeout(typingInterval);
    }, [charIndex, isErasing, lineIndex, displayedLines]);

    return (
        <section className="bg-primary text-white min-h-[60vh] flex items-center justify-center text-center px-4">
        <div>
        {displayedLines.map((line, index) => (
            <h1
            key={index}
            className={`text-2xl sm:text-4xl font-bold ${
                index === displayedLines.length - 1 ? "inline-flex" : ""
            }`}
            >
            {line}
            {index === displayedLines.length - 1 && !isErasing && (
                <span className="inline-block w-[1ch] animate-blink ml-1">|</span>
            )}
            </h1>
        ))}
        {displayedLines.length === 0 && (
            <span className="inline-block text-2xl sm:text-4xl font-bold animate-blink">|</span>
        )}
        </div>
        </section>
    );
}
