"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/Button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated Background */}
      <motion.div
        className="fixed inset-0 z-0"
        animate={{
          background: [
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
            "linear-gradient(135deg, #16213e 0%, #0a0a0a 50%, #1a1a2e 100%)",
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0a0a0a 100%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      />

      <main className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <motion.header
          className="p-6 flex justify-between items-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            SentimentAI
          </h1>
          <nav className="hidden md:flex space-x-8">
            <Link href="/analyzer" className="text-gray-300 hover:text-white transition-colors">
              Analyzer
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/insights" className="text-gray-300 hover:text-white transition-colors">
              Insights
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
          </nav>
        </motion.header>

        {/* Hero Section */}
        <section className="flex-1 flex items-center px-6">
          <motion.div
            className="max-w-4xl mx-auto w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div variants={itemVariants} className="space-y-8">
                <motion.h2
                  className="text-5xl md:text-6xl font-bold leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <motion.span
                    className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    Decode
                  </motion.span>
                  <span className="block text-white">Social Sentiment</span>
                  <span className="block text-gray-400 text-3xl md:text-4xl">
                    with AI Precision
                  </span>
                </motion.h2>

                <motion.p
                  variants={itemVariants}
                  className="text-xl text-gray-300 leading-relaxed"
                >
                  Harness model selection, transformer intelligence, emotion detection, toxicity checks,
                  and trend analytics to decode social conversations in real-time.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                  <Link href="/analyzer">
                    <Button className="text-lg px-8 py-4">
                      Analyze a Comment
                    </Button>
                  </Link>
                  <Link href="/batch">
                    <Button variant="secondary" className="text-lg px-8 py-4">
                      Batch Upload
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right Content - Floating Cards */}
              <motion.div variants={itemVariants} className="relative">
                <motion.div
                  className="glass p-6 rounded-2xl glow"
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="text-2xl font-semibold text-white mb-4">Real-time Analysis</h3>
                  <p className="text-gray-300 mb-4">
                    &quot;This product is amazing! Love the quality.&quot;
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-400 font-medium">Positive (98%)</span>
                  </div>
                </motion.div>

                <motion.div
                  className="glass p-4 rounded-xl absolute -top-4 -right-4 glow"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl">🚀</div>
                  <p className="text-sm text-gray-300">Fast & Accurate</p>
                </motion.div>

                <motion.div
                  className="glass p-4 rounded-xl absolute -bottom-4 -left-4 glow"
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl">📊</div>
                  <p className="text-sm text-gray-300">Data-Driven</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <motion.section
          className="py-20 px-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.h3
              className="text-4xl font-bold text-center text-white mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Why Choose SentimentAI?
            </motion.h3>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🧠",
                  title: "Advanced ML",
                  desc: "Logistic Regression vs SVM vs Naive Bayes with automatic best-model selection by macro F1.",
                },
                {
                  icon: "⚡",
                  title: "Real-time",
                  desc: "Instant sentiment, probability distribution, keyword influence, and confidence meter.",
                },
                {
                  icon: "🔒",
                  title: "Intelligent Insights",
                  desc: "Emotion breakdown, toxicity signals, batch analytics, and dashboard trend storytelling.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="glass p-8 rounded-2xl text-center glow"
                  whileHover={{ y: -10, scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-300">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
