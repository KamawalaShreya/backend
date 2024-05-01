import multer from "multer";
import fs from "fs";
import { randomStringGenerator } from "../helper";

const storeFile = (fields) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    const multerStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        const fieldDestination = fields.find(
          (field) => field.name === file.fieldname
        )?.destination;

        fs.mkdirSync(fieldDestination, { recursive: true });
        cb(null, fieldDestination);
      },
      filename: (req, file, cb) => {
        const name = randomStringGenerator(10);
        const ext = file.mimetype.split("/")[1];

        cb(null, `${file.fieldname}-${name}.${ext}`);
      },
    });
    const upload = multer({ storage: multerStorage }).fields(fields);

    upload(req, res, (err) => {
      if (err) reject(err);

      resolve();
    });
  })
    .then(() => next())
    .catch((err) => {
      res.send({ error: err });
    });
};

export default storeFile;
