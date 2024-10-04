const { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } = require('fs');
const { resolve, join } = require('path');
const { buildPostList, slugifyToC } = require('../scripts/build-post-list');

describe('buildPostList', () => {
  let tempDir;
  let writeFilePath;
  let postDirectories;

  beforeEach(() => {
    tempDir = resolve(__dirname, `tempTestDir_${Date.now()}`);
    writeFilePath = resolve(tempDir, 'posts.json');
    postDirectories = [
      [join(tempDir, 'blog'), '/blog'],
      [join(tempDir, 'docs'), '/docs'],
      [join(tempDir, 'about'), '/about'],
    ];

    mkdirSync(tempDir, { recursive: true });

    mkdirSync(join(tempDir, 'blog'), { recursive: true });
    writeFileSync(join(tempDir, 'blog', 'release-notes-2.1.0.mdx'), '---\ntitle: Release Notes 2.1.0\n---\nThis is a release note.');

    mkdirSync(join(tempDir, 'docs'), { recursive: true });
    writeFileSync(join(tempDir, 'docs', 'index.mdx'), '---\ntitle: Docs Home\n---\nThis is the documentation homepage.');

    mkdirSync(join(tempDir, 'about'), { recursive: true });
    writeFileSync(join(tempDir, 'about', 'index.mdx'), '---\ntitle: About Us\n---\nThis is the about page.');

    mkdirSync(join(tempDir, 'docs', 'reference', 'specification'), { recursive: true });
  });

  afterEach(() => {
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

  it('handles errors gracefully', async () => {
    const invalidDir = [join(tempDir, 'non-existent-dir'), '/invalid'];
    await expect(buildPostList([invalidDir], tempDir, writeFilePath)).rejects.toThrow();
  });

  it('handles heading ids like {# myHeadingId}', () => {
    const input = '## My Heading {#custom-id}';
    expect(slugifyToC(input)).toBe('custom-id');
  });

  it('handles heading ids like {<a name="myHeadingId"/>}', () => {
    const input = '## My Heading {<a name="custom-anchor-id"/>}';
    expect(slugifyToC(input)).toBe('custom-anchor-id');
  });

  it('handles empty strings', () => {
    expect(slugifyToC('')).toBe('');
  });

  it('handles specification files without a title correctly', async () => {
    const specDir = join(tempDir, 'docs', 'reference', 'specification')
    writeFileSync(
      join(specDir, 'v2.1.0.mdx'),
      '---\n---\nContent of specification v2.1.0.'
    )

    await buildPostList(postDirectories, tempDir, writeFilePath)

    const output = JSON.parse(readFileSync(writeFilePath, 'utf-8'))

  })

  it('handles specification files with "next-spec" in the filename correctly', async () => {
    const specDir = join(tempDir, 'docs', 'reference', 'specification')
    writeFileSync(
      join(specDir, 'v2.1.0-next-spec.1.mdx'),
      '---\n---\nContent of pre-release specification v2.1.0-next-spec.1.'
    )

    await buildPostList(postDirectories, tempDir, writeFilePath)

    const output = JSON.parse(readFileSync(writeFilePath, 'utf-8'))

  })

  it('handles specification files with "explorer" in the filename correctly', async () => {
    const specDir = join(tempDir, 'docs', 'reference', 'specification')
    writeFileSync(
      join(specDir, 'explorer.mdx'),
      '---\n---\nContent of explorer specification.'
    )

    await buildPostList(postDirectories, tempDir, writeFilePath)

    const output = JSON.parse(readFileSync(writeFilePath, 'utf-8'))

  })
});