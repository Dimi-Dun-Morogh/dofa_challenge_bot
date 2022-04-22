import api from './api';
import render from './render';

// Both set of different routes and template generation functions
let routes = {} as { [key: string]: Function };
let templates = {} as { [key: string]: Function }; // Register a template (this is to mimic a template engine)

let template = (name: string, templateFunction: Function) => {
  return (templates[name] = templateFunction);
};

// Define the routes. Each route is described with a route path & a template to render
// when entering that path. A template can be a string (file name), or a function that
// will directly create the DOM objects.
let route = (path: string, template: string) => {
  return (routes[path] = templates[template]);
};

// Register the templates.
template('home-page', async () => {
  const data = await api.getAllChallenges();
  render.mainPage(data);
});

template('id-page', async (id: string) => {
  const challenge = await api.getChallengeById(id);
  console.log(challenge);
  render.idPage(challenge);
});

// Define the mappings route->template.
route('/', 'home-page');
route('/id', 'id-page');

// Give the correspondent route (template) or fail
let resolveRoute = (route: string) => {
  try {
    return routes[route];
  } catch (error) {
    throw new Error('The route is not defined');
  }
};

// The actual router, get the current URL and generate the corresponding template
const router = () => {
  const url = window.location.hash.slice(1) || '/';

  if (url.slice(0, 3) === '/id') {
    const id = url.slice(3);
    return resolveRoute('/id')(id);
  }
  const routeResolved = resolveRoute(url);
  routeResolved();
}; // For first load or when routes are changed in browser url box.

export default router;
