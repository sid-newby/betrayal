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
 * Process text for TTS by stripping code blocks and symbols
 * Returns both the cleaned text and segments for display
 */
export function processTextForTTS(text: string, maxChars?: number): ProcessedText {
  const segments: ProcessedTextSegment[] = [];
  
  // Regex patterns for code detection
  const codeBlockRegex = /```[\s\S]*?```/g;
  const inlineCodeRegex = /`[^`]+`/g;
  // Reduced symbol set - preserve periods and question marks for natural speech
  const symbolsRegex = /[<>{}()[\]=+\-*/\\|&^%$#@!~;:'"]/g;
  
  // First, handle code blocks
  let processedText = text;
  let lastIndex = 0;
  
  // Process code blocks
  const codeBlocks = [...text.matchAll(codeBlockRegex)];
  codeBlocks.forEach(match => {
    const startIndex = match.index!;
    
    // Add text before code block
    if (startIndex > lastIndex) {
      const beforeText = text.slice(lastIndex, startIndex);
      segments.push({
        type: 'spoken',
        content: beforeText
      });
    }
    
    // Add code block as stripped - don't include in spoken text
    segments.push({
      type: 'stripped',
      content: '', // Empty content for TTS
      originalContent: match[0]
    });
    
    lastIndex = startIndex + match[0].length;
  });
  
  // Add remaining text after last code block
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    segments.push({
      type: 'spoken',
      content: remainingText
    });
  }
  
  // Process inline code in spoken segments
  const processedSegments: ProcessedTextSegment[] = [];
  segments.forEach(segment => {
    if (segment.type === 'stripped') {
      processedSegments.push(segment);
      return;
    }
    
    // Process inline code
    let content = segment.content;
    let segmentLastIndex = 0;
    const inlineMatches = [...content.matchAll(inlineCodeRegex)];
    
    if (inlineMatches.length === 0) {
      processedSegments.push(segment);
      return;
    }
    
    inlineMatches.forEach(match => {
      const startIndex = match.index!;
      
      // Add text before inline code
      if (startIndex > segmentLastIndex) {
        const beforeText = content.slice(segmentLastIndex, startIndex);
        processedSegments.push({
          type: 'spoken',
          content: beforeText
        });
      }
      
      // Add inline code as stripped - don't include in spoken text
      processedSegments.push({
        type: 'stripped',
        content: '', // Empty content for TTS
        originalContent: match[0]
      });
      
      segmentLastIndex = startIndex + match[0].length;
    });
    
    // Add remaining text
    if (segmentLastIndex < content.length) {
      processedSegments.push({
        type: 'spoken',
        content: content.slice(segmentLastIndex)
      });
    }
  });
  
  // Strip symbols from spoken segments
  const finalSegments = processedSegments.map(segment => {
    if (segment.type === 'stripped') {
      return segment;
    }
    
    // Remove unwanted symbols but keep punctuation for natural speech
    const strippedContent = segment.content
      .replace(symbolsRegex, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return {
      ...segment,
      content: strippedContent
    };
  });
  
  // Build spoken text - only include spoken segments
  let spokenText = finalSegments
    .filter(segment => segment.type === 'spoken' && segment.content)
    .map(segment => segment.content)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Apply max character limit if specified
  if (maxChars && spokenText.length > maxChars) {
    spokenText = spokenText.slice(0, maxChars - 3) + '...';
  }
  
  return {
    spokenText,
    segments: finalSegments,
    wasStripped: finalSegments.some(s => s.type === 'stripped')
  };
}
