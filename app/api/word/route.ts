import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";

import bcryptjs from 'bcryptjs' 

const prisma=new PrismaClient();


const sampleWords = [
    'apple', 'banana', 'orange', 'grape', 'kiwi', 'strawberry',
    'car', 'truck', 'bicycle', 'motorcycle', 'bus', 'train',
    'house', 'apartment', 'tent', 'cabin', 'villa', 'building',
    'happy', 'sad', 'angry', 'excited', 'calm', 'confused',
    'run', 'walk', 'jump', 'swim', 'climb', 'drive',
    'dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster',
    'mountain', 'river', 'lake', 'ocean', 'forest', 'desert',
    'book', 'magazine', 'newspaper', 'letter', 'novel', 'story',
    'computer', 'phone', 'tablet', 'television', 'camera', 'watch',
    'music', 'movie', 'song', 'dance', 'art', 'painting',
    'football', 'basketball', 'soccer', 'tennis', 'golf', 'swimming',
    'doctor', 'teacher', 'engineer', 'chef', 'artist', 'athlete',
    'friend', 'family', 'neighbor', 'stranger', 'colleague', 'partner',
    'love', 'hate', 'dream', 'hope', 'fear', 'surprise',
    'sun', 'moon', 'star', 'cloud', 'rain', 'snow',
    'light', 'dark', 'hot', 'cold', 'fast', 'slow',
  'quick', 'slowly', 'rapidly', 'easily', 'hardly', 'gently',
  'beautiful', 'ugly', 'small', 'big', 'tiny', 'huge',
  'young', 'old', 'new', 'ancient', 'modern', 'future',
  'bright', 'dark', 'loud', 'quiet', 'sweet', 'sour',
  'sharp', 'blunt', 'smooth', 'rough', 'soft', 'hard',
  'happy', 'sad', 'angry', 'excited', 'calm', 'confused',
  'brave', 'scared', 'curious', 'proud', 'ashamed', 'guilty',
  'beautiful', 'ugly', 'handsome', 'pretty', 'ugly', 'attractive',
  'small', 'big', 'tiny', 'huge', 'large', 'massive',
  'hot', 'cold', 'warm', 'cool', 'freezing', 'boiling',
  'fast', 'slow', 'quick', 'speedy', 'rapid', 'swift',
  'loud', 'quiet', 'noisy', 'silent', 'soft', 'hard',
  'run', 'walk', 'jump', 'swim', 'climb', 'crawl',
  'drive', 'ride', 'fly', 'sail', 'dive', 'ski',
  'eat', 'drink', 'cook', 'bake', 'cut', 'slice',
  'read', 'write', 'study', 'learn', 'teach', 'talk',
  'play', 'sing', 'dance', 'perform', 'act', 'direct',
  'paint', 'draw', 'sketch', 'design', 'create', 'build',
  'work', 'sleep', 'rest', 'relax', 'exercise', 'meditate',
  'and', 'but', 'or', 'so', 'yet', 'while',
  'although', 'because', 'since', 'if', 'when', 'until',
  'in', 'on', 'at', 'by', 'for', 'from',
  'to', 'into', 'onto', 'through', 'under', 'over',
  'between', 'among', 'around', 'about', 'behind', 'beside'
]



function generateRandomWords(count:any) {
    const randomWords = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * sampleWords.length);
      randomWords.push(sampleWords[randomIndex]);
    }
    return randomWords;
  }
  
 
  function generateRandomSentence(wordCount:any) {
    const randomWords = generateRandomWords(wordCount);
    const sentence = randomWords.join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  }

function generateRandomParagraph(minWords:any, maxWords:any) {
    const paragraph = [];
    const paragraphLength = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    let currentWordCount = 0;
  
    while (currentWordCount < paragraphLength) {
      const remainingWords = paragraphLength - currentWordCount;
      const sentenceLength = Math.min(Math.floor(Math.random() * remainingWords) + 10, remainingWords);
      const sentence = generateRandomSentence(sentenceLength);
      paragraph.push(sentence);
      currentWordCount += sentence.split(' ').length;
    }
  
    return paragraph.join(' ');
  }
  
  

  export async function GET(req:any) {
    const randomParagraph = generateRandomParagraph(60, 80);
    return NextResponse.json({randomParagraph},{status:200})
  }