const hello = require('../scripts/hello')

describe('hello function', () => {

    it('should say hello', async () => {
        let x = hello()
        expect(x).toBe("hello")
    });
    
});
