## TODOS
- Add Tests using Jest

## Notes 

### 1.Microservices
- In Microservices, services can communicate with each other synchronously or asynchronously

    - Synchronously via axios/fetch and is done when your service cannot proceed further without getting a response
    - Asynchronously is done via queues/message broker(RabbitMQ,BullMQ,kafka,Redis)
---

### 2.Why array of Address schema objects and not simple objects?

The technical difference isn't in **how you insert** the data (the `push` syntax), but in **how Mongoose treats the data** once it’s inside that array.

When you use a **separate schema** (Sub-document), Mongoose wraps that object in its own internal logic. When you use a **simple array of objects**, it's just raw data.

Here is the breakdown of the "under the hood" differences:

---

### 1. The `_id` Factor (Identification)
* **Separate Schema:** Mongoose automatically assigns a unique `_id` to every single address you push.
* **Simple Object Array:** No `_id` is created.
* **Why it matters:** In your e-commerce project, if a user wants to **delete** or **edit** a specific address, you need that ID. Without it, you’d have to find the address by comparing every single string (street, zip, etc.), which is slow and error-prone.

### 2. Validation "Bubble"
* **Separate Schema:** The validation is encapsulated. If the `zip` code is invalid, Mongoose throws an error specifically for that sub-document.
* **Simple Object Array:** Validation is often "all or nothing" at the parent level. It’s harder to run complex, nested middleware or custom validators on raw objects inside an array.

### 3. Casting and Defaults
* **Separate Schema:** If you define `createdAt: { type: Date, default: Date.now }` in your `addressSchema`, every time you push an address, it gets a timestamp automatically.
* **Simple Object Array:** You would have to manually add `Date.now()` to every object before pushing it. Mongoose won't "fill in the blanks" for raw objects.

---

### Comparison at a Glance

| Feature | Simple Array `[{...}]` | Separate Schema `[addressSchema]` |
| :--- | :--- | :--- |
| **Unique ID** | No (Unless manual) | **Yes** (Automatic `_id`) |
| **Validation** | Basic | **Advanced** (Field-level) |
| **Defaults** | Manual only | **Automatic** |
| **Hooks** | No `pre-save` on items | **Yes** (Sub-doc middleware) |

---

### First Principles: The "Sub-document" Object
When you use a separate schema, each address in the array is an instance of a **Mongoose Sub-document**. This means you can do things like this:

```typescript
const user = await User.findById(userId);

// You can use .id() to find a sub-document by its ID instantly
const specificAddress = user.addresses.id("64a7b..."); 

// You can modify it like a real document
specificAddress.city = "Pune";
await user.save();
```

If you used a **simple array of objects**, you would have to use `find()` or `findIndex()`, manually iterate through the array, and update the object yourself. 

---