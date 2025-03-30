"use client";
import { motion } from "framer-motion";

export default function GameOver(props: { winner: string | undefined }) {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            {/* "Game Over" Text with Tada Animation */}
            <motion.h1 
                initial={{ scale: 0 }}
                animate={{ scale: [1.2, 0.9, 1.1, 1] }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-6xl font-bold text-red-500"
            >
                Game Over
            </motion.h1>

            {/* Delay before showing the winner */}
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                className="text-3xl font-semibold mt-5 bg-white text-black px-6 py-3 rounded-lg shadow-lg"
            >
                🎉 {props.winner} has won the game! 🎉
            </motion.h2>
        </div>
    );
}
