import request from 'supertest';
import server from '../../src/index.js'

describe('Create url shorted', ()=>{
  test('Create url shorted', async () => {    
      const {status, body} = await request(server)
        .post('/urlShorter')
        .send(
          {
            url: "https://www.google.es",
          }
        )
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      
      expect(status).toBe(201);
      expect(body.success).toBe(true)

      global.myUrlShorterResponse = body.urlShorted
  })
})

describe('Get url shorted', ()=>{
  test('Url shorted not found', async () => {    
      const {status, body} = await request(server)
        .get('/:5')
        .send(
          {
            url: "https://www.google.es",
          }
        )
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      
      expect(status).toBe(302);
  })
})

describe('Creat url shorted', ()=>{
  test('Url shorted not found', async () => {    
      const {status, body} = await request(server)
        .get('/:555556')
        .send(
          {
            url: "https://www.google.es",
          }
        )
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      
      expect(status).toBe(302);
  })
})

describe('Creat url shorted', ()=>{
  test('Url shorted found', async () => {    
      const {status, body} = await request(server)
        .get(`/:${global.myUrlShorterResponse}`)
        .send(
          {
            url: "https://www.google.es",
          }
        )
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      
      expect(status).toBe(302);
  })
})

afterAll(async()=>{
  server.close();
})