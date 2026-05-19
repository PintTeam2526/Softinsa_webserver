const TIMEOUT_MS = parseInt(process.env.REQUEST_TIMEOUT || '15000');

function timeoutMiddleware(req, res, next) {
  const timer = setTimeout(() => {
    if (!res.writableEnded) {
      if (!res.headersSent) {
        res.status(503).json({ mensagem: "Pedido excedeu o tempo limite" });
      } else {
        res.end();
      }
    }
  }, TIMEOUT_MS);

  res.on('finish', () => clearTimeout(timer));

  next();
}

module.exports = timeoutMiddleware;
