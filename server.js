const express = require('express');
const fs      = require('fs');
const path    = require('path');
const https   = require('https');

const app = express();
const ROOT = __dirname;
const PORT = 3000;

// ── Static files ────────────────────────────────────
app.use(express.static(ROOT, {
  index: 'index.html',
  extensions: ['html']
}));

// ── Helpers ─────────────────────────────────────────
const CATEGORY_META = {
  'linked-list':         { name: 'Linked List',         icon: '🔗' },
  'dynamic-programming': { name: 'Dynamic Programming', icon: '📊' },
  'binary-search':       { name: 'Binary Search',       icon: '🔍' },
  'tree':                { name: 'Tree',                 icon: '🌲' },
  'two-pointers':        { name: 'Two Pointers',         icon: '👆' },
  'sliding-window':      { name: 'Sliding Window',       icon: '🪟' },
  'stack-queue':         { name: 'Stack & Queue',        icon: '📚' },
  'graph':               { name: 'Graph',                icon: '🕸️' },
  'heap':                { name: 'Heap',                 icon: '🏔️' },
  'math':                { name: 'Math',                 icon: '🔢' },
  'string':              { name: 'String',               icon: '🔤' },
  'hash-table':          { name: 'Hash Table',           icon: '🗂️' },
};

const PROBLEM_TITLES = {
  4:   'Median of Two Sorted Arrays', 15: '3Sum',
  21:  'Merge Two Sorted Lists',      33: 'Search in Rotated Sorted Array',
  70:  'Climbing Stairs',             102:'Binary Tree Level Order Traversal',
  104: 'Maximum Depth of Binary Tree',125:'Valid Palindrome',
  142: 'Linked List Cycle II',        322:'Coin Change',
  704: 'Binary Search',
};

function parseFilename(fname) {
  const m = fname.match(/^(easy|medium|hard)_(\d+)(?:_(\d+))?\.py$/);
  if (!m) return null;
  return { difficulty: m[1], id: parseInt(m[2]), solIdx: m[3] ? parseInt(m[3]) : null };
}

function scanCategories() {
  const codeDir = path.join(ROOT, 'code');
  if (!fs.existsSync(codeDir)) return [];

  return fs.readdirSync(codeDir)
    .filter(n => fs.statSync(path.join(codeDir, n)).isDirectory())
    .sort()
    .map(slug => {
      const meta = CATEGORY_META[slug] || { name: slug.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase()), icon: '📝' };
      const probsMap = {};

      const dir = path.join(codeDir, slug);
      fs.readdirSync(dir).filter(f => f.endsWith('.py')).sort().forEach(fname => {
        const p = parseFilename(fname);
        if (!p) return;
        if (!probsMap[p.id]) {
          probsMap[p.id] = {
            id: p.id, difficulty: p.difficulty,
            title: probCache[p.id]?.title || PROBLEM_TITLES[p.id] || `Problem ${p.id}`,
            solutions: []
          };
        }
        probsMap[p.id].solutions.push({
          file: `code/${slug}/${fname}`,
          label: p.solIdx ? `解法 ${p.solIdx}` : '解法 1'
        });
      });

      const problems = Object.values(probsMap).sort((a, b) => a.id - b.id);
      return problems.length ? { name: meta.name, icon: meta.icon, slug, problems } : null;
    })
    .filter(Boolean);
}

const NOTE_CATEGORY_META = {
  'patterns':       { name: '演算法模板', icon: '📐' },
  'data-structures':{ name: '資料結構',   icon: '🗂️' },
  'algorithms':     { name: '演算法',     icon: '⚡' },
  'tips':           { name: '解題技巧',   icon: '💡' },
  'problem-types':  { name: '題型分析',   icon: '📋' },
};

function scanNotes() {
  const noteDir = path.join(ROOT, 'note');
  if (!fs.existsSync(noteDir)) return [];

  const categories = [];
  for (const entry of fs.readdirSync(noteDir).sort()) {
    const full = path.join(noteDir, entry);
    if (!fs.statSync(full).isDirectory()) continue;

    const meta = NOTE_CATEGORY_META[entry] || {
      name: entry.replace(/-/g,' ').replace(/\b\w/g, c=>c.toUpperCase()),
      icon: '📁'
    };
    const notes = [];
    for (const fname of fs.readdirSync(full).filter(f=>f.endsWith('.md')).sort()) {
      const slug = fname.replace('.md','');
      const filePath = path.join(full, fname);
      let title = slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
      let preview = '';
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const firstH = content.match(/^#+\s+(.+)$/m);
        if (firstH) title = firstH[1].trim();
        // Strip markdown syntax for preview
        preview = content.replace(/```[\s\S]*?```/g,'').replace(/[#*`>\-|]/g,'').replace(/\s+/g,' ').slice(0,200);
      } catch(_) {}
      notes.push({ title, slug, file: `note/${entry}/${fname}`, preview });
    }
    if (notes.length) categories.push({ name: meta.name, icon: meta.icon, slug: entry, notes });
  }
  return categories;
}


function getDailyFromFiles() {
  const daily = {};
  const codeDir = path.join(ROOT, 'code');
  if (!fs.existsSync(codeDir)) return daily;

  function walk(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (entry.endsWith('.py')) {
        // birthtime = file creation time; fallback to mtime on Linux
        const created = stat.birthtime && stat.birthtime.getFullYear() > 1970
          ? stat.birthtime : stat.mtime;
        const ds = created.toISOString().slice(0, 10);
        daily[ds] = (daily[ds] || 0) + 1;
      }
    }
  }
  walk(codeDir);
  return daily;
}

// ── LeetCode Problem Cache ──────────────────────────
const DATA_DIR = path.join(ROOT, 'data');
const PROB_CACHE_FILE = path.join(DATA_DIR, 'problems-cache.json');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
let probCache = {};
try { probCache = JSON.parse(fs.readFileSync(PROB_CACHE_FILE, 'utf-8')); } catch(_){}

function titleToSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function fetchLC(slug) {
  const body = JSON.stringify({
    operationName: 'questionData',
    variables: { titleSlug: slug },
    query: `query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId title content difficulty
        topicTags { name }
      }
    }`
  });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'leetcode.com', path: '/graphql', method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer':      `https://leetcode.com/problems/${slug}/`,
        'Origin':       'https://leetcode.com',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)?.data?.question || null); }
        catch(e) { reject(new Error('parse error')); }
      });
    });
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

