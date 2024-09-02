<!-- перенеси у файл openapi.yaml -->
openapi: 3.1.0
info:
  version: 1.0.0
  title: Water Tracker app
description: Water Tracker
  license:
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0.html
  description: This is a documentation of Water Tracker app
tags:
  - name: Water
  - name: Auth
    description: Auth operations.
servers:
  - url: https://water-tracker-backend-101-team-5.onrender.com/
  - url: http://localhost:8080
paths:
  /auth/register:
    post:
      tags:
        - auth
      summary: Register a new user
      operationId: registerUser
      description: Register a new user with the provided credentials.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterUserRequest'
      responses:
       '201':
          description: Successfully registered a user
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '500':
          $ref: '#/components/responses/GeneralError'
 /auth/login:
    post:
      tags:
        - auth
      summary: Login a user
      operationId: loginUser
      description: Login a user with the provided credentials.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginUserRequest'
      responses:
        '200':
          description: Successfully logged in a user
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LoginResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '500':
          $ref: '#/components/responses/GeneralError'

  /auth/logout:
    post:
      tags:
        - auth
      summary: Logout a user
      operationId: logoutUser
      description: Logout the currently authenticated user.
      responses:
        '204':
          description: Successfully logged out
        '400':
          $ref: '#/components/responses/BadRequest'
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/GeneralError'

  /auth/refresh:
    post:
      tags:
        - auth
      summary: Refresh user session
      operationId: refreshUserSession
      description: Refresh the session of the currently authenticated user.
      responses:
        '200':
          description: Successfully refreshed the session
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LoginResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '500':
          $ref: '#/components/responses/GeneralError'

  /auth/avatar:
    patch:
      tags:
        - auth
      summary: Update user avatar
      operationId: updateAvatar
      description: Update the avatar of the currently authenticated user.
      security:
        - bearerAuth: []
      requestBody:
        content:
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/UpdateAvatarRequest'
      responses:
        '200':
          description: Avatar updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AvatarResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '400':
          $ref: '#/components/responses/BadRequest'
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/GeneralError'

  /auth/user:
    get:
      tags:
        - auth
      summary: Get user profile
      operationId: getUserProfile
      description: Retrieve the profile information of the currently authenticated user.
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Successfully retrieved user profile
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/GeneralError'

    patch:
      tags:
        - auth
      summary: Update user profile
      operationId: updateUserProfile
      description: Update the profile information of the currently authenticated user.
      security:
        - bearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateUserRequest'
      responses:
        '200':
          description: User profile updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/GeneralError'
schemas:
    RegisterUserRequest:
      type: object
      required:
        - email
        - password
      properties:
        userName:
          type: string
          example: User
        email:
          type: string
          format: email
          example: user@example.com
        password:
          type: string
          format: password
          example: password123

    LoginUserRequest:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
          example: user@example.com
        password:
          type: string
          format: password
          example: password123

    UserResponse:
      type: object
      properties:
        id:
          type: string
          example: 60d0fe4f5311236168a109ca
        userName:
          type: string
          example: User
        email:
          type: string
          format: email
          example: user@example.com
        dailyNorma:
          type: number
          example: 2000
        gender:
          type: string
          enum: [Man, Woman]
          example: Man
        photo:
          type: string
          example: http://example.com/photo.jpg

    LoginResponse:
      type: object
      properties:
        accessToken:
          type: string
          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

    SuccessResponse:
      type: object
      properties:
        status:
          type: integer
          example: 200
        message:
          type: string
          example: User profile updated successfully

    ErrorResponse:
      type: object
      properties:
        status:
          type: integer
          example: 404
        message:
          type: string
          example: Not Found

    UpdateAvatarRequest:
      type: object
      properties:
        avatar:
          type: string
          format: binary
          description: The avatar image file to upload
      required:
        - avatar

    AvatarResponse:
      type: object
      properties:
        status:
          type: integer
          example: 200
        message:
          type: string
          example: Avatar updated successfully
        data:
          type: object
          properties:
            avatarUrl:
              type: string
              example: http://example.com/uploads/avatar.jpg

    UpdateUserRequest:
      type: object
      properties:
        email:
          type: string
          format: email
          example: newemail@example.com
        currentPassword:
          type: string
          format: password
          example: oldPassword123
        newPassword:
          type: string
          format: password
          example: newPassword123
        confirmPassword:
          type: string
          format: password
          example: newPassword123
        userName:
          type: string
          example: New User Name
        dailyNorma:
          type: number
          example: 2000
        gender:
          type: string
          enum: [Man, Woman]
          example: Man

  responses:
    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'

    BadRequest:
      description: Bad Request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'

    NotFound:
      description: Not Found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'

    GeneralError:
      description: Internal Server Error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
