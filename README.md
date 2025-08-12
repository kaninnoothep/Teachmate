<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/kaninnoothep/Teachmate">
    <img src="client/assets/images/adaptive-icon.png" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">Teachmate</h3>

  <p align="center">
    Empower Your Learning Journey
    <br />
    <a href="https://github.com/kaninnoothep/Teachmate"><strong>Explore »</strong></a>
    <br />
    <br />
    <a href="https://drive.google.com/file/d/1lDS2fPy3Nth1clOyNSEFzVpQRRPOf5o2/view?usp=sharing">View Demo (MVP 1)</a>
    ·
    <a href="#">View Demo (MVP 2)</a>
    ·
    <a href="https://github.com/kaninnoothep/Teachmate/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/kaninnoothep/Teachmate/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#how-to-run">How To Run</a></li>
    <li><a href="#author">Author</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This project is a **Tutor-Student Matching platform**. As the education system is rapidly changing, finding a tutor is a crucial and challenging task for students. Traditional tutoring methods, such as word-of-mouth or bulletin boards, still have gaps in tutors' background and experience, resulting in students having an unpleasant experience of finding tutors who meet their needs. Consequently, the students may miss out on learning opportunities and receive an ineffective learning experience. **Teachmate** addresses these problems by providing a comprehensive mobile app solution for connecting tutors and students, streamlining the process of matching based on subjects, expertise, availability, and preferences. The goal of Teachmate is to match tutors with students, where students can investigate and verify the identity of tutors for credibility, and book sessions with confident tutors, enhancing the learning experience to be more effective and appropriate for the students' needs.

The following are key features implemented in **MVP 1** and **MVP 2** to satisfy the goal, categorized by user role:

**Tutor Features**

- [x] **Signup & Login**
      Tutors can create an account and securely log in to access the tutor features.
- [x] **Profile Setups**
      Tutors can build a detailed profile that includes personal information, education, experience, and preferred location, helping students to access their credibility and expertise.
- [x] **Availability Management**
      Tutors can set and update their available dates and time slots. This helps with session scheduling from students, ensuring accurate session booking.
- [x] **Session Management**
      Tutors can create and manage session details such as subject, description, and estimated duration, allowing students to view their offered sessions.
- [x] **Review Bookings**
      Tutors can see bookings from students and the booking information, including subject, date, time, preferred locations, notes, and student profile details, helping them prepare more effectively for the session.
- [x] **Confirm, Reject, and Cancel Bookings**
      Tutors can accept or decline booking requests, or cancel previously confirmed sessions, to maintain accurate scheduling and avoid conflicts.
- [x] **Calendar View of Bookings**
      Tutors can view all upcoming sessions in a calendar, making it easier to plan lessons and manage availability.
- [x] **Ratings and Reviews on Students**
      Tutors can leave feedback and rate students after sessions, promoting transparency and helping other tutors assess student reliability.
- [x] **Overview Tracking Dashboard**
      Tutors can view statistics on completed tutoring hours per week and month, enabling them to track performance and plan their schedules effectively.

**Student Features**

- [x] **Signup & Login**
      Students can create an account and securely log in to access the student features.
- [x] **Profile Setups**
      Students can complete their profiles with personal details and education level to help tutors tailor sessions effectively.
- [x] **Search and Filter Tutors**
      Students can search for tutors by keywords and use filters (e.g., subject, location) to narrow down the most suitable tutors.
- [x] **Booking with Tutors**
      Students can view tutor profiles, select a preferred session, date, time slots, and location. After booking, they can review all upcoming sessions. Students can also cancel the booking.
- [x] **Calendar View of Bookings**
      Students can see all upcoming tutoring sessions in a calendar view, helping them organize study plans and avoid schedule conflicts.
- [x] **Ratings and Reviews on Tutors**
      Students can provide ratings and written feedback after sessions, helping other students make informed decisions and encouraging quality teaching.
- [x] **Overview Tracking Dashboard**
      Students can track completed tutoring hours weekly and monthly, enabling them to monitor progress and set learning goals.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

This project was developed using the **MERN stack** (MongoDB, Express.js, React Native, Node.js). MongoDB Atlas serves as the database platform, Express and Node.js support the backend server, and the mobile interface was built using React Native, with the Expo framework. Together, these technologies support a scalable, maintainable, and user-friendly mobile application for modern education needs.

Technologies employed to build this application include:

- ![React Native](https://img.shields.io/badge/React_Native-%2320232a.svg?logo=react&logoColor=%2361DAFB)
- ![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=fff)
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
- ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

Supporting libraries and services:

- TanStack Query (data fetching and caching)
- Axios (HTTP client)
- React Native Paper (UI components)
- Cloudinary (image handling)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This project was built to run locally. To get a local copy up and running, follow the steps below.

### Prerequisites

To ensure you have no difficulty running this application, be sure to have the following installed:

- npm (latest version)

  ```sh
  npm install npm@latest -g
  ```

- [Node.js](https://nodejs.org/en)

- [Expo CLI](https://docs.expo.dev/more/expo-cli/)

  ```sh
  npm install expo-cli --global
  ```

### Installation

To install the application, simply follow these steps:

1. **Clone the repo**
   ```sh
   git clone https://github.com/kaninnoothep/Teachmate.git
   ```
2. **Install NPM packages** – open the terminal in the root of the project directory (Teachmate), and run the following commands

   ```sh
   cd client && npm install
   cd ../server && npm install
   ```

3. **Initialize environment variables** – be sure to have `.env` in the root of both `client` and `server` directories, and ensure to use the correct variables

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE -->

## How To Run

To run the application, you will need to open 2 terminal windows in the root of the project directory (Teachmate), one window will be used for the `client` directory, and the other for the `server` directory.
On the first terminal window, move to the `client` directory:

```sh
cd client
```

On the second terminal window, move to the `server` directory:

```sh
cd server
```

On each window, run this command:

```sh
npm run start
```

**On the client terminal window**
In the output, you'll find options to open the app in:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)

- [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)

- [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)

- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

Example steps to open the app on the iOS platform:

- Press `i` to open in the iOS Simulator (requires Xcode), or

- Scan the QR code with the Expo Go app on an iPhone

**On the server terminal window,** you’ll find the successful message:

```
Server running on port 3000
MongoDB Connected Successfully
```

#### Note

See the `README` file in the `client` and `server` directories for more information on the application.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Author

**Kanin Noothep**

GitHub: [@kaninnoothep](https://github.com/kaninnoothep)

Email: [kaninnoothep@gmail.com](mailto:kaninnoothep@gmail.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License.

See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

**Project Link**: [https://github.com/kaninnoothep/Teachmate](https://github.com/kaninnoothep/Teachmate)
