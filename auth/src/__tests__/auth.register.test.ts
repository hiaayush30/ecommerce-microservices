import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { connectTestDB, closeTestDB, clearTestDB } from './utils/testDb.js';
import { userModel } from '../models/user.model.js';
import app from '../app.js';

describe('POST /auth/register', () => {
    beforeAll(async () => {
        await connectTestDB();
    });

    afterAll(async () => {
        await closeTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();
    });

    const validUserData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test@1234',
        fullname: {
            firstName: 'Test',
            lastName: 'User'
        }
    };

    describe('Successful Registration', () => {
        it('should register a new user with valid data', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send(validUserData)
                .expect(201);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message', 'User registered successfully');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('username', validUserData.username);
            expect(response.body.data).toHaveProperty('email', validUserData.email);
            expect(response.body.data).toHaveProperty('fullname');
            expect(response.body.data.fullname).toHaveProperty('firstName', validUserData.fullname.firstName);
            expect(response.body.data.fullname).toHaveProperty('lastName', validUserData.fullname.lastName);
            expect(response.body.data).not.toHaveProperty('password');
        });

        // it('should register a user with role "seller"', async () => {
        //     const sellerData = {
        //         ...validUserData,
        //         username: 'testseller',
        //         email: 'seller@example.com',
        //         role: 'seller' as const
        //     };

        //     const response = await request(app)
        //         .post('/auth/register')
        //         .send(sellerData)
        //         .expect(201);

        //     expect(response.body.success).toBe(true);
        //     expect(response.body.data).toHaveProperty('role', 'seller');
        // });

        it('should default to "user" role when role is not specified', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send(validUserData)
                .expect(201);

            expect(response.body.data).toHaveProperty('role', 'user');
        });

        it('should hash the password before storing', async () => {
            await request(app)
                .post('/auth/register')
                .send(validUserData)
                .expect(201);

            const user = await userModel.findOne({ email: validUserData.email });
            expect(user).toBeTruthy();
            expect(user?.password).not.toBe(validUserData.password);
            expect(user?.password).toBeTruthy();
        });
    });

    describe('Validation Errors', () => {
        it('should return 400 when username is missing', async () => {
            const invalidData = { ...validUserData };
            delete (invalidData as any).username;

            const response = await request(app)
                .post('/auth/register')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'All fields are required');
        });

        it('should return 400 when email is missing', async () => {
            const invalidData = { ...validUserData };
            delete (invalidData as any).email;

            const response = await request(app)
                .post('/auth/register')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'All fields are required');
        });

        it('should return 400 when password is missing', async () => {
            const invalidData = { ...validUserData };
            delete (invalidData as any).password;

            const response = await request(app)
                .post('/auth/register')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'All fields are required');
        });

        it('should return 400 when firstName is missing', async () => {
            const invalidData = {
                ...validUserData,
                fullname: {
                    lastName: 'User'
                }
            };

            const response = await request(app)
                .post('/auth/register')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'All fields are required');
        });

        it('should return 400 when lastName is missing', async () => {
            const invalidData = {
                ...validUserData,
                fullname: {
                    firstName: 'Test'
                }
            };

            const response = await request(app)
                .post('/auth/register')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'All fields are required');
        });

        it('should return 400 when fullname is missing', async () => {
            const invalidData = { ...validUserData };
            delete (invalidData as any).fullname;

            const response = await request(app)
                .post('/auth/register')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'All fields are required');
        });
    });

    describe('Duplicate User Errors', () => {
        beforeEach(async () => {
            // Register a user first
            await request(app)
                .post('/auth/register')
                .send(validUserData);
        });

        it('should return 409 when email already exists', async () => {
            const duplicateEmailData = {
                ...validUserData,
                username: 'differentuser'
            };

            const response = await request(app)
                .post('/auth/register')
                .send(duplicateEmailData)
                .expect(409);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'User already exists');
            expect(response.body).toHaveProperty('error', 'Email or username already registered');
        });

        it('should return 409 when username already exists', async () => {
            const duplicateUsernameData = {
                ...validUserData,
                email: 'different@example.com'
            };

            const response = await request(app)
                .post('/auth/register')
                .send(duplicateUsernameData)
                .expect(409);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'User already exists');
            expect(response.body).toHaveProperty('error', 'Email or username already registered');
        });

        it('should return 409 when both email and username already exist', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send(validUserData)
                .expect(409);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'User already exists');
        });
    });

    describe('Database Persistence', () => {
        it('should save user to database with correct fields', async () => {
            await request(app)
                .post('/auth/register')
                .send(validUserData)
                .expect(201);

            const user = await userModel.findOne({ email: validUserData.email });

            expect(user).toBeTruthy();
            expect(user?.username).toBe(validUserData.username);
            expect(user?.email).toBe(validUserData.email);
            expect(user?.fullname.firstName).toBe(validUserData.fullname.firstName);
            expect(user?.fullname.lastName).toBe(validUserData.fullname.lastName);
            expect(user?.role).toBe('user');
            expect(user?.password).toBeTruthy();
            expect(user?.password).not.toBe(validUserData.password);
        });

        it('should create unique users with different credentials', async () => {
            const user1 = validUserData;
            const user2 = {
                username: 'testuser2',
                email: 'test2@example.com',
                password: 'Test@5678',
                fullname: {
                    firstName: 'Test2',
                    lastName: 'User2'
                }
            };

            await request(app).post('/auth/register').send(user1).expect(201);
            await request(app).post('/auth/register').send(user2).expect(201);

            const count = await userModel.countDocuments();
            expect(count).toBe(2);
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty request body', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
        });

        it('should handle malformed JSON gracefully', async () => {
            const response = await request(app)
                .post('/auth/register')
                .set('Content-Type', 'application/json')
                .send('invalid json')
                .expect(400);

            // Express will handle malformed JSON with 400
            expect(response.status).toBe(400);
        });

        it('should trim and handle whitespace in fields', async () => {
            const dataWithSpaces = {
                username: '  testuser  ',
                email: '  test@example.com  ',
                password: 'Test@1234',
                fullname: {
                    firstName: '  Test  ',
                    lastName: '  User  '
                }
            };

            const response = await request(app)
                .post('/auth/register')
                .send(dataWithSpaces)
                .expect(201);

            expect(response.body.success).toBe(true);
        });
    });
});
