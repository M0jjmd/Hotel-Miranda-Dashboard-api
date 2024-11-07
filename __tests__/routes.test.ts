import request from 'supertest'
import app from '../src/app'

describe('Rooms routes', () => {
    it('return 401 if accessing protected rooms route with no token', async () => {
        const response = await request(app).get('/rooms')
        expect(response.status).toBe(404)
    })
})
