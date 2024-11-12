
const express = require("express");
const cors = require("cors");
const path = require('path');
const cookieSession = require("cookie-session");
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger.json');
const bodyParser = require('body-parser');

const app = express();
app.use("/api-documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"],
    httpOnly: true,
    sameSite: 'strict'
  })
);

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();

app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo ao teste de api." });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/imc.routes")(app);
require("./app/routes/feedback.routes")(app);
require("./app/routes/conquista.routes")(app);
require("./app/routes/fichas.routes")(app);
require("./app/routes/exercicios.routes")(app);
require("./app/routes/recuperar.routes")(app);
require("./app/routes/sequencia.routes")(app);
require("./app/routes/treino_status.routes")(app);
require("./app/routes/recordes.routes")(app);
require('./app/routes/pdf.routes')(app); 

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`O servidor está em execução em: http://localhost:${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}
