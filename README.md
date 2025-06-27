
# Angular Assessment App

A modern task and project management web application built using Angular 17+, standalone components, RxJS, Angular Material, and Vite.

---

## 📦 Features

- ✅ Standalone component architecture with Vite
- ✅ Task and Project CRUD operations
- ✅ User management with role-based logic
- ✅ Notifications for overdue tasks and projects
- ✅ Snackbar system with custom `ToasterComponent`
- ✅ Pipes for user names and due date formatting
- ✅ Services for authentication, CRUD, search, notifications

---

## 🧱 Project Structure Highlights

### 📁 Core Models (Interfaces)
- `Users`: Basic user structure with role and creation date
- `Projects`: Includes name, status, start/deadline dates, assigned user
- `Tasks`: Tracks name, priority, due date, project linkage
- `Notifications`: System to alert users of overdue tasks
- `Kpis`: Used for dashboard indicators
- `userDialogData`: Data exchange structure for user dialogs

### ⚙️ Core Services
- `AuthService`: Login, logout, token & role handling
- `CommonService`: Shared utilities like snackbar, search, and overdue filters
- `CronService`: Scheduled checks for overdue tasks
- `NotificationService`: Create/read/update notifications
- `ProjectService`, `TaskService`, `UserService`: CRUD services for respective modules

### 🛠 Pipes
- `DuedatePipe`: Displays relative due status like `2 days left` or `Today`
- `UserNamePipe`: Resolves user names from user ID and list

---

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run the App (Dev)
```bash
npm run dev
```

> Make sure backend (`json-server` or any mock API) is running on `http://localhost:3000`

### Run JSON-server locally
```bash
npm run json-server
```

---

## 🧪 Scripts

### Generate Docs (via Compodoc)
```bash
npx compodoc -p tsconfig.json
npx compodoc -s
```

Visit: `http://localhost:8080`

---

## 📁 Key Folders

```
src/
 ┣ app/
 ┃ ┣ auth/                # Authentication logic
 ┃ ┣ core/                # Shared models & services
 ┃ ┣ features/            # Dashboard, tasks, projects
 ┃ ┣ shared/              # Reusable components, pipes
 ┣ assets/
 ┣ environments/
```

---

## 🔐 Auth Logic

- Uses `localStorage` for token + user object
- Guards implemented in routing (canActivate, canLoad, canActivateChild )
- `AuthService` includes:
  - `login(email, password)`
  - `logout()`
  - `isAuthenticated()`
  - `getUserRole()`

  ---

  ## Dashboard Module
- 
- Dispalying total and overdue tasks card and chart
- Dispalying total and overdue projects card and chart

---

 ## Projects module Module
- Crud of project and assign users to projcet
- By clicking on particular project row it will redirect to tasks related to that project whre you can crud of tasks;

---

## Tasks module Module
- To go to task module we need to go with projects module and perform operations;

---

## User module Module
- Crud of user by updating role  password username etc

---


## 🎯 Notifications System

- `CronService` checks for tasks due "today" at midnight
- Creates `Notifications` using `NotificationService`
- Notifications are filtered per user and sorted by `createdAt`

---

## ✅ Custom Pipes Example

```ts
// duedate.pipe.ts
transform(value: string | Date): string {
  // Outputs: "2 days left", "Today", or "3 days overdue"
}
```

---

## 📚 Documentation

To view full code documentation:

```bash
npx compodoc -p tsconfig.json
npx compodoc -s
```

Then open: [http://localhost:8080](http://localhost:8080)

---

## 📃 License

MIT – Free to use, fork, and modify.

---

## 👨‍💻 Author

Built by Asendra Chauhan
_Contact via GitHub or LinkedIn_
