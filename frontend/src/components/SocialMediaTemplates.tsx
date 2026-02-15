// Social Media Template Components for 7 Aberkane Principles
// Ready to export for Instagram, TikTok, LinkedIn, Twitter

import React from 'react';

export interface SocialMediaPost {
  platform: 'instagram' | 'tiktok' | 'linkedin' | 'twitter';
  size: { width: number; height: number };
  content: string;
  hashtags: string[];
  callToAction: string;
}

// ========== INSTAGRAM TEMPLATES ==========

/**
 * INSTAGRAM POST 1: Principle Overview Carousel
 * Format: 1080x1350 (vertical, optimal for feed)
 * Strategy: Educational carousel showing principle + benefit
 */
export const InstagramCarouselTemplate = () => (
  <div className="w-full max-w-md mx-auto bg-white">
    {/* Slide 1: Principle Cover */}
    <div className="bg-gradient-to-br from-primary/20 to-terracotta/20 aspect-[4/5] p-8 flex flex-col justify-between rounded-lg">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-terracotta">Aberkane Principle #1</p>
        <h1 className="text-5xl font-heading font-bold text-primary mt-4">Neuro<br />ergonomics</h1>
      </div>
      <p className="text-lg text-charcoal/70">Your brain is unique.<br />Your study tools should be too.</p>
    </div>

    {/* Slide 2: Key Insight */}
    <div className="bg-white aspect-[4/5] p-8 flex flex-col justify-center rounded-lg border-t-4 border-primary">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-terracotta mb-4">The Science</p>
        <p className="text-3xl font-heading font-bold text-primary mb-6">
          &quot;Adapt content to the brain, not brains to content&quot;
        </p>
        <p className="text-charcoal/70">— Idriss Aberkane, Libérez votre cerveau</p>
      </div>
    </div>

    {/* Slide 3: Benefit */}
    <div className="bg-gradient-to-br from-gold/10 to-terracotta/10 aspect-[4/5] p-8 flex flex-col justify-center rounded-lg">
      <div className="text-center">
        <p className="text-2xl font-heading font-bold text-primary mb-4">What It Means</p>
        <ul className="text-left space-y-4 text-charcoal/70">
          <li className="flex gap-3">
            <span className="text-gold font-bold">✓</span>
            <span>VARK-adapted content (visual, auditory, reading, kinesthetic)</span>
          </li>
          <li className="flex gap-3">
            <span className="text-gold font-bold">✓</span>
            <span>Learning style detection from your first upload</span>
          </li>
          <li className="flex gap-3">
            <span className="text-gold font-bold">✓</span>
            <span>Formats that work for YOUR brain, not generic ones</span>
          </li>
        </ul>
      </div>
    </div>

    {/* Slide 4: CTA */}
    <div className="bg-primary aspect-[4/5] p-8 flex flex-col justify-center rounded-lg text-white text-center">
      <p className="text-4xl mb-4">🎯</p>
      <h2 className="text-3xl font-heading font-bold mb-4">Stop Fighting Your Brain</h2>
      <p className="text-primary-100 mb-6">NKOM learns how YOU learn. Then adapts. Instantly.</p>
      <p className="text-sm font-semibold">👆 Tap link in bio to join 10K+ students</p>
    </div>
  </div>
);

/**
 * INSTAGRAM REEL TEMPLATE (15-30 seconds)
 * Concept: Quick principle explainer with motion
 * Script: "Did you know? Your brain learns better when content adapts to you, not the other way around."
 */
export const InstagramReelScript = {
  principle: 1,
  title: "Neuroergonomics",
  duration: "15 seconds",
  scenes: [
    {
      duration: "0-2s",
      visual: "Text: 'Did you know?'",
      voiceover: "Did you know your brain has a learning superpower?",
      animation: "Fade in + Zoom"
    },
    {
      duration: "2-5s",
      visual: "Show person overwhelmed with one-size-fits-all materials",
      voiceover: "Most apps force your brain to conform.",
      animation: "Shake effect showing confusion"
    },
    {
      duration: "5-8s",
      visual: "Transition to NKOM app adapting content",
      voiceover: "NKOM does the opposite.",
      animation: "Smooth morphing effect"
    },
    {
      duration: "8-12s",
      visual: "Show 7 learning formats appearing",
      voiceover: "It learns how YOUR brain learns. Then adapts. Instantly.",
      animation: "Cascade reveal with gold highlights"
    },
    {
      duration: "12-15s",
      visual: "CTA: Person smiling, retention percentage 90%",
      voiceover: "Get 90% retention. Not 10%.",
      animation: "Success celebration"
    }
  ],
  hashtags: ["#NKOM", "#NeuroscienceStudying", "#PersonalizedLearning", "#AfricanTech", "#LearnSmarter"]
};

