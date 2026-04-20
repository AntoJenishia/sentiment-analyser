"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const storySections = [
  {
    title: "The Challenge",
    content: "In today's digital age, social media platforms generate millions of comments daily. Understanding public sentiment has become crucial for businesses, researchers, and individuals alike. Manual analysis is time-consuming and prone to human bias.",
    icon: "🎯",
  },
  {
    title: "The Solution",
    content: "We developed SentimentAI, a cutting-edge sentiment analysis tool powered by machine learning. Using Support Vector Machines (SVM) with TF-IDF vectorization, our model achieves high accuracy in classifying social media comments as positive or negative.",
    icon: "🚀",
  },
  {
    title: "The Technology",
    content: "Our system preprocesses text data, converts it into numerical features using TF-IDF, and applies SVM classification to determine sentiment. The result includes not just the classification but also a confidence score for transparency.",
    icon: "🧠",
  },
  {
    title: "The Impact",
    content: "SentimentAI empowers users to quickly analyze social media sentiment at scale. Whether you're a business monitoring brand perception or a researcher studying public opinion, our tool provides fast, accurate insights.",
    icon: "📈",
  },
];

export default function About() {
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
            <Link href="/insights" className="text-gray-300 hover:text-white transition-colors">
              Insights
            </Link>
          </nav>
        </motion.header>

        {/* About Content */}
        <section className="px-6 py-12">
          <motion.div
            className="max-w-4xl mx-auto space-y-16"
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
                Our Story
              </motion.h1>
              <motion.p
                className="text-xl text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                How we built the future of sentiment analysis
              </motion.p>
            </div>

            {/* Story Timeline */}
            <div className="space-y-12">
              {storySections.map((section, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {section.icon}
                  </motion.div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-semibold text-white mb-4">{section.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-lg">{section.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mission Statement */}
            <motion.div
              className="glass p-12 rounded-2xl text-center glow"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-3xl font-bold text-white mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Our Mission
              </motion.h2>
              <motion.p
                className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                To democratize sentiment analysis by providing accessible, accurate, and transparent
                AI-powered tools that help individuals and organizations understand public opinion
                in the digital age. We believe in combining cutting-edge machine learning with
                intuitive design to make complex analysis simple and actionable.
              </motion.p>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-white">Ready to analyze sentiment?</h3>
              <Link href="/analyzer">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Analyzing
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}