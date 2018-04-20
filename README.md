# Opa!Grappa!!    <br>
## <i>An online journal for keeping track of your favorite wines <br>
 

## Live Demo
https://opa-grappa.herokuapp.com/ <br>


## Description <br>  
Opa!Grappa!! is an app that keeps track of all the wines a user has consumed or would like to try in the future. User can search for a wine by narrowing down to a winery or vineyard. User can find more information of selected wine by clicking on its name and it will display details like the name, type, vintage, vineyard, ratings and reviews (by Wine Enthusiast) and allows user to add their own comments    <br>


## Technologies used<br> 

#### Front End:
- JavaScript <br>
- jQuery <br>
- HTML5 <br>
- CSS3 <br>

#### Back End <br>
- Node.js (server-side scripting)<br> 
- Express (server framework and API end point routing) <br> 
- MongoDB(mLab) (database) <br> 
- Mongoose (data modeling and schema) <br>
- Mocha Chai (unit testing) <br>
- Travis CI (continuous integration and deployment) <br>
- Heroku (deployment) <br>

#### Security <br>
- Passwords are encrypted with bcryptjs <br>
- Passport.js was used as authentication middleware <br>

#### Responsive <br>
- The app is responsive and optimized for both desktop and mobile viewing and use <br>


## API Documentation <br>

#### API endpoints <br>
- API for registering new users and checking existing user logins: <br>
	* '/users' - POST, GET <br>

- API for creating JWTs: <br>
	* '/auth' <br>
		* '/login' - POST <br>

- API for wines data: <br>
	* '/wines' <br>
		* '/' - GET a list of top 20 wines <br>
		* '/:id' - GET wine by id <br>
		* '/states' - GET all states (distinct) <br>
		* '/regions/:state' - GET all regions (distinct) for a given state <br>
		* '/wineries/:region' - GET all wineries (distinct) for a given region <br>
		* '/list/:winery' - GET all wines for a given winery <br>

- API for personal my list data: <br>
	* '/mylist' <br>
		* '/' - GET a list of all wines on logged-in user's list <br>
		* '/' - POST a new item to list ('userId', 'wineId', 'comments', 'name', 'description', 'cost', 'rating', 'region', 'state', 'winery', 'type') <br>
		* '/:id' - GET selected wine item details by id <br>
		* '/:id' - PUT for updating the comments field for an existing item on list by id <br>
		* '/:id' - DELETE for deleting an existing item by id <br>


## Screenshots <br>

### Index page:<br>
<img src="/screenshots/index.png" alt="Home page - blank"> <br>

### Login page:<br>
<img src="/screenshots/login.png" alt="Login page - blank"> <br>

### My List page:<br>
<img src="/screenshots/mylist.png" alt="My List page - blank"> <br>

### Details page:<br>
<img src="/screenshots/details.png" alt="details page - blank"> <br>

### Search page:<br>
<img src="/screenshots/search.png" alt="Search page - blank"> <br>
