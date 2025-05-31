export interface ProcessedTextSegment {
  type: 'spoken' | 'stripped';
  content: string;
  originalContent?: string;
}

export interface ProcessedText {
  spokenText: string;
  segments: ProcessedTextSegment[];
  wasStripped: boolean;
}

/**
 * Process text for TTS by stripping code blocks, function calls, and symbols
 * Returns both the cleaned text and segments for display
 */
export function processTextForTTS(text: string, maxChars?: number): ProcessedText {
  const segments: ProcessedTextSegment[] = [];
  
  // Patterns to strip from voice output
  const strippablePatterns = [
    // Code blocks
    { regex: /```[\s\S]*?```/g, name: 'code_block' },
    // Inline code
    { regex: /`[^`]+`/g, name: 'inline_code' },
    // Function calls - XML style tags
    { regex: /<function_calls[\s\S]*?<\/function_calls>/g, name: 'function_calls' },
    { regex: /<invoke[\s\S]*?<\/invoke>/g, name: 'invoke' },
    { regex: /<parameter[\s\S]*?<\/parameter>/g, name: 'parameter' }
  ];
  
  let workingText = text;
  let allMatches: Array<{ match: RegExpMatchArray; type: string }> = [];
  
  // Find all matches from all patterns
  strippablePatterns.forEach(pattern => {
    const matches = Array.from(workingText.matchAll(pattern.regex));
    matches.forEach(match => {
      if (match.index !== undefined) {
        allMatches.push({ match, type: pattern.name });
      }
    });
  });
  
  // Sort matches by position
  allMatches.sort((a, b) => a.match.index! - b.match.index!);
  
  let lastIndex = 0;
  
  // Process each match in order
  allMatches.forEach(({ match }) => {
    const startIndex = match.index!;
    
    // Add text before this match as spoken content
    if (startIndex > lastIndex) {
      const beforeText = text.slice(lastIndex, startIndex);
      if (beforeText.trim()) {
        segments.push({
          type: 'spoken',
          content: beforeText
        });
      }
    }
    
    // Add the match as stripped content
    segments.push({
      type: 'stripped',
      content: '', // Empty for TTS
      originalContent: match[0]
    });
    
    lastIndex = startIndex + match[0].length;
  });
  
  // Add remaining text after last match
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText.trim()) {
      segments.push({
        type: 'spoken',
        content: remainingText
      });
    }
  }
  
  // If no matches found, treat entire text as spoken
  if (allMatches.length === 0) {
    segments.push({
      type: 'spoken',
      content: text
    });
  }
  
  // Clean up spoken segments by removing unwanted symbols
  const cleanedSegments = segments.map(segment => {
    if (segment.type === 'stripped') {
      return segment;
    }
    
    // Remove symbols but preserve sentence structure
    let cleanContent = segment.content
      // Remove angle brackets and other programming symbols
      .replace(/[<>{}\[\]=+\-*/\\|&^%$#@!~;]/g, ' ')
      // Keep basic punctuation for natural speech
      .replace(/\s+/g, ' ')
      .trim();
    
    return {
      ...segment,
      content: cleanContent
    };
  });
  
  // Build final spoken text
  let spokenText = cleanedSegments
    .filter(segment => segment.type === 'spoken' && segment.content.trim())
    .map(segment => segment.content.trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Apply character limit if specified
  if (maxChars && spokenText.length > maxChars) {
    spokenText = spokenText.slice(0, maxChars - 3) + '...';
  }
  
  return {
    spokenText,
    segments: cleanedSegments,
    wasStripped: cleanedSegments.some(s => s.type === 'stripped')
  };
}
