"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const pipelineSteps = [
  {
    title: "Input Text",
    description: "User submits a social media comment",
    icon: "💬",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Preprocessing",
    description: "Clean and normalize the text data",
    icon: "🔧",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "TF-IDF Vectorization",
    description: "Convert text to numerical features",
    icon: "📊",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Model Selection",
    description: "Choose best classifier via macro F1 (LR vs SVM vs NB)",
    icon: "🧠",
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Output Result",
    description: "Return sentiment, confidence, probability map and keywords",
    icon: "📈",
    color: "from-red-500 to-red-600",
  },
];

export default function Insights() {
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
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
          </nav>
        </motion.header>

        {/* Insights Content */}
        <section className="px-6 py-12">
          <motion.div
            className="max-w-6xl mx-auto space-y-12"
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
                Model Insights
              </motion.h1>
              <motion.p
                className="text-xl text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Understand how the full AI pipeline transforms noisy social text into actionable insights
              </motion.p>
            </div>

            {/* Pipeline Visualization */}
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {/* Connection Lines */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 via-orange-500 to-red-500 transform -translate-y-1/2 z-0" />

              <div className="grid md:grid-cols-5 gap-8 relative z-10">
                {pipelineSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <motion.div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {step.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Technical Details */}
            <motion.div
              className="grid md:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <motion.div
                className="glass p-8 rounded-2xl glow"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-2xl font-semibold text-white mb-6">TF-IDF Vectorization</h3>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Term Frequency-Inverse Document Frequency (TF-IDF) converts text into numerical vectors
                    by measuring word importance relative to the entire corpus.
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Term Frequency: How often a word appears in a document</li>
                    <li>Inverse Document Frequency: Rarity across all documents</li>
                    <li>Creates sparse feature vectors for machine learning</li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                className="glass p-8 rounded-2xl glow"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-2xl font-semibold text-white mb-6">SVM Classification</h3>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Support Vector Machine (SVM) finds the optimal hyperplane that best separates
                    positive and negative sentiment classes in the feature space.
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Linear kernel for text classification</li>
                    <li>Maximum margin separation</li>
                    <li>Confidence scores via decision function</li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              className="glass p-8 rounded-2xl glow text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              <h3 className="text-2xl font-semibold text-white mb-6">Model Performance</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold text-green-400 mb-2">95%</div>
                  <p className="text-gray-300">Training Accuracy</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-400 mb-2">5000</div>
                  <p className="text-gray-300">Features</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-400 mb-2">LinearSVC</div>
                  <p className="text-gray-300">Algorithm</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}