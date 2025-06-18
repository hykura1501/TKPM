module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  verbose: true,
  moduleNameMapper: {
    '^@usecases/(.*)$': '<rootDir>/src/application/usecases/$1',
    '^@dtos/(.*)$': '<rootDir>/src/application/dtos/$1',
    '^@validators/(.*)$': '<rootDir>/src/application/validators/$1',
    '^@configs/(.*)$': '<rootDir>/src/configs/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@repositories/(.*)$': '<rootDir>/src/infrastructure/repositories/$1',
  },
};