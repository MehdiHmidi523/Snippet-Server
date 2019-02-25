The application has full CRUD functionality regarding snippets, whereby a user is be able to:
    create, read, update and delete snippets.

The application in Node.js will use Express.js as the application framework and Mongoose as the object modeling library

+ M stands for models, this will include all the code for our database models (which in this case will be Snippets)
+ V stands for the views or the layout. 
+ C stands for controllers which is the logic of how the app handles the incoming requests and outgoing responses. 
+ Routes are our guide, they tell the client (browser/mobile app) to go to which Controller once a specific url/path is requested.


To run application execute: npm install ===>  npm start

Constraints:
   + Anonymous users will only be able to view snippets
   + Users must be able to register themselves and must be able to login to the application after entering $user_ID and $password
----------------------------------------------------------------------------------------------------------------
   + A user cannot register an already existing user_ID (as user ID is unique for the application.)
   + If a user tries to access a resource which requires the user to be logged in, the application must return the status code 403
   + A user must be able to log off from the application.
   + Nobody but the authenticated user should be able to create, edit and delete her/his own snippets.
----------------------------------------------------------------------------------------------------------------
+ The user should be able to write a real code snippet, not just a one line text string.
+ The application must also return the status code 404 (not found) as well as 500 (internal error) when necessary.
----------------------------------------------------------------------------------------------------------------
Extra features [optional] to be discussed....

