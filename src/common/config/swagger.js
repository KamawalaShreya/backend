import express from "express";
import { serve, setup } from "swagger-ui-express";
import YAML from "yamljs";

const router = express.Router();
const swaggerDocument = YAML.load("swagger.yaml");

router.use(
  "/",
  (req, res, next) => {
    swaggerDocument.info.title = process.env.APP_NAME;
    swaggerDocument.servers = [
      {
        url: `${process.env.BASE_URL}:${process.env.PORT}`,
        description: "API base url",
      },
    ];
    req.swaggerDoc = swaggerDocument;
    next();
  },
  serve,
  setup(swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

export default router;
