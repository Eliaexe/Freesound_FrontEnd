"use client";

import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';

const API_URL = "https://reconstruction-starring-birds-fig.trycloudflare.com/";

export function LoginView() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-900/80 to-black/90 p-4">
            <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/10 shadow-2xl space-y-6">
                <div className="flex flex-col items-center">
                    <div className="mb-6 p-4 bg-orange-500 rounded-full shadow-lg">
                        <Music className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 mb-2">
                        Benvenuto su Freesound
                    </h1>
                    <p className="text-center text-white/80 text-lg">
                        Accedi con Spotify per accedere alla tua musica preferita e scoprire nuovi brani.
                    </p>
                </div>

                <a 
                    href={`${API_URL}/auth/login`} 
                    className="block transition-transform hover:scale-95 active:scale-90"
                >
                    <Button 
                        size="lg" 
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-6 rounded-xl shadow-lg"
                    >
                        Accedi con Spotify
                    </Button>
                </a>

                <p className="text-center text-sm text-white/60">
                    Continuando, accetti i nostri <br/>
                    <a href="#" className="underline hover:text-orange-400">Termini di servizio</a> e la 
                    <a href="#" className="underline hover:text-orange-400"> Privacy Policy</a>
                </p>
            </div>
        </div>
    );
} 