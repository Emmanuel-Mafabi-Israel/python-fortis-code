# Fortis**Code**: Secure Token Transfer Application

# By Israel Mafabi Emmanuel

[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/downloads/)
[![Flask Version](https://img.shields.io/badge/flask-2.x-green.svg)](https://flask.palletsprojects.com/)
[![React Version](https://img.shields.io/badge/react-17%2B-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Fortis is a secure web application built with Python (Flask) on the **backend** and React on the **frontend** that allows users to transfer digital tokens securely. Fortis leverages the power of cryptography to ensure that transactions are safe, validated, and tamper-proof.

**Key Features:**

*   **User Authentication:** Secure user registration, login, and profile management using JWT (JSON Web Tokens) for authentication.
*   **Token Transfer:** Users can send tokens to other registered users using either a "direct" or "deposit" method.
*   **Encrypted Tokens:**  Fortis utilizes the `cryptography` library to generate and manage encrypted tokens, ensuring the integrity and confidentiality of transactions.
*   **Transaction History:**  The application keeps a record of all transactions, allowing users to track their token transfers.
*   **Notifications:** Users receive notifications about incoming tokens and transaction statuses.
*   **Balance Management:**  The system automatically updates user balances upon successful token transfers.
*   **Self-Transaction Prevention:**  Built-in validation prevents users from sending tokens to themselves, enhancing security and preventing errors.
*   **Initial Token Deposit:** New users receive an initial deposit of 500 tokens upon registration.

## Getting Started

### Prerequisites

*   **Python 3.8+**
*   **Node.js 14+**
*   **npm** (or **yarn**)
*   **Virtual Environment (Recommended):** `virtualenv` or `venv` for Python

### Installation

1. **Clone the repository:**

    ```bash
    git clone # put here repo url!
    cd python-fortis-code
    ```

2. **Backend Setup:**

    *   Create and activate a virtual environment:

        ```bash
        python3 -m venv venv
        source venv/bin/activate  # On Linux/macOS
        venv\Scripts\activate     # On Windows
        ```

    *   Install backend dependencies:

        ```bash
        pip install -r server/requirements.txt
        ```

    *   Set up environment variables (create a `.env` file in the `server` directory):

        ```
        SECRET_KEY=<your-secret-key>
        SQLALCHEMY_DATABASE_URI=sqlite:///fortis.db # Or your preferred database URI
        SQLALCHEMY_TRACK_MODIFICATIONS=False
        JWT_SECRET_KEY=<your-jwt-secret-key>
        CRYPTO_KEY=<your-encryption-key> # Generate a strong key using Fernet.generate_key()
        TOKEN_EXPIRY=14400 # Token expiry in minutes (default: 14400 - which is 10days)
        ```

    *   Initialize and migrate the database:

        ```bash
        flask db init
        flask db migrate -m "Initial migration"
        flask db upgrade
        ```

3. **Frontend Setup:**

    *   Navigate to the frontend directory:

        ```bash
        cd client
        ```

    *   Install frontend dependencies:

        ```bash
        npm install
        # or
        yarn install
        ```

### Running the Application

1. **Start the Backend Server:**

    *   Make sure your virtual environment is activated.
    *   From the `server` directory, run:

        ```bash
        flask run # --debug
        ```

    *   The backend server will typically start on `http://127.0.0.1:5000`.

2. **Start the Frontend Development Server:**

    *   In a new terminal, navigate to the `client` directory.
    *   Run:

        ```bash
        npm start
        # or
        yarn start
        ```

    *   The frontend development server will typically start on `http://localhost:3000`.

3. **Access the Application:**

    *   Open your web browser and go to `http://localhost:3000` to access the Fortis application.

## Model Relationships

Relationships diagram

![FortisCode ERD](https://raw.githubusercontent.com/Emmanuel-Mafabi-Israel/python-fortis-code/main/relationships/FortisCode%20Relationships.png)

## API Endpoints (Backend)

| Endpoint         | Method   | Description                         | Authentication Required |
| :--------------- | :------- | :---------------------------------- | :---------------------- |
| `/register`      | `POST`   | Register a new user                 | No                      |
| `/login`         | `POST`   | Log in an existing user             | No                      |
| `/user`          | `GET`    | Get user details                    | Yes                     |
| `/user`          | `PATCH`  | Update user details (e.g., profile) | Yes                     |
| `/user`          | `DELETE` | Delete user details                 | Yes                     |
| `/send_token`    | `POST`   | Send tokens to another user         | Yes                     |
| `/notifications` | `GET`    | Get user notifications              | Yes                     |
| `/transactions`  | `GET`    | Get user's transaction history      | Yes                     |
| `/debug/`        | `GET`    | Debug Page                          | No                      |
| `/debug/models/` | `GET`    | View Database Models                | No                      |
| `/debug/users/`  | `GET`    | View All User's email               | No                      |

## Technologies Used

*   **Backend:**
    *   Python
    *   Flask
    *   SQLAlchemy (ORM)
    *   Flask-JWT-Extended
    *   cryptography
    *   python-dotenv
*   **Frontend:**
    *   React
    *   React Router
    *   Context API
    *   `fetch` for API calls

## Contributing

Contributions to Fortis are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them with clear messages.
4. Push your branch to your forked repository.
5. Create a pull request to the main branch of the original repository.

## License

Fortis is released under the [MIT License](https://opensource.org/licenses/MIT).

## Enjoy the Project

Feel free to reach out... 🤭😍😉

Made with Love... 😎

More so, Glory to God!!!