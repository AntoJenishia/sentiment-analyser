"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import { predictComment } from "@/lib/api";
import { ModelType, PredictionResult, SentimentLabel } from "@/types/analysis";

const sentimentStyles: Record<SentimentLabel, string> = {
  positive: "text-green-400",
  negative: "text-red-400",
  neutral: "text-yellow-300",
};

const sentimentEmoji: Record<SentimentLabel, string> = {
  positive: "😊",
  negative: "😡",
  neutral: "😐",
};

export default function Analyzer() {
  const [text, setText] = useState("");
  const [modelType, setModelType] = useState<ModelType>("classical");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const wordCount = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);

  const analyzeSentiment = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await predictComment(text, modelType);
      setResult(data);
    } catch {
      setError("Failed to analyze. Make sure backend is running and model files are trained.");
    } finally {
      setLoading(false);
    }
  };

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

      <main className="relative z-10 flex-1 flex flex-col">
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
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
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

        {/* Main Content */}
        <section className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div
            className="max-w-2xl w-full space-y-8"
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
                Sentiment Analyzer
              </motion.h1>
              <motion.p
                className="text-xl text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Real-time sentiment and emotion intelligence for social media comments
              </motion.p>
            </div>

            {/* Input Section */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Input
                value={text}
                onChange={setText}
                placeholder="Enter a comment to analyze..."
                multiline
                className="text-lg"
              />
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-300">
                <span>Words: {wordCount}</span>
                <div className="flex items-center gap-2">
                  <span>Model:</span>
                  <select
                    className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1"
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value as ModelType)}
                  >
                    <option value="classical">Classical (best ML)</option>
                    <option value="transformer">Transformer (HF)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={analyzeSentiment}
                  disabled={!text.trim() || loading}
                  className="text-lg px-12 py-4"
                >
                  {loading ? <Loading /> : "Analyze Sentiment"}
                </Button>
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="glass p-4 rounded-lg border border-red-500/50 text-red-400 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result Section */}
            <AnimatePresence>
              {result && (
                <motion.div
                  className="glass p-8 rounded-2xl text-center space-y-6 glow"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="text-6xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    {sentimentEmoji[result.sentiment]}
                  </motion.div>

                  <motion.h3
                    className={`text-3xl font-bold ${sentimentStyles[result.sentiment]}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)} Sentiment
                  </motion.h3>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-gray-300">Confidence Score</p>
                    <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                      <motion.div
                        className={`h-full ${result.sentiment === "positive" ? "bg-green-500" : result.sentiment === "negative" ? "bg-red-500" : "bg-yellow-400"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence * 100}%` }}
                        transition={{ delay: 0.8, duration: 1 }}
                      />
                    </div>
                    <p className="text-lg font-semibold text-white">
                      {(result.confidence * 100).toFixed(1)}%
                    </p>
                  </motion.div>

                  <div className="grid md:grid-cols-3 gap-3 text-left">
                    {Object.entries(result.probabilities).map(([label, probability]) => (
                      <div key={label} className="bg-black/20 border border-white/10 rounded-lg p-3">
                        <p className="text-xs uppercase text-gray-400">{label}</p>
                        <p className="text-lg font-semibold text-white">{(probability * 100).toFixed(1)}%</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-left space-y-2">
                    <p className="text-sm text-gray-300">Emotion detection</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(result.emotions).map(([emotion, score]) => (
                        <div key={emotion} className="bg-black/20 border border-white/10 rounded px-2 py-1 text-sm">
                          <span className="text-gray-200">{emotion}</span>{" "}
                          <span className="text-gray-400">{(score * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-left space-y-2">
                    <p className="text-sm text-gray-300">Influential keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {result.influential_keywords.map((word) => (
                        <span key={word} className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-200">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    className="pt-4 border-t border-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <p className="text-gray-400 text-sm">
                      Analysis powered by model comparison + TF-IDF (1,2)-gram + optional transformer
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      </main>
    </div>
  );
}