// ========== TIKTOK TEMPLATES ==========

/**
 * TIKTOK VIDEO 1: "POV: Your Brain" Series
 * Format: 1080x1920 (vertical, 15-60 seconds)
 * Hook: "POV: Your brain when your study app finally adapts to you"
 */
export const TikTokPOVTemplate = {
  hook: "POV: Your brain when your study app FINALLY adapts to you 🧠✨",
  duration: "15-30 seconds",
  scenes: [
    "0s: Show confused student with generic study app",
    "3s: Brain character shakes head (❌)",
    "6s: Switch to NKOM - content transforms",
    "9s: Brain character nods approvingly (✓)",
    "12s: Student suddenly focused and happy",
    "15s: Text overlay: 'Retention: 90% vs 10%'",
    "18s: CTA: 'Try NKOM free' + link in bio"
  ],
  music: "Upbeat, African-inspired rhythm",
  caption: "When study apps finally get it 🔥 Your brain learns better when content adapts to YOU. #NKOM #StudyTok #LearnSmarter #NeuroScience",
  hashtags: ["#NKOM", "#StudyTok", "#LearnSmarter", "#EdTech", "#NeuroscienceStudying", "#FYP", "#For You"]
};

/**
 * TIKTOK VIDEO 2: "This is what Aberkane said..." Educational Series
 * Format: Text-based with visuals
 * Strategy: Quote-driven education about learning principles
 */
export const TikTokQuoteTemplate = {
  principle: 4,
  quote: "Wonder is the engine of learning. Schools trade it for conformity.",
  author: "Idriss Aberkane",
  duration: "20 seconds",
  scenes: [
    "0-3s: Quote appears on screen with animation",
    "3-8s: Show school classroom (conformity) ❌",
    "8-13s: Show NKOM learning (wonder) ✓",
    "13-18s: Quick cuts of curiosity hooks, discoveries",
    "18-20s: CTA with link"
  ],
  caption: "This changed everything about how I study 📚✨ #NKOM #Aberkane #LearningScience",
  hashtags: ["#NKOM", "#NeuroScience", "#StudyMotivation", "#LearnSmarter", "#Viral", "#FYP"]
};

// ========== LINKEDIN TEMPLATES ==========

/**
 * LINKEDIN POST 1: Thought Leadership
 * Format: Rich text + image carousel
 * Audience: Educators, Parents, Professionals
 */
export const LinkedInThoughtLeadershipPost = `
🧠 The 7 Principles That Change Everything About Learning

Did you know that schools are using methods that fight against how our brains actually work?

Idriss Aberkane's research shows that effective learning comes from 7 key principles:

1️⃣ Neuroergonomics — Content adapts to the brain, not vice versa
2️⃣ Mental Handles — Complex ideas need "hooks" our brain can grab
3️⃣ Play as Learning — The brain learns through play, not punishment
4️⃣ Wonder — Curiosity is the engine, not compliance
5️⃣ Joy — Learning should feel good, not obligatory
6️⃣ Memory Palaces — Spatial memory is 10x more powerful
7️⃣ Knowledge Economy — Teaching deepens your own learning

Most ed-tech ignores these principles. We built NKOM around them.

The result? Students retain 90% of what they study, not 10%.

What principle resonates most with you?

#NeuroScience #Education #Learning #Aberkane #EdTech #NKOM
`;

/**
 * LINKEDIN ARTICLE: "Why Your Study App Isn't Working"
 * Format: Full article with data
 * Targets: Professionals, Educators, Parents
 */
export const LinkedInArticleOutline = {
  title: "Why Your Study App Isn't Working: The Science Behind NKOM",
  sections: [
    {
      heading: "The Problem: Information ≠ Knowledge",
      key_stat: "Most students forget 90% of what they study within 3 days"
    },
    {
      heading: "Seven Principles That Work",
      subsections: ["Neuroergonomics", "Mental Handles", "Play", "Wonder", "Joy", "Memory Palaces", "Knowledge Economy"]
    },
    {
      heading: "The Science: Aberkane + Dehaene",
      key_stat: "Peer-reviewed neuroscience shows 4x better retention with these principles"
    },
    {
      heading: "NKOM: Implementation",
      key_stat: "Students using NKOM achieve 90% retention vs 10% with traditional methods"
    },
    {
      heading: "Call to Action",
      cta: "Try NKOM free for 14 days. No credit card required."
    }
  ]
};

// ========== TWITTER/X TEMPLATES ==========

