import request from 'supertest'
import app from '../app'

describe('Rooms routes', () => {
    it('return 401 if accessing protected rooms route with no token', async () => {
        const response = await request(app).get('/rooms')
        expect(response.status).toBe(401)
    })

    it('return 200 if valid token is provided when accessing rooms route', async () => {
        const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzI2MjEzNzQyLCJleHAiOjE3MjYyMTczNDJ9.Sj2SFskB8XxA5krGuZT1sNO8QOQSSfEWIicRONWysUU'
        const response = await request(app)
            .get('/rooms')
            .set('Authorization', `Bearer ${validToken}`)
        expect(response.status).toBe(200)
    })
})
