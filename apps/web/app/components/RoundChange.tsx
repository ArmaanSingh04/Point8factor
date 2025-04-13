"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function RoundChange(props: {
    results: { username: string; guess: number }[];
    winner: string | undefined;
}) {
    const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
    const [showTotal, setShowTotal] = useState(false);
    const [showWinner, setShowWinner] = useState(false);

    useEffect(() => {
        setVisibleIndexes([]);
        setShowTotal(false);
        setShowWinner(false);

        props.results.forEach((_, index) => {
            setTimeout(() => {
                setVisibleIndexes((prev) => [...prev, index]);
            }, index * 1000); // 1-second delay between each player
        });

        setTimeout(() => {
            setShowTotal(true);
        }, props.results.length * 1000 + 5000); // show total 1s after all players

        setTimeout(() => {
            setShowWinner(true);
        }, props.results.length * 1000 + 8000); // show winner 1.5s after total
    }, [props.results]);

    const getTotal = (): number => {
        return props.results.reduce((sum, player) => sum + player.guess, 0);
    };

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center gap-10 bg-gray-900 text-white p-4">
            <h1 className="text-4xl font-bold text-yellow-400">Round Over</h1>

            {/* Players' guesses */}
            <div className="flex flex-wrap justify-center gap-6">
                {props.results.map((player, index) => (
                    <motion.div
                        key={index}
                        className="border border-white rounded px-6 py-4 min-w-[200px] text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: visibleIndexes.includes(index) ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-xl font-semibold">{player.username}</p>
                        <p className="text-green-400 text-2xl mt-2">{player.guess}</p>
                    </motion.div>
                ))}
            </div>

            {/* Total Calculation */}
            <motion.div
                className="text-2xl bg-blue-600 px-6 py-3 rounded mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: showTotal ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            >
                Total:{" "}
                <span className="font-bold">{`${getTotal()} * 0.8 = ${Math.floor(
                    (getTotal() / props.results.length) * 0.8
                )}`}</span>
            </motion.div>

            {/* Winner */}
            <motion.div
                className="text-3xl text-white font-bold bg-green-500 px-8 py-4 rounded mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: showWinner ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            >
                🎉 Winner: {props.winner} 🎉
            </motion.div>
        </div>
    );
}