// Parse top-comment block from a .py file as fallback description
function parseFileComment(filePath) {
  try {
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
    const comments = [];
    for (const line of lines) {
      if (line.startsWith('#')) comments.push(line.replace(/^#\s?/, ''));
      else if (comments.length) break;  // stop at first non-comment
    }
    return comments.join('\n').trim() || null;
  } catch(_) { return null; }
}

app.get('/api/problem/:id', async (req, res) => {
  const id = req.params.id;
  if (probCache[id]) return res.json(probCache[id]);

  const numId = parseInt(id);
  try {
    const matched = await fetchLCSlugById(numId);
    if (matched) {
      const q = await fetchLC(matched.titleSlug);
      if (q) {
        const result = { ...q, slug: matched.titleSlug };
        probCache[id] = result;
        fs.writeFileSync(PROB_CACHE_FILE, JSON.stringify(probCache, null, 2));
        return res.json(result);
      }
    }
  } catch(_) {}

  // Fallback: parse comment from first solution file found
  const cats = scanCategories();
  let comment = null;
  for (const cat of cats) {
    const p = cat.problems.find(x => x.id === numId);
    if (p && p.solutions.length) {
      comment = parseFileComment(path.join(ROOT, p.solutions[0].file));
      break;
    }
  }
  const title = PROBLEM_TITLES[numId] || `Problem ${numId}`;
  const slug = titleToSlug(title);
  return res.json({ title, difficulty: null, slug, content: null, topicTags: [], fileComment: comment });
});

function fetchLCSlugById(id) {
  const body = JSON.stringify({
    operationName: 'problemsetQuestionList',
    variables: {
      categorySlug: '',
      limit: 5,
      skip: 0,
      filters: { searchKeywords: String(id) }
    },
    query: `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
      problemsetQuestionList: questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
      ) {
        questions: data {
          frontendQuestionId: questionFrontendId
          title
          titleSlug
        }
      }
    }`
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'leetcode.com', path: '/graphql', method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer':      'https://leetcode.com/problemset/all/',
        'Origin':       'https://leetcode.com',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const questions = parsed?.data?.problemsetQuestionList?.questions || [];
          const matched = questions.find(q => String(q.frontendQuestionId) === String(id));
          resolve(matched || null);
        }
        catch(e) { reject(e); }
      });
    });
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

async function prefetchMissingDescriptions() {
  const categories = scanCategories();
  const idsToFetch = [];
  for (const cat of categories) {
    for (const p of cat.problems) {
      if (!probCache[p.id]) {
        idsToFetch.push(p);
      }
    }
  }

  if (idsToFetch.length === 0) {
    console.log('[Cache] All problem descriptions are already cached.');
    return;
  }

  console.log(`[Cache] Found ${idsToFetch.length} missing problem descriptions. Prefetching in background...`);
  
  for (const p of idsToFetch) {
    try {
      console.log(`[Cache] Fetching description for #${p.id}...`);
      const matched = await fetchLCSlugById(p.id);
      if (matched) {
        const q = await fetchLC(matched.titleSlug);
        if (q) {
          probCache[p.id] = { ...q, slug: matched.titleSlug };
          fs.writeFileSync(PROB_CACHE_FILE, JSON.stringify(probCache, null, 2));
          console.log(`[Cache] Successfully cached #${p.id} (${matched.title}).`);
        }
      } else {
        console.log(`[Cache] Could not find LeetCode problem with ID #${p.id}.`);
      }
    } catch (err) {
      console.error(`[Cache] Failed to fetch description for #${p.id}: ${err.message}`);
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  console.log('[Cache] Background prefetch complete.');
}

// ── API ──────────────────────────────────────────────
app.get('/api/index', (req, res) => {
  const categories = scanCategories();
  const notes = scanNotes();
  const daily = getDailyFromFiles();

  let total = 0, easy = 0, medium = 0, hard = 0;
  const byCategory = {};
  for (const cat of categories) {
    byCategory[cat.name] = cat.problems.length;
    for (const p of cat.problems) {
      total++;
      if (p.difficulty === 'easy') easy++;
      else if (p.difficulty === 'medium') medium++;
      else hard++;
    }
  }

  res.json({
    generated_at: new Date().toISOString(),
    categories, notes,
    stats: { total, easy, medium, hard, by_category: byCategory, daily }
  });
});

// ── Start ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  LeetCode Notes running at http://localhost:${PORT}\n`);
  prefetchMissingDescriptions();
});
