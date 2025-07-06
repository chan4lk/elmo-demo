# ELMO Dummy API for Fabric Lakehouse

A comprehensive Node.js API that serves dummy data based on the ELMO User API specification, designed to populate a Microsoft Fabric lakehouse with realistic HR data.

## Features

- **Complete ELMO API Coverage**: Implements all major endpoints from the ELMO User API
- **Realistic Dummy Data**: Generates 50+ users, departments, positions, leave requests, and more
- **Pagination Support**: All endpoints support pagination with `page` and `itemsPerPage` parameters
- **Search & Filtering**: Query parameters for filtering data (name, email, status, etc.)
- **OAuth2 Simulation**: Mock OAuth2 token endpoint for authentication testing
- **Fabric Lakehouse Ready**: Data structure optimized for data warehouse ingestion

## Data Entities

The API provides dummy data for:

- **Users** (50 records) - Employee profiles with personal details
- **Onboarding Users** (10 records) - New hires in onboarding process
- **Departments** (10 records) - Organizational departments
- **Locations** (10 records) - Office locations across Australia/NZ
- **Positions** (10 records) - Job positions and roles
- **Employees** (50 records) - Employment details, payroll, tax info
- **Legal Entities** (3 records) - Company legal structures
- **Payroll Cycles** (4 records) - Pay frequency configurations
- **Leave Types** (5 records) - Annual, personal, long service leave
- **Leave Requests** (100 records) - Employee leave applications
- **Candidates** (25 records) - Recruitment pipeline data

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Verify Installation**
   ```bash
   curl http://localhost:3000/health
   ```

## API Endpoints

### Authentication
- `POST /oauth/token` - Get OAuth2 access token

### Core Endpoints
- `GET /core/v1/users` - List all users
- `GET /core/v1/users/{id}` - Get specific user
- `GET /core/v1/onboarding-users` - List onboarding users
- `GET /core/v1/departments` - List departments
- `GET /core/v1/locations` - List locations
- `GET /core/v1/positions` - List positions
- `GET /core/v1/employees` - List employee details
- `GET /core/v1/legal-entities` - List legal entities
- `GET /core/v1/payroll-cycles` - List payroll cycles
- `GET /core/v1/leave-types` - List leave types
- `GET /core/v1/leave-requests` - List leave requests

### Recruitment
- `GET /recruitment/v1/candidates` - List candidates

### Utility
- `GET /health` - Health check and data counts
- `GET /` - API documentation

## Usage Examples

### Get OAuth Token
```bash
curl --location 'http://localhost:3000/oauth/token' \
--header 'Content-Type: application/json' \
--data '{
    "grant_type":"client_credentials",
    "client_id":"test_client_id",
    "client_secret":"test_client_secret"
}'
```

### List Users with Pagination
```bash
curl "http://localhost:3000/core/v1/users?page=1&itemsPerPage=10"
```

### Search Users by Name
```bash
curl "http://localhost:3000/core/v1/users?firstName=John&lastName=Smith"
```

### Get Employee Details
```bash
curl "http://localhost:3000/core/v1/employees/USER_ID"
```

### Filter Leave Requests by Status
```bash
curl "http://localhost:3000/core/v1/leave-requests?status=APPROVED"
```

## Data Structure for Fabric Lakehouse

### Recommended Ingestion Strategy

1. **Bronze Layer** (Raw Data)
   - Ingest all endpoints as separate tables
   - Maintain original JSON structure
   - Add ingestion timestamp

2. **Silver Layer** (Cleaned Data)
   - Normalize data types
   - Handle relationships between entities
   - Apply data quality rules

3. **Gold Layer** (Business Ready)
   - Create dimensional models
   - Employee fact table with department/location/position dimensions
   - Leave requests fact table with user/leave type dimensions

### Key Relationships

```
Users ←→ Employees (1:1)
Users → Departments (N:1)
Users → Locations (N:1)
Users → Positions (N:1)
Users → Legal Entities (N:1)
Leave Requests → Users (N:1)
Leave Requests → Leave Types (N:1)
```

## Fabric Lakehouse Integration

### Using Data Factory

1. **Create Linked Service**
   - Type: REST
   - Base URL: `http://your-api-server:3000`
   - Authentication: None (or OAuth2 if needed)

2. **Create Datasets**
   - One dataset per endpoint
   - Use pagination parameters for large datasets

3. **Create Pipelines**
   - ForEach activity for paginated endpoints
   - Copy activity to ingest into lakehouse tables

### Sample Pipeline Configuration

```json
{
  "name": "IngestELMOData",
  "activities": [
    {
      "name": "GetUsers",
      "type": "Copy",
      "source": {
        "type": "RestSource",
        "httpRequestTimeout": "00:01:40",
        "requestInterval": "00:00:01",
        "requestMethod": "GET",
        "additionalHeaders": {},
        "paginationRules": {
          "AbsoluteUrl": "$.metadata.nextPage"
        }
      },
      "sink": {
        "type": "LakehouseTableSink",
        "tableName": "users"
      }
    }
  ]
}
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Data Customization

To modify the dummy data generation:

1. Edit the `generateDummyData()` function in `server.js`
2. Adjust record counts, data ranges, or add new fields
3. Restart the server to regenerate data

## Performance Considerations

- Data is generated in-memory on startup
- Suitable for development and testing
- For production loads, consider implementing database persistence
- Current setup handles ~300 total records across all entities

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. **Memory Issues with Large Datasets**
   - Reduce record counts in `generateDummyData()`
   - Implement streaming for large responses

3. **CORS Issues**
   - API includes CORS middleware
   - Modify CORS settings in server.js if needed

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new endpoints
4. Submit pull request

## License

MIT License - feel free to use for your Fabric lakehouse projects!
