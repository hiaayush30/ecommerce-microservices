## Notes 

- In Microservices, services can communicate with each other synchronously or asynchronously

    - Synchronously via axios/fetch and is done when your service cannot proceed further without getting a response
    - Asynchronously is done via queues/message broker(RabbitMQ,BullMQ,kafka,Redis)
---

#### Lexical scope and Closures
- The validate middleware (`auth/src/middlewares/validate.middleware.ts`) is a perfect example of a programming concept that relies on lexical scoping, and it specifically creates what is known as a closure.

- Lexical (or static) scoping means that the accessibility of variables is determined by the position of the functions in the source code, not by where they are executed. An inner function has access to the variables of its outer (parent) function.

1. Outer Function (`validate`): You call this function in your route file (auth.routes.ts) and pass a specific schema (e.g., registerSchema) to it.

2. Inner Function (The Closure): The validate function immediately returns the inner async function. This inner function is the actual middleware that Express will execute. Because of lexical scoping, this inner function "remembers" the environment in which it was created. It maintains a reference to the schema variable that was passed to its parent. This combination of the function and its "remembered" lexical environment is called a closure.

3. Execution: When a request comes in to your /register route, Express executes the inner function. Even though it's being called by Express, deep within the framework, the function still has access to the specific schema (registerSchema in this case) that it was "born" with.

---

#### TODOS
- try express-validator instead of zod
- write tests manually :-)

---