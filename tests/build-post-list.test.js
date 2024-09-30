const { existsSync, readdirSync,statSync,readFileSync, writeFileSync, mkdirSync, rmSync } = require('fs');
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

    // Create blog directory with a release note
    mkdirSync(join(tempDir, 'blog'), { recursive: true });
    writeFileSync(join(tempDir, 'blog', 'release-notes-2.1.0.mdx'), '---\ntitle: Release Notes 2.1.0\n---\nThis is a release note.');

    // Create docs directory with an index file
    mkdirSync(join(tempDir, 'docs'), { recursive: true });
    writeFileSync(join(tempDir, 'docs', 'index.mdx'), '---\ntitle: Docs Home\n---\nThis is the documentation homepage.');

    // Create about directory with an index file
    mkdirSync(join(tempDir, 'about'), { recursive: true });
    writeFileSync(join(tempDir, 'about', 'index.mdx'), '---\ntitle: About Us\n---\nThis is the about page.');

    // Create directories for specification files
    mkdirSync(join(tempDir, 'docs', 'reference', 'specification'), { recursive: true });
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

  it('handles a directory with only section files', async () => {
    mkdirSync(join(tempDir, 'docs', 'section1'), { recursive: true });
    writeFileSync(join(tempDir, 'docs', 'section1', '_section.mdx'), '---\ntitle: Section 1\n---\nThis is section 1.');

    await buildPostList(postDirectories, tempDir, writeFilePath);
    
    const output = JSON.parse(readFileSync(writeFilePath, 'utf-8'));
    
    expect(output.docs.length).toBeGreaterThan(0);
    expect(output.docs.find(item => item.title === 'Section 1')).toBeDefined();
  });

  it('handles multiple release notes correctly', async () => {
    writeFileSync(join(tempDir, 'blog', 'release-notes-2.1.1.mdx'), '---\ntitle: Release Notes 2.1.1\n---\nThis is a release note.');

    await buildPostList(postDirectories, tempDir, writeFilePath);

    const output = JSON.parse(readFileSync(writeFilePath, 'utf-8'));

    const firstReleaseNote = output.blog.find(item => item.slug === '/blog/release-notes-2.1.0');
    const secondReleaseNote = output.blog.find(item => item.slug === '/blog/release-notes-2.1.1');

    expect(firstReleaseNote).toBeDefined();
    expect(firstReleaseNote.title).toBe('Release Notes 2.1.0');

    expect(secondReleaseNote).toBeDefined();
    expect(secondReleaseNote.title).toBe('Release Notes 2.1.1');
  });

  // it('handles specification files correctly', async () => {
  //   mkdirSync(join(tempDir, 'docs', 'reference', 'specification'), { recursive: true });
  //   writeFileSync(join(tempDir, 'docs', 'reference', 'specification', 'v2.0.0.mdx'), '# Specification v2.0.0');
  //   writeFileSync(join(tempDir, 'docs', 'reference', 'specification', 'v2.1.0-next-spec.1.mdx'), '# Specification v2.1.0-next-spec.1');
  //   writeFileSync(join(tempDir, 'docs', 'reference', 'specification', 'v3.0.0-explorer.mdx'), '# Specification v3.0.0 Explorer');

  //   await buildPostList(modifiedPostDirectories, tempDir, writeFilePath);
    
  //   const output = JSON.parse(readFileSync(writeFilePath, 'utf-8'));
    

  //   const spec200 = output.docs.find(item => item.slug === '/docs/reference/specification/v2.0.0');
  //   console.log('spec200:', spec200);
  //   expect(spec200).toBeDefined();
  //   expect(spec200.title).toBe('2.0.0');
  //   expect(spec200.weight).toBeLessThan(100);

  //   const spec210Next = output.docs.find(item => item.slug === '/docs/reference/specification/v2.1.0-next-spec.1');
  //   console.log('spec210Next:', spec210Next);
  //   expect(spec210Next).toBeDefined();
  //   expect(spec210Next.title).toBe('2.1.0 (Pre-release)');
  //   expect(spec210Next.isPrerelease).toBe(true);

  //   const spec300Explorer = output.docs.find(item => item.slug === '/docs/reference/specification/v3.0.0-explorer');
  //   console.log('spec300Explorer:', spec300Explorer);
  //   expect(spec300Explorer).toBeDefined();
  //   expect(spec300Explorer.title).toBe('3.0.0 - Explorer');
  // });

  it('handles errors gracefully', async () => {
    const invalidDir = [join(tempDir, 'non-existent-dir'), '/invalid'];
    await expect(buildPostList([invalidDir], tempDir, writeFilePath)).rejects.toThrow();
  });
});