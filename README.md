# Survey App

Survey App is a full-stack application designed to conduct surveys with a variety of question types. It leverages Spring Boot for the backend and React for the front end, with a focus on security and user-friendly design.

## Features

- **SSO and ADFS Authentication**: Users are authenticated via Single Sign-On (SSO) for external users and Active Directory Federation Services (ADFS) for internal users, ensuring secure and streamlined access to the survey. Using [Auth0](https://auth0.com) to mimic this in the app in production, which uses Google sign-on. (To learn more about Auth0, click [here](https://auth0.com)).
- **Role-Based Authorization**: Specific roles and permissions are enforced to authorize users to take the survey, maintaining the integrity of the survey process.
- **Diverse Question Types**: Supports multiple question types such as sliders, multi-select, fill-in-the-blanks, and single-select multiple choice.
- **API Interaction**: The application interacts with backend APIs for storing and retrieving survey answers, employing secure communication protocols.
- **Reusable React Components**: Frontend built with reusable components for efficiency and maintainability, utilizing Redux for state management.
- **Exception Handling**: Implements robust exception handling with user-friendly error messages and developer logs.

## Technologies Used

- **Auth0**: Manages authentication and role-based access control.
- **JSON Server**: Simulates a backend database on port 3001, providing a mock REST API.
- **Redux Toolkit (RTK)**: Manages application state and logic.
- **Chakra UI**: Provides a modern, responsive user interface.
- **Redux Persist**: Ensures state persistence across sessions.

## Security Measures

- Input validation to prevent malicious data entry.
- HTTPS for secure data transmission.
- Protection against common web vulnerabilities such as XSS and CSRF.

## API Endpoints

### Surveys

- `GET /surveys`: Retrieves all surveys.
- `GET /surveys/{surveyId}`: Retrieves a specific survey by ID.
- `POST /surveys`: Creates a new survey with the provided survey data.
- `DELETE /surveys/{surveyId}`: Deletes a specific survey by ID.

### Responses

- `POST /answers`: Stores a survey response with the user ID and survey ID.
- `GET /answers`: Retrieves responses for a specific survey and user ID combination.

## Example Requests

### Store a Response

- `POST /answers`:
```
Content-Type: application/json
{
    "id": "userId",
    "surveyId": "surveyId",
    "responses": "response"
}
```
### Get a Responses

`GET /answers?surveyId={surveyId}&userId={userId}`

### Create a Survey

- `POST /surveys`:
```
Content-Type: application/json

{
    "title": "Your Survey Title",
    "description": "Survey Description",
    "questions: [],
    "responses": [],
}
```

### Delete a Survey
`DELETE /surveys/{surveyId}`

## Installation

- clone to local, `npm install`, then `npm run dev` to run app on `localhost:3000`
- to run JSON server to mimic db - run: `json-server --watch db.json --port 3001`

## User Stories

- As an external user, I want to authenticate via Google to take the survey.
- As an admin, I want to view survey results and manage permissions.

## Internal Application Design

For the internal version of the application, used by the sales and marketing teams, authentication will be managed by ADFS, with a focus on internal user roles and permissions. In this app 
using Auth0 to handle this, this is for example use only.

## Exception Handling Strategy

The application will present users with clear error messages when issues occur and log detailed error information for developers to troubleshoot.
