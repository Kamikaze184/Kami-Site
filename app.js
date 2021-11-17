const app = require('./server');

app.listen(process.env.PORT, function () {
  console.log(`Servidor iniciado na porta: ${process.env.PORT}`);
});
