/* eslint-disable no-undef */
require('dotenv').config()

const { expect } = require('chai')
const request = require('supertest')
const mongoose = require('mongoose')
const connectDB = require('../db/connect')
const User = require('../models/User')
const Balance = require('../models/Balance')

let app
let authToken
let userId

const balancePayload = {
   accountType: 'Checking',
   bankName: 'Test Bank',
   accountNumber: '1234123412341234',
   balance: 100,
   branchName: 'Main',
}

before(async function () {
   this.timeout(5000)

   process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret'
   process.env.JWT_LIFETIME = process.env.JWT_LIFETIME || '1d'

   await connectDB()

   await User.deleteOne({ email: 'barsik@google.com' }).catch(() => { })
   const user = await User.create({
      name: 'Test User',
      email: 'barsik@google.com',
      password: 'password123',
   })
   authToken = user.createJWT()
   userId = user._id.toString()

   app = require('../app')
})

after(async function () {
   if (userId) await Balance.deleteMany({ user: userId })
   await User.deleteOne({ email: 'barsik@google.com' }).catch(() => { })
   await mongoose.disconnect()
})

beforeEach(async () => {
   await Balance.deleteMany({})
})

describe('Balance CRUD', () => {
   const basePath = () => `/api/v1/users/${userId}/balances`

   describe('POST /api/v1/users/:userId/balances', () => {
      it('creates a balance', async () => {
         const res = await request(app)
            .post(basePath())
            .set('Authorization', `Bearer ${authToken}`)
            .send(balancePayload)
            .expect(201)

         expect(res.body).to.have.property('balance')
         expect(res.body.balance.accountType).to.equal(balancePayload.accountType)
         expect(res.body.balance.bankName).to.equal(balancePayload.bankName)
         expect(res.body.balance.accountNumber).to.equal(balancePayload.accountNumber)
         expect(res.body.balance.balance).to.equal(balancePayload.balance)
         expect(res.body.balance).to.have.property('_id')
         expect(res.body.balance.user).to.equal(userId)
      })

      it('returns 401 without token', async () => {
         await request(app)
            .post(basePath())
            .send(balancePayload)
            .expect(401)
      })

      it('returns 400 for invalid account type', async () => {
         const res = await request(app)
            .post(basePath())
            .set('Authorization', `Bearer ${authToken}`)
            .send({ ...balancePayload, accountType: 'Invalid' })
            .expect(400)

         expect(res.body).to.have.property('msg')
      })
   })

   describe('GET /api/v1/users/:userId/balances', () => {
      it('returns empty list when no balances', async () => {
         const res = await request(app)
            .get(basePath())
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)

         expect(res.body.balances).to.be.an('array')
         expect(res.body.balances).to.have.lengthOf(0)
      })

      it('returns all balances for user', async () => {
         await Balance.create({
            ...balancePayload,
            user: userId,
         })
         const res = await request(app)
            .get(basePath())
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)

         expect(res.body.balances).to.have.lengthOf(1)
         expect(res.body.balances[0].bankName).to.equal(balancePayload.bankName)
      })
   })

   describe('GET /api/v1/users/:userId/balances/:balanceId (details)', () => {
      it('returns balance details with transactions list', async () => {
         const created = await Balance.create({
            ...balancePayload,
            user: userId,
         })
         const res = await request(app)
            .get(`${basePath()}/${created._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)

         expect(res.body).to.have.property('balanceInfo')
         expect(res.body).to.have.property('transactions')
         expect(res.body).to.have.property('total')
         expect(res.body.balanceInfo._id).to.equal(created._id.toString())
         expect(res.body.balanceInfo.bankName).to.equal(balancePayload.bankName)
      })

      it('returns 404 for non-existent balanceId', async () => {
         const fakeId = new mongoose.Types.ObjectId()
         const res = await request(app)
            .get(`${basePath()}/${fakeId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(404)

         expect(res.body).to.have.property('msg')
      })
   })

   describe('PATCH /api/v1/users/:userId/balances/:id', () => {
      it('updates a balance', async () => {
         const created = await Balance.create({
            ...balancePayload,
            user: userId,
         })
         const res = await request(app)
            .patch(`${basePath()}/${created._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ bankName: 'Updated Bank', balance: 200 })
            .expect(200)

         expect(res.body.balance.bankName).to.equal('Updated Bank')
         expect(res.body.balance.balance).to.equal(200)
      })

      it('returns 404 for non-existent id', async () => {
         const fakeId = new mongoose.Types.ObjectId()
         await request(app)
            .patch(`${basePath()}/${fakeId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ bankName: 'X' })
            .expect(404)
      })
   })

   describe('DELETE /api/v1/users/:userId/balances/:id', () => {
      it('deletes a balance', async () => {
         const created = await Balance.create({
            ...balancePayload,
            user: userId,
         })
         const res = await request(app)
            .delete(`${basePath()}/${created._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)

         expect(res.body.message).to.equal('Balance removed')

         const found = await Balance.findById(created._id)
         expect(found).to.be.null
      })

      it('returns 404 for non-existent id', async () => {
         const fakeId = new mongoose.Types.ObjectId()
         await request(app)
            .delete(`${basePath()}/${fakeId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(404)
      })
   })
})
