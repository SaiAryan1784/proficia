import { NextResponse } from 'next/server';

export async function GET() {
  const faqs = [
    {
      question: "What is Proficia?",
      answer: "Proficia is an AI-powered learning platform that helps you master technology skills through personalized practice tests, instant feedback, and gamified progress tracking."
    },
    {
      question: "How do the AI-generated tests work?",
      answer: "Our AI analyzes your performance and learning patterns to generate personalized practice tests that adapt to your skill level and focus on areas where you need improvement."
    },
    {
      question: "What programming languages and technologies can I learn?",
      answer: "Proficia covers a wide range of topics including Web Development, Data Science, Machine Learning/AI, Mobile Development, Cloud Computing, Cybersecurity, DevOps, Game Development, and Algorithms & Data Structures."
    },
    {
      question: "Is Proficia suitable for beginners?",
      answer: "Yes! Proficia offers content for all skill levels, from complete beginners to advanced practitioners. Our adaptive learning system ensures you start at the right level and progress at your own pace."
    },
    {
      question: "How does the gamification system work?",
      answer: "You earn XP points for completing tests, maintain daily learning streaks, unlock achievement badges, and level up as you progress. This makes learning engaging and motivating."
    },
    {
      question: "Can I track my learning progress?",
      answer: "Absolutely! Proficia provides detailed analytics showing your performance over time, topic-specific progress, learning streaks, and areas for improvement."
    },
    {
      question: "How much does Proficia cost?",
      answer: "Proficia offers a free tier to get started with basic features. Premium plans with advanced features and unlimited access are available for serious learners."
    },
    {
      question: "Can I use Proficia on mobile devices?",
      answer: "Yes, Proficia is fully responsive and works great on all devices including smartphones, tablets, and desktop computers."
    },
    {
      question: "How often is the content updated?",
      answer: "Our content is regularly updated to reflect current industry trends and technologies. New topics and practice questions are added frequently."
    },
    {
      question: "Do you offer certificates or credentials?",
      answer: "Yes, you can earn badges and achievements that showcase your skills. We're also working on industry-recognized certifications for various technology topics."
    }
  ];

  return NextResponse.json(faqs);
}