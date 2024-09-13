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

    it('should fetch video data and write to file', async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockApiResponse),
        });

        const result = await buildNewsroomVideos(testFilePath);

        const expectedUrl = new URL('https://youtube.googleapis.com/youtube/v3/search');
        expectedUrl.searchParams.set('key', 'testkey');
        expectedUrl.searchParams.set('part', 'snippet');
        expectedUrl.searchParams.set('channelId', 'UCIz9zGwDLbrYQcDKVXdOstQ');
        expectedUrl.searchParams.set('eventType', 'completed');
        expectedUrl.searchParams.set('type', 'video');
        expectedUrl.searchParams.set('order', 'Date');
        expectedUrl.searchParams.set('maxResults', '5');

        expect(fetch).toHaveBeenCalledWith(expectedUrl.toString());
        const response = readFileSync(testFilePath, 'utf8');
        expect(response).toEqual(expectedResult);
        expect(result).toEqual(expectedResult);
    });

});
