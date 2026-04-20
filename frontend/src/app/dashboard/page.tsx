"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const mockData = {
  totalAnalyses: 1247,
  positive: 68,
  negative: 32,
  recentComments: [
    { text: "This app is fantastic! Love the interface.", sentiment: "positive", confidence: 0.95, time: "2 hours ago" },
    { text: "Not impressed with the customer service.", sentiment: "negative", confidence: 0.87, time: "4 hours ago" },
    { text: "Great value for money, highly recommend!", sentiment: "positive", confidence: 0.92, time: "6 hours ago" },
    { text: "The product quality is poor.", sentiment: "negative", confidence: 0.89, time: "8 hours ago" },
    { text: "Amazing features and easy to use.", sentiment: "positive", confidence: 0.96, time: "10 hours ago" },
  ],
};

export default function Dashboard() {
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
                Monitor sentiment analysis trends and insights
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
                <h3 className="text-3xl font-bold text-white mb-2">{mockData.totalAnalyses.toLocaleString()}</h3>
                <p className="text-gray-300">Total Analyses</p>
              </motion.div>

              <motion.div
                className="glass p-8 rounded-2xl text-center glow"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-3xl font-bold text-green-400 mb-2">{mockData.positive}%</h3>
                <p className="text-gray-300">Positive Sentiment</p>
              </motion.div>

              <motion.div
                className="glass p-8 rounded-2xl text-center glow"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-3xl font-bold text-red-400 mb-2">{mockData.negative}%</h3>
                <p className="text-gray-300">Negative Sentiment</p>
              </motion.div>
            </motion.div>

            {/* Charts Placeholder */}
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
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Positive</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-700 rounded-full h-4">
                        <motion.div
                          className="bg-green-500 h-4 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "68%" }}
                          transition={{ duration: 1, delay: 1 }}
                        />
                      </div>
                      <span className="text-green-400 font-medium">68%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Negative</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-700 rounded-full h-4">
                        <motion.div
                          className="bg-red-500 h-4 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "32%" }}
                          transition={{ duration: 1, delay: 1.2 }}
                        />
                      </div>
                      <span className="text-red-400 font-medium">32%</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="glass p-8 rounded-2xl glow"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-2xl font-semibold text-white mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-gray-300">{day}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-blue-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.random() * 100}%` }}
                            transition={{ duration: 1, delay: 1 + index * 0.1 }}
                          />
                        </div>
                        <span className="text-blue-400 text-sm">{Math.floor(Math.random() * 50) + 10}</span>
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
              <h3 className="text-2xl font-semibold text-white mb-6">Recent Comments</h3>
              <div className="space-y-4">
                {mockData.recentComments.map((comment, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <div className={`w-3 h-3 rounded-full mt-2 ${comment.sentiment === "positive" ? "bg-green-500" : "bg-red-500"}`} />
                    <div className="flex-1">
                      <p className="text-gray-200 mb-2">{comment.text}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{comment.sentiment.charAt(0).toUpperCase() + comment.sentiment.slice(1)}</span>
                        <span>{(comment.confidence * 100).toFixed(0)}% confidence</span>
                        <span>{comment.time}</span>
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