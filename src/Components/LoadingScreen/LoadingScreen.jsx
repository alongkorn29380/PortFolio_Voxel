import { useProgress } from '@react-three/drei'
import { useState } from 'react'
import './LoadingScreen.css'

export default function LoadingScreen({ onEnter, ready })
{
    const { progress } = useProgress()
    const [fading, setFading] = useState(false)

    function handleEnter(withMusic)
    {
        if (!ready) return

        if (withMusic) {
            const audio = new Audio('Sounds/ฺBlackground/Music.mp3')
            audio.loop = true
            audio.volume = 0.1
            audio.play().catch(error => {
                console.log("Audio autoplay was prevented:", error)
            })
        }

        setFading(true)
        onEnter(withMusic)
    }

    return (
        <div className={`loading-screen${fading ? ' loading-screen--fading' : ''}`}>

            <div className="loading-card">

                <div className="loading-header">
                    <div className="loading-icon" />
                    <h1 className="loading-title">PORTFOLIO</h1>
                </div>

                <div className="loading-divider" />

                <p className="loading-tagline">
                    {ready ? 'World ready — choose how to explore' : 'Welcome to my world…'}
                </p>

                {!ready && (
                    <div className="loading-segments-frame">
                        <span className="loading-segments-label">Loading</span>
                        <div className="loading-segments">
                            {Array.from({ length: 8 }, (_, i) => (
                                <div
                                    key={i}
                                    className="loading-segment"
                                    style={{ animationDelay: `${i * 0.12}s` }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="loading-buttons">
                    <button
                        className="loading-btn loading-btn--light"
                        onClick={() => handleEnter(true)}
                        disabled={!ready}
                    >
                        ♪ &nbsp;Explore with Music
                    </button>
                    <button
                        className="loading-btn loading-btn--dark"
                        onClick={() => handleEnter(false)}
                        disabled={!ready}
                    >
                        🔇 &nbsp;Explore in Silence
                    </button>
                </div>

            </div>
        </div>
    )
}
