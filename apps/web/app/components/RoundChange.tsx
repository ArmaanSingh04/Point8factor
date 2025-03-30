"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function RoundChange(props: { results: { username: string; guess: number }[]; winner: string | undefined }) {
    const [visiblePlayers, setVisiblePlayers] = useState<{ username: string; guess: number }[]>([]);
    const [showTotal, setShowTotal] = useState(false);
    const [showWinner, setShowWinner] = useState(false);

    useEffect(() => {
        setVisiblePlayers([]);
        setShowTotal(false);
        setShowWinner(false);

        props.results.forEach((player, index) => {
            setTimeout(() => {
                setVisiblePlayers((prev) => [...prev, player]);
            }, index * 500);
        });


        setTimeout(() => {
            setShowTotal(true);
        }, (props.results.length * 0.5 + 1) * 1000);

        setTimeout(() => {
            setShowWinner(true);
        }, props.results.length * 500 + 1500);
    }, [props.results]);

    const getTotal = (): number => {
        return props.results.reduce((sum, player) => sum + player.guess, 0);
    };

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center gap-6 bg-gray-900 text-white">
            <h1 className="text-4xl font-bold text-yellow-400">Round Over</h1>

            <div className="flex border border-white flex-col min-w-1/4 p-4 rounded-lg shadow-lg bg-gray-800">
                {visiblePlayers.map((player, index) => (
                    <motion.div
                        key={index}
                        className="text-2xl p-3 border-b border-gray-600 last:border-none"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.5 }}
                    >
                        {player.username} - <span className="text-green-400">{player.guess}</span>
                    </motion.div>
                ))}
            </div>

            {showTotal && (
                <motion.p
                    className="text-2xl bg-blue-600 px-4 py-2 rounded-md shadow-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 , delay: 1}}
                >
                    Total: <span className="font-bold">{`${getTotal()} * 0.8 = ${Math.floor((getTotal() / props.results.length) * 0.8)}`}</span>
                </motion.p>
            )}

            {showWinner && (
                <motion.div
                    className="text-3xl text-white font-bold bg-green-500 px-6 py-3 rounded-lg shadow-lg"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    🎉 Winner: {props.winner} 🎉
                </motion.div>
            )}
        </div>
    );
}
