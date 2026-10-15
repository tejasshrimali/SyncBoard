/**
 * AI Categorization and Smart Title Generator for SyncBoard
 * Powered by Gemini 3 Flash (`gemini-3.5-flash-lite` / `gemini-flash-lite-latest`) with instant local fallback.
 */

export const CATEGORIES = [
  { id: 'all', label: 'All Clips', icon: 'Sparkles', color: 'theme-accent' },
  { id: 'code', label: 'Code & Commands', icon: 'Code2', color: '#457B9D' },
  { id: 'links', label: 'Links & URLs', icon: 'Globe', color: '#2A9D8F' },
  { id: 'notes', label: 'Notes & Thoughts', icon: 'FileText', color: '#E76F51' },
  { id: 'tasks', label: 'Tasks & Lists', icon: 'CheckSquare', color: '#F4A261' },
  { id: 'credentials', label: 'Keys & Tokens', icon: 'KeyRound', color: '#9B5DE5' },
  { id: 'snippets', label: 'Quotes & Snippets', icon: 'Quote', color: '#00BBF9' },
];

/**
 * Local Rule-based NLP classifier & title generator (0ms, 100% offline capable)
 */
function localAnalyze(rawText) {
  const text = rawText.trim();
  const lower = text.toLowerCase();
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || '';

  // 1. URL detection
  const urlRegex = /^(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9]+([-.][a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?)$/i;
  if (urlRegex.test(text) || (lines.length === 1 && /^https?:\/\//i.test(firstLine))) {
    try {
      const parsedUrl = new URL(text.startsWith('http') ? text : `https://${text}`);
      const host = parsedUrl.hostname.replace(/^www\./, '');
      const pathPart = parsedUrl.pathname.split('/').filter(Boolean).pop();
      let title = `Link: ${host}`;
      if (pathPart && pathPart.length > 2 && pathPart.length < 24) {
        title = `${host} / ${decodeURIComponent(pathPart).replace(/[-_]/g, ' ')}`;
      }
      return {
        title: title.slice(0, 40),
        category: 'links',
        contentType: 'url',
        tags: [host, 'bookmark']
      };
    } catch {
      return {
        title: `Web URL: ${firstLine.slice(0, 30)}`,
        category: 'links',
        contentType: 'url',
        tags: ['web', 'link']
      };
    }
  }

  // 2. Secret Keys / Auth Tokens / Hashes
  const keyRegex = /^(ey[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*|ghp_[a-zA-Z0-9]{36}|sk_live_[a-zA-Z0-9]+|sk_test_[a-zA-Z0-9]+|AIza[0-9A-Za-z-_]{35}|[a-f0-9]{32,64})$/i;
  if (keyRegex.test(text) || lower.includes('bearer ') || lower.includes('api_key') || lower.includes('secret_key')) {
    return {
      title: 'API Secret / Access Token',
      category: 'credentials',
      contentType: 'text',
      tags: ['credentials', 'key', 'security']
    };
  }

  // 3. JSON format
  if ((text.startsWith('{') && text.endsWith('}')) || (text.startsWith('[') && text.endsWith(']'))) {
    try {
      const parsed = JSON.parse(text);
      const keys = Object.keys(parsed);
      const title = keys.length ? `JSON Payload (${keys.slice(0, 3).join(', ')})` : 'JSON Object';
      return {
        title: title.slice(0, 40),
        category: 'code',
        contentType: 'json',
        tags: ['json', 'data', 'object']
      };
    } catch {
      // not valid json, continue
    }
  }

  // 4. Code & CLI Commands
  const codeKeywords = ['const ', 'let ', 'var ', 'function', 'import ', 'export ', 'class ', 'def ', 'SELECT ', 'INSERT ', 'UPDATE ', 'docker ', 'git ', 'npm ', 'npx ', 'pnpm ', 'yarn ', 'curl ', 'ssh ', 'sudo ', 'apt ', 'kubectl '];
  const isCommand = lines.some(l => l.startsWith('$ ') || l.startsWith('npm ') || l.startsWith('git ') || l.startsWith('curl ') || l.startsWith('docker '));
  const hasCodeKeywords = codeKeywords.some(kw => text.includes(kw));
  const hasBraces = (text.includes('{') && text.includes('}')) || (text.includes('(') && text.includes(');'));

  if (isCommand) {
    const cmdClean = firstLine.replace(/^\$\s*/, '');
    return {
      title: `Command: ${cmdClean.slice(0, 36)}`,
      category: 'code',
      contentType: 'code',
      tags: ['terminal', 'cli', cmdClean.split(' ')[0]]
    };
  }

  if (hasCodeKeywords || (lines.length > 2 && hasBraces)) {
    let language = 'code';
    if (text.includes('import ') || text.includes('const ') || text.includes('=>')) language = 'javascript';
    if (text.includes('def ') || text.includes('elif ') || text.includes('print(')) language = 'python';
    if (text.includes('SELECT ') || text.includes('FROM ')) language = 'sql';
    if (text.includes('<html') || text.includes('<div') || text.includes('</')) language = 'markup';

    const shortSnippet = firstLine.replace(/[{;}>]/g, '').trim();
    return {
      title: `Snippet: ${shortSnippet.slice(0, 35) || 'Code Snippet'}`,
      category: 'code',
      contentType: 'code',
      tags: [language, 'dev']
    };
  }

  // 5. Checklist / Tasks
  const isTask = lines.some(l => /^[-*]\s*\[[\sx]\]/i.test(l) || /^\d+\.\s+/.test(l) || /^todo:/i.test(l));
  if (isTask) {
    return {
      title: `Tasks: ${firstLine.replace(/^[-*0-9.\s[\]x]+/i, '').slice(0, 35) || 'Checklist'}`,
      category: 'tasks',
      contentType: 'markdown',
      tags: ['todo', 'checklist', `${lines.length} items`]
    };
  }

  // 6. Quote / Thought
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith('“') && text.endsWith('”')) || text.startsWith('> ')) {
    return {
      title: `Quote: ${firstLine.replace(/^[">“\s]+/g, '').slice(0, 35)}...`,
      category: 'snippets',
      contentType: 'text',
      tags: ['quote', 'inspiration']
    };
  }

  // 7. General Note / Text
  const words = firstLine.split(/\s+/).filter(Boolean);
  const cleanTitle = words.slice(0, 5).join(' ') || 'Quick Note';

  return {
    title: cleanTitle.length > 36 ? `${cleanTitle.slice(0, 33)}...` : cleanTitle,
    category: 'notes',
    contentType: 'text',
    tags: ['note', `${words.length} words`]
  };
}

// Resilient model priority chain (blazing fast flash-lite models with high availability)
const GEMINI_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

/**
 * Main AI Analyzer
 * Tries Gemini 3 Flash models with automatic fallback on busy spikes,
 * and reliable local heuristic engine if completely offline.
 */
export async function analyzeClip(content) {
  if (!content || !content.trim()) {
    return {
      title: 'Empty Clip',
      category: 'notes',
      contentType: 'text',
      tags: ['empty']
    };
  }

  const raw = content.trim();
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  // If no Gemini key, use instant local analyzer
  if (!apiKey) {
    return localAnalyze(raw);
  }

  const prompt = `You are the AI engine for "SyncBoard", a clipboard manager.
Analyze this clipboard content:
"""
${raw.slice(0, 1500)}
"""

Return ONLY a valid JSON object matching this schema without markdown fences:
{
  "title": "A short, crisp title (max 5 words, human readable)",
  "category": "one of: code, links, notes, tasks, credentials, snippets",
  "tags": ["tag1", "tag2"]
}`;

  // Try available models in order of speed and uptime
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 120,
            responseMimeType: "application/json"
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textOutput) {
          const parsed = JSON.parse(textOutput);
          return {
            title: parsed.title || localAnalyze(raw).title,
            category: parsed.category || localAnalyze(raw).category,
            contentType: localAnalyze(raw).contentType,
            tags: Array.isArray(parsed.tags) ? parsed.tags : localAnalyze(raw).tags
          };
        }
      }
    } catch {
      // Continue to next model in cascade
    }
  }

  // Fallback to local heuristic engine
  return localAnalyze(raw);
}
