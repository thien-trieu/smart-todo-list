# Smart To-Do Web Application
=========

When you are recommended something it's not always easy to jot it down for later in an organized fashion. Adding the item to your phone or computer ends up taking time and opening up the right app is only part of the problem. You then have to locate the right list ("Movies to watch", "Books to read", etc.) to add to. And if you do get it in to the right list, you don't have much more context about it. This delay and lack of additional information acts as a huge deterrent.

The solution? A smart, auto-categorizing todo list app. The user simply has to add the name of the thing, and it gets put into the correct list.

![Video of Category Browsing](

https://user-images.githubusercontent.com/116989045/210008663-a0d009e3-75d9-4b09-845e-dcfc719629e0.mov

)

## Collaborators

This project was created by:

- [Thien Trieu](https://github.com/thien-trieu)
- [Jhon Useche](https://github.com/jhon-u)
- [Joe Polo](https://github.com/JoePolo1)


## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`

## Warnings & Use Tips

- Do not edit the `layout.css` file directly, it is auto-generated by `layout.scss`.
- Split routes into their own resource-based file names, as demonstrated with `users.js` and `widgets.js`.
- Split database schema (table definitions) and seeds (inserts) into separate files, one per table. See `db` folder for pre-populated examples. 
- Use helper functions to run your SQL queries and clean up any data coming back from the database. See `db/queries` for pre-populated examples.
- Use the `npm run db:reset` command each time there is a change to the database schema or seeds. 
  - It runs through each of the files, in order, and executes them against the database. 
  - Note: you will lose all newly created (test) data each time this is run, since the schema files will tend to `DROP` the tables and recreate them.

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- express 4.17.1
- express-validator 6.14.2
- bcryptjs 2.4.3
- cookie-session 2.0
- morgan 1.9.1
- pg 8.5
- ejs 2.6.2
- axios 1.2.1
- chalk 2.4.2
- dotenv 2.0
- sass 1.35.1
- xml-js": 1.6.11

## Features

### The Landing Page

The primary use of the Smart To Do app is simply to add, browse, and complete items on a to do list via a simple user interface. As to-do lists are often personalized and private, Smart To-Do utilizes an encrypted **bcryptjs** user login experience. When a user first visits our site, the following landing page will appear:

![The Landing Page](IMG URL GOES HERE ONCE UPLOAD COMPLETE)

Visitors may click on the Start Here button, or the Login or Register buttons on the navigation bar's right hand side. 

### The Registration Page

Upon clicking Start Here or Register, users are prompted to share their name and email address, create a strong password, and to update their city. By default, if the user has allowed their location data to be collected, the city should auto-populate based on the latitude and longitude of their IP address. This utilizes the free API **"Big Data Cloud"** to return the city to the system, and the main purpose of this API is to pass the city into the Yelp API which searches local restaurant names in order to better categorize to do memos.

***NOTE: Location browser data does not need to be shared and users may update their city to any location manually on this page or the [Profile Edit](#editing-user-profiles) page.***

![The Registration Page](IMG URL GOES HERE ONCE UPLOAD COMPLETE)

### The Login Page

Existing users may log in via the login portal using their email and password as shown below:

![The Login Page](IMG URL GOES HERE ONCE UPLOAD COMPLETE)

### The Smart To-Do List

Once a user has registered or logged in, the Smart To-Do main page appears. This is where a user can:

- create new to-do memo items
- search through existing items
- browse to-do items by category
- update existing items text or category
- delete items off of their list completely

Here is a detailed outline of each of these features:

#### Adding a new Smart To-Do task

To create a new Smart To-Do task, simply click to the right of the + icon on the placeholder text "Write a new Smart To-Do task here" and then write anything to log it as a task. Once done writing, pressing enter will save the task prepended to the top of the current To-Do list. As of the time of writing, there is no limit to the character count in a task, nor on the number of Smart To-Do tasks a user may have.

##### A Note on Smart Categorization

As the task is created, the keywords within are run through included API's "Wolfram Alpha" and "Yelp", further assisted by the provided user location data. These are compared against built in measurements which help determine with relative accuracy what type of category the Smart To-Do task should fall under, and automatically assigned a category on the right hand side of the list as one of the following:

- Eat (for nearby restaurants, food items mentioned in the task, and other meal based keywords)
- Watch (for film, television series and other related content detected in keywords)
- Read (for books and stories detected in keywords)
- Buy (for products and services detected in keywords)

Users may [edit a category](#changing-the-text-or-category-of-an-existing-smart-to-do-item) of any Smart To-Do task at any time while logged in. 

![Video of Adding a New Task](VID URL GOES HERE ONCE UPLOAD COMPLETE)

#### Searching through existing Smart To-Do items

Life can be busy, and as such it is normal to accumulate many To-Do items on a user's list over time. To search for existing Smart To-Do items, click on and type into the search bar. Results will automatically populate. Further sorting may be done via [browsing by category](#browsing-existing-smart-to-do-items-by-category)

![Video of Searchbar](VID URL GOES HERE ONCE UPLOAD COMPLETE)

#### Browsing existing Smart To-Do items by category

Users may also browse existing Smart To-Do items by category using the navigation icons to the right of the searchbar. The leftmost icon is the inbox icon which will reveal all categorized tasks, followed by the food icon, book icon, film icon and products/buy icon respectively. Each of those icons when clicked will only show the tasks within those categories, filtering out the rest. 

![Video of Category Browsing](IMG URL GOES HERE ONCE UPLOAD COMPLETE)

#### Changing the text or category of an existing Smart To-Do item

If a category is assigned incorrectly or to change the category assigned to a specific task, simply click on the current category which will reveal a drop down allowing adjustment to a new category.

To edit an existing Smart To-Do task's text, click on the text and add or remove the required changes, then press enter to save.

![Video of Category changing](IMG URL GOES HERE ONCE UPLOAD COMPLETE)

#### Deleting a Smart To-Do item

To delete an item altogether, click on the trash bin icon on the rightmost side of the Smart To-Do task. It will be removed from all views.

### Editing User Profiles

To edit an existing user profile, a user must first be logged in to that profile. Click on the "My Profile" button in the top navigation bar. The following page will appear where the user email and location may be updated. Click "Submit" to save preferences.

![Photo of Profile Edit Page](IMG URL GOES HERE ONCE UPLOAD COMPLETE)






