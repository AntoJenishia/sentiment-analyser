"use client";

import { motion } from "framer-motion";
import { ChangeEvent, useMemo, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { batchPredict } from "@/lib/api";
import { BatchPredictionResponse, ModelType } from "@/types/analysis";

export default function BatchPage() {
  const [bulkText, setBulkText] = useState("");
  const [modelType, setModelType] = useState<ModelType>("classical");
  const [result, setResult] = useState<BatchPredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const comments = useMemo(
    () => bulkText.split("\n").map((line) => line.trim()).filter(Boolean),
    [bulkText],
  );

  const runBatch = async () => {
    if (!comments.length) return;
    setLoading(true);
    setError("");
    try {
      const response = await batchPredict(comments, modelType);
      setResult(response);
    } catch {
      setError("Batch analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const onFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const parsed = lines
      .map((line) => line.split(",")[0]?.trim())
      .filter((line) => line && line.toLowerCase() !== "comment");
    setBulkText(parsed.join("\n"));
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            SentimentAI
          </Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
        </header>

        <motion.section className="glass rounded-2xl p-6 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-3xl font-bold text-white">Batch Analyzer</h1>
          <p className="text-gray-300">Paste one comment per line or upload CSV content manually.</p>
          <Input
            value={bulkText}
            onChange={setBulkText}
            placeholder="Comment line 1&#10;Comment line 2&#10;Comment line 3"
            multiline
            className="min-h-[220px]"
          />
          <div className="flex flex-wrap gap-3 items-center">
            <label className="text-sm text-gray-300 border border-gray-600 rounded-md px-3 py-2 hover:border-gray-400 cursor-pointer">
              Upload CSV
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={onFileUpload} />
            </label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value as ModelType)}
              className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-200"
            >
              <option value="classical">Classical model</option>
              <option value="transformer">Transformer model</option>
            </select>
            <Button onClick={runBatch} disabled={loading || comments.length === 0}>
              {loading ? "Analyzing..." : `Analyze ${comments.length} comments`}
            </Button>
          </div>
          {error && <p className="text-red-400">{error}</p>}
        </motion.section>

        {result && (
          <motion.section className="grid md:grid-cols-2 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass rounded-2xl p-6 space-y-3">
              <h2 className="text-xl font-semibold text-white">Aggregated Insights</h2>
              {Object.entries(result.summary.distribution).map(([label, value]) => (
                <div key={label} className="flex justify-between text-gray-200">
                  <span className="capitalize">{label}</span>
                  <span>{(value * 100).toFixed(1)}%</span>
                </div>
              ))}
              <p className="text-gray-300">Average confidence: {(result.summary.avg_confidence.overall * 100).toFixed(1)}%</p>
            </div>
            <div className="glass rounded-2xl p-6 space-y-3">
              <h2 className="text-xl font-semibold text-white">Sample Predictions</h2>
              {result.predictions.slice(0, 6).map((prediction, idx) => (
                <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <p className="text-sm text-gray-300 line-clamp-2">{prediction.text}</p>
                  <p className="text-sm text-white capitalize">{prediction.sentiment} ({(prediction.confidence * 100).toFixed(0)}%)</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
