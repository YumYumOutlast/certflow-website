export const posts = [];
export function getPostBySlug(slug) { return posts.find(p => p.slug === slug) || null; }
export function getAllPosts() { return [...posts].sort((a, b) => a.date < b.date ? 1 : -1); }