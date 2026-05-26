import { Router } from 'express';

const router = Router();
let cachedStats = null;
let cacheTimestamp = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 min

router.get('/stats', async (req, res, next) => {
  try {
    const now = Date.now();
    if (cachedStats && now - cacheTimestamp < CACHE_TTL) {
      return res.json(cachedStats);
    }

    const username = process.env.GITHUB_USERNAME;
    if (!username) {
      return res.json({ repos: 0, stars: 0, contributions: 0, pinnedRepos: [], avatar_url: null });
    }

    const headers = process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'User-Agent': 'command-center' }
      : { 'User-Agent': 'command-center' };

    const repoRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
    const repos = await repoRes.json();

    const avatar_url = repos.length > 0 ? repos[0].owner.avatar_url : null;

    const stats = {
      repos: repos.length,
      stars: repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0),
      contributions: 0,
      avatar_url: avatar_url,
      pinnedRepos: repos
        .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        .slice(0, 6)
        .map((r) => ({
          name: r.name,
          description: r.description || '',
          language: r.language || 'Unknown',
          stars: r.stargazers_count,
          forks: r.forks_count,
          url: r.html_url,
        })),
    };

    cachedStats = stats;
    cacheTimestamp = now;
    res.json(stats);
  } catch (err) { next(err); }
});

export default router;