/**
 * TWITTER THREAD: "Learning Science 101"
 * Strategy: Educational thread proving differentiation
 */
export const TwitterThreadTemplate = [
  {
    tweet_number: 1,
    text: "Thread: Your study app is fighting against your brain. Here's why. 🧠",
    image_text: "Brain illustration with X (wrong)"
  },
  {
    tweet_number: 2,
    text: "Most apps give you: 'Here's information.' Your brain: 'Cool, I'll forget 90% tomorrow.'",
    image_text: "Forgetting curve visualization"
  },
  {
    tweet_number: 3,
    text: "Neuroscience says learning comes from 7 principles, not features. Aberkane called it 'neuro-ergonomics.'",
    image_text: "The 7 principles list"
  },
  {
    tweet_number: 4,
    text: "1. Neuroergonomics: Content adapts to you, not the other way.\n2. Mental Handles: Complex ideas need 'grips' your brain can grab.\n3. Play: Learning happens through games, not punishment.",
    image_text: "Principle icons"
  },
  {
    tweet_number: 5,
    text: "4. Wonder: Curiosity > compliance\n5. Joy: Learning should feel good\n6. Memory Palaces: Spatial memory ftw\n7. Knowledge Economy: Teaching = deeper learning",
    image_text: "Principle icons continued"
  },
  {
    tweet_number: 6,
    text: "Result: When you build an app around these 7 principles, students retain 90% instead of 10%.\n\nWe built NKOM around them.",
    image_text: "Retention comparison chart"
  },
  {
    tweet_number: 7,
    text: "Join 10K+ students learning smarter. 🚀\n\nnkom.io/free",
    image_text: "App screenshot or call-to-action visual"
  }
];

/**
 * TWITTER QUICK POSTS: Daily Tips Series
 * Format: Single tweet with image
 * Frequency: 3x per week
 */
export const TwitterDailyTipsTemplates = [
  {
    principle: "Neuroergonomics",
    tip: "Your brain learns 3x faster when content is in your preferred format. Visual? Auditory? NKOM adapts.",
    emoji: "🧠",
    hashtags: "#NKOM #LearnSmarter"
  },
  {
    principle: "Mental Handles",
    tip: "Complex concepts need 'handles.' That's why NKOM generates analogies, stories & mnemonics for every topic.",
    emoji: "🎯",
    hashtags: "#StudyTips #NeuroScience"
  },
  {
    principle: "Play as Learning",
    tip: "Your brain's natural learning mode is PLAY, not sitting still. That's why NKOM has XP, streaks, achievements.",
    emoji: "🎮",
    hashtags: "#NKOM #Gamification"
  },
  {
    principle: "Wonder",
    tip: "Schools kill curiosity for compliance. NKOM does the opposite. Every lesson starts with a question that makes you WANT to learn.",
    emoji: "💡",
    hashtags: "#Education #Learning"
  },
  {
    principle: "Joy",
    tip: "Learning shouldn't hurt. NKOM celebrates every win, no punishment. Your brain works 2x better when it feels good.",
    emoji: "✨",
    hashtags: "#MentalHealth #StudyMotivation"
  },
  {
    principle: "Memory Palaces",
    tip: "Forget rote memorization. NKOM builds memory palaces (spatial memory = 10x retention). You'll remember forever.",
    emoji: "🏛️",
    hashtags: "#MemoryTechniques #StudyHacks"
  },
  {
    principle: "Knowledge Economy",
    tip: "Teaching deepens YOUR learning. NKOM has a 'teach-back' mode where you explain concepts & deepen understanding.",
    emoji: "👥",
    hashtags: "#CommunityLearning #NKOM"
  }
];

// ========== EXPORT READY TEMPLATES ==========

export const SocialMediaExportGuide = {
  instagram: {
    feed_post: "1080x1350px (vertical)",
    story: "1080x1920px",
    reel: "1080x1920px, 15-90 seconds",
    carousel: "1080x1350px per slide, max 10 slides",
    recommended_frequency: "3-4x per week"
  },
  tiktok: {
    short_form: "1080x1920px, 15-60 seconds",
    recommended_frequency: "Daily or every other day",
    best_times: "6-9pm local time"
  },
  linkedin: {
    article: "Article format (1500-2500 words)",
    carousel: "1200x600px per slide",
    recommended_frequency: "2-3x per week",
    best_times: "Tuesday-Thursday, 8am-10am"
  },
  twitter: {
    image: "1200x675px (16:9 ratio)",
    thread: "Multi-tweet connected",
    recommended_frequency: "3-5x per day"
  }
};

export default SocialMediaExportGuide;
