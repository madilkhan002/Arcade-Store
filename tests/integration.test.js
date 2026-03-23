const request = require('supertest');
const app = require('../app');
const { connection, User, Admin, Game, Wishlist } = require('../models');

let userCookie;
let adminCookie;

beforeAll(async () => {
    // Sync DB and clear models
    await connection.sync({ force: true });

    // Check if admin exists to prevent unique constraint error (as app.js might have seeded it)
    const existingAdmin = await Admin.findOne({ where: { email: 'admin@admin.com' } });
    if (!existingAdmin) {
        await Admin.create({ email: 'admin@admin.com', _password: 'admin' });
    }

    const existingUser = await User.findOne({ where: { email: 'test@user.com' } });
    if (!existingUser) {
        await User.create({ email: 'test@user.com', name: 'Test User', _password: 'password123' });
    }

    const existingGame = await Game.findOne({ where: { id: 1 } });
    if (!existingGame) {
        await Game.create({ id: 1, _name: 'Test Game 1', price: '50', detail: 'Desc 1', catagory: 'Action', stars: 0, total: 0 });
    }
});

afterAll(async () => {
    await connection.close();
});

describe('User Authentication API', () => {

    it('should show user signup page', async () => {
        const res = await request(app).get('/signup');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('<form');
    });

    it('should block signup if user already exists', async () => {
        const res = await request(app).post('/pinvalidatin').send({
            name: 'Another User',
            email: 'test@user.com',
            password: 'newpassword'
        });
        expect(res.text).toContain('USER ALREADY EXISTS');
    });

    it('should authenticate admin and redirect to dashboard', async () => {
        const res = await request(app).post('/adminPanel').send({
            email: 'admin@admin.com',
            pass: 'admin',
            role: 'admin'
        });
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual('/adminPanel');
        adminCookie = res.headers['set-cookie'];
    });

    it('should authenticate user and redirect to home', async () => {
        const res = await request(app).post('/adminPanel').send({
            email: 'test@user.com',
            pass: 'password123',
            role: 'user'
        });
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual('/home');
        userCookie = res.headers['set-cookie'];
    });

    it('should fail authentication for bad credentials', async () => {
        const res = await request(app).post('/adminPanel').send({
            email: 'test@user.com',
            pass: 'wrongpassword',
            role: 'user'
        });
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual('/signin');
    });
});

describe('Game API', () => {
    it('should view games on homepage', async () => {
        const res = await request(app).get('/viewgames');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Test Game 1');
    });

    it('should show user games list page', async () => {
        const res = await request(app).get('/viewgamesuser');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Test Game 1');
    });

    it('should not allow non-numeric prices for add game', async () => {
        const res = await request(app).post('/addgame')
            .set('Cookie', adminCookie)
            .send({
                id: '2',
                name: 'Test Game 2',
                price: 'Fifty Bucks',
                detail: 'Desc',
                catagory: 'Action'
            });

        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual('/addgameform');
    });
});

describe('Wishlist API', () => {
    it('should block non-authenticated user from viewing wishlist', async () => {
        const res = await request(app).get('/wishlist');
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual('/signin');
    });

    it('should add game to wishlist for authenticated user', async () => {
        // userCookie is already set from the auth block
        const addRes = await request(app).get('/addtowishlist/1').set('Cookie', userCookie);
        expect(addRes.statusCode).toEqual(302);
        expect(addRes.headers.location).toEqual('/viewgamesuser');

        // Verify via model
        const wishlistItems = await Wishlist.findAll();
        expect(wishlistItems.length).toEqual(1);
        expect(wishlistItems[0].email).toEqual('test@user.com');
        expect(wishlistItems[0].id).toEqual(1);
    });

    it('should display wishlist page for authenticated user with item', async () => {
        const res = await request(app).get('/wishlist').set('Cookie', userCookie);
        expect(res.statusCode).toEqual(200);
        // The game info should render in the wishlist view
        expect(res.text).toContain('Test Game 1');
    });

    it('should remove game from wishlist', async () => {
        const delRes = await request(app).get('/removewishlist/1').set('Cookie', userCookie);
        expect(delRes.statusCode).toEqual(302);
        expect(delRes.headers.location).toEqual('/wishlist');

        const wishlistItems = await Wishlist.findAll();
        expect(wishlistItems.length).toEqual(0);
    });
});