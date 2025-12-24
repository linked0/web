import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

interface AIAgentProps {
    onPlanetSelect: (planetName: string) => void
}

export function AIAgent({ onPlanetSelect }: AIAgentProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm your Solar System guide powered by Gemini Flash. Ask me anything about the planets, and I'll take you there!" }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMsg = input.trim()
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setInput('')
        setIsLoading(true)

        try {
            // Simulate Gemini Flash response
            await new Promise(r => setTimeout(r, 1500))

            let response = ""
            let targetPlanet = ""

            const lowerInput = userMsg.toLowerCase()
            if (lowerInput.includes('mars')) {
                targetPlanet = "Mars"
                response = "Mars, the 'Red Planet', is home to Olympus Mons, the largest volcano in the solar system, and Valles Marineris, a canyon system that dwarfs the Grand Canyon. Its thin atmosphere is 95% carbon dioxide."
            } else if (lowerInput.includes('jupiter')) {
                targetPlanet = "Jupiter"
                response = "Jupiter is a gas giant primarily made of hydrogen and helium. Its iconic 'Great Red Spot' is actually a massive storm that has been raging for centuries, and is larger than Earth itself!"
            } else if (lowerInput.includes('saturn')) {
                targetPlanet = "Saturn"
                response = "Saturn is famous for its spectacular ring system, made of billions of small chunks of ice and rock. It has at least 146 moons, including Titan, the only moon with a substantial atmosphere."
            } else if (lowerInput.includes('mercury')) {
                targetPlanet = "Mercury"
                response = "Mercury is the smallest planet and closest to the Sun. It has no atmosphere to trap heat, meaning day temperatures reach 430°C while nights drop to -180°C!"
            } else if (lowerInput.includes('venus')) {
                targetPlanet = "Venus"
                response = "Venus is the hottest planet due to a runaway greenhouse effect. Its surface is hot enough to melt lead, and it rotates in the opposite direction of most other planets."
            } else if (lowerInput.includes('earth')) {
                targetPlanet = "Earth"
                response = "Earth is our oasis in space—the only world known to support life. 71% of its surface is covered by water, which exists in all three states: liquid, solid, and gas."
            } else if (lowerInput.includes('uranus')) {
                targetPlanet = "Uranus"
                response = "Uranus is an 'ice giant' that tilts so far on its axis that it essentially orbits the Sun on its side. This causes extreme seasons lasting over 20 years each."
            } else if (lowerInput.includes('neptune')) {
                targetPlanet = "Neptune"
                response = "Neptune is the windiest planet, with supersonic winds reaching 2,100 km/h. It was the first planet located through mathematical calculations rather than direct observation."
            } else {
                response = "The Solar System is vast and full of wonders! I can tell you about any planet from Mercury to Neptune. Which one sparks your curiosity?"
            }

            setMessages(prev => [...prev, { role: 'assistant', content: response }])
            if (targetPlanet) onPlanetSelect(targetPlanet)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 max-h-[500px] flex flex-col glass rounded-2xl overflow-hidden shadow-2xl z-50">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Bot size={20} className="text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Gemini Flash Guide</h3>
                        <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-white/50 uppercase tracking-wider">Online</span>
                        </div>
                    </div>
                </div>
                <Sparkles size={16} className="text-yellow-400" />
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] scrollbar-hide"
            >
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'
                                }`}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin text-blue-400" />
                            <span className="text-xs text-white/50">Analyzing cosmos...</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about a planet..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}
