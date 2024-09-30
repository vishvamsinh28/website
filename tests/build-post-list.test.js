const { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } = require('fs');
const { resolve, join } = require('path');
const buildPostList = require('../scripts/build-post-list');

describe('buildPostList', () => {
  const tempDir = resolve(__dirname, 'tempTestDir');
  const writeFilePath = resolve(tempDir, 'posts.json');
  const postDirectories = [
    [join(tempDir, 'blog'), '/blog'],
    [join(tempDir, 'docs'), '/docs'],
    [join(tempDir, 'about'), '/about'],
  ];

  beforeAll(() => {
    mkdirSync(tempDir, { recursive: true });

    mkdirSync(join(tempDir, 'blog'), { recursive: true });
    writeFileSync(join(tempDir, 'blog', 'release-notes-2.1.0.mdx'), '---\ntitle: Release Notes 2.1.0\n---\nThis is a release note.');

    mkdirSync(join(tempDir, 'docs'), { recursive: true });
    writeFileSync(join(tempDir, 'docs', 'index.mdx'), '---\ntitle: Docs Home\n---\nThis is the documentation homepage.');

    mkdirSync(join(tempDir, 'about'), { recursive: true });
    writeFileSync(join(tempDir, 'about', 'index.mdx'), '---\ntitle: About Us\n---\nThis is the about page.');
  });

  afterAll(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('builds a post list and writes the result to a file', async () => {
    await buildPostList(postDirectories, tempDir, writeFilePath);

    const outputExists = existsSync(writeFilePath);
    expect(outputExists).toBe(true);

    const output = JSON.parse(readFileSync(writeFilePath, 'utf-8'));

    expect(output).toHaveProperty('docs');
    expect(output).toHaveProperty('blog');
    expect(output).toHaveProperty('about');
    expect(output).toHaveProperty('docsTree');

    const blogEntry = output.blog.find(item => item.slug === '/blog/release-notes-2.1.0');
    expect(blogEntry).toBeDefined();
    expect(blogEntry.title).toBe('Release Notes 2.1.0');
  });
});
