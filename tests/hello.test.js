const hello = require('./hello');

test('should log "hello"', () => {
  console.log = jest.fn();
  hello();

  expect(console.log).toHaveBeenCalledWith("hello");

  console.log.mockRestore();
});
