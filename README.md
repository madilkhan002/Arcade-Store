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
- Docker
- Docker Compose

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Arcade | Setup & Installation

Follow these steps to successfully set up and run the Arcade Store application locally via Docker.

### 1. Clone This Repository
Open your terminal or command prompt and run:
```sh
git clone https://github.com/madilkhan002/arcade-store.git
cd arcade-store
```

### 2. Run with Docker Compose
We use Docker and Sequelize ORM to completely handle database configuration, creation, and connections automatically.

To start the application and the MySQL database containers side-by-side, run:
```sh
docker-compose up -d --build
```

- The `app` service will be accessible on port `8000`.
- The `sql-db` service will map to port `3306` natively.
- The Node.js application will automatically create all tables dynamically on startup and insert a default admin (`admin@admin.com` with password `admin`).

### 3. Open the Application
Open your browser and navigate to `http://localhost:8000`. You can test the platform and log in as an admin via the `/signin` page using the default admin credentials.

### 4. Email Configuration (Optional)
The project sends emails for User Registration (Verification Pin), Forget Password functionality, and Purchase Receipts.
These credentials are hardcoded in the codebase using Nodemailer. If you intend to test email functionality, you might need to supply your own Gmail credentials (using Gmail App Passwords):
1. Navigate to `controllers/user.js` and `controllers/buyNow.js`.
2. Find the `nodemailer.createTransport` method.
3. Replace the `user` and `pass` with your own Gmail credentials and App Password.
4. Restart your Docker container: `docker-compose restart app`

### Troubleshooting & Logs
To see application logs (for debug errors or testing API queries), run:
```sh
docker-compose logs -f app
```

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
