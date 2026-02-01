/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest'
import { app } from '../../app'
import type { DataSource } from 'typeorm';
import  AppDataSource  from '../../data.source';

import { Role } from '../../constrant';
import { User } from '../../Entity/User.entiry';
import { response } from 'express';
import { isjwt, } from '../../utils/index';
import { RefreshToken } from '../../Entity/RefreshToken';
describe('POST /auth/register', () => {
  // agar test thoda slow ho, timeout set karo
  let connection: DataSource;
  beforeAll(async () => {
    connection = await AppDataSource.initialize()
  })
  beforeEach(async () => {
    await connection.dropDatabase()
    await connection.synchronize()
    //  await truncateTable(connection);
  })
  afterAll(async () => {
    await connection.destroy()
  })
  describe('given all fields', () => {

    it('should check the json status code and message', async () => {

      // arrange
      const userdata = {
        firstName: "karan",
        lastName: "s",
        email: "karan@12.com",
        password: "secret"
      }
      // act
      const response = await request(app)
        .post('/auth/register')
        .send(userdata)
      // assert
      expect(response.statusCode).toBe(201)
      //expect(response.body).toEqual({ msg: "kran" }) // ✅ uncomment and check message
    })
    it('should the persists the user in the database', async () => {
      // arrenge
      const userdata = {
        firstName: "karan",
        lastName: "s",
        email: "karan@12.com",
        password: "secret"
      }
      // act
      await request(app).post('/auth/register').send(userdata)
      //expect 
      const userrepository = connection.getRepository(User)
      // baha se ham getRepository me entity dalenge

      const user = await userrepository.find()
      // yaha hamne find kiya hai bs
      expect(user).toHaveLength(1)
      expect(user[0].firstName).toBe(userdata.firstName)
      expect(user[0].lastName).toBe(userdata.lastName)
      //wexpect(user[0].password).toBe(userdata.password)
    })
    it('should the user id find', async () => {
      //arrenge
      const userdata = {

        firstName: "karan",
        lastName: "s",
        email: "karan@12.com",
        password: "secret"
      }
      //act 
      const response = await request(app).post('/auth/register').send(userdata)

      const userId = response.body.id
      //  console.log(userId, "ye register ki  user id hai",)
      expect(userId).toBeDefined()
      //expect 
      // ✅ TypeORM ID generated

    })
    it("should assign a customer role", async () => {
      // arrenge
      const userdata = {
        firstName: "karan",
        lastName: "s",
        email: "karan@12.com",
        password: "secret"
      }
      // act 
      await request(app).post('/auth/register').send(userdata)
      // expect
      const userrepo = AppDataSource.getRepository(User)
      const user = await userrepo.find()
      expect(user[0]).toHaveProperty("role")
      expect(user[0].role).toBe('customer')
    })

    it('should store the hashed password in the database', async () => {
      //arrenge
      const userdata = {
        firstName: "karan",
        lastName: "s",
        email: "karan@12.com",
        password: "secret"
      }
      //act
      await request(app).post('/auth/register').send(userdata)

      //expect
      const userrepo = AppDataSource.getRepository(User)
      const user = await userrepo.find()

      expect(user[0].password).not.toBe(userdata.password)
      expect(user[0].password).toHaveLength(60)
    })

    it("should return 400 status code if email is already exists", async () => {
      // arrenge
      const userdata = {
        firstName: "karan",
        lastName: "s",
        email: "karan@12.com",
        password: "secret"
      }
      const userrepository = connection.getRepository(User)
      await userrepository.save({ ...userdata, role: Role.CUSTOMER })


      //act
      const response = await request(app).post('/auth/register').send(userdata)


      const user = await userrepository.find();
      expect(user).toHaveLength(1)
      expect(response.statusCode).toBe(400)


    })

    it("should return the access token and refresh token inside a cookie", async () => {
      //arrenge
      const userdata = {
        firstName: "karan",
        lastName: "s",
        email: "karan@12.com",
        password: "secret"
      }
      //act
      const response = await request(app).post('/auth/register').send(userdata)

      interface Headers {
        ['set-cookie']: string[]
      }

      let accessToken: string | undefined
      let refreshToken: string | undefined
      // assert 
      const cookies = (response.headers as Headers)['set-cookie'] || [];
      cookies.forEach((cookie) => {
        if (cookie.startsWith('accessToken')) {
          accessToken = cookie.split(';')[0].split("=")[1]
        }
        if (cookie.startsWith('refreshToken')) {
          refreshToken = cookie.split(';')[0].split("=")[1]
        }
      })
      ///  console.log(accessToken, refreshToken, "yaha bs token inialize honge")
      expect(accessToken).toBeDefined()
      expect(refreshToken).not.toBeNull()
      expect(isjwt(accessToken)).toBeTruthy()
      expect(isjwt(refreshToken)).toBeTruthy()
    })


    it("should store the refresh token in the database", async () => {
      const userdata = {
        firstName: "karan",
        lastName: "s",
        email: "karan@12.com",
        password: "secret"
      }
      //act
      const response = await request(app).post('/auth/register').send(userdata)
      // Assert 

      const refreshTokenrepo = connection.getRepository(RefreshToken)

      const refreshToken = await refreshTokenrepo.find();

      expect(refreshToken).toHaveLength(1)

    })









  })
  describe('missing field', () => {
    it("should return 400 status code if email field is missing", async () => {
      //arrenge
      const userdata = {
        firstName: "karan",
        lastName: "s",
        ///email: "karan@12.com",
        password: "secret"
      }

      // act 
      const response = await request(app).post('/auth/register').send(userdata)
      // console.log(response)
      expect(response.statusCode).toBe(400)
      const userrepo = connection.getRepository(User)
      const user = await userrepo.find()

      expect(user).toHaveLength(0)
    })
    it("should return 400 status code if firstName field is missing", async () => {
      //arrenge
      const userdata = {
        // firstName: "karan",
        lastName: "s",
        email: "karan@12.com",
        password: "secret"
      }

      // act

      const response = await request(app).post('/auth/register').send(userdata)

      /// expect 
      expect(response.statusCode).toBe(400);


    })

    it("should return 400 status code  if lastName field is missing", async () => {
      //arrenge
      const userdata = {
        firstName: "karan",
        // lastName: "s",
        // email: "karan@12.com",
        password: "secret"
      }
      const response = await request(app).post('/auth/register').send(userdata)

      expect(response.statusCode).toBe(400)


    })

    it("should return 400 status code if password field is missing", async () => {
      // arrenge 
      const userdata = {
        firstName: "karan",
        lastName: "sengar",
        email: "karan.com",
        //  password:""
      }
      // act 
      const response = await request(app).post('/auth/register').send(userdata)

      //expect
      expect(response.statusCode).toBe(400)


    })
    it("should return 400 status code if password to be at least 6 chars", async () => {
      const userdata = {
        firstName: "karan",
        lastName: "sengar",
        email: "karan@test.com",
        password: "123"
      }

      //act 
      const response = await request(app).post('/auth/register').send(userdata)


      // Expect
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe("Password should be at least 5 chars")


    })

    it("should return 400 status code is email is not valid", async () => {
      const userdata = {
        firstName: "karan",
        lastName: "sengar",
        email: "karan",
        password: "1234323"
      }

      //act 
      const response = await request(app).post('/auth/register').send(userdata)
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe("Must be a valid email address")
    })



    it("should return proper formate the data", async () => {
      //arrenge
      const userdata = {
        firstName: "karan",
        lastName: "s",
        email: " karan@12.com ",
        password: "secret"
      }

      // act 
      const response = await request(app).post('/auth/register').send(userdata)

      const userrepo = connection.getRepository(User)
      const user = await userrepo.find()

      expect(user[0].email).toBe("karan@12.com")
    })

  })

})
