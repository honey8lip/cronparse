const {
  registerRouter,
  removeRouter,
  getRouter,
  addRoute,
  removeRoute,
  matchRoute,
  dispatch,
  listRoutes,
  clearRouters
} = require('./cronRouter');

beforeEach(() => clearRouters());

test('registerRouter creates a new router', () => {
  const r = registerRouter('main');
  expect(r.name).toBe('main');
  expect(r.routes).toEqual([]);
});

test('registerRouter throws if name already exists', () => {
  registerRouter('main');
  expect(() => registerRouter('main')).toThrow("Router 'main' already exists");
});

test('getRouter returns null for unknown router', () => {
  expect(getRouter('nope')).toBeNull();
});

test('removeRouter deletes a router', () => {
  registerRouter('main');
  expect(removeRouter('main')).toBe(true);
  expect(getRouter('main')).toBeNull();
});

test('addRoute attaches a route to a router', () => {
  registerRouter('main');
  const route = addRoute('main', '* * * * *', () => 'ok', 'every minute');
  expect(route.pattern).toBe('* * * * *');
  expect(route.label).toBe('every minute');
});

test('addRoute throws for unknown router', () => {
  expect(() => addRoute('ghost', '* * * * *', () => {})).toThrow("Router 'ghost' not found");
});

test('removeRoute removes a matching route', () => {
  registerRouter('main');
  addRoute('main', '0 * * * *', () => {});
  expect(removeRoute('main', '0 * * * *')).toBe(true);
  expect(listRoutes('main')).toHaveLength(0);
});

test('matchRoute returns matching route', () => {
  registerRouter('main');
  addRoute('main', '0 9 * * 1', () => {}, 'monday morning');
  const match = matchRoute('main', '0 9 * * 1');
  expect(match).not.toBeNull();
  expect(match.label).toBe('monday morning');
});

test('matchRoute returns null for no match', () => {
  registerRouter('main');
  expect(matchRoute('main', '0 9 * * 1')).toBeNull();
});

test('dispatch calls handler and returns result', () => {
  registerRouter('main');
  addRoute('main', '0 6 * * *', ({ expression }) => `ran: ${expression}`, 'daily 6am');
  const res = dispatch('main', '0 6 * * *', { user: 'test' });
  expect(res.matched).toBe(true);
  expect(res.result).toBe('ran: 0 6 * * *');
  expect(res.label).toBe('daily 6am');
});

test('dispatch returns matched false when no route found', () => {
  registerRouter('main');
  const res = dispatch('main', '0 6 * * *');
  expect(res.matched).toBe(false);
});

test('listRoutes returns route summaries', () => {
  registerRouter('main');
  addRoute('main', '* * * * *', () => {});
  addRoute('main', '0 0 * * *', () => {}, 'midnight');
  const routes = listRoutes('main');
  expect(routes).toHaveLength(2);
  expect(routes[1].label).toBe('midnight');
});
