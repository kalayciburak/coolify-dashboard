# Coolify Dashboard

A modern, production-ready dashboard for monitoring Coolify applications, services, and databases with comprehensive multi-language support.

## Quick Start

### Docker Deployment

```bash
docker pull torukobyte/coolify-dashboard:latest

docker run -d -p 5000:5000 \
  --name coolify-dashboard \
  -e "ADMIN_USERNAME=admin" \
  -e "ADMIN_PASSWORD=your_secure_password" \
  -e "JWT_SECRET=your_jwt_secret_key" \
  -e "ALLOWED_ORIGINS=https://dashboard.kalayciburak.com.tr" \
  -e "COOLIFY_BASE_URL=https://coolify.kalayciburak.com.tr" \
  -e "COOLIFY_TOKEN=your_coolify_api_token" \
  torukobyte/coolify-dashboard:latest
```

Access the dashboard at `http://localhost:5000`

---

## Installation on Coolify

### Step 1: Create New Application

Navigate to your Coolify instance and create a new application:

- Click **"Add New"** in the Coolify dashboard
- Select **"Docker Image"** as the deployment type
- Enter image name: `torukobyte/coolify-dashboard:latest`

### Step 2: General Configuration

Configure the basic settings:

- **Domain**: `dashboard.kalayciburak.com.tr`
- **Port**: `5000`
- Configure network and storage settings as needed

### Step 3: Environment Variables

Set the following required environment variables:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
ALLOWED_ORIGINS=https://dashboard.kalayciburak.com.tr
COOLIFY_BASE_URL=https://coolify.kalayciburak.com.tr
COOLIFY_TOKEN=your_coolify_api_token
```

### Step 4: Generate Coolify API Token

**Important**: Before deploying, generate your Coolify API token with proper permissions:

1. Navigate to your Coolify instance settings
2. Go to **API Tokens** section
3. Click **"Create New Token"**
4. Select the following permissions:
   - **read**: Enable all read permissions
   - **read:sensitive**: Enable sensitive data read access
5. Copy the generated token and use it as `COOLIFY_TOKEN`

**Note**: The `read:sensitive` permission is required to access detailed resource information, including environment variables and sensitive configuration data.

### Step 5: Deploy

- Save the configuration
- Click **"Deploy"** to start the application
- The dashboard will be available at your configured domain

---

## Screenshots

### Login Screen

![Login Screen](./docs/screenshots/en/1.png)

### Applications Overview

![Applications Overview](./docs/screenshots/en/2.png)

### Application Details

![Application Details](./docs/screenshots/en/3.png)

### Services Overview

![Services Overview](./docs/screenshots/en/4.png)

### Database Configuration

![Database Details](./docs/screenshots/en/5.png)

### Multi-language Support

![Language Support](./docs/screenshots/en/6.png)

---

## Environment Variables

| Variable           | Description                                         | Example                                 | Required |
| ------------------ | --------------------------------------------------- | --------------------------------------- | -------- |
| `ADMIN_USERNAME`   | Dashboard administrator username                    | `admin`                                 | Yes      |
| `ADMIN_PASSWORD`   | Dashboard administrator password                    | `secure_password`                       | Yes      |
| `JWT_SECRET`       | Secret key for JWT token generation                 | `random_secret_key`                     | Yes      |
| `ALLOWED_ORIGINS`  | CORS allowed origins (comma-separated for multiple) | `https://dashboard.kalayciburak.com.tr` | Yes      |
| `COOLIFY_BASE_URL` | Your Coolify instance base URL                      | `https://coolify.kalayciburak.com.tr`   | Yes      |
| `COOLIFY_TOKEN`    | Coolify API token with read + read:sensitive access | `your_api_token`                        | Yes      |

---

## Motivation

While using Coolify, I found myself constantly clicking through each application and service individually just to view their URLs and basic information. This repetitive process became tedious when managing multiple resources. I thought, "Why not build a simple, elegant solution that displays everything at a glance?" This dashboard was born from that need—a centralized view to monitor all resources efficiently. If others find it useful too, that's even better.

---

## Features

- **Multi-language Support**: Seamless switching between English and Turkish
- **Responsive Design**: Modern UI optimized for desktop and mobile devices
- **Real-time Monitoring**: Track resource status and health in real-time
- **Secure Authentication**: JWT-based authentication with secure token management
- **Resource Monitoring**: Monitor applications, services, and databases
- **Modern Tech Stack**: Built with React, Tailwind CSS, and Express.js

---

## Project Structure

```
coolify-dashboard/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API client services
│   │   ├── services/       # Business logic layer
│   │   ├── utils/          # Utility functions
│   │   └── i18n/           # Internationalization (EN/TR)
├── server/                 # Express backend application
│   ├── routes/             # API route definitions
│   ├── middleware/         # Custom middleware
│   ├── services/           # Backend services
│   └── utils/              # Backend utilities
└── Dockerfile              # Docker configuration
```

---

## Development

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Git

### Local Setup

```bash
# Clone the repository
git clone https://github.com/kalayciburak/coolify-dashboard.git

# Navigate to project directory
cd coolify-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command          | Description                                      |
| ---------------- | ------------------------------------------------ |
| `npm run dev`    | Start both client and server in development mode |
| `npm run build`  | Build frontend for production                    |
| `npm run start`  | Start production server                          |
| `npm run lint`   | Run ESLint code quality checks                   |
| `npm run format` | Format code using Prettier                       |

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Guidelines

- Follow the existing code style and conventions
- Write clear and descriptive commit messages
- Add tests for new features
- Update documentation when necessary
- Ensure all tests pass before submitting PR

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Support

For bug reports, feature requests, or questions, please open an issue on [GitHub](https://github.com/kalayciburak/coolify-dashboard/issues).
