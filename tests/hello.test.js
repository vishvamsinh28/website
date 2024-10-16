const { describe } = require('node:test')
const hello = require('../scripts/hello')

describe('hello test', () => {
    test('should check hello function', () => {
        let x = hello("mike")
        expect(x).toContain("mike")
    })
})
