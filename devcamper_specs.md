I:

1. Create basic Express server, dotenv, Git
2. Create Routes in Express using the Express Router
3. Create Bootcamp controller
4. Create basic Middleware (logger.js), install Morgan middleware

II:

1. Connecting to DB with Mongoose
2. Create Bootcamp Model
3. CRUD Bootcamp

III:

1. Error handler Middleware
2. Custom ErrorResponse Class
3. Mongoose error handling. Duplicate key, invalid ID, validation errors
4. Async Await middleware
5. Mongoose middleware Slugify bootcamp name
6. Process on unhandledRejection setup in server.js

IV:

1. Database Seeder for Bootcamps
2. Advanced filtering
3. Bootcamp pagination
4. Course Model and seeding
5. Course routes and controller(CRUD)
6. Populate, virtuals and Cascade Bootcamp delete

V:

1. Aggregate - Calculating the average course cost
2. Photo upload
3. AdvancedResults middleware
4. Bootcap virtuals

VI:

1. Create the User model
2. User register method, encrypt password middleware
3. Sign JSON webtoken on register
4. User login method
5. Sending JWT cookie
6. Auth protect middleware, auth/me route
7. Storing the token in Postman
8. Role authorization

# Storing token in Postman:

<!-- language: javascript -->

    if (pm.response.code === 200) {
        pm.environment.set('authToken', pm.response.json().token)
    }

VII:

1. Bootcamp - User relationship, User seeder
2. Bootcamp ownership, UPDATE, DELETE, PHOTO UPLOAD
3. Course ownership, CREATE, UPDATE, DELETE
4. Forgot password - Generate token
5. Forgot password - Send email, nodemailer, mailtrap
6. Reset password
7. Update user details - name, email, Update password
