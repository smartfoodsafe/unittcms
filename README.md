<p align="center">
  <a href="https://www.unittcms.org/en">
    <img width="20%" src="https://raw.githubusercontent.com/kimatata/unittcms/refs/heads/main/frontend/public/favicon/icon-192.png" alt="UnitTCMS" />
    <h1 align="center">UnitTCMS</h1>
  </a>
</p>
</br>
<p align="center">
  <a href="https://github.com/kimatata/unittcms/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/kimatata/unittcms" alt="License">
  </a>
  <a href="https://github.com/kimatata/unittcms/releases">
    <img src="https://img.shields.io/github/v/release/kimatata/unittcms" alt="Release">
  </a>
</p>

UnitTCMS is an open source test case management system. The application is free and designed for self-hosted use. It can be used in environments with strict security requirements. For more information, please visit the demo site and docs.

[🧪Demo](https://www.unittcms.org)

[📘Docs](https://kimatata.github.io/unittcms/docs)

## Getting Started

```bash
git clone https://github.com/kimatata/unittcms.git
```

and start containers with the following command.

```bash
cd unittcms
docker-compose up --build
```

You can access the app at `http://localhost:8000`

[Looking for a non-Docker way?](https://kimatata.github.io/unittcms/docs/getstarted/from-source)

### Database

The app uses Postgres when `DB_HOST` (or `DB_DIALECT=postgres`) is set — `docker-compose.yaml` ships with a Postgres service preconfigured. Without these variables it falls back to a local SQLite file, so existing single-file setups keep working.

Connection variables: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, optional `DB_POOL_MAX`.

### Restricting sign-up

Set `ALLOWED_SIGNUP_DOMAINS` (comma-separated, e.g. `example.com,example.org`) to restrict account creation to email addresses from those domains. When unset, anyone can sign up.

To move data from an existing SQLite database into Postgres:

```bash
cd backend
npx sequelize-cli db:migrate   # create the schema in Postgres first
npm run migrate:sqlite-to-postgres [path/to/database.sqlite]
```

## Why UnitTCMS

There are many test case management tools available in the market, which can be categorized into proprietary and open-source solutions.

Proprietary tools often come with modern, user-friendly interfaces but tend to be cloud-based, which may raise security concerns for some organizations. While some of them do offer on-premises options, these tend to be significantly more expensive.

There are also open-source tools, but many feature older user interfaces that involve frequent full page reloads, which can hinder usability.

With these challenges in mind, I set out to develop a modern, user-friendly, open-source test case management tool that anyone can use for free in a secure, self-hosted environment.

## Features

### Project-Based

Manage test cases and test runs on a project-by-project basis. Our dashboard provides an at-a-glance view of the types of test cases and their progress for each project. This allows you to monitor project status in real-time and manage efficiently.

![Project-Based](./frontend/public/top/light/project.png)

<hr />

### Test case management

Create folders within projects and define test cases with ease using our modern and intuitive UI. Attaching files enables detailed explanations of test cases, making it easy to share information across the entire team.

![Test Case Management](./frontend/public/top/light/case.png)

<hr />

### Test run management

Defined test cases can be reused multiple times in test runs, enabling efficient test cycles. Additionally, you can visually monitor the status of test runs and projects.

![Test Run Management](./frontend/public/top/light/run.png)

<hr />

### Project member management

Support team development by adding or removing members from projects. You can assign roles and set permissions for each member in detail. We provide three main roles: 'Manager' who manages the entire project, 'Developer' who designs the tests, and 'Reporter' who executes the tests.

![Member Management](./frontend/public/top/light/member.png)

## Supported Languages

UnitTCMS currently supports the following languages:

- German (de)
- English (en)
- Portuguese (pt-BR)
- Chinese (zh-CN)
- Japanese (ja)

If you would like to add support for another language, feel free to submit a pull request. For reference, you can see how Portuguese was added in [PR #260](https://github.com/kimatata/unittcms/pull/260).
