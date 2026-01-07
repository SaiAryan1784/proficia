"use client";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheck, FiTerminal, FiCpu, FiTrendingUp } from "react-icons/fi";

const topics = [
  {
    name: "Web Development",
    description: "Modern Fullstack Architecture",
    icon: "🌐",
  },
  {
    name: "Data Science",
    description: "Analytics & Predictive Modeling",
    icon: "📊",
  },
  {
    name: "Machine Learning",
    description: "Neural Networks & AI Systems",
    icon: "🤖",
  },
  {
    name: "System Design",
    description: "Scalable Distributed Systems",
    icon: "🏗️", // Replaced Mobile with System Design for more "pro" feel
  },
];

const stats = [
  { number: "50k+", label: "Assessments" },
  { number: "10k+", label: "Engineers" },
  { number: "98%", label: "Satisfaction" },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-accent/20 selection:text-accent-foreground">

      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-32 lg:py-48 max-w-7xl mx-auto">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Subtle gradient blob */}
          <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-secondary/20 blur-[120px] opacity-50" />
          <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[100px] opacity-30" />
        </div>

        <div className="text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-8 px-4 py-1.5 text-sm font-medium rounded-full bg-secondary text-secondary-foreground border-0">
              New: Enterprise Certifications
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-primary mb-8 leading-[1.1]">
              Engineering <br className="hidden md:block" />
              <span className="text-muted-foreground/80 font-serif italic">Excellence.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              The precision-engineered platform for technical assessment and continuous skill calibration.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/5">
                Start Assessment <FiArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="ghost" size="lg" className="h-14 px-8 text-lg rounded-full">
                View Architecture
              </Button>
            </Link>
          </motion.div>

          {/* Stats Minimal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-24 grid grid-cols-3 gap-12 max-w-3xl mx-auto"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-4xl font-bold text-foreground tracking-tight">{stat.number}</div>
                <div className="text-sm text-muted-foreground font-medium tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Topics / Domains */}
      <section className="py-32 bg-secondary/30 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight">Technical Domains</h2>
              <p className="text-lg text-muted-foreground">Rigorous evaluation paths for every layer of the stack.</p>
            </div>
            <Button variant="outline" className="hidden md:flex bg-transparent border-input">View All Domains</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-border/50 bg-card hover:border-primary/20 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-8 space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                      {topic.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">{topic.name}</h3>
                      <p className="text-muted-foreground">{topic.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration / Code Section */}
      <section className="py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <Badge variant="outline" className="mb-6 py-1.5 px-4">Workflows v2.1</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
              Adaptive Intelligence. <br />
              <span className="text-muted-foreground">Zero Latency.</span>
            </h2>
            <div className="space-y-8">
              {[
                { title: "Dynamic Difficulty Calibration", desc: "Real-time adjustment based on candidate velocity and accuracy.", icon: <FiCpu /> },
                { title: "Predictive Analytics", desc: "Forecast candidate performance with 94% accuracy.", icon: <FiTrendingUp /> },
                { title: "Automated Compliance", desc: "SOC2 aligned auditing and proctoring logs.", icon: <FiCheck /> }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl shrink-0 shadow-lg shadow-accent/20">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clean Code Window - Carbon Theme */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-accent/20 to-primary/5 rounded-[2rem] blur-2xl opacity-50" />
            <div className="bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-white/10 relative z-10">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#252526]">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <div className="ml-4 text-xs text-white/40 font-mono">analysis.ts</div>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed">
                  <code className="block text-[#d4d4d4]">
                    <span className="text-[#c586c0]">import</span> {"{"} NeuralEngine {"}"} <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">'@proficia/core'</span>;
                    {"\n\n"}
                    <span className="text-[#569cd6]">const</span> engine = <span className="text-[#569cd6]">new</span> <span className="text-[#4ec9b0]">NeuralEngine</span>({"{"}
                    {"\n"}  mode: <span className="text-[#ce9178]">'adaptive'</span>,
                    {"\n"}  latency: <span className="text-[#b5cea8]">0</span>,
                    {"\n"}  secure: <span className="text-[#569cd6]">true</span>
                    {"\n"}{"}"});
                    {"\n\n"}
                    <span className="text-[#6a9955]">// Execute assessment analysis</span>
                    {"\n"}
                    <span className="text-[#569cd6]">async function</span> <span className="text-[#dcdcaa]">calibrate</span>(candidate) {"{"}
                    {"\n"}  <span className="text-[#569cd6]">const</span> metrics = <span className="text-[#c586c0]">await</span> engine.<span className="text-[#dcdcaa]">evaluate</span>(candidate);
                    {"\n"}  <span className="text-[#c586c0]">return</span> metrics.score &gt; <span className="text-[#b5cea8]">98</span>;
                    {"\n"}{"}"}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
