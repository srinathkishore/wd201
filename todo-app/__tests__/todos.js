/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
//const todo = require("../models/todo");
let server, agent;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("Todo test suite ", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("Create new todo", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Go to movie",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302); //http status code
  });

  test("Mark todo as completed (Updating Todo)", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday?.length ?? 0;
    if (dueTodayCount === 0) {
      return;
    }
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];
    const status = latestTodo.completed ? false : true;
    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const response = await agent.put(`todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
      completed: status,
    });
    const parsedUpdateResponse = JSON.parse(response.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Mark todo as incomplete (Updating Todo)", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);

    await agent.post("/todos").send({
      title: "Clean the house",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday?.length ?? 0;
    if (dueTodayCount === 0) {
      return;
    }
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);
    const completeResponse = await agent.put(`todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
      completed: true,
    });
    const parsedCompleteResponse = JSON.parse(completeResponse.text);
    expect(parsedCompleteResponse.completed).toBe(true);

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);
    const incompleteResponse = await agent.put(`todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
      completed: false,
    });
    const parsedIncompleteResponse = JSON.parse(incompleteResponse.text);
    expect(parsedIncompleteResponse.completed).toBe(false);
  });

  test("Delete todo using ID", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Go to shopping",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday?.length ?? 0;
    if (dueTodayCount === 0) {
      return;
    }
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const response = await agent.delete(`todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
    });

    expect(response.status).toBe(200);

    const deletedTodo = await Todo.findById(latestTodo.id);
    expect(deletedTodo).toBe(null);
  });
});
