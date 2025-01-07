jest.mock('nanoid', () => {
    return {
        nanoid: () => 'ABCDEFZ'
    }
})