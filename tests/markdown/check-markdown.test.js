const fs = require('fs');
const path = require('path');
const os = require('os');
const {
    validateBlogs,
    validateDocs,
    checkMarkdownFiles
} = require('../../scripts/markdown/check-markdown');

describe('Frontmatter Validator', () => {
    let tempDir;
    let mockConsoleError;

    beforeEach(done => {
        mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
        fs.mkdtemp(path.join(os.tmpdir(), 'test-config'), (err, directory) => {
            if (err) throw err;
            tempDir = directory;
            done();
        });
    });

    afterEach(done => {
        mockConsoleError.mockRestore();
        fs.rm(tempDir, { recursive: true, force: true }, done);
    });

    it('validates authors array and returns specific errors', () => {
        const frontmatter = {
            title: 'Test Blog',
            date: '2024-01-01',
            type: 'blog',
            tags: ['test'],
            cover: 'cover.jpg',
            authors: [{ name: 'John' }, { photo: 'jane.jpg' }, { name: 'Bob', photo: 'bob.jpg', link: 'not-a-url' }]
        };

        const errors = validateBlogs(frontmatter);
        expect(errors).toEqual(expect.arrayContaining([
            'Author at index 0 is missing a photo',
            'Author at index 1 is missing a name',
            'Invalid URL for author at index 2: not-a-url'
        ]));
    });

    it('validates docs frontmatter for required fields', () => {
        const frontmatter = { title: 123, weight: 'not-a-number' };
        const errors = validateDocs(frontmatter);
        expect(errors).toEqual(expect.arrayContaining([
            'Title is missing or not a string',
            'Weight is missing or not a number'
        ]));
    });

    it('checks for errors in markdown files in a directory', done => {
        fs.writeFileSync(path.join(tempDir, 'invalid.md'), `---\ntitle: Invalid Blog\n---`);
        const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

        checkMarkdownFiles(tempDir, validateBlogs);

        setTimeout(() => {
            expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Errors in file invalid.md:'));
            mockConsoleLog.mockRestore();
            done();
        }, 100);
    });

    it('returns multiple validation errors for invalid blog frontmatter', () => {
        const frontmatter = {
            title: 123,
            date: 'invalid-date',
            type: 'blog',
            tags: 'not-an-array',
            cover: ['not-a-string'],
            authors: { name: 'John Doe' }
        };
        const errors = validateBlogs(frontmatter);
        console.log(errors)

        expect(errors.length).toBeGreaterThan(3);
    });

    it('handles filesystem errors gracefully', done => {
        fs.writeFileSync(path.join(tempDir, 'test.md'), '---\ntitle: Test\n---\nContent');
        jest.spyOn(fs, 'stat').mockImplementation((path, callback) => callback(new Error('File stat error')));

        checkMarkdownFiles(tempDir, validateBlogs);

        setTimeout(() => {
            expect(mockConsoleError).toHaveBeenCalledWith('Error reading file stats:', expect.any(Error));
            fs.stat.mockRestore();
            done();
        }, 100);
    });

    it('handles errors when reading a directory', done => {
        jest.spyOn(fs, 'readdir').mockImplementation((_, callback) => {
            callback(new Error('Directory read error'));
        });
    
        checkMarkdownFiles(tempDir, validateBlogs);
    
        setTimeout(() => {
            expect(mockConsoleError).toHaveBeenCalledWith('Error reading directory:', expect.any(Error));
            fs.readdir.mockRestore();
            done();
        }, 100);
    });
    
});
