# OTT Platform - My List Feature

A production-ready backend service for the "My List" feature of an OTT platform. Built with TypeScript, Express, MongoDB, and Redis for optimal performance.

## 🚀 Features

- **Add to My List** - Save movies and TV shows to a personalized list
- **Remove from My List** - Remove items from the list
- **List My Items** - Retrieve paginated list with content details
- **High Performance** - Optimized for <10ms response times using Redis caching and MongoDB indexes
- **Production Ready** - Includes error handling, logging, rate limiting, and security middleware

## 📋 Prerequisites

- Node.js 22 
- MongoDB 5.0+
- Redis 6.0+ (optional but recommended for optimal performance)

## 🛠️ Installation

### Option 1: Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/mayur-gupta/ott-list
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example env file
copy sample.env .env

# Edit .env with your configuration
```

4. **Start MongoDB and Redis**
```bash
# Make sure MongoDB is running on localhost:27017
# Make sure Redis is running on localhost:6379
```

5. **Seed the database**
```bash
npm run seed
```

6. **Start the development server**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Option 2: Docker Setup

1. **Build and run with Docker Compose**
```bash
docker-compose up -d
```

2. **Seed the database**
```bash
docker-compose exec app npm run seed
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
All endpoints require the `x-user-id` header:
```
x-user-id: <user-id>
```

### Endpoints

#### 1. Add to My List
```http
POST /api/v1/mylist
Content-Type: application/json
x-user-id: <user-id>

{
  "contentId": "movie-or-tvshow-id",
  "contentType": "movie" | "tvshow"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Item added to My List successfully",
  "item": {
    "id": "...",
    "userId": "...",
    "contentId": "...",
    "contentType": "movie",
    "addedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Remove from My List
```http
DELETE /api/v1/mylist/:contentId
x-user-id: <user-id>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item removed from My List successfully"
}
```

#### 3. List My Items
```http
GET /api/v1/mylist?page=1&limit=20
x-user-id: <user-id>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "userId": "...",
      "contentId": "...",
      "contentType": "movie",
      "addedAt": "2024-01-01T00:00:00.000Z",
      "content": {
        "id": "...",
        "title": "The Matrix",
        "description": "...",
        "genres": ["Action", "SciFi"],
        "releaseDate": "1999-03-31T00:00:00.000Z",
        "director": "Lana Wachowski, Lilly Wachowski",
        "actors": ["Keanu Reeves", "..."]
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

#### 4. Health Check
```http
GET /api/v1/health
```

## 🏗️ Architecture & Design Decisions

### Database Schema

**MyList Collection:**
- Compound unique index on `(userId, contentId)` prevents duplicates
- Compound index on `(userId, addedAt)` enables fast pagination queries
- Stores minimal data, references content by ID

**Performance Optimizations:**

1. **MongoDB Indexes**
   - Compound index `{ userId: 1, addedAt: -1 }` for efficient sorted queries
   - Unique compound index `{ userId: 1, contentId: 1 }` for duplicate prevention

2. **Redis Caching**
   - Caches paginated list responses (1-minute TTL)
   - Caches total count separately (5-minute TTL)
   - Invalidates cache on add/remove operations
   - Graceful degradation if Redis is unavailable

3. **Query Optimization**
   - Uses `.lean()` to bypass Mongoose overhead
   - Batch fetches content details to minimize database calls
   - Efficient pagination without expensive skip operations on large datasets

4. **Response Time**
   - Target: <10ms for "List My Items"
   - Achieved through multi-layer caching and optimized indexes
   - Logged performance metrics for monitoring

### Scalability Considerations

- **Horizontal Scaling**: Stateless API design allows multiple instances
- **Database Sharding**: Can shard by `userId` for massive scale
- **Cache Strategy**: Redis can be clustered for high availability
- **Rate Limiting**: Prevents abuse and ensures fair resource usage

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run integration tests only:
```bash
npm run test:integration
```

Watch mode for development:
```bash
npm run test:watch
```

## 📦 Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm test` - Run all tests
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevents abuse
- **Input Validation** - Joi schema validation
- **Error Handling** - Sanitized error responses

## 📊 Monitoring & Logging

- **Winston** - Structured logging
- **Morgan** - HTTP request logging
- **Performance Metrics** - Query duration tracking

## 🐳 Docker Deployment

The application includes Docker support for easy deployment:

```bash
# Build image
docker build -t ott-mylist-feature .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production/test) | development |
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/ott-mylist |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `CACHE_ENABLED` | Enable/disable caching | true |
| `CACHE_TTL_SECONDS` | Cache TTL in seconds | 60 |
| `DEFAULT_PAGE_SIZE` | Default pagination size | 20 |
| `MAX_PAGE_SIZE` | Maximum pagination size | 100 |

## 🤝 Assumptions

1. **Authentication**: Mock authentication using `x-user-id` header. In production, this would be replaced with JWT/OAuth tokens.

2. **Content Validation**: The API validates that content (movies/TV shows) exists before adding to the list.

3. **Duplicate Prevention**: Handled at the database level using unique compound indexes.

4. **Pagination**: Default page size is 20, maximum is 100 to prevent performance issues.

5. **Cache Strategy**: Short TTL (1 minute) for list data to balance performance and data freshness.

