const { readFileSync, rmSync, mkdirSync } = require('fs');
const { resolve } = require('path');
const { buildNewsroomVideos } = require('../scripts/build-newsroom-videos');
const { mockApiResponse, expectedResult } = require('./fixtures/newsroomData');
const fetch = require('node-fetch-2');

jest.mock('node-fetch-2', () => jest.fn());

describe('buildNewsroomVideos', () => {
    const testDir = resolve(__dirname, 'test_config');
    const testFilePath = resolve(testDir, 'newsroom_videos.json');

    beforeAll(() => {
        mkdirSync(testDir, { recursive: true });
        process.env.YOUTUBE_TOKEN = 'testkey';
    });

    afterAll(() => {
        rmSync(testDir, { recursive: true, force: true });
    });

    beforeEach(() => {
        fetch.mockClear();
    });

});
