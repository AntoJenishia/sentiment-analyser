"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAnalytics } from "@/lib/api";
import { AnalyticsResponse } from "@/types/analysis";

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch(() => setError("Could not load analytics."));
  }, []);

  const sentimentRows = useMemo(() => {
    if (!data) return [];
    const total = Object.values(data.sentiment_distribution).reduce((sum, value) => sum + value, 0) || 1;
    return Object.entries(data.sentiment_distribution).map(([label, count]) => ({
      label,
      count,
      pct: (count / total) * 100,
    }));
  }, [data]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated Background */}
      <motion.div
        className="fixed inset-0 z-0"
        animate={{
          background: [
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
            "linear-gradient(135deg, #16213e 0%, #0a0a0a 50%, #1a1a2e 100%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />

      <main className="relative z-10 flex-1">
        {/* Header */}
        <motion.header
          className="p-6 flex justify-between items-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            SentimentAI
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/analyzer" className="text-gray-300 hover:text-white transition-colors">
              Analyzer
            </Link>
            <Link href="/batch" className="text-gray-300 hover:text-white transition-colors">
              Batch
            </Link>
            <Link href="/insights" className="text-gray-300 hover:text-white transition-colors">
              Insights
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
          </nav>
        </motion.header>

        {/* Dashboard Content */}
        <section className="px-6 py-12">
          <motion.div
            className="max-w-7xl mx-auto space-y-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center space-y-4">
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-white"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                Analytics Dashboard
              </motion.h1>
              <motion.p
                className="text-xl text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Live sentiment and emotion intelligence from recent analysis traffic
              </motion.p>
            </div>

            {/* Stats Cards */}
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="glass p-8 rounded-2xl text-center glow"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-3xl font-bold text-white mb-2">{data?.total_requests ?? 0}</h3>
                <p className="text-gray-300">Total Analyses</p>
              </motion.div>

              <motion.div
                className="glass p-8 rounded-2xl text-center glow"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-3xl font-bold text-green-400 mb-2">{data?.model_info.best_model ?? "N/A"}</h3>
                <p className="text-gray-300">Best Classical Model</p>
              </motion.div>

              <motion.div
                className="glass p-8 rounded-2xl text-center glow"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-3xl font-bold text-yellow-300 mb-2">
                  {data?.model_info.best_macro_f1 ? `${(data.model_info.best_macro_f1 * 100).toFixed(1)}%` : "N/A"}
                </h3>
                <p className="text-gray-300">Macro F1</p>
              </motion.div>
            </motion.div>

            {error && <p className="text-center text-red-300">{error}</p>}

            {/* Charts */}
            <motion.div
              className="grid md:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="glass p-8 rounded-2xl glow"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-2xl font-semibold text-white mb-6">Sentiment Distribution</h3>
                <div className="space-y-4">
                  {sentimentRows.map((row, index) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-gray-300 capitalize">{row.label}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-40 bg-gray-700 rounded-full h-4">
                          <motion.div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${row.pct}%` }}
                            transition={{ duration: 1, delay: 1 + index * 0.1 }}
                          />
                        </div>
                        <span className="text-blue-300 font-medium">{row.pct.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="glass p-8 rounded-2xl glow"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-2xl font-semibold text-white mb-6">Emotion Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(data?.emotion_breakdown ?? {}).map(([emotion, score], index) => (
                    <div key={emotion} className="flex items-center justify-between">
                      <span className="text-gray-300 capitalize">{emotion}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="bg-blue-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, score)}%` }}
                            transition={{ duration: 1, delay: 1 + index * 0.1 }}
                          />
                        </div>
                        <span className="text-blue-400 text-sm">{score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Recent Comments */}
            <motion.div
              className="glass p-8 rounded-2xl glow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <h3 className="text-2xl font-semibold text-white mb-6">Recent Analysis History</h3>
              <div className="space-y-4">
                {(data?.recent_history ?? []).slice(0, 8).map((comment, index) => (
                  <motion.div
                    key={`${comment.created_at}-${index}`}
                    className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <div className={`w-3 h-3 rounded-full mt-2 ${comment.sentiment === "positive" ? "bg-green-500" : comment.sentiment === "negative" ? "bg-red-500" : "bg-yellow-300"}`} />
                    <div className="flex-1">
                      <p className="text-gray-200 mb-2">{comment.text}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{comment.sentiment.charAt(0).toUpperCase() + comment.sentiment.slice(1)}</span>
                        <span>{(comment.confidence * 100).toFixed(0)}% confidence</span>
                        <span>{new Date(comment.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}