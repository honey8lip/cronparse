// cronRouter.js — route cron expressions to named handlers based on matching criteria

const routers = new Map();

function makeRouter(name) {
  return { name, routes: [] };
}

function registerRouter(name) {
  if (routers.has(name)) throw new Error(`Router '${name}' already exists`);
  routers.set(name, makeRouter(name));
  return routers.get(name);
}

function removeRouter(name) {
  return routers.delete(name);
}

function getRouter(name) {
  return routers.get(name) || null;
}

function addRoute(routerName, pattern, handler, label = null) {
  const router = routers.get(routerName);
  if (!router) throw new Error(`Router '${routerName}' not found`);
  const route = { pattern, handler, label: label || pattern, addedAt: Date.now() };
  router.routes.push(route);
  return route;
}

function removeRoute(routerName, pattern) {
  const router = routers.get(routerName);
  if (!router) return false;
  const before = router.routes.length;
  router.routes = router.routes.filter(r => r.pattern !== pattern);
  return router.routes.length < before;
}

function matchRoute(routerName, expression) {
  const router = routers.get(routerName);
  if (!router) return null;
  for (const route of router.routes) {
    if (route.pattern === expression || route.pattern === '*') {
      return route;
    }
  }
  return null;
}

function dispatch(routerName, expression, context = {}) {
  const route = matchRoute(routerName, expression);
  if (!route) return { matched: false, expression, routerName };
  const result = route.handler({ expression, context, route });
  return { matched: true, expression, routerName, label: route.label, result };
}

function listRoutes(routerName) {
  const router = routers.get(routerName);
  if (!router) return [];
  return router.routes.map(r => ({ pattern: r.pattern, label: r.label, addedAt: r.addedAt }));
}

function clearRouters() {
  routers.clear();
}

module.exports = {
  registerRouter,
  removeRouter,
  getRouter,
  addRoute,
  removeRoute,
  matchRoute,
  dispatch,
  listRoutes,
  clearRouters
};
