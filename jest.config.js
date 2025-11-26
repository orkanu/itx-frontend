export default {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', './dist', './e2e'],
  setupFilesAfterEnv: ['<rootDir>/test/__config__/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/__config__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/test/__config__/styleMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
