# ClinicalTrials.gov API TypeScript SDK

**� This is an unofficial TypeScript/JavaScript wrapper for the ClinicalTrials.gov API v2. It is not affiliated with or endorsed by ClinicalTrials.gov or the National Institutes of Health (NIH).**

A modern, type-safe SDK for accessing the [ClinicalTrials.gov API v2](https://clinicaltrials.gov/api/gui) with full TypeScript support.

## Installation

```bash
npm install clinicaltrialsgov-ts
```

```bash
yarn add clinicaltrialsgov-ts
```

```bash
pnpm add clinicaltrialsgov-ts
```

## Quick Start

### ES Modules / TypeScript

```typescript
import { client, listStudies, fetchStudy } from 'clinicaltrialsgov-ts';

// List studies with search parameters
const { data } = await listStudies({
  query: {
    'query.cond': 'diabetes',
    'filter.overallStatus': ['RECRUITING'],
    pageSize: 10
  }
});

console.log(`Found ${data.totalCount} studies`);
data.studies.forEach(study => {
  console.log(study.protocolSection?.identificationModule?.briefTitle);
});

// Fetch a specific study by NCT ID
const study = await fetchStudy({
  path: { nctId: 'NCT02935634' }
});

console.log(study.data.protocolSection?.identificationModule?.officialTitle);
```

### CommonJS / Node.js

```javascript
const { client, listStudies, fetchStudy } = require('clinicaltrialsgov-ts');

async function searchStudies() {
  const response = await listStudies({
    query: {
      'query.cond': 'cancer',
      'filter.overallStatus': ['RECRUITING', 'NOT_YET_RECRUITING'],
      pageSize: 20
    }
  });
  
  return response.data.studies;
}
```

## API Reference

### Search Studies

Search for clinical trials using various criteria:

```typescript
import { listStudies } from 'clinicaltrialsgov-ts';

const response = await listStudies({
  query: {
    // Search by condition
    'query.cond': 'diabetes OR "heart disease"',
    
    // Search by intervention/treatment
    'query.intr': 'metformin',
    
    // Search by location
    'query.locn': 'New York, NY',
    
    // Filter by status
    'filter.overallStatus': ['RECRUITING', 'ACTIVE_NOT_RECRUITING'],
    
    // Filter by study type
    'filter.advanced': 'AREA[StudyType]EXPAND[Term]Interventional',
    
    // Pagination
    pageSize: 50,
    pageToken: 'next-page-token',
    
    // Count total results
    countTotal: true,
    
    // Sort results
    sort: ['@relevance:desc', 'StatusVerifiedDate:desc'],
    
    // Select specific fields
    fields: ['NCTId', 'BriefTitle', 'OverallStatus', 'Phase']
  }
});

console.log(`Total studies: ${response.data.totalCount}`);
console.log(`Studies on this page: ${response.data.studies.length}`);
console.log(`Next page token: ${response.data.nextPageToken}`);
```

### Fetch Individual Study

Get detailed information about a specific study:

```typescript
import { fetchStudy } from 'clinicaltrialsgov-ts';

const study = await fetchStudy({
  path: { nctId: 'NCT02935634' },
  query: {
    format: 'json',
    markupFormat: 'markdown',
    fields: ['ProtocolSection', 'ResultsSection']
  }
});

const protocol = study.data.protocolSection;
console.log('Title:', protocol?.identificationModule?.officialTitle);
console.log('Status:', protocol?.statusModule?.overallStatus);
console.log('Phase:', protocol?.designModule?.phases);
```

### Get API Metadata

Explore available fields and search areas:

```typescript
import { studiesMetadata, searchAreas, enums } from 'clinicaltrialsgov-ts';

// Get all available fields
const metadata = await studiesMetadata({});
console.log('Available fields:', metadata.data);

// Get search areas
const areas = await searchAreas({});
console.log('Search areas:', areas.data);

// Get enum values
const enumInfo = await enums({});
console.log('Enum values:', enumInfo.data);
```

### Statistics

Get statistics about the database:

```typescript
import { sizeStats, fieldValuesStats, listFieldSizesStats } from 'clinicaltrialsgov-ts';

// Database size statistics
const stats = await sizeStats({});
console.log('Total studies:', stats.data.totalStudies);

// Field value statistics
const fieldStats = await fieldValuesStats({
  query: {
    fields: ['OverallStatus', 'Phase'],
    types: ['ENUM']
  }
});

// Field size statistics
const sizeStats = await listFieldSizesStats({
  query: { fields: ['BriefTitle', 'DetailedDescription'] }
});
```

## Advanced Usage

### Custom Client Configuration

```typescript
import { client } from 'clinicaltrialsgov-ts';

// Configure client
client.setConfig({
  baseUrl: 'https://clinicaltrials.gov/api/v2',
  headers: {
    'User-Agent': 'MyApp/1.0.0'
  },
  timeout: 10000
});

// Use configured client
const response = await client.get({
  url: '/studies',
  query: { 'query.cond': 'covid-19' }
});
```

### Error Handling

```typescript
import { listStudies } from 'clinicaltrialsgov-ts';

try {
  const response = await listStudies({
    query: { 'query.cond': 'invalid-query-syntax[[[' }
  });
} catch (error) {
  if (error.response?.status === 400) {
    console.error('Bad request:', error.response.data);
  } else {
    console.error('Network error:', error.message);
  }
}
```

### Pagination

```typescript
import { listStudies } from 'clinicaltrialsgov-ts';

async function fetchAllPages(query: any) {
  const allStudies = [];
  let pageToken = undefined;
  
  do {
    const response = await listStudies({
      query: { ...query, pageToken, pageSize: 100 }
    });
    
    allStudies.push(...response.data.studies);
    pageToken = response.data.nextPageToken;
  } while (pageToken);
  
  return allStudies;
}

const allDiabetesStudies = await fetchAllPages({
  'query.cond': 'diabetes',
  'filter.overallStatus': ['RECRUITING']
});
```

## TypeScript Support

The SDK provides complete TypeScript definitions:

```typescript
import type { 
  Study, 
  PagedStudies, 
  Status, 
  Phase,
  StudyType 
} from 'clinicaltrialsgov-ts';

function processStudy(study: Study) {
  const identification = study.protocolSection?.identificationModule;
  const status = study.protocolSection?.statusModule;
  
  return {
    nctId: identification?.nctId,
    title: identification?.briefTitle,
    status: status?.overallStatus,
    lastUpdate: status?.lastUpdatePostDateStruct?.date
  };
}
```

## React Native

The SDK works out of the box with React Native:

```typescript
import { listStudies } from 'clinicaltrialsgov-ts';

export const ClinicalTrialsScreen = () => {
  const [studies, setStudies] = useState([]);
  
  useEffect(() => {
    listStudies({
      query: {
        'query.cond': 'diabetes',
        'filter.overallStatus': ['RECRUITING'],
        pageSize: 10
      }
    }).then(response => {
      setStudies(response.data.studies);
    });
  }, []);
  
  // Render studies...
};
```

## License

MIT

## Disclaimer

This is an unofficial SDK and is not affiliated with ClinicalTrials.gov, the National Institutes of Health (NIH), or any government agency. Use at your own risk. Always refer to the [official ClinicalTrials.gov API documentation](https://clinicaltrials.gov/data-api/api) for the most up-to-date information.

## Support

- [ClinicalTrials.gov API Documentation](https://clinicaltrials.gov/data-api/api)
- [GitHub Issues](https://github.com/raiyansayeed/clinicaltrialsgov-ts/issues)
- [npm Package](https://www.npmjs.com/package/clinicaltrialsgov-ts)