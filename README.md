<a name="readme-top"></a>
## Arcade | Introduction

Arcade is an online web based game store. Where user can buy
their favourite games through our platform. It will allow gaming much more accessible
and inclusive of all. This platform
provides details such as how many users recommended this game, the trailer of game,
availability on different platforms and so much more.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Arcade | Tools & Technology

* <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
* <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
* <img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white" />
* <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E"/>
* <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/>
* <img src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white"/>
* <img src="https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white" />

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Arcade | Prerequisites

These are the softwares you need to install before getting started.
- NodeJS
- NPM
- MySQL Server (XAMPP, MAMP, WAMP, or standalone MySQL)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Arcade | Setup & Installation

Follow these steps to successfully set up and run the Arcade Store application locally.

### 1. Clone This Repository
Open your terminal or command prompt and run:
```sh
git clone https://github.com/madilkhan002/arcade-store.git
cd arcade-store
```

### 2. Install Dependencies
Install all required Node.js packages:
```sh
npm install
```

### 3. Database Setup (MySQL)
The application requires a MySQL database to function.
1. Start your local MySQL Server (e.g., using XAMPP or running the MySQL service).
2. Open your MySQL client (e.g., phpMyAdmin, MySQL Workbench, or MySQL CLI).
3. We have provided a `schema.sql` file in the root folder which contains the queries to build the database, setup tables, and create a default admin account.
4. Run the queries from `schema.sql` in your MySQL client to initialize the `testdb1` database.
   * **Tip:** If you are using the terminal, you can import it by running:
     ```sh
     mysql -u root -p < schema.sql
     ```
   * The `schema.sql` creates a default admin account with `email: admin@admin.com` and `password: admin` to help you log into the admin panel immediately.

### 4. Database Connection Configuration
By default, the application is configured to connect to MySQL on `127.0.0.1` using the user `root` with no password (`""`).
If your local MySQL uses a different configuration, update the connection settings:
1. Open the file `config/sqlConnection.js`.
2. Update the `host`, `user`, `password`, and `database` fields inside the `mysql.createConnection` block to match your local setup.

### 5. Email Configuration (Optional)
The project sends emails for User Registration (Verification Pin), Forget Password functionality, and Purchase Receipts.
These credentials are hardcoded in the codebase using Nodemailer. If you intend to test email functionality, you might need to supply your own Gmail credentials (using Gmail App Passwords):
1. Navigate to `controllers/user.js` and `controllers/buyNow.js`.
2. Find the `nodemailer.createTransport` method.
3. Replace the `user` and `pass` with your own Gmail credentials and App Password.

### 6. Run the Application
Start the Node.js server using:
```sh
node app.js
```
The server will run on port `8000`.
Open your browser and navigate to `http://localhost:8000`. You can test the platform and log in as an admin via the `/signin` page using the default admin credentials.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Arcade | Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.
If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!
1. Fork the Project
2. Create your Feature Branch `git checkout -b feature/AmazingFeature`
3. Commit your Changes `git commit -m 'Add some AmazingFeature'`
4. Push to the Branch `git push origin feature/AmazingFeature`
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>
Distributed under the MIT License. See `LICENSE.txt` for more information.
<p align="right">(<a href="#readme-top">back to top</a>)</p>
---
<p align="center"> © 2022 3 Males, All Rights Reserved. </p>
<p align="center">
https://github.com/askinnybrownguy
</p>
