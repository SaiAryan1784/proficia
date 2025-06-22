"use client";
import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaLink, FaShare } from 'react-icons/fa';

interface ShareData {
  title: string;
  text: string;
  url: string;
}

interface SocialShareProps {
  shareData: ShareData;
  className?: string;
}

export default function SocialShare({ shareData, className = "" }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const openShareWindow = (url: string) => {
    window.open(url, 'share', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleNativeShare}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="Share your achievement"
      >
        <FaShare size={16} />
        <span>Share Achievement</span>
      </button>

      {showDropdown && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50 min-w-[200px]">
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Share on:
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => openShareWindow(shareUrls.facebook)}
              className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <FaFacebook className="text-blue-600" size={18} />
              <span className="text-gray-700 dark:text-gray-300">Facebook</span>
            </button>

            <button
              onClick={() => openShareWindow(shareUrls.twitter)}
              className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <FaTwitter className="text-blue-400" size={18} />
              <span className="text-gray-700 dark:text-gray-300">Twitter</span>
            </button>

            <button
              onClick={() => openShareWindow(shareUrls.linkedin)}
              className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <FaLinkedin className="text-blue-700" size={18} />
              <span className="text-gray-700 dark:text-gray-300">LinkedIn</span>
            </button>

            <button
              onClick={() => openShareWindow(shareUrls.whatsapp)}
              className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <FaWhatsapp className="text-green-500" size={18} />
              <span className="text-gray-700 dark:text-gray-300">WhatsApp</span>
            </button>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <FaLink className="text-gray-500" size={18} />
                <span className="text-gray-700 dark:text-gray-300">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// Component for sharing test results
export interface TestResultShareProps {
  score: number;
  topic: string;
  level?: number;
  badges?: number;
  className?: string;
}

export function TestResultShare({ score, topic, level, badges }: {
  score: number;
  topic: string;
  level?: number;
  badges?: number;
}) {
  const shareText = `I just scored ${score}% on a ${topic} test on Proficia! 🎉 ${
    level ? `Level ${level} unlocked! ` : ''
  }${badges ? `${badges} new badges earned! ` : ''}#Learning #AI #Education`;

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const shareData = {
    title: 'My Proficia Test Results',
    text: shareText,
    url: shareUrl,
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
        Share Your Achievement! 🎉
      </h3>
      
      <SocialShare shareData={shareData} className="justify-center" />
      
      <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-3">
        Share your achievement and inspire others to learn!
      </p>
    </div>
  );
}

// Component for sharing achievements/badges
interface AchievementShareProps {
  badgeName: string;
  description: string;
  level?: number;
  className?: string;
}

export function AchievementShare({ badgeName, description, level, className = "" }: AchievementShareProps) {
  const shareData: ShareData = {
    title: `New Achievement Unlocked - Proficia`,
    text: `🏆 I just unlocked the "${badgeName}" badge on Proficia! ${description} ${level ? `I'm now Level ${level}!` : ''} #Achievement #Learning #Proficia`,
    url: window.location.origin,
  };

  return (
    <SocialShare 
      shareData={shareData} 
      className={className}
    />
  );
}
